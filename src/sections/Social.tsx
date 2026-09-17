import { useRef } from 'react'
import { ArrowIcon } from '../components/Button'
import { Magnetic } from '../components/Magnetic'
import { socialImages, socials } from '../lib/content'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'
import { useReveals } from '../lib/useReveals'

const rows = [socialImages.slice(0, 4), socialImages.slice(4, 8)]

/** Two rows of reels sliding in opposite directions, tied to scroll. */
export function Social() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-srow]').forEach((row, i) => {
          gsap.fromTo(
            row,
            { xPercent: i % 2 ? -18 : 0 },
            {
              xPercent: i % 2 ? 0 : -18,
              ease: 'none',
              scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
            },
          )
        })
      })
    },
    { scope: root },
  )

  useReveals(root)

  const instagram = socials[0].href

  return (
    <section ref={root} id="social" className="relative overflow-clip bg-espresso py-28 md:py-40">
      <div className="container-x mb-16 flex flex-col justify-between gap-10 md:mb-20 md:flex-row md:items-end">
        <div>
          <p data-fade className="eyebrow mb-8 text-gold">
            07 — Community
          </p>
          <h2 data-lines className="display text-[clamp(3.25rem,8vw,8.5rem)]">
            Follow Me <em className="text-gold">On Social</em>
          </h2>
        </div>
        <div data-stagger className="flex flex-wrap gap-3">
          {socials.map((s) => (
            <Magnetic key={s.label} strength={0.3}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="hide"
                className="group flex items-center gap-2 rounded-full border border-cream/20 px-5 py-3 text-sm transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-espresso"
              >
                {s.label}
                <ArrowIcon className="size-3.5 transition-transform duration-500 group-hover:rotate-45" />
              </a>
            </Magnetic>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        {rows.map((row, r) => (
          <div key={r} data-srow className="flex w-max gap-4 will-change-transform md:gap-6">
            {[...row, ...row, ...row].map((src, i) => (
              <a
                key={`${src}-${i}`}
                href={instagram}
                target="_blank"
                rel="noreferrer"
                data-cursor-label="Watch"
                className="group relative aspect-[9/14] w-[42vw] shrink-0 overflow-hidden rounded-[1.5rem] sm:w-[28vw] md:w-[16vw]"
                aria-label="View on Instagram"
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-[scale,filter] duration-1000 ease-(--ease-expo) group-hover:scale-110 group-hover:saturate-[1.15]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-4 left-4 text-xs font-semibold tracking-wider text-cream uppercase opacity-0 transition-[opacity,translate] duration-500 group-hover:-translate-y-1 group-hover:opacity-100">
                  @arvamethod
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
