import { useRef, useState } from 'react'
import { ArrowIcon } from '../../components/Button'
import { begin } from '../../lib/content'
import { gsap, MOTION_OK, useGSAP } from '../../lib/gsap'
import { useReveals } from '../../lib/useReveals'

const paths = begin.paths
const STEP = 360 / paths.length

/** V3: the four entry points ride a 3D carousel you can drag, scroll or step through. */
export function BeginCarousel() {
  const root = useRef<HTMLElement>(null)
  const angle = useRef(0)
  const rotate = useRef<((value: number) => void) | null>(null)
  const [index, setIndex] = useState(0)

  useGSAP(
    (_, contextSafe) => {
      if (!contextSafe) return
      const ring = root.current!.querySelector<HTMLElement>('[data-ring3d]')!
      const spin = gsap.quickTo(ring, 'rotationY', { duration: 1.1, ease: 'power3' })
      rotate.current = spin

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Drag to spin.
        let dragging = false
        let lastX = 0
        const down = contextSafe((e: PointerEvent) => {
          dragging = true
          lastX = e.clientX
          ring.setPointerCapture(e.pointerId)
        })
        const move = contextSafe((e: PointerEvent) => {
          if (!dragging) return
          angle.current += (e.clientX - lastX) * 0.35
          lastX = e.clientX
          spin(angle.current)
        })
        const up = contextSafe(() => {
          if (!dragging) return
          dragging = false
          // Snap to the nearest card.
          const snapped = Math.round(angle.current / STEP) * STEP
          angle.current = snapped
          spin(snapped)
          setIndex(((-Math.round(snapped / STEP) % paths.length) + paths.length) % paths.length)
        })

        ring.addEventListener('pointerdown', down)
        ring.addEventListener('pointermove', move)
        ring.addEventListener('pointerup', up)
        ring.addEventListener('pointercancel', up)

        // Scrolling through the section also advances the ring.
        const st = gsap.to(
          { v: 0 },
          {
            v: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top 70%',
              end: 'bottom bottom',
              scrub: 1,
              onUpdate: (self) => {
                if (dragging) return
                angle.current = -self.progress * 360
                spin(angle.current)
                setIndex(Math.min(paths.length - 1, Math.floor(self.progress * paths.length)))
              },
            },
          },
        )

        return () => {
          ring.removeEventListener('pointerdown', down)
          ring.removeEventListener('pointermove', move)
          ring.removeEventListener('pointerup', up)
          ring.removeEventListener('pointercancel', up)
          st.kill()
        }
      })
    },
    { scope: root },
  )

  useReveals(root)

  const go = (i: number) => {
    angle.current = -i * STEP
    rotate.current?.(angle.current)
    setIndex(i)
  }

  return (
    <section ref={root} id="begin" className="relative overflow-clip py-24 text-cream md:py-32">
      <div className="container-x">
        <div className="mb-10 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-fade className="eyebrow mb-6 text-gold">
              (04) Entry points
            </p>
            <h2 data-lines className="display text-[clamp(2.75rem,7vw,7.5rem)] leading-[0.9]">
              How to <em className="text-gold">Begin</em>
            </h2>
          </div>
          <p data-lines className="max-w-md leading-relaxed text-cream/70">
            {begin.intro}
          </p>
        </div>
      </div>

      {/* 3D ring */}
      <div className="relative h-[68vh] min-h-[430px]" style={{ perspective: '1600px' }}>
        <div
          data-ring3d
          data-cursor-label="Drag"
          className="absolute top-1/2 left-1/2 size-0 cursor-grab touch-pan-y active:cursor-grabbing"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {paths.map((path, i) => (
            <a
              key={path.title}
              href={path.href}
              className="group absolute block h-[58vh] max-h-[520px] min-h-[380px] w-[74vw] max-w-[340px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.75rem] border border-cream/12 bg-ink/70 sm:w-[46vw]"
              style={{ transform: `rotateY(${STEP * i}deg) translateZ(clamp(300px, 34vw, 480px))` }}
            >
              <img
                src={path.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover opacity-70 transition-[opacity,scale] duration-700 group-hover:scale-105 group-hover:opacity-90"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
              <span className="absolute inset-0 flex flex-col justify-end gap-3 p-6">
                <span className="eyebrow text-gold">{path.tag}</span>
                <span className="display text-3xl leading-[1.02]">{path.title}</span>
                <span className="line-clamp-4 text-sm leading-relaxed text-cream/70">{path.text}</span>
                <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                  {path.cta}
                  <ArrowIcon className="size-3.5 transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="container-x mt-8 flex items-center justify-center gap-3">
        {paths.map((path, i) => (
          <button
            key={path.title}
            type="button"
            onClick={() => go(i)}
            aria-label={path.title}
            aria-pressed={index === i}
            className={`h-1 rounded-full transition-[width,background-color] duration-500 ${
              index === i ? 'w-10 bg-gold' : 'w-5 bg-cream/25 hover:bg-cream/50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
