import { useRef } from 'react'
import { testimonials } from '../lib/content'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'
import { useReveals } from '../lib/useReveals'

const themes = [
  'bg-cream text-espresso',
  'bg-teal text-cream',
  'bg-gold-soft text-espresso',
  'bg-espresso-2 text-cream ring-1 ring-cream/10',
  'bg-cream-2 text-espresso',
  'bg-teal-deep text-cream ring-1 ring-cream/10',
]

/** Sticky cards that stack; each one recedes and dims as the next slides over it. */
export function Testimonials() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-tcard]')
        cards.forEach((card, i) => {
          const next = cards[i + 1]
          if (!next) return
          gsap.to(card.querySelector('[data-tinner]'), {
            scale: 0.9,
            rotate: i % 2 ? 1.5 : -1.5,
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 15%', scrub: true },
          })
          gsap.to(card.querySelector('[data-tdim]'), {
            opacity: 0.55,
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 15%', scrub: true },
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-tphoto]').forEach((photo) => {
          gsap.fromTo(
            photo,
            { clipPath: 'circle(0% at 50% 50%)' },
            {
              clipPath: 'circle(100% at 50% 50%)',
              duration: 1.6,
              ease: 'expo.inOut',
              scrollTrigger: { trigger: photo, start: 'top 85%', once: true },
            },
          )
        })
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <section ref={root} id="stories" className="relative bg-espresso pt-28 pb-24 md:pt-40">
      <div className="container-x mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
        <div>
          <p data-fade className="eyebrow mb-8 text-gold">
            05 — Testimonials
          </p>
          <h2 data-lines className="display text-[clamp(3.25rem,9vw,10rem)]">
            Real Stories, <em className="text-gold">Real Life</em>
          </h2>
        </div>
        <p data-lines className="max-w-sm text-lg leading-relaxed text-cream/70">
          Athletes, doctors, parents and seekers — people who came for one thing and found the whole picture.
        </p>
      </div>

      <div className="container-x">
        {testimonials.map((t, i) => (
          <article
            key={t.name}
            data-tcard
            className="sticky mb-[12vh] last:mb-0"
            style={{ top: `calc(12vh + ${i * 14}px)` }}
          >
            <div
              data-tinner
              className={`relative origin-top overflow-hidden rounded-[2rem] will-change-transform md:rounded-[2.5rem] ${themes[i % themes.length]}`}
            >
              <div data-tdim className="pointer-events-none absolute inset-0 z-10 bg-ink opacity-0" />
              <div className="grid gap-8 p-7 md:min-h-[72vh] md:grid-cols-12 md:gap-10 md:p-14">
                <div className="flex items-center gap-5 md:col-span-4 md:flex-col md:items-start md:justify-between">
                  <div
                    data-tphoto
                    className="aspect-square w-20 shrink-0 overflow-hidden rounded-full md:aspect-[4/5] md:w-full md:max-w-xs md:rounded-[1.5rem]"
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="display text-3xl leading-none md:text-4xl">{t.name}</p>
                    <p className="mt-2 text-sm opacity-65">{t.role}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-10 md:col-span-8">
                  <div className="flex items-start justify-between gap-6">
                    <span className="display text-[6rem] leading-[0.6] opacity-40 md:text-[9rem]">“</span>
                    <span className="eyebrow pt-2 tabular-nums opacity-60">
                      {String(i + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
                    </span>
                  </div>
                  <blockquote>
                    <p className="display text-[clamp(2rem,4.2vw,4.25rem)] leading-[1.02]">{t.headline}</p>
                    <p className="mt-8 max-w-2xl text-base leading-relaxed opacity-75 md:text-lg">{t.quote}</p>
                  </blockquote>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
