import { useRef } from 'react'
import { CircleText } from '../../components/CircleText'
import { Magnetic } from '../../components/Magnetic'
import { useScrollTo } from '../../components/SmoothScroll'
import { begin, links } from '../../lib/content'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'

const rail = [...begin.paths, ...begin.paths]

/**
 * V2 hero: bone paper, oversized serif set as three kinetic rows that slide in from
 * alternating sides and keep drifting apart as you scroll, over a moving image rail.
 */
export function HeroKinetic({ play = false }: { play?: boolean }) {
  const root = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
          })
          .to('[data-krow="0"]', { xPercent: -8 }, 0)
          .to('[data-krow="1"]', { xPercent: 10 }, 0)
          .to('[data-krow="2"]', { xPercent: -6 }, 0)
          .to('[data-krail]', { xPercent: -14 }, 0)
          .to('[data-kmeta]', { yPercent: -60, opacity: 0 }, 0)
      })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (!play) {
        gsap.set('[data-kin]', { autoAlpha: 0 })
        return
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('[data-kin], [data-kword]', { autoAlpha: 1, clearProps: 'transform' })
        return
      }

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('[data-kword]', { xPercent: (i) => (i % 2 ? 120 : -120), autoAlpha: 0, duration: 1.5, stagger: 0.12 }, 0.1)
        .fromTo('[data-kin]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.5)
        .from('[data-krail] > *', { yPercent: 40, autoAlpha: 0, stagger: 0.07, duration: 1.2 }, 0.6)
        .from('[data-kline]', { scaleX: 0, transformOrigin: 'left', duration: 1.4, stagger: 0.1, ease: 'expo.inOut' }, 0.3)
    },
    { scope: root, dependencies: [play] },
  )

  return (
    <section
      ref={root}
      id="top"
      className="relative overflow-clip bg-cream-2 pt-28 pb-10 text-espresso md:pt-36"
      style={{
        backgroundImage:
          'repeating-linear-gradient(90deg, rgba(36,28,25,0.07) 0 1px, transparent 1px 12.5%)',
      }}
    >
      <div className="container-x">
        <div data-kin className="mb-10 flex items-center justify-between text-espresso/60">
          <p className="eyebrow">Somatic &amp; Depth Practice</p>
          <p className="eyebrow hidden md:block">Chicago, IL — Est. 20 years</p>
          <p className="eyebrow">(01)</p>
        </div>

        <div data-kline className="h-px w-full bg-espresso/15" />

        {/* Kinetic headline */}
        <h1 className="display my-6 text-[clamp(3.4rem,15vw,15rem)] leading-[0.82] tracking-[-0.03em] md:my-10">
          <span className="sr-only">The Body Is The Guide</span>
          <span data-krow="0" aria-hidden className="block will-change-transform">
            <span data-kword className="inline-block">
              The Body
            </span>
          </span>
          <span data-krow="1" aria-hidden className="flex items-center justify-end gap-[2vw] will-change-transform">
            <span data-kin className="hidden max-w-[22ch] pb-[1.5vw] text-right text-xs/relaxed text-espresso/60 md:block md:text-sm/relaxed">
              Somatic inquiry, clinical bodywork, breathwork and movement — brought into one conversation with your
              whole self.
            </span>
            <span data-kword className="inline-block italic">
              Is The
            </span>
          </span>
          <span data-krow="2" aria-hidden className="flex items-baseline gap-[3vw] will-change-transform">
            <span data-kword className="inline-block">
              Guide
            </span>
            <span
              data-kin
              className="hidden shrink-0 text-[clamp(2rem,4vw,4rem)] leading-none text-teal md:inline-block"
            >
              ✺
            </span>
          </span>
        </h1>

        <div data-kline className="h-px w-full bg-espresso/15" />

        <div data-kmeta className="mt-8 flex flex-col-reverse items-start gap-8 md:flex-row md:items-center md:justify-between">
          <p data-kin className="max-w-md text-base leading-relaxed text-espresso/70 md:text-lg">
            ARVAmethod integrates somatic inquiry, clinical bodywork, breathwork, and movement to restore harmony
            between body and mind.
          </p>

          <div data-kin className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => scrollTo('#philosophy')}
              className="eyebrow flex items-center gap-3 text-espresso/60 transition-colors hover:text-espresso"
              data-cursor="hide"
            >
              Scroll
              <span className="relative block h-px w-16 overflow-hidden bg-espresso/25">
                <span className="absolute inset-y-0 left-0 w-1/2 animate-[railcue_2s_ease-in-out_infinite] bg-teal" />
              </span>
            </button>

            <Magnetic strength={0.35}>
              <a
                href={links.quiz}
                data-cursor="hide"
                className="group relative grid size-32 place-items-center rounded-full bg-espresso text-cream transition-colors duration-500 hover:bg-teal md:size-40"
              >
                <CircleText
                  text="Take the Living Archetype Quiz — Free — "
                  className="absolute inset-0 text-cream/70"
                  duration={16}
                />
                <span className="display text-3xl transition-transform duration-500 ease-(--ease-expo) group-hover:scale-110 md:text-4xl">
                  →
                </span>
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Image rail */}
        <div className="mt-12 overflow-hidden md:mt-16">
          <div data-krail className="flex w-max gap-4 will-change-transform md:gap-6">
            {rail.map((path, i) => (
              <figure
                key={`${path.title}-${i}`}
                className="relative aspect-[4/5] w-[52vw] shrink-0 overflow-hidden rounded-2xl sm:w-[34vw] md:w-[21vw]"
              >
                <img
                  src={path.image}
                  alt=""
                  loading={i < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="size-full object-cover transition-[scale,filter] duration-1000 ease-(--ease-expo) hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink/70 to-transparent p-4 text-cream">
                  <span className="text-xs tracking-wide uppercase">{path.tag}</span>
                  <span className="eyebrow opacity-70">0{(i % 4) + 1}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes railcue{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
    </section>
  )
}
