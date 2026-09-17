import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

type Props = {
  children: ReactNode
  strength?: number
  className?: string
}

/** Pulls its child toward the pointer, then springs back on leave. */
export function Magnetic({ children, strength = 0.35, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current
      if (!el || !contextSafe || !window.matchMedia('(pointer: fine)').matches) return

      const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.35)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.35)' })

      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      })
      const leave = contextSafe(() => {
        xTo(0)
        yTo(0)
      })

      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  )
}
