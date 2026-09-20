import { useState } from 'react'
import { editionPath } from '../variants/VariantProvider'
import { editions, preloadVariant, sectionLabels, sectionOrder, variantIds, variants } from '../variants/registry'
import { useVariant } from '../variants/variantContext'

/**
 * Internal review controls, deliberately small and quiet: they live at the foot of the
 * nav menu so nobody mistakes them for part of the design.
 */
export function PreviewControls({ onNavigate }: { onNavigate?: () => void }) {
  const { edition, setEdition, variant, mix, setSectionVariant, resetMix, shareUrl } = useVariant()
  const [openMix, setOpenMix] = useState(false)
  const [copied, setCopied] = useState(false)
  const customised = sectionOrder.filter((s) => mix[s]).length

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link', shareUrl())
    }
  }

  return (
    <div className="border-t border-cream/10 pt-6 text-cream/70">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-[10px] font-semibold tracking-[0.28em] text-cream/35 uppercase">Design versions</p>
        <div className="flex items-center gap-3 text-[11px]">
          <button
            type="button"
            onClick={() => setOpenMix((o) => !o)}
            aria-expanded={openMix}
            className={`transition-colors hover:text-gold ${openMix ? 'text-gold' : 'text-cream/45'}`}
          >
            Mix{customised ? ` (${customised})` : ''}
          </button>
          <button type="button" onClick={copy} className="text-cream/45 transition-colors hover:text-gold">
            {copied ? 'Copied ✓' : 'Copy link'}
          </button>
        </div>
      </div>

      <ul className="flex flex-wrap gap-2">
        {editions.map((item, i) => (
          <li key={item.slug}>
            <a
              href={editionPath(item.slug)}
              onPointerEnter={() => preloadVariant(item.base)}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                e.preventDefault()
                setEdition(item.slug)
                onNavigate?.()
              }}
              aria-current={edition === item.slug}
              title={item.tagline}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] transition-colors duration-300 ${
                edition === item.slug
                  ? 'border-gold/60 bg-gold/15 text-cream'
                  : 'border-cream/12 text-cream/55 hover:border-cream/30 hover:text-cream'
              }`}
            >
              <span className="tabular-nums opacity-50">0{i + 1}</span>
              {item.name}
            </a>
          </li>
        ))}
      </ul>

      {openMix && (
        <div className="mt-4 rounded-2xl border border-cream/10 bg-cream/[0.03] p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[10px] tracking-[0.2em] text-cream/35 uppercase">Section by section</p>
            <button
              type="button"
              onClick={resetMix}
              className="text-[11px] text-cream/45 transition-colors hover:text-gold"
            >
              Reset
            </button>
          </div>
          <ul className="grid gap-0.5 sm:grid-cols-2">
            {sectionOrder.map((section) => {
              const active = mix[section] ?? variant
              return (
                <li key={section} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1">
                  <span className="flex items-center gap-1.5 text-[11px] text-cream/60">
                    {sectionLabels[section]}
                    {mix[section] && <span className="size-1 rounded-full bg-gold" />}
                  </span>
                  <span className="flex gap-0.5">
                    {variantIds.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onPointerEnter={() => preloadVariant(id)}
                        onClick={() => {
                          setSectionVariant(section, id)
                          onNavigate?.()
                          requestAnimationFrame(() =>
                            document.getElementById(section)?.scrollIntoView({ block: 'start' }),
                          )
                        }}
                        aria-pressed={active === id}
                        title={variants[id].name}
                        className={`grid size-5 place-items-center rounded text-[10px] transition-colors duration-300 ${
                          active === id ? 'bg-gold text-espresso' : 'bg-cream/8 text-cream/50 hover:bg-cream/15'
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
    </div>
  )
}
