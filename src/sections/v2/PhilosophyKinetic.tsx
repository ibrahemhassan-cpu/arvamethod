import { useRef } from 'react'
import { philosophy } from '../../lib/content'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { useReveals } from '../../lib/useReveals'

const words = ['The', 'Body', 'and', 'Mind', 'Are', 'Not', 'Separate', 'Systems.']

/** V2: the sentence assembles itself from alternating sides while two columns pass in opposite directions. */
export function PhilosophyKinetic() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-kw]',
          { xPercent: (i: number) => (i % 2 ? 60 : -60), autoAlpha: 0 },
          {
            xPercent: 0,
            autoAlpha: 1,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: '[data-kstatement]', start: 'top 85%', end: 'bottom 55%', scrub: 0.8 },
          },
        )

        gsap.fromTo(
          '[data-col="up"]',
          { yPercent: 6 },
          {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: { trigger: '[data-cols]', start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        gsap.fromTo(
          '[data-col="down"]',
          { yPercent: -10 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: '[data-cols]', start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <section ref={root} id="philosophy" className="relative overflow-clip bg-cream py-24 text-espresso md:py-36">
      <div className="container-x">
        <div className="mb-10 flex items-end justify-between gap-6">
          <p data-fade className="eyebrow text-teal">
            (02) Philosophy
          </p>
          <p data-fade className="eyebrow text-espresso/40">Not two systems — one</p>
        </div>

        <h2
          data-kstatement
          className="display flex flex-wrap gap-x-[0.22em] gap-y-1 text-[clamp(2.6rem,8.6vw,9rem)] leading-[0.9] tracking-[-0.03em]"
        >
          {words.map((word) => (
            <span
              key={word}
              data-kw
              className={`inline-block will-change-transform ${word === 'Not' || word === 'Separate' ? 'text-teal italic' : ''}`}
            >
              {word}
            </span>
          ))}
        </h2>

        <div data-cols className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12 md:gap-8">
          <div data-col="up" className="md:col-span-3">
            <figure className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <img src="/images/bodywork.webp" alt="" loading="lazy" decoding="async" className="size-full object-cover" />
            </figure>
            <p className="eyebrow mt-4 text-espresso/50">Body</p>
          </div>

          <div className="flex flex-col justify-center gap-8 md:col-span-6 md:px-6">
            {philosophy.body.map((text, i) => (
              <p key={i} data-lines className="text-lg leading-relaxed text-espresso/75 md:text-xl">
                <span className="mr-3 align-super text-xs text-teal tabular-nums">0{i + 1}</span>
                {text}
              </p>
            ))}
          </div>

          <div data-col="down" className="md:col-span-3">
            <figure className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <img src="/images/coffee-light.webp" alt="" loading="lazy" decoding="async" className="size-full object-cover" />
            </figure>
            <p className="eyebrow mt-4 text-right text-espresso/50">Mind</p>
          </div>
        </div>
      </div>
    </section>
  )
}
