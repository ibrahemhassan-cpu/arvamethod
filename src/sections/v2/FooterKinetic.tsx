import { useRef } from 'react'
import { CircleText } from '../../components/CircleText'
import { Magnetic } from '../../components/Magnetic'
import { RollText } from '../../components/RollText'
import { useScrollTo } from '../../components/SmoothScroll'
import { contact, links, nav, socials } from '../../lib/content'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { useReveals } from '../../lib/useReveals'

/** V2 footer: outline wordmark that fills with colour as the page bottoms out. */
export function FooterKinetic() {
  const root = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-fill]',
          { clipPath: 'inset(0% 100% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: '[data-wordmark]', start: 'top 95%', end: 'bottom bottom', scrub: 0.6 },
          },
        )
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <footer ref={root} id="contact" className="relative overflow-clip bg-espresso text-cream">
      <div className="container-x pt-24 md:pt-32">
        <div className="grid gap-12 border-b border-cream/12 pb-16 md:grid-cols-12 md:pb-20">
          <div className="md:col-span-7">
            <p data-fade className="eyebrow mb-6 text-gold">
              Start here — free
            </p>
            <h2 data-lines className="display text-[clamp(2.75rem,7vw,7rem)] leading-[0.9]">
              The Living <em className="text-gold">Archetype</em> Quiz
            </h2>
            <p data-lines className="mt-8 max-w-lg text-lg leading-relaxed text-cream/70">
              Reveal the hidden patterns shaping how you approach health, stress, and self-care — and a practical guide
              for beginning holistic change.
            </p>
          </div>

          <div className="flex items-center justify-start md:col-span-5 md:justify-end">
            <Magnetic strength={0.35}>
              <a
                href={links.quiz}
                data-cursor="hide"
                className="group relative grid size-40 place-items-center rounded-full bg-gold text-espresso transition-colors duration-500 hover:bg-cream md:size-52"
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
            <address className="leading-relaxed not-italic text-cream/80">
              {contact.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
          <div>
            <p className="eyebrow mb-4 text-cream/40">Contact</p>
            <a href={contact.phoneHref} className="group block text-cream/80 hover:text-gold">
              <RollText>{contact.phone}</RollText>
            </a>
            <a href={`mailto:${contact.email}`} className="group mt-2.5 block break-all text-cream/80 hover:text-gold">
              <RollText>{contact.email}</RollText>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-cream/12 py-7 text-xs text-cream/55 md:flex-row md:items-center">
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

        {/* Outline wordmark that fills as you reach the end */}
        <div data-wordmark className="relative -mb-[0.16em] select-none" aria-hidden>
          <p
            className="display text-center text-[21vw] leading-[0.82] tracking-[-0.045em] whitespace-nowrap text-transparent"
            style={{ WebkitTextStroke: '1px rgba(226,216,197,0.35)' }}
          >
            ARVAmethod
          </p>
          <p
            data-fill
            className="display absolute inset-0 text-center text-[21vw] leading-[0.82] tracking-[-0.045em] whitespace-nowrap text-gold"
          >
            ARVAmethod
          </p>
        </div>
      </div>
    </footer>
  )
}
