import { useRef } from 'react'
import { Button } from '../components/Button'
import { links, signature } from '../lib/content'
import { DESKTOP, gsap, useGSAP } from '../lib/gsap'
import { useReveals } from '../lib/useReveals'

/**
 * A small framed photo expands to fill the screen as the title splits apart,
 * then the session's five phases light up in sequence.
 */
export function SignatureSession() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(DESKTOP, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: '[data-spin]', start: 'top top', end: '+=260%', pin: true, scrub: 0.8 },
        })

        // Four panels slide away to open the window — pure transforms, no per-frame clip-path repaints.
        tl.to('[data-panel="t"]', { yPercent: -100, duration: 1, ease: 'power2.inOut' }, 0)
          .to('[data-panel="b"]', { yPercent: 100, duration: 1, ease: 'power2.inOut' }, 0)
          .to('[data-panel="l"]', { xPercent: -100, duration: 1, ease: 'power2.inOut' }, 0)
          .to('[data-panel="r"]', { xPercent: 100, duration: 1, ease: 'power2.inOut' }, 0)
          .fromTo('[data-window] img', { scale: 1.45 }, { scale: 1, duration: 1, ease: 'power2.inOut' }, 0)
          .to('[data-split="left"]', { xPercent: -60, autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, 0)
          .to('[data-split="right"]', { xPercent: 60, autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, 0)
          .to('[data-intro-eyebrow]', { autoAlpha: 0, y: -30, duration: 0.4 }, 0)
          .fromTo('[data-veil]', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.7)
          .from('[data-sig-content] > *', { y: 60, autoAlpha: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, 1)
          .from('[data-phase]', { autoAlpha: 0.15, stagger: 0.25, duration: 0.3 }, 1.3)
          .from('[data-phase-line]', { scaleX: 0, duration: 1.2 }, 1.3)
          .to({}, { duration: 0.3 })
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <section ref={root} id="signature" className="relative bg-espresso">
      <div data-spin className="relative flex min-h-[100svh] flex-col overflow-hidden md:h-[100svh]">
        {/* Expanding photograph */}
        <div
          data-window
          className="relative h-[60svh] w-full overflow-hidden md:absolute md:inset-0 md:h-auto"
        >
          <img
            src="/images/path-landscape.webp"
            alt="An open path through the dunes toward the sea at golden hour"
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
          <div data-veil className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/10 md:opacity-0" />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          <div data-panel="t" className="absolute inset-x-0 top-0 h-[22%] bg-espresso will-change-transform" />
          <div data-panel="b" className="absolute inset-x-0 bottom-0 h-[22%] bg-espresso will-change-transform" />
          <div data-panel="l" className="absolute inset-y-0 left-0 w-[34%] bg-espresso will-change-transform" />
          <div data-panel="r" className="absolute inset-y-0 right-0 w-[34%] bg-espresso will-change-transform" />
        </div>

        {/* Opening title that parts around the photo */}
        <div className="pointer-events-none absolute inset-0 hidden flex-col items-center justify-center md:flex">
          <p data-intro-eyebrow className="eyebrow absolute top-[12%] text-gold">
            {signature.eyebrow}
          </p>
          <div className="display grid w-full grid-cols-[1fr_34vw_1fr] items-center px-[3vw] text-[clamp(3rem,6.2vw,8rem)] text-cream">
            <span data-split="left" className="pr-[2vw] text-right">
              The
              <br />
              ARVAmethod
            </span>
            <span />
            <span data-split="right" className="pl-[2vw] text-gold italic">
              Body
            </span>
          </div>
        </div>

        {/* Revealed content */}
        <div className="container-x relative flex flex-1 items-center py-16 md:py-0">
          <div data-sig-content className="max-w-2xl">
            <p className="eyebrow mb-6 text-gold">04 — Signature session</p>
            <h2 className="display text-[clamp(3rem,6.5vw,7rem)] text-cream">
              The ARVAmethod <em className="text-gold">Body</em>
            </h2>
            <div className="mt-8 flex items-end gap-5">
              <span className="display text-[clamp(4.5rem,9vw,8rem)] leading-[0.8] text-gold">{signature.duration}</span>
              <span className="pb-2 text-sm leading-snug tracking-wide text-cream/70 uppercase">
                hour immersive
                <br />
                signature session
              </span>
            </div>
            <p className="mt-8 text-lg leading-relaxed text-cream/75">{signature.body}</p>

            <ol className="relative mt-10 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-5 sm:gap-3">
              <span
                data-phase-line
                className="absolute top-[7px] right-[10%] left-[10%] hidden h-px origin-left bg-gold/60 sm:block"
              />
              {signature.phases.map((phase, i) => (
                <li data-phase key={phase} className="relative flex flex-col gap-3 sm:items-center sm:text-center">
                  <span className="relative z-10 grid size-[15px] place-items-center rounded-full border border-gold bg-espresso">
                    <span className="size-[5px] rounded-full bg-gold" />
                  </span>
                  <span className="text-xs leading-snug text-cream/85">
                    <span className="block text-gold/70 tabular-nums">0{i + 1}</span>
                    {phase}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-12">
              <Button href={links.body}>Learn More</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
