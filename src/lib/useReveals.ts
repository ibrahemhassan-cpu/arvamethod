import type { RefObject } from 'react'
import { gsap, MOTION_OK, SplitText, useGSAP } from './gsap'

/**
 * Declarative scroll reveals inside a section:
 *  - [data-lines]  text rises line-by-line out of a mask
 *  - [data-fade]   element fades up (children of [data-stagger] are staggered)
 *  - [data-rule]   hairline draws from left to right
 *  - [data-clip]   image wipes open from bottom while its <img> settles from a zoom
 */
export function useReveals(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope)

        q('[data-lines]').forEach((el: HTMLElement) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'line',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 105,
                duration: 1.2,
                stagger: 0.09,
                ease: 'expo.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }),
          })
        })

        q('[data-fade]').forEach((el: HTMLElement) => {
          gsap.from(el, {
            y: 40,
            autoAlpha: 0,
            duration: 1.2,
            ease: 'expo.out',
            delay: Number(el.dataset.fade) || 0,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })

        q('[data-stagger]').forEach((el: HTMLElement) => {
          gsap.from(el.children, {
            y: 40,
            autoAlpha: 0,
            duration: 1.1,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })

        q('[data-rule]').forEach((el: HTMLElement) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.6,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          })
        })

        q('[data-clip]').forEach((el: HTMLElement) => {
          const img = el.querySelector('img')
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
          tl.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' },
          )
          if (img) tl.from(img, { scale: 1.4, duration: 2, ease: 'expo.out' }, 0.2)
        })

        // Images that drift within their frame while scrolling.
        q('[data-parallax]').forEach((el: HTMLElement) => {
          const amount = Number(el.dataset.parallax) || 12
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      })
    },
    { scope },
  )
}
