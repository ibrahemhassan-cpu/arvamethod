import { Renderer } from 'ogl'
import { useEffect, type RefObject } from 'react'
import { gsap, ScrollTrigger } from '../gsap'

type Setup = (ctx: {
  renderer: Renderer
  gl: Renderer['gl']
  size: { width: number; height: number }
}) => {
  render: (time: number) => void
  resize?: (width: number, height: number) => void
  dispose?: () => void
} | void

/**
 * Mounts an OGL renderer into `host`, drives it from the GSAP ticker (one clock for the
 * whole page) and pauses it whenever the canvas is off-screen or the tab is hidden.
 */
type Options = {
  /** Skip creating the renderer until the data it needs is ready. */
  enabled?: boolean
  /** Device-pixel-ratio cap — lower it for full-screen background effects. */
  maxDpr?: number
  /** Keep rendering regardless of scroll position (for fixed backgrounds). */
  alwaysVisible?: boolean
}

export function useWebGL(host: RefObject<HTMLElement | null>, setup: Setup, options: Options = {}) {
  const { enabled = true, maxDpr = 1.75, alwaysVisible = false } = options
  useEffect(() => {
    const el = host.current
    if (!el || !enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const renderer = new Renderer({ alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio, maxDpr) })
    const gl = renderer.gl
    gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
    el.appendChild(gl.canvas)

    const size = { width: el.clientWidth, height: el.clientHeight }
    renderer.setSize(size.width, size.height)

    const scene = setup({ renderer, gl, size })
    let visible = true
    let hidden = document.hidden

    const tick = (time: number) => {
      if (!visible || hidden) return
      scene?.render(time / 1000) // the scene calls renderer.render itself
    }
    gsap.ticker.add(tick)

    const onResize = () => {
      size.width = el.clientWidth
      size.height = el.clientHeight
      renderer.setSize(size.width, size.height)
      scene?.resize?.(size.width, size.height)
    }
    window.addEventListener('resize', onResize)

    const st = alwaysVisible
      ? null
      : ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (visible = self.isActive),
        })
    const onVisibility = () => (hidden = document.hidden)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      st?.kill()
      scene?.dispose?.()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      gl.canvas.remove()
    }
  }, [host, setup, enabled, maxDpr, alwaysVisible])
}
