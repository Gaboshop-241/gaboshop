'use client'

import dynamic from 'next/dynamic'

// Real 3D scene (Three.js / React Three Fiber) loaded client-side only.
// The ~300KB bundle is isolated to its own chunk — server render returns the
// lightweight fallback below, and the WebGL canvas streams in on the client.
const Scene3D = dynamic(() => import('./HeroScene3D'), {
  ssr: false,
  loading: () => <SceneFallback />,
})

export function HeroScene() {
  return (
    <div className="relative w-full h-[420px] md:h-[460px] lg:h-[500px]">
      <Scene3D />
    </div>
  )
}

// Minimal fallback: green ambient glow so the slot never looks broken while
// the 3D chunk is loading.
function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-[360px] h-[360px] rounded-full bg-[#22C55E]/35 blur-[100px]" />
    </div>
  )
}
