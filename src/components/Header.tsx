import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { links, nav } from '../lib/content'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { ArrowIcon } from './Button'
import { Magnetic } from './Magnetic'
import { RollText } from './RollText'
import { variants } from '../variants/registry'
import { useVariant } from '../variants/variantContext'
import { useLenis } from './SmoothScroll'

const loadMenu = () => import('./MenuOverlay')
const Menu = lazy(loadMenu)

type Props = {
  /** Slide the bar in (fired as the preloader curtain lifts). */
  visible: boolean
  /** Show the header logo — the preloader's flying logo lands here first. */
  logoReady: boolean
}

export function Header({ visible, logoReady }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [menuRequested, setMenuRequested] = useState(false)
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null)
  const lenis = useLenis()
  const progress = useRef<HTMLDivElement>(null)
  const { variantFor } = useVariant()
  // Follow whichever version owns the hero — in a mixed cut that's what sits under the bar.
  const light = variants[variantFor('hero')].theme === 'light'

  useGSAP(() => {
    const setProgress = gsap.quickSetter(progress.current, 'scaleX')
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll()
        setScrolled(y > 40)
        setHidden(self.direction === 1 && y > window.innerHeight * 0.6)
        setProgress(self.progress)
      },
    })
    return () => st.kill()
  })

  // Warm the menu chunk once the page is idle, so the first open is instant.
  useEffect(() => {
    if (!logoReady) return
    const id = window.setTimeout(loadMenu, 2500)
    return () => window.clearTimeout(id)
  }, [logoReady])

  useEffect(() => {
    if (!visible) return
    if (open) lenis?.stop()
    else lenis?.start()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lenis, visible])

  const toggle = () => {
    setMenuRequested(true)
    setOpen((o) => !o)
  }

  const shown = visible && (!hidden || open)

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] px-3 pt-3 transition-transform duration-[900ms] ease-(--ease-expo) md:px-5 md:pt-4 ${
          shown ? 'translate-y-0' : '-translate-y-[120%]'
        }`}
      >
        <div
          className={`container-x relative flex items-center justify-between rounded-full py-2 transition-[background-color,box-shadow] duration-700 ${
            scrolled && !open
              ? light
                ? 'bg-cream-2/92 shadow-[0_10px_40px_-14px_rgba(36,28,25,0.35)] ring-1 ring-espresso/10'
                : 'bg-espresso/90 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-cream/10'
              : ''
          }`}
        >
          <a href={nav[0].href} aria-label="ARVAmethod home" data-cursor="hide" className="relative z-10 flex items-center">
            <img
              data-header-logo
              src="/images/logo-primary.webp"
              srcSet="/images/logo-primary.webp 500w, /images/logo-primary@2x.webp 1000w"
              sizes="72px"
              alt="ARVAmethod"
              width={500}
              height={500}
              className={`h-14 w-auto transition-[scale] duration-700 ease-(--ease-expo) md:h-[4.5rem] ${scrolled ? 'scale-[0.82]' : ''} ${
                logoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </a>

          {/* Desktop nav with a sliding highlight */}
          <nav
            aria-label="Primary"
            onMouseLeave={() => setPill(null)}
            className={`absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full p-1.5 transition-[opacity,background-color] duration-500 lg:flex ${
              open ? 'pointer-events-none opacity-0' : ''
            } ${scrolled ? '' : light ? 'bg-espresso/6 ring-1 ring-espresso/10' : 'bg-ink/35 ring-1 ring-cream/10'}`}
          >
            <span
              aria-hidden
              className={`absolute top-1.5 bottom-1.5 left-0 rounded-full transition-[translate,width,opacity] duration-500 ease-(--ease-expo) ${light ? 'bg-espresso' : 'bg-cream'}`}
              style={{ translate: `${pill?.x ?? 0}px 0`, width: pill?.w ?? 0, opacity: pill ? 1 : 0 }}
            />
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onMouseEnter={(e) => setPill({ x: e.currentTarget.offsetLeft, w: e.currentTarget.offsetWidth })}
                className={`group relative px-4 py-2.5 text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                  light ? 'text-espresso/80 hover:text-cream' : 'text-cream/85 hover:text-espresso'
                }`}
              >
                <RollText>{item.label}</RollText>
              </a>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-2 md:gap-3">
            <Magnetic strength={0.2} className="hidden sm:inline-block">
              <a
                href={links.quiz}
                data-cursor="hide"
                className="group inline-flex items-center gap-2 rounded-full bg-gold py-3 pr-3 pl-5 text-[13px] font-semibold text-espresso"
              >
                <RollText>Take the Quiz</RollText>
                <span className="grid size-6 place-items-center rounded-full bg-espresso text-gold transition-transform duration-500 group-hover:rotate-45">
                  <ArrowIcon className="size-3" />
                </span>
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <button
                type="button"
                onClick={toggle}
                onPointerEnter={loadMenu}
                onFocus={loadMenu}
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
                data-cursor="hide"
                className={`group grid size-12 place-items-center rounded-full ${light ? 'bg-espresso text-cream' : 'bg-cream text-espresso'}`}
              >
                <span className="relative block h-3 w-5">
                  <span
                    className={`absolute left-0 block h-[1.5px] w-full bg-current transition-[top,rotate] duration-500 ease-(--ease-smooth) ${
                      open ? 'top-1/2 -mt-px rotate-45' : 'top-0'
                    }`}
                  />
                  <span
                    className={`absolute right-0 block h-[1.5px] bg-current transition-[top,rotate,width] duration-500 ease-(--ease-smooth) ${
                      open ? 'top-1/2 -mt-px w-full -rotate-45' : 'top-full -mt-[1.5px] w-3/5 group-hover:w-full'
                    }`}
                  />
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Reading progress */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[71] h-[2px]">
        <div ref={progress} className="h-full origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
      </div>

      {menuRequested && (
        <Suspense fallback={null}>
          <Menu open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  )
}
