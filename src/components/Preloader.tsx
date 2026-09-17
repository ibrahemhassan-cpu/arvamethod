import { useRef } from 'react'
import { HERO_POSTER } from '../lib/content'
import { gsap, useGSAP } from '../lib/gsap'

type Props = {
  /** Fired as the curtain starts lifting — the hero intro and header should start now. */
  onReveal: () => void
  /** Fired once the logo has landed in the header and the preloader can unmount. */
  onComplete: () => void
}

const LOGO = '/images/logo-primary@2x.webp'

/**
 * Slices of the square primary logo, in its 500×500 pixel space (measured from the artwork's alpha).
 * Each slice is a clipped window onto the same image, so the pieces line up perfectly when assembled.
 */
type Piece = { id: string; x0: number; x1: number; y0: number; y1: number }

const petals: Piece[] = [
  { id: 'petal-l', x0: 132, x1: 257, y0: 92, y1: 194 },
  { id: 'petal-r', x0: 257, x1: 382, y0: 92, y1: 194 },
]
const arva: Piece[] = [
  { id: 'A', x0: 28, x1: 153, y0: 219, y1: 338 },
  { id: 'R', x0: 153, x1: 256, y0: 219, y1: 338 },
  { id: 'V', x0: 256, x1: 362, y0: 219, y1: 338 },
  { id: 'A2', x0: 362, x1: 472, y0: 219, y1: 338 },
]
const method: Piece[] = [
  { id: 'M', x0: 28, x1: 98, y0: 362, y1: 408 },
  { id: 'E', x0: 98, x1: 170, y0: 362, y1: 408 },
  { id: 'T', x0: 170, x1: 245, y0: 362, y1: 408 },
  { id: 'H', x0: 245, x1: 324, y0: 362, y1: 408 },
  { id: 'O', x0: 324, x1: 409, y0: 362, y1: 408 },
  { id: 'D', x0: 409, x1: 472, y0: 362, y1: 408 },
]

function Slice({ piece, group }: { piece: Piece; group: string }) {
  const w = piece.x1 - piece.x0
  const h = piece.y1 - piece.y0
  return (
    <div
      data-piece={group}
      className="absolute overflow-hidden"
      style={{ left: `${piece.x0 / 5}%`, top: `${piece.y0 / 5}%`, width: `${w / 5}%`, height: `${h / 5}%` }}
    >
      <img
        data-piece-img
        src={LOGO}
        alt=""
        draggable={false}
        className="absolute max-w-none"
        style={{
          width: `${(500 / w) * 100}%`,
          left: `${(-piece.x0 / w) * 100}%`,
          top: `${(-piece.y0 / h) * 100}%`,
          // Clip the artwork to this slice so, while it slides inside its window,
          // neighbouring parts of the logo (e.g. the lotus above ARVA) never show through.
          clipPath: `inset(${piece.y0 / 5}% ${(500 - piece.x1) / 5}% ${(500 - piece.y1) / 5}% ${piece.x0 / 5}%)`,
        }}
      />
    </div>
  )
}

const loadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
    img.decode?.().then(() => resolve(), () => resolve())
  })

