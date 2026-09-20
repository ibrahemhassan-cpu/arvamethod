type Props = {
  text: string
  className?: string
  /** Seconds per full rotation. */
  duration?: number
  reverse?: boolean
}

/** Text running around a circle, rotating forever. Used for the big round CTAs. */
export function CircleText({ text, className = '', duration = 18, reverse = false }: Props) {
  const id = `circle-${text.replace(/\W+/g, '').slice(0, 12)}`
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={`pointer-events-none size-full ${className}`}
      style={{ animation: `spin-circle ${duration}s linear infinite ${reverse ? 'reverse' : ''}` }}
    >
      <defs>
        <path id={id} d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
      </defs>
      <text className="fill-current text-[8.5px] tracking-[0.34em] uppercase">
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
    </svg>
  )
}
