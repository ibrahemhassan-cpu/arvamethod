import { useCallback, useEffect, useState } from 'react'
import { Cursor } from './components/Cursor'
import { Grain } from './components/Grain'
import { Header } from './components/Header'
import { Preloader } from './components/Preloader'
import { SmoothScroll, useLenis } from './components/SmoothScroll'
import { ScrollTrigger } from './lib/gsap'
import { Breathe } from './sections/Breathe'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { HowToBegin } from './sections/HowToBegin'
import { Manifesto } from './sections/Manifesto'
import { Marquee } from './sections/Marquee'
import { Philosophy } from './sections/Philosophy'
import { SignatureSession } from './sections/SignatureSession'
import { Social } from './sections/Social'
import { Testimonials } from './sections/Testimonials'
import { TheWork } from './sections/TheWork'

export default function App() {
  return (
    <SmoothScroll>
      <Page />
    </SmoothScroll>
  )
}

function Page() {
  const lenis = useLenis()
  const [revealed, setRevealed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const onReveal = useCallback(() => setRevealed(true), [])
  const onComplete = useCallback(() => setLoaded(true), [])

  // Hold scroll at the top until the preloader has lifted.
  useEffect(() => {
    if (!loaded) {
      window.scrollTo(0, 0)
      document.documentElement.style.overflow = 'hidden'
      return
    }
    document.documentElement.style.overflow = ''
    lenis?.start()
    ScrollTrigger.refresh()
  }, [loaded, lenis])

  // Disabled links ("#") stay clickable-looking but must not jump the page to the top.
  useEffect(() => {
    const block = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest?.('a[href="#"]')) e.preventDefault()
    }
    document.addEventListener('click', block)
    return () => document.removeEventListener('click', block)
  }, [])

  // Lazy images change section heights; re-measure once everything has settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      {!loaded && <Preloader onReveal={onReveal} onComplete={onComplete} />}
      <Header visible={revealed} logoReady={loaded} />
      <main>
        <Hero play={revealed} />
        <Marquee className="bg-espresso text-cream" />
        <Philosophy />
        <TheWork />
        <HowToBegin />
        <SignatureSession />
        <Testimonials />
        <Manifesto />
        <Breathe />
        <Marquee className="border-y border-cream/10 bg-ink text-cream/90" reverse />
        <Social />
      </main>
      <Footer />
      <Cursor />
      <Grain />
    </>
  )
}
