import { useRef } from 'react'
import { Sparkle } from '../components/Button'
import { philosophy } from '../lib/content'
import { DESKTOP, gsap, SplitText, useGSAP } from '../lib/gsap'
import { useReveals } from '../lib/useReveals'

/** Body and Mind drift in from opposite edges and fuse while the statement lights up word by word. */
export function Philosophy() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(DESKTOP, () => {
        const split = SplitText.create('[data-statement]', { type: 'words' })
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: '[data-pin]', start: 'top top', end: '+=180%', scrub: 0.6, pin: true },
        })
        tl.fromTo(split.words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, duration: 0.6 }, 0)
          .fromTo('[data-orb="body"]', { xPercent: -170, rotate: -14 }, { xPercent: 0, rotate: 0, duration: 1.4, ease: 'power2.inOut' }, 0)
          .fromTo('[data-orb="mind"]', { xPercent: 170, rotate: 14 }, { xPercent: 0, rotate: 0, duration: 1.4, ease: 'power2.inOut' }, 0)
          .fromTo('[data-orb-img]', { scale: 1.35 }, { scale: 1, duration: 1.4 }, 0)
          .fromTo('[data-union]', { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' }, 1.15)
          .fromTo('[data-orb-label]', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 1.2)
      })

      // The pair leans toward the pointer and the union mark turns with it.
      mm.add(`${DESKTOP} and (pointer: fine)`, () => {
        const ox = gsap.quickTo('[data-orbs]', 'x', { duration: 1.2, ease: 'power3' })
        const oy = gsap.quickTo('[data-orbs]', 'y', { duration: 1.2, ease: 'power3' })
        const spin = gsap.quickTo('[data-union-icon]', 'rotation', { duration: 1.2, ease: 'power3' })
        const el = root.current!
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          ox(nx * 40)
          oy(ny * 24)
          spin(nx * 180)
        }
        el.addEventListener('pointermove', move)
        return () => el.removeEventListener('pointermove', move)
      })

      mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => {
        const split = SplitText.create('[data-statement]', { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', end: 'bottom 45%', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <section ref={root} id="philosophy" className="relative bg-espresso">
      <div data-pin className="container-x flex flex-col items-center justify-center gap-12 py-24 md:min-h-[100svh] md:gap-16">
        <p className="eyebrow flex items-center gap-3 text-gold">
          <span className="h-px w-10 bg-gold/60" /> 01 — Philosophy <span className="h-px w-10 bg-gold/60" />
        </p>

        <h2
          data-statement
          className="display max-w-[18ch] text-center text-[clamp(2.6rem,6.4vw,7.25rem)] text-cream"
        >
          The Body and Mind Are <em className="text-gold">Not Separate</em> Systems.
        </h2>

        <div data-orbs className="relative flex items-center justify-center">
          {(
            [
              { key: 'body', label: 'Body', src: '/images/bodywork.webp' },
              { key: 'mind', label: 'Mind', src: '/images/coffee-light.webp' },
            ] as const
          ).map((orb, i) => (
            <figure
              key={orb.key}
              data-orb={orb.key}
              className={`relative aspect-[3/4] w-[38vw] overflow-hidden rounded-t-full rounded-b-[2rem] ring-1 ring-cream/10 will-change-transform md:w-[15vw] md:min-w-44 ${
                i === 0 ? '-mr-[4vw] md:-mr-[2.5vw]' : '-ml-[4vw] md:-ml-[2.5vw]'
              }`}
            >
              <img
                data-orb-img
                src={orb.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <figcaption
                data-orb-label
                className="display absolute inset-x-0 bottom-4 text-center text-2xl text-cream italic md:text-3xl"
              >
                {orb.label}
              </figcaption>
            </figure>
          ))}
          <div
            data-union
            className="absolute top-1/2 left-1/2 z-10 -mt-7 -ml-7 grid size-14 md:-mt-8 md:-ml-8 place-items-center rounded-full bg-gold text-espresso shadow-[0_0_60px_rgba(197,148,89,0.55)] md:size-16"
          >
            <span data-union-icon className="grid place-items-center">
              <Sparkle className="size-5" />
            </span>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-10 pb-28 md:grid-cols-12 md:pb-40">
        <div data-rule className="h-px bg-cream/15 md:col-span-12" />
        <p data-fade className="eyebrow text-cream/50 md:col-span-3">The foundation</p>
        {philosophy.body.map((text, i) => (
          <p
            key={i}
            data-lines
            className={`text-lg leading-relaxed text-cream/75 md:col-span-4 md:text-xl ${i === 0 ? '' : 'md:col-start-8'}`}
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  )
}
