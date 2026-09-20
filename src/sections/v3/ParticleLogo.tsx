import { Camera, Geometry, Mesh, Program, Transform, Vec2 } from 'ogl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useWebGL } from '../../lib/webgl/useRenderer'

// Fewer points on phones: same silhouette, a third of the vertex work.
const MAX_POINTS = () => (window.innerWidth < 768 ? 6000 : 14000)

/** Read the logo artwork's alpha channel and turn it into a point cloud. */
async function sampleLogo(src: string, max: number) {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = src
  await img.decode()

  const size = 260
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)

  const hits: number[] = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[(y * size + x) * 4 + 3] > 70) hits.push(x, y)
    }
  }

  const total = hits.length / 2
  const count = Math.min(max, total)
  const step = total / count
  const target = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const seed = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const h = Math.floor(i * step) * 2
    // Centre the logo and flip Y into clip-ish space (−1…1), then scale to taste.
    const x = (hits[h] / size - 0.5) * 2
    const y = -(hits[h + 1] / size - 0.5) * 2
    const jitter = 0.004
    target[i * 3] = x + (Math.random() - 0.5) * jitter
    target[i * 3 + 1] = y + (Math.random() - 0.5) * jitter
    target[i * 3 + 2] = (Math.random() - 0.5) * 0.06

    // Start as a slow galaxy of dust around the logo.
    const angle = Math.random() * Math.PI * 2
    const radius = 0.9 + Math.random() * 1.8
    scatter[i * 3] = Math.cos(angle) * radius
    scatter[i * 3 + 1] = Math.sin(angle) * radius * 0.75
    scatter[i * 3 + 2] = (Math.random() - 0.5) * 2

    seed[i] = Math.random()
  }

  return { target, scatter, seed, count }
}

const vertex = /* glsl */ `
  attribute vec3 position;   // scattered origin
  attribute vec3 aTarget;    // position inside the logo
  attribute float aSeed;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uProgress;   // 0 = dust, 1 = logo
  uniform float uDisperse;   // driven by scroll
  uniform vec2 uMouse;
  uniform float uSize;

  varying float vAlpha;
  varying float vSeed;

  void main() {
    float eased = smoothstep(0.0, 1.0, uProgress);
    // Each particle arrives on its own beat so the logo assembles rather than snaps.
    float lag = mix(0.55, 1.0, aSeed);
    float p = clamp((eased - (1.0 - lag)) / lag, 0.0, 1.0);

    vec3 pos = mix(position, aTarget, p);

    // Idle drift, strongest while the cloud is still loose.
    float breathe = 0.035 + 0.12 * (1.0 - p);
    pos.x += sin(uTime * 0.6 + aSeed * 30.0) * breathe;
    pos.y += cos(uTime * 0.5 + aSeed * 22.0) * breathe;
    pos.z += sin(uTime * 0.4 + aSeed * 12.0) * breathe;

    // Pointer pushes nearby particles away, then they settle back.
    vec2 away = pos.xy - uMouse;
    float d = length(away);
    float push = smoothstep(0.55, 0.0, d) * 0.42;
    pos.xy += normalize(away + 0.0001) * push;

    // Scroll blows the cloud apart and back into dust.
    pos += normalize(position + 0.0001) * uDisperse * (0.6 + aSeed);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aSeed * 0.8) * (3.0 / -mv.z);

    vAlpha = (0.35 + 0.65 * p) * (1.0 - uDisperse * 0.8);
    vSeed = aSeed;
  }
`

const fragment = /* glsl */ `
  precision highp float;
  varying float vAlpha;
  varying float vSeed;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float soft = smoothstep(0.5, 0.05, dist);
    vec3 color = mix(uColorA, uColorB, vSeed);
    gl_FragColor = vec4(color, soft * vAlpha);
  }
`

