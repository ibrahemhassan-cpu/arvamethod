import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { preloadVariant, sectionLabels, sectionOrder, variantIds, variants, type VariantId } from './registry'
import { useVariant } from './variantContext'

/**
 * Presentation console: switch between the three directions, or open Mix to build a
 * cut that takes each section from whichever version the client prefers.
 */
export function VersionSwitcher() {
  const { variant, mix, mixing, setVariant, setSectionVariant, setMixing, resetMix, shareUrl } = useVariant()
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from(root.current, { y: 120, autoAlpha: 0, duration: 1.2, ease: 'expo.out', delay: 1.4 })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (!panel.current) return
      gsap
        .timeline()
        .fromTo(panel.current, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' })
        .from('[data-mix-row]', { y: 16, autoAlpha: 0, stagger: 0.035, duration: 0.5, ease: 'expo.out' }, 0.05)
    },
    { dependencies: [mixing], scope: root },
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link', shareUrl())
    }
  }

  const pick = (section: (typeof sectionOrder)[number], id: VariantId) => {
    setSectionVariant(section, id)
    requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView({ block: 'start' }))
  }

  return (
    <div ref={root} className="pointer-events-none fixed inset-x-0 bottom-0 z-[75] flex flex-col items-center gap-3 p-3 md:p-5">
      {mixing && (
        <div
          ref={panel}
          data-lenis-prevent
          className="pointer-events-auto max-h-[52vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-cream/12 bg-ink/92 p-4 text-cream shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl md:p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow text-gold">Mix your own cut</p>
              <p className="mt-1 text-xs text-cream/55">Pick a version per section — the page updates as you choose.</p>
            </div>
            <button
              type="button"
              onClick={resetMix}
              className="shrink-0 rounded-full border border-cream/20 px-3 py-1.5 text-[11px] tracking-wider uppercase transition-colors hover:border-gold hover:text-gold"
            >
              Reset
            </button>
          </div>

          <ul className="grid gap-1.5">
            {sectionOrder.map((section) => {
              const active = mix[section] ?? variant
              return (
                <li
                  key={section}
                  data-mix-row
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-cream/5"
                >
                  <span className="flex items-center gap-2 text-sm">
                    {sectionLabels[section]}
                    {mix[section] && <span className="size-1.5 rounded-full bg-gold" title="Customised" />}
                  </span>
                  <span className="flex gap-1">
                    {variantIds.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onPointerEnter={() => preloadVariant(id)}
                        onClick={() => pick(section, id)}
                        aria-pressed={active === id}
                        title={variants[id].name}
                        className={`grid size-8 place-items-center rounded-lg text-xs font-semibold transition-colors duration-300 ${
                          active === id ? 'bg-gold text-espresso' : 'bg-cream/8 text-cream/60 hover:bg-cream/15 hover:text-cream'
                        }`}
                      >
                        {id}
                      </button>
                    ))}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-cream/12 bg-ink/85 p-1.5 text-cream shadow-[0_20px_60px_-25px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Show versions' : 'Hide versions'}
          className="grid size-9 place-items-center rounded-full bg-cream/8 text-[10px] font-bold tracking-wider transition-colors hover:bg-cream/15"
        >
          {collapsed ? 'V' : '—'}
        </button>

        {!collapsed && (
          <>
            {variantIds.map((id) => (
              <button
                key={id}
                type="button"
                onPointerEnter={() => preloadVariant(id)}
                onClick={() => setVariant(id)}
                aria-pressed={!mixing && variant === id}
                className={`group relative flex items-center gap-2 rounded-full px-3 py-2 transition-colors duration-500 md:px-4 ${
                  variant === id ? 'bg-cream text-espresso' : 'hover:bg-cream/10'
                }`}
              >
                <span className="text-[10px] font-bold tabular-nums opacity-60">0{id}</span>
                <span className="text-[13px] font-medium">{variants[id].name}</span>
              </button>
            ))}

            <span className="mx-1 h-6 w-px bg-cream/15" />

            <button
              type="button"
              onClick={() => setMixing(!mixing)}
              aria-pressed={mixing}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-500 ${
                mixing ? 'bg-gold text-espresso' : 'hover:bg-cream/10'
              }`}
            >
              Mix
            </button>
            <button
              type="button"
              onClick={copy}
              className="rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-500 hover:bg-cream/10"
            >
              {copied ? 'Copied ✓' : 'Share'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
