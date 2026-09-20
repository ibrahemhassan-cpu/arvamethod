import { Breathe } from '../sections/Breathe'
import { Footer } from '../sections/Footer'
import { Hero } from '../sections/Hero'
import { HowToBegin } from '../sections/HowToBegin'
import { Manifesto } from '../sections/Manifesto'
import { Marquee } from '../sections/Marquee'
import { Philosophy } from '../sections/Philosophy'
import { SignatureSession } from '../sections/SignatureSession'
import { Social } from '../sections/Social'
import { Testimonials } from '../sections/Testimonials'
import { TheWork } from '../sections/TheWork'
import type { VariantModule } from './registry'

function MarqueeDark() {
  return <Marquee className="bg-espresso text-cream" />
}

export const sections: VariantModule['sections'] = {
  hero: Hero,
  marquee: MarqueeDark,
  philosophy: Philosophy,
  work: TheWork,
  begin: HowToBegin,
  signature: SignatureSession,
  stories: Testimonials,
  manifesto: Manifesto,
  breathe: Breathe,
  social: Social,
  footer: Footer,
}
