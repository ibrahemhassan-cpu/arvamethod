import { useRef } from 'react'
import { testimonials } from '../../lib/content'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { useReveals } from '../../lib/useReveals'
import { useTilt } from '../../lib/useTilt'

// Each card sits at its own depth so the column breathes as you scroll.
const depth = [0.16, -0.1, 0.22, -0.16, 0.1, -0.2]

/** V3: testimonials as panes of smoked glass floating at different depths. */
export function StoriesGlass() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-glass]').forEach((card, i) => {
          gsap.fromTo(
            card,
            { yPercent: depth[i % depth.length] * 90 },
            {
              yPercent: -depth[i % depth.length] * 90,
              ease: 'none',
              scrollTrigger: { trigger: card.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
            },
          )
        })
      })
    },
    { scope: root },
  )

  useReveals(root)
  useTilt(root, 5)

  return (
    <section ref={root} id="stories" className="relative overflow-clip py-24 text-cream md:py-36">
      <div className="container-x">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-fade className="eyebrow mb-6 text-gold">
              (06) Testimonials
            </p>
            <h2 data-lines className="display text-[clamp(2.75rem,7.5vw,8rem)] leading-[0.9]">
              Real Stories, <em className="text-gold">Real Life</em>
            </h2>
          </div>
          <p data-fade className="eyebrow text-cream/40">
            Hover a pane — it leans with you
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {testimonials.map((t, i) => (
            <div key={t.name} className="md:[&:nth-child(3n+2)]:mt-16">
              <article
                data-glass
                data-tilt
                className="relative h-full overflow-hidden rounded-[1.75rem] border border-cream/12 bg-ink/55 p-7 will-change-transform md:p-8"
              >
                <span
                  data-glare
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-1/2 z-10 -mt-[50%] -ml-[50%] aspect-square w-full rounded-full opacity-0"
                  style={{ background: 'radial-gradient(circle, rgba(197,148,89,0.22), transparent 62%)' }}
                />
                <span className="display block text-6xl leading-[0.4] text-gold/60">“</span>
                <blockquote className="display mt-6 text-[clamp(1.4rem,1.9vw,2rem)] leading-[1.1]">
                  {t.headline}
                </blockquote>
                <p className="mt-5 text-sm leading-relaxed text-cream/65">{t.quote}</p>
                <figcaption className="mt-7 flex items-center gap-4 border-t border-cream/10 pt-5">
                  <img
                    src={t.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-11 rounded-full object-cover object-top"
                  />
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-xs text-cream/50">{t.role}</span>
                  </span>
                  <span className="eyebrow ml-auto text-cream/30 tabular-nums">0{i + 1}</span>
                </figcaption>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
