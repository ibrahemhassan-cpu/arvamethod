import type { RefObject } from 'react'
import { gsap, MOTION_OK, useGSAP } from './gsap'

/**
 * 3D pointer tilt with a moving glare for every `[data-tilt]` inside `scope`.
 * A child `[data-glare]` (optional) follows the pointer. Transforms only; fine pointers only.
 */
export function useTilt(scope: RefObject<HTMLElement | null>, max = 7) {
  useGSAP(
    (_, contextSafe) => {
      if (!contextSafe) return
      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const cleanups = gsap.utils.toArray<HTMLElement>('[data-tilt]', scope.current).map((card) => {
          gsap.set(card, { transformPerspective: 1000 })
          const glare = card.querySelector<HTMLElement>('[data-glare]')
          const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' })
          const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' })
          const gx = glare && gsap.quickTo(glare, 'xPercent', { duration: 0.5, ease: 'power3' })
          const gy = glare && gsap.quickTo(glare, 'yPercent', { duration: 0.5, ease: 'power3' })

          const move = contextSafe((e: PointerEvent) => {
            const r = card.getBoundingClientRect()
            const px = (e.clientX - r.left) / r.width - 0.5
            const py = (e.clientY - r.top) / r.height - 0.5
            rx(-py * max)
            ry(px * max)
            gx?.(px * 100)
            gy?.(py * 100)
          })
          const enter = contextSafe(() => {
            if (glare) gsap.to(glare, { opacity: 1, duration: 0.4, overwrite: 'auto' })
          })
          const leave = contextSafe(() => {
            rx(0)
            ry(0)
            if (glare) gsap.to(glare, { opacity: 0, duration: 0.6, overwrite: 'auto' })
          })

          card.addEventListener('pointerenter', enter)
          card.addEventListener('pointermove', move)
          card.addEventListener('pointerleave', leave)
          return () => {
            card.removeEventListener('pointerenter', enter)
            card.removeEventListener('pointermove', move)
            card.removeEventListener('pointerleave', leave)
          }
        })
        return () => cleanups.forEach((fn) => fn())
      })
    },
    { scope },
  )
}
