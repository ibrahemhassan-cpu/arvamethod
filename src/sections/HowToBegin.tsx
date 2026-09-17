import { useRef } from 'react'
import { ArrowIcon } from '../components/Button'
import { begin } from '../lib/content'
import { DESKTOP, gsap, useGSAP } from '../lib/gsap'
import { useReveals } from '../lib/useReveals'
import { useTilt } from '../lib/useTilt'

/** Pins the section and translates a rail of entry points sideways as you scroll down. */
export function HowToBegin() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(DESKTOP, () => {
        const rail = root.current!.querySelector<HTMLElement>('[data-rail]')!
        const distance = () => rail.scrollWidth - window.innerWidth

        const move = gsap.to(rail, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-hpin]',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set('[data-progress]', { scaleX: self.progress })
              const index = Math.min(begin.paths.length, Math.floor(self.progress * begin.paths.length) + 1)
              const counter = root.current?.querySelector('[data-count]')
              if (counter) counter.textContent = String(index).padStart(2, '0')
            },
          },
        })

        // Each card's photo drifts against the rail, and cards tilt in as they enter from the right.
        gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card) => {
          gsap.fromTo(
            card.querySelector('img'),
            { xPercent: -10 },
            {
              xPercent: 10,
              ease: 'none',
              scrollTrigger: { trigger: card, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
            },
          )
          gsap.from(card, {
            rotate: 4,
            y: 60,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: move, start: 'left right', end: 'left 55%', scrub: true },
          })
        })
      })
    },
    { scope: root },
  )

  useReveals(root)
  useTilt(root, 6)

  return (
    <section ref={root} id="begin" className="relative bg-teal-deep text-cream">
      <div data-hpin className="relative overflow-hidden md:h-[100svh]">
        <div
          data-rail
          className="flex h-full flex-col gap-6 px-5 py-24 will-change-transform md:w-max md:flex-row md:items-center md:gap-8 md:px-[4vw] md:py-0"
        >
          {/* Intro panel */}
          <div className="flex shrink-0 flex-col justify-center pb-8 md:w-[40vw] md:pr-[4vw] md:pb-0">
            <p data-fade className="eyebrow mb-8 text-mist">
              03 — Entry points
            </p>
            <h2 data-lines className="display text-[clamp(3.25rem,8vw,9rem)]">
              How to <em className="text-gold">Begin</em>
            </h2>
            <p data-lines className="mt-8 max-w-lg text-lg leading-relaxed text-cream/75">
              {begin.intro}
            </p>
            <p data-fade className="eyebrow mt-12 hidden items-center gap-4 text-cream/50 md:flex">
              Keep scrolling
              <span className="relative h-px w-20 overflow-hidden bg-cream/20">
                <span className="absolute inset-y-0 left-0 w-1/2 animate-[railcue_2s_ease-in-out_infinite] bg-gold" />
              </span>
            </p>
          </div>

          {begin.paths.map((path, i) => (
            <a
              key={path.title}
              href={path.href}
              target="_blank"
              rel="noreferrer"
              data-card
              data-tilt
              data-cursor-label="Explore"
              className="group relative flex shrink-0 flex-col overflow-hidden rounded-[2rem] bg-cream text-espresso md:h-[76vh] md:w-[min(34vw,560px)]"
            >
              <div className="relative h-72 overflow-hidden md:h-[52%]">
                <img
                  src={path.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-y-0 -left-[12%] h-full w-[124%] max-w-none object-cover transition-[scale] duration-1000 ease-(--ease-expo) group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                <span className="absolute top-5 left-5 rounded-full bg-cream px-4 py-2 text-[11px] font-semibold tracking-wider text-espresso uppercase">
                  {path.tag}
                </span>
                <span className="display absolute right-5 bottom-3 text-7xl text-cream/90 md:text-8xl">0{i + 1}</span>
              </div>
              <span
                data-glare
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 z-10 -mt-[50%] -ml-[50%] aspect-square w-full rounded-full opacity-0"
                style={{ background: 'radial-gradient(circle, rgba(255,248,235,0.28), transparent 60%)' }}
              />
              <div className="flex flex-1 flex-col p-7 md:p-9">
                <h3 className="display text-4xl md:text-[2.75rem]">{path.title}</h3>
                <p className="mt-4 leading-relaxed text-espresso/70">{path.text}</p>
                <span className="mt-auto flex items-center justify-between border-t border-espresso/15 pt-6">
                  <span className="text-sm font-semibold">{path.cta}</span>
                  <span className="grid size-11 place-items-center rounded-full bg-espresso text-gold transition-[rotate,background-color] duration-500 group-hover:rotate-45 group-hover:bg-gold group-hover:text-espresso">
                    <ArrowIcon />
                  </span>
                </span>
              </div>
            </a>
          ))}
          <div className="hidden w-[4vw] shrink-0 md:block" />
        </div>

        {/* Progress */}
        <div className="pointer-events-none absolute inset-x-[4vw] bottom-8 hidden items-center gap-6 md:flex">
          <span className="eyebrow text-cream/60 tabular-nums">
            <span data-count>01</span> / 0{begin.paths.length}
          </span>
          <span className="relative h-px flex-1 bg-cream/15">
            <span data-progress className="absolute inset-0 origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
          </span>
        </div>
      </div>
      <style>{`@keyframes railcue{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
    </section>
  )
}
