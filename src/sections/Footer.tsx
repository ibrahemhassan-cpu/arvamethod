import { useRef } from 'react'
import { Button } from '../components/Button'
import { RollText } from '../components/RollText'
import { useScrollTo } from '../components/SmoothScroll'
import { contact, links, nav, socials } from '../lib/content'
import { gsap, MOTION_OK, SplitText, useGSAP } from '../lib/gsap'
import { useReveals } from '../lib/useReveals'

export function Footer() {
  const root = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Content rises from beneath the previous section, like a page being lifted.
        gsap.fromTo(
          '[data-footer-inner]',
          { yPercent: -25 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
          },
        )

        const split = SplitText.create('[data-wordmark]', { type: 'chars', mask: 'chars', charsClass: 'char' })
        gsap.from(split.chars, {
          yPercent: 100,
          stagger: 0.04,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-wordmark]', start: 'top 98%', once: true },
        })
      })
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <footer ref={root} id="contact" className="relative overflow-clip bg-cream text-espresso">
      <div data-footer-inner className="container-x pt-24 md:pt-36">
        <div className="grid gap-12 border-b border-espresso/15 pb-16 md:grid-cols-12 md:pb-24">
          <div className="md:col-span-7">
            <p data-fade className="eyebrow mb-8 text-teal">
              Start here for free
            </p>
            <h2 data-lines className="display text-[clamp(3rem,7vw,7.5rem)]">
              The Living <em className="text-teal">Archetype</em> Quiz
            </h2>
            <p data-lines className="mt-8 max-w-xl text-lg leading-relaxed text-espresso/70">
              Reveal the hidden patterns shaping how you approach health, stress, and self-care — and a practical guide
              for beginning holistic change.
            </p>
            <div data-fade className="mt-10">
              <Button href={links.quiz} variant="dark">
                Take the Living Archetype Quiz
              </Button>
            </div>
          </div>

          <div data-stagger className="grid grid-cols-2 gap-10 text-sm md:col-span-5 md:pt-4">
            <div>
              <p className="eyebrow mb-4 text-espresso/50">Explore</p>
              <ul className="space-y-2.5">
                {nav.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="group inline-block hover:text-teal">
                      <RollText>{item.label}</RollText>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4 text-espresso/50">Social</p>
              <ul className="space-y-2.5">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="group inline-block hover:text-teal">
                      <RollText>{s.label}</RollText>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4 text-espresso/50">Studio</p>
              <address className="leading-relaxed not-italic">
                {contact.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
            <div>
              <p className="eyebrow mb-4 text-espresso/50">Contact</p>
              <a href={contact.phoneHref} className="group block hover:text-teal">
                <RollText>{contact.phone}</RollText>
              </a>
              <a href={`mailto:${contact.email}`} className="group mt-2.5 block break-all hover:text-teal">
                <RollText>{contact.email}</RollText>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 py-8 text-xs text-espresso/60 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} ARVAmethod. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href={links.privacy} className="group hover:text-espresso">
              <RollText>Privacy Policy</RollText>
            </a>
            <button type="button" onClick={() => scrollTo(0)} className="group flex items-center gap-2 hover:text-espresso">
              <RollText>Back to top</RollText> ↑
            </button>
          </div>
        </div>

        <p
          data-wordmark
          aria-hidden
          className="display -mb-[0.2em] text-center text-[22vw] leading-[0.85] tracking-[-0.04em] whitespace-nowrap text-espresso select-none"
        >
          ARVA<em className="text-gold">method</em>
        </p>
      </div>
    </footer>
  )
}
