import type { ComponentType } from 'react'

export type VariantId = 1 | 2 | 3
export const variantIds: VariantId[] = [1, 2, 3]

export const variants: Record<VariantId, { name: string; tagline: string; theme: 'dark' | 'light' | 'ink' }> = {
  1: { name: 'Editorial', tagline: 'Dark, typographic, cinematic', theme: 'dark' },
  2: { name: 'Kinetic', tagline: 'Light, oversized, in motion', theme: 'light' },
  3: { name: 'Immersive', tagline: 'WebGL, spatial, alive', theme: 'ink' },
}

export type SectionId =
  | 'hero'
  | 'marquee'
  | 'philosophy'
  | 'work'
  | 'begin'
  | 'signature'
  | 'stories'
  | 'manifesto'
  | 'breathe'
  | 'social'
  | 'footer'

export const sectionOrder: SectionId[] = [
  'hero',
  'marquee',
  'philosophy',
  'work',
  'begin',
  'signature',
  'stories',
  'manifesto',
  'breathe',
  'social',
  'footer',
]

export const sectionLabels: Record<SectionId, string> = {
  hero: 'Hero',
  marquee: 'Ticker',
  philosophy: 'Body & Mind',
  work: 'The Work',
  begin: 'How to Begin',
  signature: 'ARVAmethod Body',
  stories: 'Testimonials',
  manifesto: 'Manifesto',
  breathe: 'Breathe',
  social: 'Social',
  footer: 'Footer',
}

/** Per-section overrides on top of an edition's base version. */
export type Mix = Partial<Record<SectionId, VariantId>>

export type EditionSlug = 'editorial' | 'kinetic' | 'immersive' | 'harmony'

export type Edition = {
  slug: EditionSlug
  name: string
  tagline: string
  /** Version used for any section the edition doesn't override. */
  base: VariantId
  mix: Mix
  theme: 'dark' | 'light' | 'ink'
}

/** The cut served at the bare domain. */
export const DEFAULT_EDITION: EditionSlug = 'harmony'

/**
 * The four cuts the client can look at, in presentation order. "Harmony" leads and is the
 * default: the hand-picked mix — Editorial's storytelling with the Kinetic ticker, the
 * Immersive testimonials and its glass footer. The other three are one version end to end.
 */
export const editions: Edition[] = [
  {
    slug: 'harmony',
    name: 'Harmony',
    tagline: 'Editorial calm, with light and depth woven in',
    base: 3,
    mix: {
      hero: 1,
      marquee: 2,
      philosophy: 1,
      work: 1,
      begin: 1,
      signature: 2,
      stories: 3,
      manifesto: 1,
    },
    theme: 'dark',
  },
  { slug: 'kinetic', name: 'Kinetic', tagline: 'Light, oversized, in motion', base: 2, mix: {}, theme: 'light' },
  { slug: 'immersive', name: 'Immersive', tagline: 'WebGL, spatial, alive', base: 3, mix: {}, theme: 'ink' },
  { slug: 'editorial', name: 'Editorial', tagline: 'Dark, typographic, cinematic', base: 1, mix: {}, theme: 'dark' },
]

export const editionBySlug = (slug: string) => editions.find((e) => e.slug === slug)

const sameMix = (a: Mix, b: Mix) =>
  sectionOrder.every((section) => (a[section] ?? null) === (b[section] ?? null))

/** Which edition, if any, exactly describes the current state. */
export function matchEdition(base: VariantId, mix: Mix): Edition | undefined {
  return editions.find((e) => e.base === base && sameMix(e.mix, mix))
}

export type SectionProps = { play?: boolean }
export type SectionComponent = ComponentType<SectionProps>
/** A variant module supplies whichever sections it re-imagines; the rest fall back to variant 1. */
export type VariantModule = {
  sections: Partial<Record<SectionId, SectionComponent>>
  /** Optional fixed backdrop rendered behind the whole page while this variant is on screen. */
  Background?: ComponentType
}

const loaders: Record<VariantId, () => Promise<VariantModule>> = {
  1: () => import('./v1'),
  2: () => import('./v2'),
  3: () => import('./v3'),
}

const cache = new Map<VariantId, VariantModule>()

export function getLoaded(id: VariantId) {
  return cache.get(id)
}

export async function loadVariant(id: VariantId) {
  const cached = cache.get(id)
  if (cached) return cached
  const mod = await loaders[id]()
  cache.set(id, mod)
  return mod
}

/** Warm a variant's chunk in the background (used on hover of the switcher). */
export function preloadVariant(id: VariantId) {
  void loadVariant(id)
}

/** Resolve the component for a section, falling back to variant 1 when a variant doesn't override it. */
export function resolveSection(section: SectionId, variant: VariantId): SectionComponent | undefined {
  return cache.get(variant)?.sections[section] ?? cache.get(1)?.sections[section]
}

/** Fixed backdrop for a variant, if it has one. */
export function variantBackground(id: VariantId) {
  return cache.get(id)?.Background
}

/** Which variants actually ship their own take on a section (always includes 1). */
export function sectionOptions(section: SectionId): VariantId[] {
  return variantIds.filter((id) => id === 1 || cache.get(id)?.sections[section])
}
