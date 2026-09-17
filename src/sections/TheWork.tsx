import { useRef } from 'react'
import { work } from '../lib/content'
import { DESKTOP, gsap, SplitText, useGSAP } from '../lib/gsap'
import { useReveals } from '../lib/useReveals'

export function TheWork() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(DESKTOP, () => {
        // The pull quote brightens as it crosses the viewport.
        const split = SplitText.create('[data-pull]', { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: { trigger: '[data-pull]', start: 'top 80%', end: 'bottom 50%', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <section ref={root} id="work" className="relative z-10 -mt-px overflow-clip rounded-t-[2.5rem] bg-cream text-espresso md:rounded-t-[5rem]">
      <div className="container-x grid gap-14 py-28 md:grid-cols-12 md:gap-8 md:py-40">
        {/* Sticky portrait */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <div data-clip className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <img
                data-parallax="7"
                src="/images/arrabella-chair.webp"
                alt="Arrabella Schippers, founder of ARVAmethod"
                loading="lazy"
                decoding="async"
                className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-cream/95 px-5 py-4">
                <div>
                  <p className="display text-2xl leading-none">Arrabella Schippers</p>
                  <p className="mt-1 text-xs text-espresso/60">Founder, ARVAmethod</p>
                </div>
                <span className="eyebrow text-teal">Chicago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:col-span-6 md:col-start-7">
          <p data-fade className="eyebrow mb-8 text-teal">
            02 — Approach
          </p>
          <h2 data-lines className="display text-[clamp(3rem,7vw,7.5rem)]">
            {work.title}
          </h2>
          <p data-lines className="mt-10 text-2xl leading-snug md:text-3xl">
            {work.lead}
          </p>
          <p data-lines className="mt-6 text-lg leading-relaxed text-espresso/70">
            {work.body}
          </p>

          <ul className="mt-14 border-t border-espresso/15" data-stagger>
            {work.pillars.map((pillar, i) => (
              <li
                key={pillar}
                className="group flex items-center justify-between border-b border-espresso/15 py-6 transition-colors"
              >
                <span className="flex items-baseline gap-6">
                  <span className="eyebrow text-espresso/40">0{i + 1}</span>
                  <span className="display text-4xl transition-[translate,color] duration-700 ease-(--ease-expo) group-hover:translate-x-3 group-hover:text-teal md:text-5xl">
                    {pillar}
                  </span>
                </span>
                <span className="size-2.5 rounded-full bg-gold transition-transform duration-500 group-hover:scale-[2.2]" />
              </li>
            ))}
          </ul>

          <blockquote
            data-pull
            className="display mt-20 border-l-2 border-gold pl-6 text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.05] text-teal italic md:pl-10"
          >
            “{work.pull}”
          </blockquote>

          <p data-lines className="mt-14 text-lg leading-relaxed text-espresso/70">
            {work.closing}
          </p>
        </div>
      </div>
    </section>
  )
}
