import { useRef } from 'react'
import { Button } from '../../components/Button'
import { links, signature } from '../../lib/content'
import { DESKTOP, gsap, useGSAP } from '../../lib/gsap'
import { useReveals } from '../../lib/useReveals'

/** V3: the five phases of the signature session fly toward you, one after another. */
export function SignatureTunnel() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(DESKTOP, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: '[data-tunnel]', start: 'top top', end: '+=320%', pin: true, scrub: 0.7 },
        })

        // Backdrop pulls in slowly for the whole ride.
        tl.fromTo('[data-tunnel-bg]', { scale: 1.25, opacity: 0.25 }, { scale: 1, opacity: 0.5, duration: 5 }, 0)

        gsap.utils.toArray<HTMLElement>('[data-phase-layer]').forEach((layer, i) => {
          tl.fromTo(
            layer,
            { z: -2600, opacity: 0, rotateX: -8 },
            { z: 520, opacity: 1, rotateX: 0, duration: 1.1, immediateRender: i === 0 },
            i * 0.85,
          ).to(layer, { opacity: 0, duration: 0.25 }, i * 0.85 + 0.95)
        })

        tl.fromTo('[data-tunnel-end] > *', { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.5 }, '>-0.2')
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <section ref={root} id="signature" className="relative text-cream">
      <div data-tunnel className="relative flex min-h-[100svh] items-center overflow-hidden md:h-[100svh]">
        <img
          data-tunnel-bg
          src="/images/path-landscape.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(23,17,15,0.55),rgba(23,17,15,0.95))]" />

        {/* Depth stack */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden place-items-center md:grid"
          style={{ perspective: '900px' }}
        >
          {signature.phases.map((phase, i) => (
            <div
              key={phase}
              data-phase-layer
              className="absolute grid place-items-center opacity-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="display text-[clamp(2.5rem,7vw,7.5rem)] leading-none whitespace-nowrap text-cream">
                {phase}
              </span>
              <span className="eyebrow mt-4 text-gold">
                Phase 0{i + 1} / 0{signature.phases.length}
              </span>
            </div>
          ))}
        </div>

        <div className="container-x relative grid w-full gap-10 py-24 md:grid-cols-12 md:py-0">
          <div className="md:col-span-5">
            <p data-fade className="eyebrow mb-6 text-gold">
              (05) {signature.eyebrow}
            </p>
            <h2 data-lines className="display text-[clamp(2.75rem,6vw,6.5rem)] leading-[0.92]">
              The ARVAmethod <em className="text-gold">Body</em>
            </h2>
            <div className="mt-8 flex items-end gap-4">
              <span className="display text-[clamp(4rem,8vw,7rem)] leading-[0.8] text-gold">{signature.duration}</span>
              <span className="pb-2 text-xs leading-snug tracking-wider text-cream/65 uppercase">
                hour immersive
                <br />
                signature session
              </span>
            </div>
          </div>

          <div data-tunnel-end className="flex flex-col justify-center gap-6 md:col-span-5 md:col-start-8">
            <p className="text-lg leading-relaxed text-cream/75">{signature.body}</p>
            <ol className="grid grid-cols-2 gap-2 text-sm text-cream/80 sm:grid-cols-3">
              {signature.phases.map((phase, i) => (
                <li key={phase} className="rounded-xl border border-cream/12 bg-ink/50 px-3 py-2">
                  <span className="mr-2 text-gold/70 tabular-nums">0{i + 1}</span>
                  {phase}
                </li>
              ))}
            </ol>
            <div>
              <Button href={links.body}>Learn More</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
