import { useRef } from 'react'
import { Button, Sparkle } from '../components/Button'
import { useScrollTo } from '../components/SmoothScroll'
import { HERO_POSTER, HERO_VIDEO, links } from '../lib/content'
import { gsap, MOTION_OK, SplitText, useGSAP } from '../lib/gsap'

export function Hero({ play }: { play: boolean }) {
  const root = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()

  // Scroll exit, transforms and opacity only: the frame recedes into a card while the title lifts away.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        tl.to('[data-hero-frame]', { scale: 0.9, yPercent: 6, borderRadius: 36 }, 0)
          .to('[data-hero-media]', { yPercent: 12 }, 0)
          .to('[data-hero-shade]', { opacity: 0.8 }, 0)
          .to('[data-hero-title]', { yPercent: -45, opacity: 0 }, 0)
          .to('[data-hero-aside]', { yPercent: -80, opacity: 0 }, 0)
      })

      // Pointer parallax: media drifts against the cursor, the headline leans with it.
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const mx = gsap.quickTo('[data-hero-tilt]', 'x', { duration: 1.4, ease: 'power3' })
        const my = gsap.quickTo('[data-hero-tilt]', 'y', { duration: 1.4, ease: 'power3' })
        const tx = gsap.quickTo('[data-hero-lean]', 'x', { duration: 1.6, ease: 'power3' })
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          mx(nx * -34)
          my(ny * -22)
          tx(nx * 18)
        }
        const el = root.current!
        el.addEventListener('pointermove', onMove)
        return () => el.removeEventListener('pointermove', onMove)
      })
    },
    { scope: root },
  )

  // Intro, played as the preloader curtain lifts.
  useGSAP(
    () => {
      if (!play) {
        gsap.set('[data-hero-fade]', { autoAlpha: 0 })
        return
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.to('[data-hero-fade]', { autoAlpha: 1, duration: 0.6 })
        return
      }

      const split = SplitText.create('[data-hero-h1]', { type: 'chars,words', mask: 'words', wordsClass: 'word' })

      gsap
        .timeline()
        .fromTo('[data-hero-intro]', { scale: 1.3 }, { scale: 1, duration: 2.4, ease: 'expo.out' }, 0)
        .from(split.chars, { yPercent: 115, rotate: 6, stagger: 0.028, duration: 1.3, ease: 'expo.out' }, 0.35)
        .fromTo(
          '[data-hero-fade]',
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, stagger: 0.1, duration: 1.2, ease: 'expo.out' },
          0.7,
        )
        .from('[data-hero-rule]', { scaleX: 0, duration: 1.6, ease: 'expo.inOut' }, 0.6)
    },
    { scope: root, dependencies: [play] },
  )

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-clip">
      <div data-hero-frame className="absolute inset-0 origin-top overflow-hidden will-change-transform">
        <div data-hero-media className="absolute inset-0">
          <div data-hero-tilt className="absolute -inset-[4%]">
            <div data-hero-intro className="size-full">
              {HERO_VIDEO ? (
                <video
                  className="size-full object-cover"
                  src={HERO_VIDEO}
                  poster={HERO_POSTER}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              ) : (
                <img
                  src={HERO_POSTER}
                  alt="Arrabella guiding a client through a movement assessment"
                  className="size-full object-cover object-[60%_30%]"
                  fetchPriority="high"
                  decoding="async"
                />
              )}
            </div>
          </div>
        </div>
        {/* One gradient layer instead of three stacked overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 15% 100%, rgba(23,17,15,0.9), transparent 60%), linear-gradient(to top, #17110f 0%, rgba(23,17,15,0.45) 45%, rgba(23,17,15,0.5) 100%)',
          }}
        />
        <div data-hero-shade className="absolute inset-0 bg-ink opacity-0" />
      </div>

      <div className="container-x relative flex h-full flex-col justify-end pb-10 md:pb-14">
        <div data-hero-title>
          <p data-hero-fade className="eyebrow mb-6 flex items-center gap-3 text-gold">
            <Sparkle className="size-3" /> Somatic &amp; Depth Practice for Embodied Living
          </p>
          <div data-hero-lean>
            <h1
              data-hero-h1
              className="display max-w-[14ch] text-[clamp(3.6rem,11.5vw,12.5rem)] text-cream"
              aria-label="The Body Is The Guide"
            >
              The Body Is <br className="hidden sm:block" />
              <span className="text-gold italic">The Guide</span>
            </h1>
          </div>
        </div>

        <div data-hero-rule className="my-8 h-px w-full origin-left bg-cream/20 md:my-10" />

        <div data-hero-aside className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p data-hero-fade className="max-w-xl text-base leading-relaxed text-cream/80 md:text-lg">
            ARVAmethod integrates somatic inquiry, clinical bodywork, breathwork, and movement to restore harmony
            between body and mind.
          </p>
          <div data-hero-fade className="flex items-center gap-6">
            <Button href={links.quiz}>Take the Living Archetype Quiz</Button>
            <button
              type="button"
              onClick={() => scrollTo('#philosophy')}
              className="group hidden items-center gap-3 text-xs tracking-[0.2em] text-cream/70 uppercase md:flex"
              data-cursor="hide"
            >
              <span className="relative block h-12 w-px overflow-hidden bg-cream/20">
                <span className="absolute inset-x-0 top-0 block h-1/2 animate-[scrollcue_2.2s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-gold" />
              </span>
              Scroll
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  )
}
