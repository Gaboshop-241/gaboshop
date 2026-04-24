// Reusable AKIBASTORE logo: geometric AK mark + two-line wordmark.
// Mark = black geometric AK with a Gabon-tricolor accent stripe at the base.
// Wordmark = "AKIBA" extrabold on top, "STORE" light + letter-spaced underneath,
// separated from the mark by a thin vertical divider.

type Size = 'sm' | 'md' | 'lg'
type Variant = 'dark' | 'light'

type Props = {
  size?: Size
  variant?: Variant
  className?: string
}

const SIZES: Record<Size, { mark: number; title: string; sub: string; gap: string }> = {
  sm: { mark: 28, title: 'text-sm',  sub: 'text-[8px]',  gap: 'gap-2' },
  md: { mark: 38, title: 'text-lg',  sub: 'text-[10px]', gap: 'gap-3' },
  lg: { mark: 56, title: 'text-2xl', sub: 'text-xs',     gap: 'gap-4' },
}

export function AkibaMark({ size = 38, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* A */}
      <path
        d="M6 52 L20 12 H28 L42 52 H34 L31 42 H17 L14 52 H6 Z M19 34 H29 L24 20 Z"
        fill="currentColor"
      />
      {/* K */}
      <path
        d="M33 12 H41 V30 L54 12 H63 L49 30 L63 52 H54 L43 35 L41 37 V52 H33 V12 Z"
        fill="currentColor"
      />
      {/* Gabon tricolor accent */}
      <rect x="6"  y="55" width="18" height="3" rx="1.5" fill="#22C55E" />
      <rect x="27" y="55" width="18" height="3" rx="1.5" fill="#FACC15" />
      <rect x="48" y="55" width="15" height="3" rx="1.5" fill="#2563EB" />
    </svg>
  )
}

export function AkibaLogo({ size = 'md', variant = 'dark', className = '' }: Props) {
  const s = SIZES[size]
  const isDark = variant === 'dark'
  const markColor   = isDark ? 'text-[#0B0B0B]' : 'text-white'
  const titleColor  = isDark ? 'text-[#0B0B0B]' : 'text-white'
  const subColor    = isDark ? 'text-[#6B7280]' : 'text-white/60'
  const dividerClr  = isDark ? 'bg-[#E5E7EB]'   : 'bg-white/20'

  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <AkibaMark size={s.mark} className={markColor} />
      <span className={`h-[70%] w-px ${dividerClr}`} />
      <span className="inline-flex flex-col leading-none">
        <span
          className={`${s.title} font-extrabold tracking-tight ${titleColor}`}
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          AKIBA
        </span>
        <span className={`${s.sub} font-medium tracking-[0.4em] uppercase mt-1 ${subColor}`}>
          Store
        </span>
      </span>
    </span>
  )
}
