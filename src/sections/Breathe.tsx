import { useRef, useState } from 'react'
import { Button } from '../components/Button'
import { links } from '../lib/content'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useReveals } from '../lib/useReveals'

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale'

const INHALE = 4
const EXHALE = 6
const labels: Record<Phase, string> = {
  idle: 'Press & hold',
  inhale: 'Breathe in',
  hold: 'Hold',
  exhale: 'Let it go',
}

/**
 * Interactive breathing orb: press and hold to inhale, release to exhale.
 * A single 0→1 "fullness" value drives every layer, so each frame is a handful of transform writes.
 */
export function Breathe() {
  const root = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [breaths, setBreaths] = useState(0)
  const api = useRef<{ press: () => void; release: () => void } | null>(null)

  useGSAP(
    (_, contextSafe) => {
      if (!contextSafe) return
      const reduced = !window.matchMedia(MOTION_OK).matches
      const fullness = { v: 0 }
      let peak = 0
      let holding = false
      let tween: ReturnType<typeof gsap.to> | null = null

      // quickSetter has no "scale" shorthand, so drive both axes.
      const scaleSetter = (target: Element | string) => {
        const sx = gsap.quickSetter(target, 'scaleX')
        const sy = gsap.quickSetter(target, 'scaleY')
        return (value: number) => {
          sx(value)
          sy(value)
        }
      }
      const setCore = scaleSetter(root.current!.querySelector('[data-core]')!)
      const setGlow = gsap.quickSetter('[data-breath-glow]', 'opacity')
      const setBg = gsap.quickSetter('[data-breath-bg]', 'opacity')
      const rings = gsap.utils.toArray<HTMLElement>('[data-ring]').map(scaleSetter)
      const arc = root.current!.querySelector<SVGCircleElement>('[data-arc]')!
      const circumference = 2 * Math.PI * 49

      const render = () => {
        const v = fullness.v
        setCore(0.55 + 0.45 * v)
        setGlow(v)
        setBg(0.25 + 0.75 * v)
        rings.forEach((set, i) => set(0.62 + i * 0.13 + v * (0.1 + i * 0.05)))
        arc.style.strokeDashoffset = String(circumference * (1 - v))
      }
      render()

      // A slow idle "resting breath" invites interaction; paused whenever the section is off-screen.
      const idle = gsap.to('[data-idle]', {
        scale: 1.05,
        duration: 2.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        paused: true,
      })
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive && !holding && !reduced ? idle.play() : idle.pause()),
      })

      const press = contextSafe(() => {
        if (holding) return
        holding = true
        idle.pause()
        gsap.to('[data-idle]', { scale: 1, duration: 0.4 })
        tween?.kill()
        setPhase('inhale')
        tween = gsap.to(fullness, {
          v: 1,
          duration: reduced ? 0.3 : INHALE * (1 - fullness.v),
          ease: 'sine.inOut',
          onUpdate: () => {
            peak = Math.max(peak, fullness.v)
            render()
          },
          onComplete: () => setPhase('hold'),
        })
      })

      const release = contextSafe(() => {
        if (!holding) return
        holding = false
        tween?.kill()
        setPhase('exhale')
        tween = gsap.to(fullness, {
          v: 0,
          duration: reduced ? 0.3 : EXHALE * fullness.v,
          ease: 'sine.inOut',
          onUpdate: render,
          onComplete: () => {
            if (peak > 0.85) setBreaths((n) => n + 1)
            peak = 0
            setPhase('idle')
            if (st.isActive && !reduced) idle.play()
          },
        })
      })

      api.current = { press, release }
      return () => {
        api.current = null
      }
    },
    { scope: root },
  )

  useReveals(root)

  return (
    <section ref={root} id="breathe" className="relative overflow-clip bg-espresso py-28 md:py-40">
      <div
        data-breath-bg
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,94,92,0.45),transparent_65%)] opacity-25"
      />

      <div className="container-x relative grid items-center gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p data-fade className="eyebrow mb-8 text-gold">
            A pause, for your body
          </p>
          <h2 data-lines className="display text-[clamp(3rem,6.5vw,7rem)]">
            Press, hold <em className="text-gold">&amp; breathe.</em>
          </h2>
          <p data-lines className="mt-8 max-w-md text-lg leading-relaxed text-cream/70">
            Breathwork is woven through the ARVAmethod. Take one slow breath with the orb — hold to breathe in,
            release to let it go.
          </p>

          <div data-fade className="mt-12 flex items-center gap-6">
            <div>
              <p className="display text-6xl leading-none text-gold tabular-nums">{breaths}</p>
              <p className="eyebrow mt-2 text-cream/50">{breaths === 1 ? 'Breath' : 'Breaths'} taken</p>
            </div>
            <div
              className={`transition-[opacity,translate] duration-700 ease-(--ease-expo) ${
                breaths >= 3 ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
              }`}
              aria-hidden={breaths < 3}
            >
              <p className="mb-3 text-sm text-cream/70">Notice how you feel?</p>
              <Button href={links.quiz}>Take the Quiz</Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:col-span-7">
          <button
            type="button"
            data-cursor-label={phase === 'idle' ? 'Hold' : ''}
            aria-label="Press and hold to breathe in, release to breathe out"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              api.current?.press()
            }}
            onPointerUp={() => api.current?.release()}
            onPointerCancel={() => api.current?.release()}
            onKeyDown={(e) => {
              if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                e.preventDefault()
                api.current?.press()
              }
            }}
            onKeyUp={(e) => {
              if (e.key === ' ' || e.key === 'Enter') api.current?.release()
            }}
            onContextMenu={(e) => e.preventDefault()}
            className="relative aspect-square w-[min(84vw,520px)] touch-none rounded-full outline-offset-8 select-none"
          >
            <span data-idle className="absolute inset-0 grid place-items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  data-ring
                  className="absolute inset-0 rounded-full border will-change-transform"
                  style={{ borderColor: `rgba(197,148,89,${0.32 - i * 0.09})` }}
                />
              ))}

              <svg viewBox="0 0 100 100" className="absolute inset-[6%] -rotate-90" aria-hidden>
                <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(226,216,197,0.08)" strokeWidth="0.4" />
                <circle
                  data-arc
                  cx="50"
                  cy="50"
                  r="49"
                  fill="none"
                  stroke="#c59459"
                  strokeWidth="0.6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 49}
                  strokeDashoffset={2 * Math.PI * 49}
                />
              </svg>

              <span
                data-breath-glow
                className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(197,148,89,0.35),transparent_65%)] opacity-0"
              />
              <span
                data-core
                className="absolute inset-[12%] rounded-full will-change-transform"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, #e7c898 0%, #c59459 38%, #3b5e5c 100%)',
                  boxShadow: 'inset 0 -20px 60px rgba(23,17,15,0.45)',
                }}
              />
              <span className="relative flex flex-col items-center gap-2 text-espresso">
                <span className="display text-2xl italic sm:text-3xl md:text-4xl" aria-live="polite">
                  {labels[phase]}
                </span>
                <span className="eyebrow text-espresso/60">
                  {phase === 'inhale' ? `${INHALE} seconds` : phase === 'exhale' ? `${EXHALE} seconds` : ' '}
                </span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
