import { useRef, useState } from 'react'
import { ArrowIcon } from '../../components/Button'
import { begin } from '../../lib/content'
import { useReveals } from '../../lib/useReveals'

/**
 * V2: the four entry points as a full-height accordion — hovering a column opens it
 * and its photograph takes over. On touch, the open column follows taps instead.
 */
export function BeginAccordion() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(0)

  useReveals(root)

  return (
    <section ref={root} id="begin" className="relative bg-cream-2 py-24 text-espresso md:py-32">
      <div className="container-x mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p data-fade className="eyebrow mb-6 text-teal">
            (04) Entry points
          </p>
          <h2 data-lines className="display text-[clamp(3rem,8vw,8.5rem)] leading-[0.88]">
            How to <em className="text-teal">Begin</em>
          </h2>
        </div>
        <p data-lines className="max-w-md text-lg leading-relaxed text-espresso/70">
          {begin.intro}
        </p>
      </div>

      <div className="container-x">
        <div className="flex h-[72vh] min-h-[420px] flex-col gap-2 md:flex-row md:gap-3">
          {begin.paths.map((path, i) => {
            const active = open === i
            return (
              <a
                key={path.title}
                href={path.href}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(i)}
                data-cursor-label="Open"
                aria-current={active}
                className={`group relative overflow-hidden rounded-[1.75rem] transition-[flex-grow] duration-[900ms] ease-(--ease-expo) ${
                  active ? 'grow-[4]' : 'grow'
                }`}
                style={{ flexBasis: 0 }}
              >
                <img
                  src={path.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 size-full object-cover transition-[scale,filter] duration-[1200ms] ease-(--ease-expo) ${
                    active ? 'scale-100 saturate-100' : 'scale-110 saturate-[0.35]'
                  }`}
                />
                <span
                  className={`absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-90'}`}
                  style={{ background: 'linear-gradient(to top, rgba(23,17,15,0.92), rgba(23,17,15,0.15) 60%)' }}
                />

                <span className="absolute inset-0 flex flex-col justify-between p-5 text-cream md:p-7">
                  <span className="flex items-start justify-between">
                    <span className="eyebrow opacity-70">0{i + 1}</span>
                    <span
                      className={`grid size-10 place-items-center rounded-full border border-cream/30 transition-[rotate,background-color,color] duration-700 ${
                        active ? 'rotate-45 border-gold bg-gold text-espresso' : ''
                      }`}
                    >
                      <ArrowIcon className="size-4" />
                    </span>
                  </span>

                  <span className="flex flex-col gap-3">
                    <span className="eyebrow text-gold">{path.tag}</span>
                    {/* Vertical when closed on desktop, horizontal when open */}
                    <span
                      className={`display leading-[0.95] transition-all duration-700 ease-(--ease-expo) ${
                        active ? 'text-[clamp(1.9rem,3.4vw,3.5rem)]' : 'text-[clamp(1.4rem,2vw,2rem)] md:[writing-mode:vertical-rl]'
                      }`}
                    >
                      {path.title}
                    </span>
                    <span
                      className={`max-w-md text-sm leading-relaxed text-cream/75 transition-[opacity,translate] duration-700 ${
                        active ? 'translate-y-0 opacity-100 delay-150' : 'pointer-events-none translate-y-3 opacity-0'
                      }`}
                    >
                      {path.text}
                    </span>
                    <span
                      className={`text-xs font-semibold tracking-wider uppercase transition-opacity duration-700 ${
                        active ? 'opacity-100 delay-200' : 'opacity-0'
                      }`}
                    >
                      {path.cta}
                    </span>
                  </span>
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
