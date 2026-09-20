import { useRef } from 'react'
import { work } from '../../lib/content'
import { DESKTOP, gsap, SplitText, useGSAP } from '../../lib/gsap'
import { useReveals } from '../../lib/useReveals'

const panels = [
  { kind: 'intro' as const },
  ...work.pillars.map((pillar, i) => ({ kind: 'pillar' as const, pillar, index: i + 1 })),
  { kind: 'quote' as const },
]

const pillarCopy: Record<string, string> = {
  Dialogue: 'We start with language — what you notice, what you avoid, what you have stopped saying out loud.',
  'Somatic inquiry': 'Then the body answers: where it holds, where it braces, where it has been carrying the story.',
  'Practical frameworks': 'And finally structure — the repeatable practices that make the shift hold in daily life.',
}

/** V2: the approach reads as a horizontal ribbon of full-height panels that slide past as you scroll. */
export function WorkRibbon() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(DESKTOP, () => {
        const rail = root.current!.querySelector<HTMLElement>('[data-ribbon]')!
        const distance = () => rail.scrollWidth - window.innerWidth

        const move = gsap.to(rail, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-ribbon-pin]',
            start: 'top top',
            end: () => `+=${distance() * 1.1}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        })

        gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((panel) => {
          const numeral = panel.querySelector('[data-numeral]')
          if (numeral) {
            gsap.fromTo(
              numeral,
              { xPercent: 30 },
              {
                xPercent: -30,
                ease: 'none',
                scrollTrigger: { trigger: panel, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
              },
            )
          }
        })

        const split = SplitText.create('[data-ribbon-quote]', { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-panel="quote"]',
              containerAnimation: move,
              start: 'left 70%',
              end: 'right right',
              scrub: true,
            },
          },
        )
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <section ref={root} id="work" className="relative bg-espresso text-cream">
      <div data-ribbon-pin className="relative overflow-hidden md:h-[100svh]">
        <div data-ribbon className="flex flex-col md:w-max md:flex-row md:items-stretch">
          {panels.map((panel) => {
            if (panel.kind === 'intro') {
              return (
                <div
                  key="intro"
                  data-panel
                  className="flex shrink-0 flex-col justify-center border-cream/10 px-5 py-24 md:h-[100svh] md:w-[46vw] md:border-r md:px-[4vw] md:py-0"
                >
                  <p data-fade className="eyebrow mb-8 text-gold">
                    (03) The Work Itself
                  </p>
                  <h2 data-lines className="display text-[clamp(3rem,7.5vw,8rem)] leading-[0.9]">
                    Everything begins <em className="text-gold">where you are.</em>
                  </h2>
                  <p data-lines className="mt-8 max-w-md text-lg leading-relaxed text-cream/70">
                    {work.body}
                  </p>
                </div>
              )
            }

            if (panel.kind === 'pillar') {
              return (
                <div
                  key={panel.pillar}
                  data-panel
                  className="relative flex shrink-0 flex-col justify-between overflow-hidden border-cream/10 px-5 py-20 md:h-[100svh] md:w-[34vw] md:border-r md:px-[3vw] md:py-[10vh]"
                >
                  <span
                    data-numeral
                    aria-hidden
                    className="display pointer-events-none absolute -bottom-[6vh] left-0 text-[38vw] leading-none text-cream/[0.045] md:text-[26vw]"
                  >
                    0{panel.index}
                  </span>
                  <p className="eyebrow relative text-cream/40">0{panel.index} / 03</p>
                  <div className="relative">
                    <h3 className="display text-[clamp(2.5rem,5vw,5rem)] leading-[0.95]">{panel.pillar}</h3>
                    <p className="mt-6 max-w-sm leading-relaxed text-cream/65">{pillarCopy[panel.pillar]}</p>
                  </div>
                </div>
              )
            }

            return (
              <div
                key="quote"
                data-panel="quote"
                className="relative flex shrink-0 items-center overflow-hidden px-5 py-24 md:h-[100svh] md:w-[62vw] md:px-[4vw] md:py-0"
              >
                <img
                  src="/images/arrabella-chair.webp"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover opacity-25"
                />
                <div className="relative">
                  <blockquote
                    data-ribbon-quote
                    className="display max-w-4xl text-[clamp(2rem,4.6vw,4.75rem)] leading-[1.03] text-cream"
                  >
                    “{work.pull}”
                  </blockquote>
                  <p className="mt-10 max-w-xl leading-relaxed text-cream/65">{work.closing}</p>
                </div>
              </div>
            )
          })}
          <div key="tail" className="hidden w-[4vw] shrink-0 md:block" aria-hidden data-index={panels.length} />
        </div>
      </div>
    </section>
  )
}
