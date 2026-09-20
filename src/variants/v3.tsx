import { Marquee } from '../sections/Marquee'
import { WorkRibbon } from '../sections/v2/WorkRibbon'
import { AuroraBackground } from '../sections/v3/AuroraBackground'
import { BeginCarousel } from '../sections/v3/BeginCarousel'
import { FooterImmersive } from '../sections/v3/FooterImmersive'
import { HeroImmersive } from '../sections/v3/HeroImmersive'
import { PhilosophyOrbit } from '../sections/v3/PhilosophyOrbit'
import { SignatureTunnel } from '../sections/v3/SignatureTunnel'
import { StoriesGlass } from '../sections/v3/StoriesGlass'
import type { VariantModule } from './registry'

function MarqueeGlass() {
  return <Marquee className="border-y border-cream/10 bg-ink/40 text-cream/90" />
}

/** Immersive: WebGL light, depth and drag. Sections not listed fall back to V1. */
export const sections: VariantModule['sections'] = {
  hero: HeroImmersive,
  marquee: MarqueeGlass,
  philosophy: PhilosophyOrbit,
  // The dark ribbon suits the immersive tone better than V1's cream sheet.
  work: WorkRibbon,
  begin: BeginCarousel,
  signature: SignatureTunnel,
  stories: StoriesGlass,
  footer: FooterImmersive,
}

/** Fixed shader gradient that lives behind the whole version. */
export const Background = AuroraBackground
