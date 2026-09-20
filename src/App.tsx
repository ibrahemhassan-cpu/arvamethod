import { useCallback, useEffect, useState } from 'react'
import { Cursor } from './components/Cursor'
import { Grain } from './components/Grain'
import { Header } from './components/Header'
import { Preloader } from './components/Preloader'
import { SmoothScroll, useLenis } from './components/SmoothScroll'
import { ScrollTrigger } from './lib/gsap'
import { resolveSection, sectionOrder, variantBackground, variants } from './variants/registry'
import { VariantProvider } from './variants/VariantProvider'
import { useVariant } from './variants/variantContext'
import { VersionSwitcher } from './variants/VersionSwitcher'
import { VersionTransition } from './variants/VersionTransition'

export default function App() {
  return (
    <VariantProvider>
      <SmoothScroll>
        <Shell />
      </SmoothScroll>
    </VariantProvider>
  )
}

function Shell() {
  const lenis = useLenis()
  const { variant, variantFor, ready, epoch } = useVariant()
  const [revealed, setRevealed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [shown, setShown] = useState(0)

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

  // Theme hook for variant-specific base colours.
  useEffect(() => {
    document.documentElement.dataset.variant = String(variant)
    document.documentElement.dataset.theme = variants[variant].theme
  }, [variant])

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

  // Swap the page while the wipe covers the screen.
  const swap = useCallback(() => {
    setShown(epoch)
    lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [epoch, lenis])

  // A variant can paint a fixed backdrop (V3's shader gradient) behind everything.
  const backgrounds = ready
    ? [...new Set(sectionOrder.map(variantFor))].map((id) => ({ id, Background: variantBackground(id) }))
    : []

  return (
    <>
      {backgrounds.map(({ id, Background }) => (Background ? <Background key={id} /> : null))}
      {!loaded && <Preloader onReveal={onReveal} onComplete={onComplete} />}
      <Header visible={revealed} logoReady={loaded} />

      <main key={shown}>
        {ready &&
          sectionOrder.map((id) => {
            const Section = resolveSection(id, variantFor(id))
            if (!Section) return null
            return (
              <div key={id} id={id} data-section={id}>
                <Section play={id === 'hero' ? revealed : undefined} />
              </div>
            )
          })}
      </main>

      <VersionTransition epoch={epoch} variant={variant} onCover={swap} />
      <VersionSwitcher />
      <Cursor />
      <Grain />
    </>
  )
}
