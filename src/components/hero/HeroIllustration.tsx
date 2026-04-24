// Static SVG/HTML hero illustration — 8 platform tiles floating above a
// tilted phone + AKIBASTORE shopping bag + colored glows. Built to match
// the reference mock without requiring any external image asset.

import { AkibaMark } from '@/components/brand/AkibaLogo'

export function HeroIllustration() {
  return (
    <div className="relative w-full h-[420px] md:h-[460px] lg:h-[520px]">
      {/* Colored ambient glows behind the icon cluster */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[18%]  left-[42%]  w-[140px] h-[140px] rounded-full bg-[#22C55E]/45 blur-3xl" />
        <div className="absolute top-[14%]  left-[58%]  w-[160px] h-[160px] rounded-full bg-[#EF4444]/35 blur-3xl" />
        <div className="absolute top-[46%]  left-[38%]  w-[180px] h-[180px] rounded-full bg-[#2563EB]/40 blur-3xl" />
      </div>

      {/* ── Phone mockup ── */}
      <div
        className="absolute bottom-4 left-1/2 w-[260px] md:w-[320px] aspect-[2/1]"
        style={{ transform: 'translateX(-60%) perspective(900px) rotateX(62deg)' }}
      >
        <div className="relative w-full h-full rounded-[22px] bg-gradient-to-b from-[#1a1a1a] via-[#0f0f0f] to-black shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
          {/* Screen glass */}
          <div className="absolute inset-[6px] rounded-[18px] bg-gradient-to-br from-[#0a1628] to-[#030910] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
          </div>
          {/* Yellow tile on screen */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-xl bg-[#FACC15] flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
              <polygon points="8,6 8,18 18,12" fill="#0B0B0B" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── 8 platform tiles ── */}
      {TILES.map((t) => (
        <div
          key={t.label}
          className="absolute rounded-[18px] flex items-center justify-center"
          style={{
            top: t.top, left: t.left,
            width: t.size, height: t.size,
            backgroundColor: t.bg,
            transform: `rotate(${t.rotate}deg)`,
            boxShadow: '0 18px 35px -8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
          aria-label={t.label}
        >
          {t.glyph}
        </div>
      ))}

      {/* ── AKIBASTORE shopping bag ── */}
      <div className="absolute right-0 md:right-2 top-[22%] w-[130px] md:w-[160px]">
        {/* Handles */}
        <svg className="absolute -top-1 left-1/2 -translate-x-1/2 w-[75%] h-10" viewBox="0 0 140 40" fill="none" aria-hidden="true">
          <path d="M20 38 C 20 8, 55 8, 55 38" stroke="#1a1a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M85 38 C 85 8, 120 8, 120 38" stroke="#1a1a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
        {/* Bag body with subtle depth */}
        <div className="relative mt-7 rounded-md bg-gradient-to-br from-[#161616] via-[#0d0d0d] to-black aspect-[4/5] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.7)] ring-1 ring-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
            <AkibaMark size={52} className="text-white drop-shadow-lg" />
            <span className="text-white font-extrabold text-[13px] tracking-[0.2em]" style={{ fontFamily: 'var(--font-manrope)' }}>
              AKIBASTORE
            </span>
          </div>
          {/* Side fold */}
          <div className="absolute right-0 top-0 bottom-0 w-[14px] bg-gradient-to-l from-black/60 to-transparent" />
        </div>
      </div>
    </div>
  )
}

// ── Brand glyph helpers (real inline SVG) ──────────────────────────────────

const NetflixGlyph = (
  <svg viewBox="0 0 32 32" className="w-8 h-8" aria-hidden="true">
    <defs>
      <linearGradient id="nflx-sh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E50914" />
        <stop offset="1" stopColor="#831010" />
      </linearGradient>
    </defs>
    <rect x="6"  y="3" width="5" height="26" fill="url(#nflx-sh)" />
    <rect x="21" y="3" width="5" height="26" fill="url(#nflx-sh)" />
    <polygon points="6,3 11,3 26,29 21,29" fill="#E50914" />
  </svg>
)

const SpotifyGlyph = (
  <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
    <circle cx="20" cy="20" r="20" fill="#1DB954" />
    <path d="M10 14c6-2 16-2 22 1"  stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M11 20c5-1.5 13-1.5 19 1" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M12 26c4-1 10-1 14 1"    stroke="#000" strokeWidth="2"   strokeLinecap="round" fill="none" />
  </svg>
)

const YouTubeGlyph = (
  <div className="w-11 h-8 rounded-md bg-white flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <polygon points="9,7 9,17 18,12" fill="#FF0000" />
    </svg>
  </div>
)

const DisneyGlyph = (
  <span
    className="text-white italic font-extrabold text-[20px] leading-none tracking-tight"
    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
  >
    Disney+
  </span>
)

const WindowsGlyph = (
  <div className="grid grid-cols-2 gap-1.5">
    <span className="w-[14px] h-[14px] bg-white" />
    <span className="w-[14px] h-[14px] bg-white" />
    <span className="w-[14px] h-[14px] bg-white" />
    <span className="w-[14px] h-[14px] bg-white" />
  </div>
)

const McAfeeGlyph = (
  <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
    <path
      d="M6 8 L14 32 L20 18 L26 32 L34 8 L28 8 L20 26 L12 8 Z"
      fill="#C01818"
    />
  </svg>
)

const PrimeVideoGlyph = (
  <div className="text-white font-extrabold leading-[1] text-center">
    <div className="text-[13px] tracking-tight italic">prime</div>
    <div className="text-[11px] tracking-tight italic">video</div>
    <svg viewBox="0 0 40 6" className="w-10 h-1.5 -mt-0.5" aria-hidden="true">
      <path d="M2 4 C 12 6, 28 6, 38 2" stroke="#00A8E1" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  </div>
)

const CanvaGlyph = (
  <span
    className="text-white font-black italic text-[18px] leading-none"
    style={{ fontFamily: '"Times New Roman", serif' }}
  >
    Canva
  </span>
)

// ── Tile positions (in %) ─────────────────────────────────────────────────

type Tile = {
  label: string
  bg: string
  top: string
  left: string
  size: number
  rotate: number
  glyph: React.ReactNode
}

const TILES: Tile[] = [
  { label: 'Netflix',     bg: '#0B0B0B', top: '12%', left: '16%', size: 72, rotate: -6, glyph: NetflixGlyph },
  { label: 'Spotify',     bg: '#0d2f1c', top: ' 8%', left: '34%', size: 72, rotate:  2, glyph: SpotifyGlyph },
  { label: 'YouTube',     bg: '#E60000', top: '14%', left: '52%', size: 72, rotate: -3, glyph: YouTubeGlyph },
  { label: 'Windows',     bg: '#203a8a', top: '38%', left: '10%', size: 68, rotate: -2, glyph: WindowsGlyph },
  { label: 'McAfee',      bg: '#ffffff', top: '36%', left: '30%', size: 68, rotate:  3, glyph: McAfeeGlyph },
  { label: 'Prime Video', bg: '#0f3d7a', top: '40%', left: '50%', size: 70, rotate: -4, glyph: PrimeVideoGlyph },
  { label: 'Disney+',     bg: '#17345f', top: '62%', left: '22%', size: 66, rotate:  4, glyph: DisneyGlyph },
  { label: 'Canva',       bg: '#0F8FF6', top: '64%', left: '42%', size: 66, rotate: -3, glyph: CanvaGlyph },
]
