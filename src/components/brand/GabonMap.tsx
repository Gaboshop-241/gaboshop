// Stylized Gabon silhouette filled with the national tricolor (green / yellow / blue).
// Used in the footer as a decorative anchor. Not geographically precise — a
// recognizable blob filled with horizontal flag stripes.

export function GabonMap({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Gabon"
    >
      <defs>
        <clipPath id="gabon-shape">
          <path d="
            M 38 10
            C 50 8, 70 10, 82 18
            C 94 24, 102 36, 104 48
            C 106 58, 102 68, 98 78
            C 94 88, 88 96, 78 102
            C 68 108, 54 110, 42 106
            C 30 102, 22 94, 18 82
            C 14 70, 16 56, 22 44
            C 26 32, 30 18, 38 10
            Z
          "/>
        </clipPath>
      </defs>

      <g clipPath="url(#gabon-shape)">
        <rect x="0" y="0"   width="120" height="40" fill="#22C55E" />
        <rect x="0" y="40"  width="120" height="40" fill="#FACC15" />
        <rect x="0" y="80"  width="120" height="40" fill="#2563EB" />
      </g>

      {/* Outline for crispness */}
      <path
        d="M 38 10 C 50 8, 70 10, 82 18 C 94 24, 102 36, 104 48 C 106 58, 102 68, 98 78 C 94 88, 88 96, 78 102 C 68 108, 54 110, 42 106 C 30 102, 22 94, 18 82 C 14 70, 16 56, 22 44 C 26 32, 30 18, 38 10 Z"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
    </svg>
  )
}
