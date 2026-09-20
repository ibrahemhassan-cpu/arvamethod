import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadVariant, sectionOrder, variantIds, type SectionId, type VariantId } from './registry'
import { VariantContext, type Mix, type VariantState } from './variantContext'

const isVariant = (n: unknown): n is VariantId => n === 1 || n === 2 || n === 3

function readUrl(): { variant: VariantId; mix: Mix } {
  const params = new URLSearchParams(location.search)
  const v = Number(params.get('v'))
  const variant = isVariant(v) ? v : 1
  const mix: Mix = {}
  const raw = params.get('mix')
  if (raw) {
    for (const pair of raw.split('.')) {
      const [section, value] = pair.split('-') as [SectionId, string]
      const id = Number(value)
      if (sectionOrder.includes(section) && isVariant(id)) mix[section] = id
    }
  }
  return { variant, mix }
}

function writeUrl(variant: VariantId, mix: Mix) {
  const params = new URLSearchParams(location.search)
  if (variant === 1) params.delete('v')
  else params.set('v', String(variant))
  const entries = sectionOrder.filter((s) => mix[s]).map((s) => `${s}-${mix[s]}`)
  if (entries.length) params.set('mix', entries.join('.'))
  else params.delete('mix')
  const query = params.toString()
  history.replaceState(null, '', query ? `${location.pathname}?${query}` : location.pathname)
}

export function VariantProvider({ children }: { children: ReactNode }) {
  const [variant, setVariantState] = useState<VariantId>(() => readUrl().variant)
  const [mix, setMix] = useState<Mix>(() => readUrl().mix)
  const [mixing, setMixing] = useState(() => Object.keys(readUrl().mix).length > 0)
  const [ready, setReady] = useState(false)
  const [epoch, setEpoch] = useState(0)

  const variantFor = useCallback(
    (section: SectionId) => (mixing ? (mix[section] ?? variant) : variant),
    [mix, mixing, variant],
  )

  // Load every variant module that is currently on screen before rendering the page.
  const needed = useMemo(() => {
    const ids = new Set<VariantId>([1, variant])
    if (mixing) sectionOrder.forEach((s) => mix[s] && ids.add(mix[s]!))
    return [...ids].sort()
  }, [variant, mix, mixing])

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

  useEffect(() => writeUrl(variant, mixing ? mix : {}), [variant, mix, mixing])

  const setVariant = useCallback((id: VariantId) => {
    setVariantState((current) => {
      if (current === id) return current
      setEpoch((e) => e + 1)
      return id
    })
  }, [])

  const setSectionVariant = useCallback((section: SectionId, id: VariantId) => {
    setMixing(true)
    setMix((current) => ({ ...current, [section]: id }))
    setEpoch((e) => e + 1)
  }, [])

  const resetMix = useCallback(() => {
    setMix({})
    setMixing(false)
    setEpoch((e) => e + 1)
  }, [])

  const shareUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (variant !== 1) params.set('v', String(variant))
    if (mixing) {
      const entries = sectionOrder.filter((s) => mix[s]).map((s) => `${s}-${mix[s]}`)
      if (entries.length) params.set('mix', entries.join('.'))
    }
    const query = params.toString()
    return `${location.origin}${location.pathname}${query ? `?${query}` : ''}`
  }, [variant, mix, mixing])

  // 1 / 2 / 3 switch versions, M toggles mix mode — handy while presenting.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement
      if (target.isContentEditable || ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      const n = Number(e.key)
      if (isVariant(n) && variantIds.includes(n)) setVariant(n)
      if (e.key.toLowerCase() === 'm') setMixing((m) => !m)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setVariant])

  const value = useMemo<VariantState>(
    () => ({
      variant,
      mix,
      mixing,
      variantFor,
      ready,
      epoch,
      setVariant,
      setSectionVariant,
      setMixing,
      resetMix,
      shareUrl,
    }),
    [variant, mix, mixing, variantFor, ready, epoch, setVariant, setSectionVariant, resetMix, shareUrl],
  )

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>
}