/** The ARVA lotus, rebuilt every visit out of ~14k points of light. */
export function ParticleLogo({ className = '' }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null)
  const [cloud, setCloud] = useState<Awaited<ReturnType<typeof sampleLogo>> | null>(null)

  useEffect(() => {
    let alive = true
    sampleLogo('/images/logo-primary@2x.webp', MAX_POINTS()).then((data) => alive && setCloud(data))
    return () => {
      alive = false
    }
  }, [])

  const setup = useCallback(
    ({ renderer, gl, size }: { renderer: import('ogl').Renderer; gl: WebGL2RenderingContext | WebGLRenderingContext; size: { width: number; height: number } }) => {
      if (!cloud) return
      const camera = new Camera(gl as never, { fov: 40 })
      camera.position.z = 3.4
      camera.perspective({ aspect: size.width / size.height })

      const scene = new Transform()
      const geometry = new Geometry(gl as never, {
        position: { size: 3, data: cloud.scatter },
        aTarget: { size: 3, data: cloud.target },
        aSeed: { size: 1, data: cloud.seed },
      })

      const uniforms = {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uDisperse: { value: 0 },
        uMouse: { value: new Vec2(9, 9) },
        uSize: { value: Math.min(size.width, size.height) > 900 ? 2.6 : 2.0 },
        uColorA: { value: [0.85, 0.63, 0.37] },
        uColorB: { value: [0.93, 0.87, 0.78] },
      }

      const program = new Program(gl as never, { vertex, fragment, uniforms, transparent: true, depthTest: false })
      const mesh = new Mesh(gl as never, { mode: gl.POINTS, geometry, program })
      // Sit the mark in the upper third so the headline below stays legible.
      const place = (width: number, height: number) => {
        const compact = width < 900
        mesh.scale.set(compact ? 0.62 : 0.52)
        mesh.position.set(0, compact ? 0.42 : 0.62, 0)
        uniforms.uSize.value = Math.min(width, height) > 900 ? 2.4 : 1.9
      }
      place(size.width, size.height)
      mesh.setParent(scene)

      // Assemble on entry.
      const intro = gsap.to(uniforms.uProgress, { value: 1, duration: 3.4, ease: 'power2.inOut' })

      // Scroll pulls it apart again.
      const st = ScrollTrigger.create({
        trigger: host.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
        onUpdate: (self) => {
          uniforms.uDisperse.value = self.progress * 1.4
        },
      })

      const target = new Vec2(9, 9)
      const onMove = (e: PointerEvent) => {
        const rect = host.current!.getBoundingClientRect()
        const aspect = rect.width / rect.height
        const scale = mesh.scale.x || 1
        target.set(
          (((e.clientX - rect.left) / rect.width - 0.5) * 2 * aspect * 1.2) / scale,
          (-((e.clientY - rect.top) / rect.height - 0.5) * 2 * 1.2 - mesh.position.y) / scale,
        )
      }
      const onLeave = () => target.set(9, 9)
      host.current?.addEventListener('pointermove', onMove)
      host.current?.addEventListener('pointerleave', onLeave)

      return {
        render: (time: number) => {
          uniforms.uTime.value = time
          // Ease the pointer so the repulsion never snaps.
          uniforms.uMouse.value.x += (target.x - uniforms.uMouse.value.x) * 0.08
          uniforms.uMouse.value.y += (target.y - uniforms.uMouse.value.y) * 0.08
          renderer.render({ scene, camera })
        },
        resize: (width: number, height: number) => {
          camera.perspective({ aspect: width / height })
          place(width, height)
        },
        dispose: () => {
          intro.kill()
          st.kill()
          host.current?.removeEventListener('pointermove', onMove)
          host.current?.removeEventListener('pointerleave', onLeave)
        },
      }
    },
    [cloud],
  )

  useWebGL(host, setup, { enabled: !!cloud })

  return <div ref={host} className={`absolute inset-0 ${className}`} aria-hidden />
}
