import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { useState } from 'react'
import { contact, nav, socials } from '../lib/content'
import { PreviewControls } from './PreviewControls'
import { RollText } from './RollText'

const EASE = [0.76, 0, 0.24, 1] as const
const EASE_OUT = [0.16, 1, 0.3, 1] as const

/** Full-screen menu. Loaded on demand so Motion stays out of the initial bundle. */
export default function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{open && <Overlay onClose={onClose} />}</AnimatePresence>
    </MotionConfig>
  )
}

function Overlay({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(0)

  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: '0%' }}
      exit={{ y: '-100%', transition: { duration: 0.8, ease: EASE, delay: 0.25 } }}
      transition={{ duration: 0.9, ease: EASE }}
      className="fixed inset-0 z-[65] overflow-y-auto bg-ink text-cream"
      data-lenis-prevent
    >
      <motion.div
        initial={{ y: '60%' }}
        animate={{ y: '0%' }}
        exit={{ y: '60%', transition: { duration: 0.8, ease: EASE, delay: 0.25 } }}
        transition={{ duration: 0.9, ease: EASE }}
        className="container-x grid min-h-full grid-cols-1 gap-10 pt-28 pb-10 md:pt-36 lg:grid-cols-12"
      >
        <nav aria-label="Menu" className="flex flex-col justify-center lg:col-span-7">
          {nav.map((item, i) => (
            <div key={item.label} className="overflow-hidden border-b border-cream/10">
              <motion.a
                href={item.href}
                onClick={onClose}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-110%', transition: { duration: 0.5, ease: EASE, delay: i * 0.03 } }}
                transition={{ duration: 1, ease: EASE_OUT, delay: 0.35 + i * 0.06 }}
                className="group flex items-baseline gap-5 py-3 md:py-4"
              >
                <span className="eyebrow w-8 tracking-[0.08em] text-gold/70">{String(i + 1).padStart(2, '0')}</span>
                <span className="display text-[clamp(2.4rem,6.5vw,5.75rem)] transition-[translate,color] duration-700 ease-(--ease-expo) group-hover:translate-x-4 group-hover:text-gold group-hover:italic">
                  {item.label}
                </span>
              </motion.a>
            </div>
          ))}
        </nav>

        <div className="hidden flex-col justify-center lg:col-span-5 lg:flex">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.7 }}
            className="relative ml-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem]"
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={nav[active].image}
                src={nav[active].image}
                alt=""
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-30%', transition: { duration: 0.9, ease: EASE } }}
                transition={{ duration: 0.9, ease: EASE }}
                className="absolute inset-0 size-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <p className="display absolute bottom-6 left-6 text-3xl italic">{nav[active].label}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.8 }}
          className="grid grid-cols-2 gap-8 border-t border-cream/10 pt-8 text-sm text-cream/70 md:grid-cols-4 lg:col-span-12"
        >
          <div>
            <p className="eyebrow mb-3 text-gold">Studio</p>
            {contact.address.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          <div>
            <p className="eyebrow mb-3 text-gold">Contact</p>
            <a className="block hover:text-cream" href={contact.phoneHref}>
              {contact.phone}
            </a>
            <a className="block hover:text-cream" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </div>
          <div className="col-span-2">
            <p className="eyebrow mb-3 text-gold">Follow</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="group hover:text-cream">
                  <RollText>{s.label}</RollText>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Internal review controls — quiet on purpose */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 1 }}
          className="lg:col-span-12"
        >
          <PreviewControls onNavigate={onClose} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
