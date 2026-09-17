import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

const LenisContext = createContext<Lenis | null>(null)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.15 })
    instance.stop() // released by the preloader
    instance.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

/** Smooth-scroll to a selector/element, falling back to native scrolling. */
export function useScrollTo() {
  const lenis = useLenis()
  return (target: string | HTMLElement | number) => {
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
      return
    }
    if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
    else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior: 'smooth' })
  }
}
