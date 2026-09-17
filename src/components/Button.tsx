import type { ReactNode } from 'react'
import { Magnetic } from './Magnetic'
import { RollText } from './RollText'

type Props = {
  href: string
  children: string
  variant?: 'gold' | 'ghost' | 'dark'
  icon?: ReactNode
  className?: string
}

const styles = {
  gold: 'bg-gold text-espresso',
  ghost: 'border border-cream/30 text-cream',
  dark: 'bg-espresso text-cream',
}

const fills = {
  gold: 'bg-cream',
  ghost: 'bg-cream',
  dark: 'bg-gold',
}

export function Button({ href, children, variant = 'gold', icon, className = '' }: Props) {
  const external = href.startsWith('http')
  return (
    <Magnetic strength={0.25} className={className}>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        data-cursor="hide"
        className={`group relative isolate inline-flex items-center gap-3 overflow-hidden rounded-full py-4 pr-4 pl-7 text-sm font-semibold tracking-wide transition-colors duration-500 ${styles[variant]} ${variant === 'ghost' ? 'hover:text-espresso' : variant === 'dark' ? 'hover:text-espresso' : ''}`}
      >
        {/* liquid fill that rises from below on hover */}
        <span
          aria-hidden
          className={`absolute inset-x-0 top-full -z-10 h-[200%] rounded-[50%] transition-[top,border-radius] duration-700 ease-(--ease-expo) group-hover:top-[-50%] group-hover:rounded-none ${fills[variant]}`}
        />
        <RollText>{children}</RollText>
        <span
          className={`grid size-9 place-items-center rounded-full transition-transform duration-500 ease-(--ease-expo) group-hover:rotate-45 ${variant === 'gold' ? 'bg-espresso text-gold' : 'bg-gold text-espresso'}`}
        >
          {icon ?? <ArrowIcon />}
        </span>
      </a>
    </Magnetic>
  )
}

export function ArrowIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Sparkle({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  )
}
