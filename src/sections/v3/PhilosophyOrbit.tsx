import { useRef } from 'react'
import { disciplines, philosophy } from '../../lib/content'
import { DESKTOP, gsap, SplitText, useGSAP } from '../../lib/gsap'
import { useReveals } from '../../lib/useReveals'

/** V3: the practice literally orbits the statement — a 3D ring you can tilt with the pointer. */
export function PhilosophyOrbit() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(DESKTOP, () => {
        const spin = gsap.to('[data-ring]', { rotateY: 360, duration: 44, ease: 'none', repeat: -1 })

        const tiltX = gsap.quickTo('[data-orbit]', 'rotateX', { duration: 1.4, ease: 'power3' })
        const tiltY = gsap.quickTo('[data-orbit]', 'rotateZ', { duration: 1.4, ease: 'power3' })
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          tiltX(8 - ny * 14)
          tiltY(nx * 6)
        }
        const el = root.current!
        el.addEventListener('pointermove', onMove)

        // Scroll speeds the ring up and lifts it past the statement.
        const st = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
          defaults: { ease: 'none' },
        })
        st.fromTo('[data-orbit]', { yPercent: 12 }, { yPercent: -12 }, 0).fromTo(spin, { timeScale: 1 }, { timeScale: 3 }, 0)

        return () => {
          el.removeEventListener('pointermove', onMove)
          spin.kill()
        }
      })

      mm.add('(min-width: 768px)', () => {
        const split = SplitText.create('[data-orbit-statement]', { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.09,
            ease: 'none',
            scrollTrigger: { trigger: '[data-orbit-statement]', start: 'top 80%', end: 'bottom 50%', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <section ref={root} id="philosophy" className="relative overflow-clip py-28 text-cream md:py-40">
      <div className="container-x relative">
        <p data-fade className="eyebrow mb-16 text-center text-gold">
          (02) Philosophy
        </p>

        <div className="relative grid place-items-center" style={{ perspective: '1400px' }}>
          {/* Orbiting practice ring */}
          <div
            data-orbit
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden place-items-center md:grid"
            style={{ transformStyle: 'preserve-3d', transform: 'rotateX(8deg)' }}
          >
            <div data-ring className="relative size-0" style={{ transformStyle: 'preserve-3d' }}>
              {disciplines.map((word, i) => (
                <span
                  key={word}
                  className="display absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-[clamp(1.5rem,2.6vw,2.6rem)] whitespace-nowrap text-cream/25"
                  style={{ transform: `rotateY(${(360 / disciplines.length) * i}deg) translateZ(clamp(220px, 27vw, 420px))` }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          <h2
            data-orbit-statement
            className="display relative max-w-[16ch] py-24 text-center text-[clamp(2.4rem,6vw,6.5rem)] leading-[0.95] md:py-40"
          >
            The Body and Mind Are <em className="text-gold">Not Separate</em> Systems.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:mt-16 md:grid-cols-2 md:gap-6">
          {philosophy.body.map((text, i) => (
            <p
              key={i}
              data-lines
              className="rounded-3xl border border-cream/10 bg-ink/45 p-7 text-base leading-relaxed text-cream/75 md:p-9 md:text-lg"
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
