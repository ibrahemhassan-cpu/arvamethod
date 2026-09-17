/**
 * Text that rolls up to a duplicate of itself when its closest `.group` is hovered.
 * Pure CSS transforms, so it costs nothing while idle.
 */
export function RollText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <span className="block transition-transform duration-500 ease-(--ease-expo) group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-(--ease-expo) group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  )
}
