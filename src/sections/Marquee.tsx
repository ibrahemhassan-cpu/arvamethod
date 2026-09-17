import { Fragment, useRef } from 'react'
import { Sparkle } from '../components/Button'
import { disciplines } from '../lib/content'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../lib/gsap'

type Props = {
  items?: string[]
  className?: string
  reverse?: boolean
}

/** Infinite ticker whose speed, direction and skew follow scroll velocity. Paused while off-screen. */
export function Marquee({ items = disciplines, className = '', reverse = false }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const base = reverse ? -1 : 1
        const loop = gsap.to('[data-track]', { xPercent: -50, duration: 40, ease: 'none', repeat: -1, paused: true })
        // Park the playhead far from zero so a negative timeScale can run backwards indefinitely.
        loop.totalTime(40 * 500).timeScale(base)

        // One persistent tween per property instead of spawning new tweens on every scroll event.
        const speed = { value: base }
        const toSpeed = gsap.quickTo(speed, 'value', {
          duration: 0.8,
          ease: 'power3',
          onUpdate: () => {
            loop.timeScale(speed.value)
          },
        })
        const toSkew = gsap.quickTo('[data-skew]', 'skewX', { duration: 0.6, ease: 'power3' })
        let direction = base
        const settle = gsap
          .delayedCall(0.15, () => {
            toSpeed(direction)
            toSkew(0)
          })
          .pause()

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
          onUpdate: (self) => {
            const velocity = self.getVelocity()
            direction = self.direction === 1 ? base : -base
            toSpeed(direction * gsap.utils.clamp(1, 6, 1 + Math.abs(velocity) / 400))
            toSkew(gsap.utils.clamp(-8, 8, velocity / -300))
            settle.restart(true)
          },
        })
        return () => st.kill()
      })
    },
    { scope: root },
  )

  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((item) => (
        <Fragment key={item}>
          <span className="display px-6 text-[clamp(2.75rem,7vw,7rem)] whitespace-nowrap md:px-10">{item}</span>
          <Sparkle className="size-6 shrink-0 text-gold md:size-9" />
        </Fragment>
      ))}
    </div>
  )

  return (
    <div ref={root} className={`relative overflow-hidden py-8 md:py-12 ${className}`}>
      <div data-skew>
        <div data-track className="flex w-max will-change-transform">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  )
}
