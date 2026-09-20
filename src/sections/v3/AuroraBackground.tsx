import { Mesh, Program, Triangle, Vec2 } from 'ogl'
import { useCallback, useRef } from 'react'
import { ScrollTrigger } from '../../lib/gsap'
import { useWebGL } from '../../lib/webgl/useRenderer'

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

/** Cheap value noise (3 octaves) pushed around by time, scroll and the pointer. */
const fragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * vec2(uResolution.x / uResolution.y, 1.0);

    float t = uTime * 0.045;
    vec2 flow = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 - t + 4.7));
    float n = fbm(p * 2.1 + flow * 1.4 + vec2(0.0, uScroll * 0.6));

    // Brand palette: ink → teal → gold, with a soft glow following the pointer.
    vec3 ink = vec3(0.075, 0.059, 0.051);
    vec3 teal = vec3(0.145, 0.267, 0.259);
    vec3 gold = vec3(0.773, 0.580, 0.349);

    vec3 color = mix(ink, teal, smoothstep(0.25, 0.85, n));
    color = mix(color, gold, smoothstep(0.62, 0.98, n) * 0.55);

    float glow = smoothstep(0.55, 0.0, distance(p, uMouse));
    color += gold * glow * 0.14;

    // Vignette keeps the type legible over it.
    float vig = smoothstep(1.15, 0.25, length(uv - 0.5));
    color *= 0.55 + 0.45 * vig;

    gl_FragColor = vec4(color, 1.0);
  }
`

/** Living gradient behind the whole Immersive version. */
export function AuroraBackground() {
  const host = useRef<HTMLDivElement>(null)

  const setup = useCallback(
    ({ renderer, gl, size }: { renderer: import('ogl').Renderer; gl: WebGL2RenderingContext | WebGLRenderingContext; size: { width: number; height: number } }) => {
      const geometry = new Triangle(gl as never)
      const uniforms = {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uMouse: { value: new Vec2(0.5, 0.5) },
        uResolution: { value: new Vec2(size.width, size.height) },
      }
      const program = new Program(gl as never, { vertex, fragment, uniforms })
      const mesh = new Mesh(gl as never, { geometry, program })

      const target = new Vec2(0.5, 0.5)
      const onMove = (e: PointerEvent) => {
        const aspect = window.innerWidth / window.innerHeight
        target.set((e.clientX / window.innerWidth) * aspect, 1 - e.clientY / window.innerHeight)
      }
      window.addEventListener('pointermove', onMove, { passive: true })

      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          uniforms.uScroll.value = self.progress * 3
        },
      })

      return {
        render: (time: number) => {
          uniforms.uTime.value = time
          uniforms.uMouse.value.x += (target.x - uniforms.uMouse.value.x) * 0.05
          uniforms.uMouse.value.y += (target.y - uniforms.uMouse.value.y) * 0.05
          renderer.render({ scene: mesh })
        },
        resize: (width: number, height: number) => uniforms.uResolution.value.set(width, height),
        dispose: () => {
          window.removeEventListener('pointermove', onMove)
          st.kill()
        },
      }
    },
    [],
  )

  // Half-resolution is plenty for a soft gradient and keeps the GPU cost near zero.
  useWebGL(host, setup, { maxDpr: 1, alwaysVisible: true })

  return <div ref={host} className="pointer-events-none fixed inset-0 -z-10 bg-ink" aria-hidden />
}
