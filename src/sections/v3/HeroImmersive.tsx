import { useRef } from 'react'
import { Magnetic } from '../../components/Magnetic'
import { useScrollTo } from '../../components/SmoothScroll'
import { disciplines, links } from '../../lib/content'
import { gsap, MOTION_OK, SplitText, useGSAP } from '../../lib/gsap'
import { ParticleLogo } from './ParticleLogo'

/** V3 hero: the mark is built live out of light, and scrolling scatters it again. */
export function HeroImmersive({ play = false }: { play?: boolean }) {
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
          .to('[data-i-title]', { yPercent: -30, autoAlpha: 0 }, 0)
          .to('[data-i-foot]', { yPercent: -120, autoAlpha: 0 }, 0)
      })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (!play) {
        gsap.set('[data-i-fade]', { autoAlpha: 0 })
        return
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('[data-i-fade]', { autoAlpha: 1 })
        return
      }
      const split = SplitText.create('[data-i-h1]', { type: 'chars' })
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(split.chars, { autoAlpha: 0, yPercent: 40, filter: 'blur(12px)', stagger: 0.03, duration: 1.4 }, 0.9)
        .fromTo('[data-i-fade]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 1.2 }, 1.3)
    },
    { scope: root, dependencies: [play] },
  )

  return (
    <section ref={root} id="top" className="relative flex h-[110svh] min-h-[720px] flex-col justify-between overflow-clip">
      <ParticleLogo className="z-0" />

      {/* Soft floor so the type never fights the particles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(23,17,15,0.82) 72%)' }}
      />

      <div className="container-x relative z-[2] flex flex-1 flex-col justify-between pt-32 pb-10">
        <div data-i-fade className="flex items-center justify-between text-cream/50">
          <p className="eyebrow">Somatic &amp; Depth Practice</p>
          <p className="eyebrow hidden md:block">Chicago, IL</p>
        </div>

        <div data-i-title className="mt-auto text-center">
          <h1
            data-i-h1
            className="display text-[clamp(3rem,10vw,10.5rem)] leading-[0.9] text-cream drop-shadow-[0_8px_40px_rgba(0,0,0,0.65)]"
          >
            The Body Is <span className="text-gold italic">The Guide</span>
          </h1>
          <p data-i-fade className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-cream/75 md:text-lg">
            Somatic inquiry, clinical bodywork, breathwork and movement — one practice, held together.
          </p>
          <div data-i-fade className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic strength={0.28}>
              <a
                href={links.quiz}
                data-cursor="hide"
                className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-sm font-semibold text-espresso transition-colors duration-500 hover:bg-cream"
              >
                Take the Living Archetype Quiz
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => scrollTo('#philosophy')}
              data-cursor="hide"
              className="rounded-full border border-cream/25 px-7 py-4 text-sm text-cream/80 transition-colors duration-500 hover:border-gold hover:text-gold"
            >
              Explore the method
            </button>
          </div>
        </div>

        <div data-i-foot className="flex flex-col gap-4">
          <div data-i-fade className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] tracking-[0.25em] text-cream/45 uppercase">
            {disciplines.map((d) => (
              <span key={d} className="flex items-center gap-6">
                {d}
                <span className="hidden size-1 rounded-full bg-gold/60 md:block" />
              </span>
            ))}
          </div>
          <p data-i-fade className="text-center text-[11px] tracking-[0.3em] text-cream/35 uppercase">
            Move your cursor through the light
          </p>
        </div>
      </div>
    </section>
  )
}
