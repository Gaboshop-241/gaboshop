'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState } from 'react'

// If a static composite exists at /public/hero/scene.webp, use it (best LCP,
// pixel-perfect match for the mock). If the file is missing in production
// we fall back to the R3F WebGL scene so the slot never looks broken.
const Scene3D = dynamic(() => import('./HeroScene3D'), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
})

export function HeroScene() {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="relative w-full h-[420px] md:h-[460px] lg:h-[520px]">
      {!imgError ? (
        <Image
          src="/hero/scene.webp"
          alt="AKIBASTORE — téléphone avec icônes d'abonnements et sac shopping"
          fill
          priority
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-contain object-right"
          onError={() => setImgError(true)}
        />
      ) : (
        <Scene3D />
      )}
    </div>
  )
}
