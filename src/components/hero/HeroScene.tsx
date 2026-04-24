import { HeroIllustration } from './HeroIllustration'

// Default hero right-column = pure SVG/HTML illustration. No image asset
// dependency, no WebGL runtime, 0 KB of extra JS, perfect LCP.
// If you later want to swap in a rendered PNG/WEBP, drop it in
// `/public/hero/scene.webp` and replace the body of this component with:
//
//   import Image from 'next/image'
//   return (
//     <div className="relative w-full h-[420px] md:h-[460px] lg:h-[520px]">
//       <Image src="/hero/scene.webp" alt="…" fill priority
//         sizes="(min-width: 1024px) 640px, 100vw" className="object-contain object-right" />
//     </div>
//   )

export function HeroScene() {
  return <HeroIllustration />
}
