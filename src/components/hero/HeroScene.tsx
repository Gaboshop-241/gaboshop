// Pseudo-3D hero scene: tilted phone + floating platform tiles + glow +
// AKIBASTORE shopping bag + Gabon tricolor ribbon. CSS-only composition with
// inline SVG — no external images, no 3D runtime. Built to match the reference
// mock closely on desktop; collapses gracefully on smaller screens.

import { AkibaMark } from '@/components/brand/AkibaLogo'

type Tile = {
  label: string
  glyph: React.ReactNode
  bg: string
  style: React.CSSProperties
}

export function HeroScene() {
  return (
    <div className="relative w-full h-[420px] md:h-[460px] lg:h-[500px]">
      {/* Ambient green glow behind the phone */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[360px] h-[360px] rounded-full bg-[#22C55E]/35 blur-[100px]" />
      </div>

      {/* Gabon ribbon flag (top-right, curved) */}
      <svg
        className="absolute -top-2 -right-6 md:-right-12 w-[200px] md:w-[260px] h-auto opacity-90 pointer-events-none"
        viewBox="0 0 320 220"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ribbonShade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"  stopColor="rgba(255,255,255,0.25)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <path d="M0 50 C 120 0, 220 60, 320 20 L 320 80 C 220 120, 120 60, 0 110 Z" fill="#22C55E" />
        <path d="M0 110 C 120 60, 220 120, 320 80 L 320 140 C 220 180, 120 120, 0 170 Z" fill="#FACC15" />
        <path d="M0 170 C 120 120, 220 180, 320 140 L 320 200 C 220 240, 120 180, 0 230 Z" fill="#2563EB" />
        <path d="M0 50 C 120 0, 220 60, 320 20 L 320 200 C 220 240, 120 180, 0 230 Z" fill="url(#ribbonShade)" />
      </svg>

      {/* Shopping bag (right side, behind tiles) */}
      <div className="absolute right-4 md:right-8 top-16 md:top-20 w-[130px] md:w-[150px] aspect-[4/5] pointer-events-none">
        <div className="relative w-full h-full">
          {/* Handles */}
          <div className="absolute top-0 left-[22%] w-[56%] h-[30%] border-t-[6px] border-x-[6px] border-white/80 rounded-t-full" />
          {/* Bag body */}
          <div className="absolute bottom-0 left-0 right-0 h-[75%] bg-gradient-to-br from-[#1a1a1a] to-[#0B0B0B] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-2">
            <AkibaMark size={40} className="text-white" />
            <span className="text-white font-extrabold text-[11px] tracking-[0.2em]" style={{ fontFamily: 'var(--font-manrope)' }}>
              AKIBASTORE
            </span>
          </div>
        </div>
      </div>

      {/* Phone mockup — center, tilted */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-[55%] -translate-y-1/2 w-[180px] md:w-[220px] aspect-[9/18]"
        style={{ transform: 'translate(-55%, -50%) perspective(900px) rotateY(-18deg) rotateX(4deg)' }}
      >
        <div className="relative w-full h-full rounded-[36px] bg-gradient-to-b from-[#1a1a1a] via-[#0B0B0B] to-[#000] border-[6px] border-[#1F1F1F] shadow-[0_40px_80px_-10px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[40%] h-4 bg-black rounded-full" />
          {/* Screen glow */}
          <div className="absolute inset-3 rounded-[28px] bg-gradient-to-b from-[#0f3d24] via-[#082814] to-[#000] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.45),transparent_55%)]" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <AkibaMark size={48} className="text-white/90" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating platform tiles */}
      {TILES.map((t) => (
        <div
          key={t.label}
          className="absolute rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.45)] flex items-center justify-center ring-1 ring-white/10"
          style={{ ...t.style, backgroundColor: t.bg }}
          aria-label={t.label}
        >
          {t.glyph}
        </div>
      ))}
    </div>
  )
}

// ── Inline brand glyphs ──
const N = (
  <span className="font-black text-white text-xl" style={{ fontFamily: 'Impact, sans-serif' }}>N</span>
)
const S = (
  <svg viewBox="0 0 32 32" className="w-7 h-7" aria-hidden="true">
    <circle cx="16" cy="16" r="16" fill="#1DB954" />
    <path d="M10 12c4-1 10-1 14 1M10 16c3-1 8-1 12 1M10 20c2.5-.5 6-.5 9 .5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </svg>
)
const YT = (
  <svg viewBox="0 0 32 24" className="w-8 h-auto" aria-hidden="true">
    <rect width="32" height="24" rx="6" fill="#FF0000" />
    <polygon points="13,7 13,17 22,12" fill="#fff" />
  </svg>
)
const Disney = (
  <span className="font-black text-white text-sm italic tracking-tight">D+</span>
)
const Windows = (
  <div className="grid grid-cols-2 gap-0.5">
    <span className="w-3 h-3 bg-[#F25022]" /><span className="w-3 h-3 bg-[#7FBA00]" />
    <span className="w-3 h-3 bg-[#00A4EF]" /><span className="w-3 h-3 bg-[#FFB900]" />
  </div>
)
const Prime = (
  <span className="text-white font-extrabold text-[10px] leading-tight text-center">
    prime<br/><span className="text-[#00A8E1]">video</span>
  </span>
)
const Canva = (
  <span className="font-black text-white text-sm italic" style={{ fontFamily: 'Georgia, serif' }}>Cv</span>
)
const McAfee = (
  <svg viewBox="0 0 32 32" className="w-7 h-7" aria-hidden="true">
    <path d="M4 4 L12 28 L16 16 L20 28 L28 4 L22 4 L16 22 L10 4 Z" fill="#C01818" />
  </svg>
)

const TILES: Tile[] = [
  { label: 'Netflix',     glyph: N,       bg: '#E50914', style: { top:  '8%', left: '6%',   width: 66, height: 66, transform: 'rotate(-8deg)' } },
  { label: 'Spotify',     glyph: S,       bg: '#191414', style: { top: '20%', left: '40%',  width: 66, height: 66, transform: 'rotate(4deg)' } },
  { label: 'YouTube',     glyph: YT,      bg: '#ffffff', style: { top:  '6%', left: '62%',  width: 72, height: 72, transform: 'rotate(-3deg)' } },
  { label: 'Disney+',     glyph: Disney,  bg: '#0063E5', style: { top: '30%', left: '78%',  width: 60, height: 60, transform: 'rotate(6deg)' } },
  { label: 'Windows',     glyph: Windows, bg: '#0B0B0B', style: { top: '48%', left: '2%',   width: 70, height: 70, transform: 'rotate(-4deg)' } },
  { label: 'Prime Video', glyph: Prime,   bg: '#00A8E1', style: { top: '52%', left: '32%',  width: 68, height: 68, transform: 'rotate(3deg)' } },
  { label: 'Canva',       glyph: Canva,   bg: '#00C4CC', style: { top: '70%', left: '58%',  width: 62, height: 62, transform: 'rotate(-6deg)' } },
  { label: 'McAfee',      glyph: McAfee,  bg: '#ffffff', style: { top: '76%', left: '18%',  width: 64, height: 64, transform: 'rotate(5deg)' } },
]
