// AKIBASTORE logo: chunky AK monogram with Gabon tricolor shapes embedded
// in the base of the letterform + two-line wordmark separated by a hairline.
// Matches the reference mock: green triangle under A, yellow diamond in the
// middle, blue triangle under K.

type Size = 'sm' | 'md' | 'lg'
type Variant = 'dark' | 'light'

type Props = {
  size?: Size
  variant?: Variant
  className?: string
}

const SIZES: Record<Size, { mark: number; title: string; sub: string; gap: string }> = {
  sm: { mark: 30, title: 'text-sm',  sub: 'text-[8px]',  gap: 'gap-2' },
  md: { mark: 42, title: 'text-lg',  sub: 'text-[10px]', gap: 'gap-3' },
  lg: { mark: 60, title: 'text-2xl', sub: 'text-xs',     gap: 'gap-4' },
}

export function AkibaMark({ size = 42, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 56"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* A — chunky geometric */}
      <path
        d="M4 52 L16 4 H26 L38 52 H29 L26.8 42 H15.2 L13 52 Z M17 34 H25 L21 16 Z"
        fill="currentColor"
      />
      {/* K — chunky geometric */}
      <path
        d="M30 4 H38 V28 L53 4 H63 L47 28 L63 52 H52 L41 33 L38 37 V52 H30 V4 Z"
        fill="currentColor"
      />
      {/* Gabon flag accents embedded at the base */}
      {/* Green triangle inside A counter-space */}
      <path d="M17 34 L25 34 L21 26 Z" fill="#22C55E" />
      {/* Yellow diamond bridging A and K */}
      <path d="M28 46 L32 42 L36 46 L32 50 Z" fill="#FACC15" />
      {/* Blue triangle at K's base */}
      <path d="M44 40 L52 48 L44 52 Z" fill="#2563EB" />
    </svg>
  )
}

export function AkibaLogo({ size = 'md', variant = 'dark', className = '' }: Props) {
  const s = SIZES[size]
  const isDark = variant === 'dark'
  const markColor  = isDark ? 'text-[#0B0B0B]' : 'text-white'
  const titleColor = isDark ? 'text-[#0B0B0B]' : 'text-white'
  const subColor   = isDark ? 'text-[#6B7280]' : 'text-white/60'
  const dividerClr = isDark ? 'bg-[#D1D5DB]'   : 'bg-white/20'

  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <AkibaMark size={s.mark} className={markColor} />
      <span className={`h-8 w-px ${dividerClr}`} />
      <span className="inline-flex flex-col leading-none">
        <span
          className={`${s.title} font-extrabold tracking-tight ${titleColor}`}
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          AKIBA<span className="font-light tracking-[0.15em]">STORE</span>
        </span>
        <span className={`${s.sub} font-medium tracking-[0.5em] uppercase mt-1 ${subColor}`}>
          Store
        </span>
      </span>
    </span>
  )
}
