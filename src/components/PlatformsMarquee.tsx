'use client'

type Platform = { name: string; color: string; initial: string }

export function PlatformsMarquee({ platforms }: { platforms: Platform[] }) {
  const loop = [...platforms, ...platforms]

  return (
    <div className="group/marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex gap-3 sm:gap-4 w-max animate-[marquee_40s_linear_infinite] group-hover/marquee:[animation-play-state:paused]">
        {loop.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full px-4 py-2 transition-colors shrink-0"
          >
            <span
              className="w-6 h-6 rounded-md flex items-center justify-center text-white font-black text-[10px] shrink-0"
              style={{ backgroundColor: p.color }}
            >
              {p.initial}
            </span>
            <span className="text-sm font-medium text-white/90 whitespace-nowrap">{p.name}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
