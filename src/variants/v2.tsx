import { Marquee } from '../sections/Marquee'
import { BeginAccordion } from '../sections/v2/BeginAccordion'
import { FooterKinetic } from '../sections/v2/FooterKinetic'
import { HeroKinetic } from '../sections/v2/HeroKinetic'
import { PhilosophyKinetic } from '../sections/v2/PhilosophyKinetic'
import { StoriesMarquee } from '../sections/v2/StoriesMarquee'
import { WorkRibbon } from '../sections/v2/WorkRibbon'
import type { VariantModule } from './registry'

function MarqueeLight() {
  return <Marquee className="border-y border-espresso/12 bg-cream-2 text-espresso" />
}

/** Kinetic: light paper, oversized type, horizontal motion. Sections not listed fall back to V1. */
export const sections: VariantModule['sections'] = {
  hero: HeroKinetic,
  marquee: MarqueeLight,
  philosophy: PhilosophyKinetic,
  work: WorkRibbon,
  begin: BeginAccordion,
  stories: StoriesMarquee,
  footer: FooterKinetic,
}
