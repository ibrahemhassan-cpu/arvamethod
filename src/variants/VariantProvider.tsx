import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  DEFAULT_EDITION,
  editionBySlug,
  editions,
  loadVariant,
  matchEdition,
  sectionOrder,
  type EditionSlug,
  type Mix,
  type SectionId,
  type VariantId,
} from './registry'
import { VariantContext, type VariantState } from './variantContext'

const isVariant = (n: unknown): n is VariantId => n === 1 || n === 2 || n === 3

/**
 * URLs are real paths:
 *   /              — Harmony, the default cut
 *   /kinetic       — a named edition (also /immersive, /editorial, /harmony)
 *   /custom?v=2&mix=hero-3   — a one-off cut made in Mix mode
 * Legacy `?v=…` links still resolve and are rewritten to the path form on load.
 */
export function editionPath(slug: EditionSlug) {
  return slug === DEFAULT_EDITION ? '/' : `/${slug}`
}

function parseMix(raw: string | null, base: Mix = {}): Mix {
  const mix: Mix = { ...base }
  if (!raw) return mix
  for (const pair of raw.split('.')) {
    const [section, value] = pair.split('-') as [SectionId, string]
    const id = Number(value)
    if (sectionOrder.includes(section) && isVariant(id)) mix[section] = id
  }
  return mix
}

function readUrl(): { variant: VariantId; mix: Mix } {
  const params = new URLSearchParams(location.search)
  const segment = location.pathname.split('/').filter(Boolean).pop() ?? ''
  const isCustom = segment === 'custom' || params.has('mix') || params.has('v')
  // A bare path is the default edition; anything else must name itself.
  const named =
    editionBySlug(segment) ??
    editionBySlug(params.get('v') ?? '') ??
    (isCustom ? undefined : editionBySlug(DEFAULT_EDITION))
  const rawMix = params.get('mix')

  if (named && !rawMix) return { variant: named.base, mix: { ...named.mix } }

  const numeric = Number(params.get('v'))
  const variant = isVariant(numeric) ? numeric : (named?.base ?? 1)
  return { variant, mix: parseMix(rawMix, named ? { ...named.mix } : {}) }
}

/** The URL that reproduces a given state. */
function urlFor(variant: VariantId, mix: Mix) {
  const edition = matchEdition(variant, mix)
  if (edition) return editionPath(edition.slug)

  const params = new URLSearchParams()
  params.set('v', String(variant))
  const entries = sectionOrder.filter((s) => mix[s]).map((s) => `${s}-${mix[s]}`)
  if (entries.length) params.set('mix', entries.join('.'))
  return `/custom?${params.toString()}`
}

export function VariantProvider({ children }: { children: ReactNode }) {
  const [variant, setVariantState] = useState<VariantId>(() => readUrl().variant)
  const [mix, setMix] = useState<Mix>(() => readUrl().mix)
  const [ready, setReady] = useState(false)
  const [epoch, setEpoch] = useState(0)

  const edition = useMemo(() => matchEdition(variant, mix)?.slug ?? null, [variant, mix])

  const variantFor = useCallback((section: SectionId) => mix[section] ?? variant, [mix, variant])

  // Load every variant module that is currently on screen before rendering the page.
  const needed = useMemo(() => {
    const ids = new Set<VariantId>([1, variant])
    sectionOrder.forEach((s) => mix[s] && ids.add(mix[s]!))
    return [...ids].sort()
  }, [variant, mix])

  useEffect(() => {
    let cancelled = false
    setReady(false)
    Promise.all(needed.map(loadVariant)).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [needed])

  // Keep the address bar in step; a version change is a real history entry, tweaks are not.
  useEffect(() => {
    const next = urlFor(variant, mix)
    const current = `${location.pathname}${location.search}`
    if (next === current) return
    // setEdition already pushed its own entry; everything else just corrects the address.
    history.replaceState(null, '', next)
  }, [variant, mix])

  const apply = useCallback((next: { variant: VariantId; mix: Mix }, bump = true) => {
    setVariantState(next.variant)
    setMix(next.mix)
    if (bump) setEpoch((e) => e + 1)
  }, [])

  const setEdition = useCallback(
    (slug: EditionSlug) => {
      if (slug === edition) return
      const next = editionBySlug(slug)
      if (!next) return
      history.pushState(null, '', editionPath(slug))
      apply({ variant: next.base, mix: { ...next.mix } })
    },
    [edition, apply],
  )

  // Back / forward between versions.
  useEffect(() => {
    const onPop = () => apply(readUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [apply])

  const setSectionVariant = useCallback((section: SectionId, id: VariantId) => {
    setMix((current) => ({ ...current, [section]: id }))
    setEpoch((e) => e + 1)
  }, [])

  const resetMix = useCallback(() => {
    setMix({})
    setEpoch((e) => e + 1)
  }, [])

  const shareUrl = useCallback(() => `${location.origin}${urlFor(variant, mix)}`, [variant, mix])

  // 1…4 jump between editions while presenting.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement
      if (target.isContentEditable || ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      const n = Number(e.key)
      if (n >= 1 && n <= editions.length) setEdition(editions[n - 1].slug)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setEdition])

  const value = useMemo<VariantState>(
    () => ({
      variant,
      edition,
      setEdition,
      mix,
      variantFor,
      ready,
      epoch,
      setVariant: (id: VariantId) => apply({ variant: id, mix: {} }),
      setSectionVariant,
      resetMix,
      shareUrl,
    }),
    [variant, edition, setEdition, mix, variantFor, ready, epoch, apply, setSectionVariant, resetMix, shareUrl],
  )

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>
}