export function Preloader({ onReveal, onComplete }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const progress = { value: 0 }
      let loaded = 0
      const tasks = [document.fonts.ready, loadImage(HERO_POSTER), loadImage(LOGO)]
      tasks.forEach((t) => t.then(() => loaded++))

      // 1 — the logo builds itself: petals bloom, ARVA rises, METHOD gathers, then a light sweep.
      gsap.set('[data-shine]', { xPercent: -120 })
      const build = gsap.timeline({ paused: true })
      if (!reduced) {
        build
          .from('[data-glow]', { opacity: 0, scale: 0.4, duration: 2.2, ease: 'expo.out' }, 0)
          .from(
            '[data-piece="petal"]',
            {
              rotate: (i) => (i === 0 ? 38 : -38),
              scale: 0.3,
              opacity: 0,
              transformOrigin: (i) => (i === 0 ? '100% 100%' : '0% 100%'),
              duration: 1.6,
              ease: 'expo.out',
            },
            0.1,
          )
          .from(
            '[data-piece="arva"] [data-piece-img]',
            { y: (_, el: HTMLElement) => el.parentElement!.offsetHeight * 1.05, duration: 1.2, stagger: 0.09, ease: 'expo.out' },
            0.55,
          )
          .from(
            '[data-piece="method"]',
            {
              x: (i) => (i - 2.5) * 26,
              opacity: 0,
              duration: 1.3,
              stagger: { each: 0.05, from: 'center' },
              ease: 'expo.out',
            },
            0.95,
          )
          .fromTo('[data-shine]', { xPercent: -120 }, { xPercent: 120, duration: 1.1, ease: 'power2.inOut' }, 1.5)
          .from('[data-pl-meta]', { opacity: 0, y: 12, stagger: 0.08, duration: 0.9, ease: 'expo.out' }, 0.4)
      }
      build.play()

      // 2 — counter tracks real loading, but never outruns the build animation.
      const start = performance.now()
      let last = start
      let exiting = false
      const tick = () => {
        const now = performance.now()
        const dt = Math.min(0.25, (now - last) / 1000)
        last = now
        const elapsed = (now - start) / 1000
        const loadGoal = elapsed > 6 ? 100 : (loaded / tasks.length) * 100
        const timeGoal = reduced ? 100 : Math.min(100, (build.time() / Math.max(0.01, build.duration())) * 100)
        const goal = Math.min(loadGoal, timeGoal)
        progress.value += (goal - progress.value) * (1 - Math.exp(-dt * 8))
        if (goal === 100 && progress.value > 99.4) progress.value = 100
        if (count.current) count.current.textContent = String(Math.round(progress.value)).padStart(3, '0')
        gsap.set('[data-pl-bar]', { scaleX: progress.value / 100 })

        if (!exiting && progress.value === 100 && (reduced || build.progress() === 1)) {
          exiting = true
          gsap.ticker.remove(tick)
          exit()
        }
      }
      gsap.ticker.add(tick)

      // 3 — the curtain lifts while the assembled logo flies into its place in the header.
      const exit = () => {
        const logo = root.current!.querySelector<HTMLElement>('[data-logo]')!
        const target = document.querySelector<HTMLElement>('[data-header-logo]')
        const header = document.querySelector<HTMLElement>('header')

        const tl = gsap.timeline({ onComplete })
        tl.to('[data-pl-meta], [data-pl-line]', { opacity: 0, y: -10, duration: 0.5, ease: 'power2.in' }, 0)
          .to('[data-glow]', { opacity: 0, duration: 0.8 }, 0)
          .add(onReveal, 0.25)
          .to('[data-curtain]', { yPercent: -100, duration: 1.15, ease: 'arva' }, 0.3)

        if (target && header && !reduced) {
          const from = logo.getBoundingClientRect()
          const to = target.getBoundingClientRect()
          // The header is still parked above the viewport; account for where it will come to rest.
          const headerOffset = header.getBoundingClientRect().top
          const scale = to.width / from.width
          tl.to(
            logo,
            {
              x: to.left + to.width / 2 - (from.left + from.width / 2),
              y: to.top - headerOffset + to.height / 2 - (from.top + from.height / 2),
              scale,
              duration: 1.25,
              ease: 'arva',
            },
            0.3,
          )
        } else {
          tl.to(logo, { opacity: 0, scale: 0.9, duration: 0.6 }, 0.2)
        }
      }

      return () => gsap.ticker.remove(tick)
    },
    { scope: root },
  )

  return (
    <div ref={root} className="fixed inset-0 z-[80]" aria-busy="true" aria-label="Loading ARVAmethod">
      <div data-curtain className="absolute inset-0 bg-ink will-change-transform">
        <div className="absolute right-0 bottom-0 left-0 px-6 pb-8 md:px-12 md:pb-10">
          <div data-pl-line className="relative mb-5 h-px w-full bg-cream/10">
            <div data-pl-bar className="absolute inset-0 origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
          </div>
          <div className="flex items-end justify-between text-cream/50">
            <p data-pl-meta className="eyebrow">
              Somatic &amp; Depth Practice
            </p>
            <p data-pl-meta className="eyebrow tabular-nums">
              <span ref={count}>000</span>
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div data-logo className="relative aspect-square w-[min(68vw,380px)] will-change-transform">
          <div
            data-glow
            className="absolute inset-[-30%] rounded-full bg-[radial-gradient(circle,rgba(197,148,89,0.22),transparent_62%)]"
          />
          {petals.map((p) => (
            <Slice key={p.id} piece={p} group="petal" />
          ))}
          {arva.map((p) => (
            <Slice key={p.id} piece={p} group="arva" />
          ))}
          {method.map((p) => (
            <Slice key={p.id} piece={p} group="method" />
          ))}
          {/* Light sweep, masked to the logo artwork */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              WebkitMaskImage: `url(${LOGO})`,
              maskImage: `url(${LOGO})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
            }}
          >
            <div
              data-shine
              className="absolute inset-y-0 -left-1/4 w-[150%] bg-[linear-gradient(100deg,transparent_35%,rgba(255,244,222,0.95)_50%,transparent_65%)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
