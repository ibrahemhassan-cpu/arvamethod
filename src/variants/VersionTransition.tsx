import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { variants, type VariantId } from './registry'

type Props = {
  epoch: number
  variant: VariantId
  /** Called while the screen is fully covered — swap the page here. */
  onCover: () => void
}

/** Full-bleed wipe played between versions so the swap reads as a deliberate cut, not a reload. */
export function VersionTransition({ epoch, variant, onCover }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!epoch) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        onCover()
        return
      }

      gsap
        .timeline()
        .set(root.current, { autoAlpha: 1, pointerEvents: 'auto' })
        .fromTo(
          '[data-wipe]',
          { yPercent: 102 },
          { yPercent: 0, duration: 0.55, stagger: 0.06, ease: 'power3.inOut' },
        )
        .fromTo('[data-wipe-label]', { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, '-=0.2')
        .add(onCover, '>-0.1')
        .to('[data-wipe-label]', { yPercent: -110, duration: 0.55, ease: 'expo.in' }, '+=0.25')
        .to('[data-wipe]', { yPercent: -102, duration: 0.7, stagger: 0.06, ease: 'power3.inOut' }, '<')
        .set(root.current, { autoAlpha: 0, pointerEvents: 'none' })
    },
    { dependencies: [epoch], scope: root },
  )

  return (
    <div ref={root} className="pointer-events-none invisible fixed inset-0 z-[85]">
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} data-wipe className="h-full flex-1 bg-ink" />
        ))}
      </div>
      <div className="absolute inset-0 grid place-items-center overflow-hidden">
        <div className="overflow-hidden px-6 text-center">
          <div data-wipe-label>
            <p className="eyebrow mb-4 text-gold">Version 0{variant}</p>
            <p className="display text-[clamp(3rem,10vw,9rem)] text-cream">{variants[variant].name}</p>
            <p className="mt-4 text-sm tracking-wide text-cream/50">{variants[variant].tagline}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
