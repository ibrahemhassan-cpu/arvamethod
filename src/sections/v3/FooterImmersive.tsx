import { useRef } from 'react'
import { CircleText } from '../../components/CircleText'
import { Magnetic } from '../../components/Magnetic'
import { RollText } from '../../components/RollText'
import { useScrollTo } from '../../components/SmoothScroll'
import { contact, links, nav, socials } from '../../lib/content'
import { gsap, MOTION_OK, SplitText, useGSAP } from '../../lib/gsap'
import { useReveals } from '../../lib/useReveals'

/** V3 footer: glass over the living background, wordmark dissolving in from the dark. */
export function FooterImmersive() {
  const root = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create('[data-i-wordmark]', { type: 'chars' })
        gsap.from(split.chars, {
          autoAlpha: 0,
          yPercent: 30,
          filter: 'blur(14px)',
          stagger: 0.05,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-i-wordmark]', start: 'top 95%', once: true },
        })
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <footer ref={root} id="contact" className="relative overflow-clip pt-24 text-cream md:pt-32">
      <div className="container-x">
        <div className="grid items-center gap-10 rounded-[2rem] border border-cream/12 bg-ink/55 p-8 md:grid-cols-12 md:p-14">
          <div className="md:col-span-7">
            <p data-fade className="eyebrow mb-6 text-gold">
              Start here — free
            </p>
            <h2 data-lines className="display text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.95]">
              The Living <em className="text-gold">Archetype</em> Quiz
            </h2>
            <p data-lines className="mt-6 max-w-lg leading-relaxed text-cream/70">
              Reveal the hidden patterns shaping how you approach health, stress, and self-care — and a practical guide
              for beginning holistic change.
            </p>
          </div>
          <div className="flex md:col-span-5 md:justify-end">
            <Magnetic strength={0.35}>
              <a
                href={links.quiz}
                data-cursor="hide"
                className="group relative grid size-36 place-items-center rounded-full bg-gold text-espresso transition-colors duration-500 hover:bg-cream md:size-48"
              >
                <CircleText text="Take the quiz — Begin where you are — " className="absolute inset-0" duration={20} />
                <span className="display text-4xl transition-transform duration-500 ease-(--ease-expo) group-hover:rotate-45">
                  ↗
                </span>
              </a>
            </Magnetic>
          </div>
        </div>

        <div data-stagger className="grid grid-cols-2 gap-10 py-14 text-sm md:grid-cols-4">
          <div>
            <p className="eyebrow mb-4 text-cream/40">Explore</p>
            <ul className="space-y-2.5">
              {nav.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="group inline-block hover:text-gold">
                    <RollText>{item.label}</RollText>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-cream/40">Social</p>
            <ul className="space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="group inline-block hover:text-gold">
                    <RollText>{s.label}</RollText>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-cream/40">Studio</p>
            <address className="leading-relaxed text-cream/75 not-italic">
              {contact.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
          <div>
            <p className="eyebrow mb-4 text-cream/40">Contact</p>
            <a href={contact.phoneHref} className="group block text-cream/75 hover:text-gold">
              <RollText>{contact.phone}</RollText>
            </a>
            <a href={`mailto:${contact.email}`} className="group mt-2.5 block break-all text-cream/75 hover:text-gold">
              <RollText>{contact.email}</RollText>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-cream/12 py-7 text-xs text-cream/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} ARVAmethod. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href={links.privacy} className="group hover:text-cream">
              <RollText>Privacy Policy</RollText>
            </a>
            <button type="button" onClick={() => scrollTo(0)} className="group flex items-center gap-2 hover:text-cream">
              <RollText>Back to top</RollText> ↑
            </button>
          </div>
        </div>

        <p
          data-i-wordmark
          aria-hidden
          className="display -mb-[0.18em] text-center text-[20vw] leading-[0.82] tracking-[-0.04em] whitespace-nowrap text-cream/90 select-none"
        >
          ARVA<em className="text-gold">method</em>
        </p>
      </div>
    </footer>
  )
}
