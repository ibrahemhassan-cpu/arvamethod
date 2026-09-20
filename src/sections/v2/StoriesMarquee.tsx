import { useRef } from 'react'
import { testimonials } from '../../lib/content'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { useReveals } from '../../lib/useReveals'

const rows = [testimonials.slice(0, 3), testimonials.slice(3)]

/** V2: quotes drift past in two opposing lanes and slow to a stop under the pointer. */
export function StoriesMarquee() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const loops = gsap.utils.toArray<HTMLElement>('[data-lane]').map((lane, i) => {
          const dir = i % 2 ? 1 : -1
          const loop = gsap.to(lane, { xPercent: -50, duration: 46, ease: 'none', repeat: -1, paused: true })
          loop.totalTime(46 * 500).timeScale(dir)
          return { lane, loop }
        })

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => loops.forEach(({ loop }) => (self.isActive ? loop.play() : loop.pause())),
        })

        // Hovering a lane eases it almost to a stop so the quote can be read.
        const cleanups = loops.map(({ lane, loop }) => {
          const base = loop.timeScale()
          const slow = () => gsap.to(loop, { timeScale: base * 0.12, duration: 0.8, overwrite: true })
          const resume = () => gsap.to(loop, { timeScale: base, duration: 1.2, overwrite: true })
          lane.addEventListener('pointerenter', slow)
          lane.addEventListener('pointerleave', resume)
          return () => {
            lane.removeEventListener('pointerenter', slow)
            lane.removeEventListener('pointerleave', resume)
          }
        })

        return () => {
          st.kill()
          cleanups.forEach((fn) => fn())
        }
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <section ref={root} id="stories" className="relative overflow-clip bg-cream py-24 text-espresso md:py-32">
      <div className="container-x mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
        <div>
          <p data-fade className="eyebrow mb-6 text-teal">
            (06) Real stories
          </p>
          <h2 data-lines className="display text-[clamp(3rem,9vw,9.5rem)] leading-[0.88]">
            Real Stories, <em className="text-teal">Real Life</em>
          </h2>
        </div>
        <p data-fade className="eyebrow text-espresso/40">
          {testimonials.length} clients — coaching &amp; bodywork
        </p>
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        {rows.map((row, r) => (
          <div key={r} className="overflow-hidden">
            <div data-lane className="flex w-max gap-4 will-change-transform md:gap-6">
              {[...row, ...row].map((t, i) => (
                <figure
                  key={`${t.name}-${i}`}
                  className="flex w-[82vw] shrink-0 flex-col justify-between gap-6 rounded-[1.75rem] border border-espresso/10 bg-cream-2 p-6 sm:w-[54vw] md:w-[34vw] md:p-8"
                >
                  <blockquote className="display text-[clamp(1.5rem,2.2vw,2.35rem)] leading-[1.08]">
                    “{t.headline}”
                  </blockquote>
                  <p className="text-sm leading-relaxed text-espresso/65">{t.quote}</p>
                  <figcaption className="flex items-center gap-4 border-t border-espresso/10 pt-5">
                    <img
                      src={t.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="size-12 rounded-full object-cover object-top"
                    />
                    <span>
                      <span className="block text-base font-semibold">{t.name}</span>
                      <span className="block text-xs text-espresso/55">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
