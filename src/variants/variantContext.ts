import { createContext, useContext } from 'react'
import type { SectionId, VariantId } from './registry'

export type Mix = Partial<Record<SectionId, VariantId>>

export type VariantState = {
  variant: VariantId
  /** Per-section overrides; only set while the client is assembling their own cut. */
  mix: Mix
  mixing: boolean
  /** Version used for a given section right now. */
  variantFor: (section: SectionId) => VariantId
  ready: boolean
  /** Bumped on every switch so the page remounts and re-runs its intro. */
  epoch: number
  setVariant: (id: VariantId) => void
  setSectionVariant: (section: SectionId, id: VariantId) => void
  setMixing: (on: boolean) => void
  resetMix: () => void
  /** Shareable URL that reproduces exactly what is on screen. */
  shareUrl: () => string
}

export const VariantContext = createContext<VariantState | null>(null)

export function useVariant() {
  const ctx = useContext(VariantContext)
  if (!ctx) throw new Error('useVariant must be used inside <VariantProvider>')
  return ctx
}
