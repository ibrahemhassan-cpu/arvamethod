import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

/**
 * Two-part cursor: a precise dot and a lagging ring that grows into a label
 * over elements marked with `data-cursor-label`. Fine pointers only.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const circle = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLSpanElement>(null)
  const [label, setLabel] = useState('')
  const [enabled] = useState(
    () => window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useGSAP(() => {
    if (!enabled || !dot.current || !ring.current) return
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })

    let visible = false
    const move = (e: PointerEvent) => {
      if (!visible) {
        visible = true
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }

    let current: Element | null = null
    const over = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor-label], [data-cursor], a, button')
      if (target === current) return
      current = target

      const labelText = target?.dataset.cursorLabel ?? ''
      const hide = target?.dataset.cursor === 'hide'
      const interactive = !!target && !labelText && !hide
      if (labelText) setLabel(labelText)

      gsap.to(text.current, { autoAlpha: labelText ? 1 : 0, scale: labelText ? 1 : 0.6, duration: 0.4 })
      gsap.to(circle.current, {
        scale: labelText ? 2.4 : interactive ? 1.6 : 1,
        opacity: hide ? 0 : 1,
        backgroundColor: labelText ? 'rgba(197,148,89,1)' : 'rgba(197,148,89,0)',
        borderColor: labelText ? 'rgba(197,148,89,0)' : 'rgba(226,216,197,0.5)',
        duration: 0.5,
      })
      gsap.to(dot.current, { scale: labelText || hide ? 0 : 1, duration: 0.3 })
    }

    const leave = () => {
      visible = false
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 })
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={ring} className="pointer-events-none fixed top-0 left-0 z-[100] grid size-10 place-items-center">
        <div ref={circle} className="absolute inset-0 rounded-full border border-cream/50" />
        <span
          ref={text}
          className="invisible relative text-[10px] font-bold tracking-[0.18em] whitespace-nowrap text-espresso uppercase opacity-0"
        >
          {label}
        </span>
      </div>
      <div ref={dot} className="pointer-events-none fixed top-0 left-0 z-[100] size-1.5 rounded-full bg-gold" />
    </>
  )
}
