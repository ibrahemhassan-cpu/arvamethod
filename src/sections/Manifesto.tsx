import { useRef } from 'react'
import { Button } from '../components/Button'
import { links, manifesto } from '../lib/content'
import { gsap, MOTION_OK, SplitText, useGSAP } from '../lib/gsap'
import { useReveals } from '../lib/useReveals'

/** Editorial statement with an inline photo "pill" that opens up inside the headline. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Clip-path on a small inline element is cheap, and unlike width it doesn't reflow the headline.
        gsap.fromTo(
          '[data-pill]',
          { clipPath: 'inset(0% 46% 0% 46% round 999px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 999px)',
            ease: 'none',
            scrollTrigger: { trigger: '[data-manifesto]', start: 'top 85%', end: 'center 45%', scrub: true },
          },
        )
        gsap.fromTo(
          '[data-pill] img',
          { scale: 1.8 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-manifesto]', start: 'top 85%', end: 'center 45%', scrub: true },
          },
        )

        const split = SplitText.create('[data-sub]', { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-sub]', start: 'top 80%', end: 'bottom 45%', scrub: true },
          },
        )

        gsap.fromTo(
          '[data-portrait] img',
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: { trigger: '[data-portrait]', start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <section ref={root} id="manifesto" className="relative overflow-clip bg-ink py-28 md:py-44">
      <div className="container-x">
        <p data-fade className="eyebrow mb-10 text-center text-gold">
          06 — A different kind of change
        </p>
        <h2
          data-manifesto
          className="display mx-auto max-w-[16ch] text-center text-[clamp(3.25rem,9.5vw,11rem)] text-cream"
        >
          Change isn’t{' '}
          <span
            data-pill
            className="relative inline-block h-[0.78em] w-[2.4em] translate-y-[0.06em] overflow-hidden rounded-full align-baseline"
          >
            <img
              src="/images/arrabella-kitchen.webp"
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-[50%_30%]"
            />
          </span>{' '}
          about more <em className="text-gold">effort.</em>
        </h2>

        <p
          data-sub
          className="mx-auto mt-14 max-w-4xl text-center text-[clamp(1.35rem,2.4vw,2.2rem)] leading-snug text-cream"
        >
          {manifesto.sub}
        </p>

        <div className="mt-28 grid items-center gap-12 md:mt-40 md:grid-cols-12">
          <div
            data-portrait
            data-clip
            className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] md:col-span-4 md:col-start-2"
          >
            <img
              src="/images/arrabella-sofa.webp"
              alt="Arrabella Schippers"
              loading="lazy"
              decoding="async"
              className="absolute inset-x-0 -top-[12%] h-[124%] w-full object-cover"
            />
          </div>
          <figure className="md:col-span-6 md:col-start-7">
            <span data-fade className="display block text-8xl leading-[0.5] text-gold">
              “
            </span>
            <blockquote data-lines className="display mt-6 text-[clamp(2rem,3.4vw,3.4rem)] leading-[1.08] text-cream">
              {manifesto.quote}
            </blockquote>
            <figcaption data-fade className="mt-8 flex items-center gap-4 text-cream/70">
              <span className="h-px w-10 bg-gold" />
              <span className="eyebrow">{manifesto.author}</span>
            </figcaption>
            <div data-fade className="mt-12">
              <Button href={links.about} variant="ghost">
                Learn more about my background
              </Button>
            </div>
          </figure>
        </div>
      </div>
    </section>
  )
}
