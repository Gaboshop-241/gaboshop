import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { HeroScene } from '@/components/hero/HeroScene'

// ── Hardcoded offers (matches reference mock until DB is seeded) ─────────────

type Category = {
  title: string
  subtitle: string
  icon: string
  tint: string   // icon color
  bg: string     // icon-bg color
  href: string
}

const CATEGORIES: Category[] = [
  { title: 'Streaming',  subtitle: 'Films, séries, musiques',      icon: 'smart_display', tint: '#22C55E', bg: '#DCFCE7', href: '/shop?category=streaming' },
  { title: 'Logiciels',  subtitle: 'Windows, Office, Antivirus',   icon: 'grid_view',     tint: '#F59E0B', bg: '#FEF3C7', href: '/shop?category=software' },
  { title: 'Gaming',     subtitle: 'Jeux, cartes, abonnements',    icon: 'sports_esports',tint: '#2563EB', bg: '#DBEAFE', href: '/shop?category=gaming' },
  { title: 'Formations', subtitle: 'Cours en ligne, certifications', icon: 'school',      tint: '#9333EA', bg: '#EDE9FE', href: '/shop?category=formations' },
]

type Offer = {
  id: string
  name: string
  tagline: string
  price: number
  oldPrice: number
  unit: string
  discount: number
  rating: number
  logo: React.ReactNode
  logoBg: string
}

const OFFERS: Offer[] = [
  {
    id: 'netflix',
    name: 'Netflix Premium',
    tagline: 'Partagez vos moments',
    price: 3500, oldPrice: 5250, unit: '/ mois', discount: 33, rating: 4.9,
    logoBg: '#0B0B0B',
    logo: (
      <span className="font-black text-[#E50914] text-3xl leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>N</span>
    ),
  },
  {
    id: 'spotify',
    name: 'Spotify Premium',
    tagline: 'Écoutez sans limite',
    price: 2000, oldPrice: 2700, unit: '/ mois', discount: 25, rating: 4.8,
    logoBg: '#0B0B0B',
    logo: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="24" fill="#1DB954" />
        <path d="M13 18c6-2 16-2 22 1M13 24c5-1.5 13-1.5 19 1M13 30c4-1 10-1 14 1" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: 'disney',
    name: 'Disney+ Standard',
    tagline: 'Vos histoires préférées',
    price: 3150, oldPrice: 4500, unit: '/ mois', discount: 30, rating: 4.9,
    logoBg: '#F5F9FF',
    logo: (
      <span className="font-black text-[#0063E5] text-2xl italic tracking-tight">Disney+</span>
    ),
  },
  {
    id: 'ms365',
    name: 'Microsoft 365',
    tagline: 'Productivité au quotidien',
    price: 6000, oldPrice: 7500, unit: '/ an', discount: 20, rating: 4.7,
    logoBg: '#FFF5EC',
    logo: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" aria-hidden="true">
        <path d="M10 10 L28 6 L28 24 L10 24 Z" fill="#F25022" />
        <path d="M10 24 L28 24 L28 42 L10 38 Z" fill="#FFB900" />
        <path d="M28 6 L44 4 L44 24 L28 24 Z" fill="#7FBA00" />
        <path d="M28 24 L44 24 L44 44 L28 42 Z" fill="#00A4EF" />
      </svg>
    ),
  },
]

const TRUST = [
  { icon: 'verified_user', title: 'Paiement sécurisé',     desc: 'Vos paiements sont 100% sécurisés', tint: '#22C55E', bg: '#DCFCE7' },
  { icon: 'bolt',          title: 'Livraison instantanée', desc: 'Vous recevez immédiatement',         tint: '#F59E0B', bg: '#FEF3C7' },
  { icon: 'support_agent', title: 'Support client 24/7',   desc: 'Nous sommes là pour vous',           tint: '#2563EB', bg: '#DBEAFE' },
  { icon: 'workspace_premium', title: 'Garantie satisfaction', desc: 'Satisfait ou remboursé',         tint: '#9333EA', bg: '#EDE9FE' },
]

const AVATARS = [
  'https://i.pravatar.cc/80?img=12',
  'https://i.pravatar.cc/80?img=25',
  'https://i.pravatar.cc/80?img=32',
  'https://i.pravatar.cc/80?img=47',
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const locale = await getLocale()

  return (
    <div className="bg-white text-[#0B0B0B]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-10 lg:py-14 space-y-16 lg:space-y-20">

        {/* ══════════════ HERO ══════════════ */}
        <section className="relative rounded-[28px] bg-[#0B0B0B] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]">
          {/* subtle dotted backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-8 p-8 md:p-14 lg:p-16 items-center">

            {/* Left: copy */}
            <div className="text-white">
              <h1
                className="text-[36px] sm:text-[44px] lg:text-[54px] xl:text-[60px] leading-[1.08] font-extrabold tracking-tight mb-5"
                style={{ fontFamily: 'var(--font-manrope)' }}
              >
                Accédez aux meilleurs<br />services <span className="text-[#22C55E]">à prix réduit</span>
              </h1>

              <p className="text-[15px] lg:text-base text-white/70 max-w-md leading-relaxed mb-10">
                Streaming, logiciels, abonnements, et plus.<br />
                Tout ce dont vous avez besoin, au meilleur prix.
              </p>

              <Link
                href={`/${locale}/shop`}
                className="group inline-flex items-center gap-3 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-sm lg:text-base rounded-full pl-7 pr-2 py-2 shadow-[0_10px_30px_-5px_rgba(34,197,94,0.5)] transition-all hover:scale-[1.02]"
              >
                Commencer maintenant
                <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </span>
              </Link>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {AVATARS.map((src, i) => (
                    <div key={i} className="w-10 h-10 rounded-full ring-2 ring-[#0B0B0B] overflow-hidden bg-[#1F1F1F]">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-0.5 text-[#FACC15]">
                    {[1,2,3,4,5].map((i) => (
                      <span key={i} className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <span className="text-xs text-white/70 mt-0.5">+ 20 000 clients satisfaits</span>
                </div>
              </div>
            </div>

            {/* Right: 3D-ish scene */}
            <div className="relative hidden lg:block">
              <HeroScene />
            </div>
          </div>
        </section>

        {/* ══════════════ CATÉGORIES ══════════════ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-extrabold text-[#0B0B0B]" style={{ fontFamily: 'var(--font-manrope)' }}>Nos catégories</h2>
            <Link href={`/${locale}/shop`} className="inline-flex items-center gap-1 text-sm font-semibold text-[#22C55E] hover:text-[#16A34A] transition-colors">
              Voir toutes
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {CATEGORIES.map((c) => (
              <Link
                key={c.title}
                href={`/${locale}${c.href}`}
                className="group bg-white border border-[#F0F0F0] rounded-2xl p-5 flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:border-[#E5E7EB] hover:-translate-y-0.5 transition-all"
              >
                <span
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: c.bg }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: c.tint, fontVariationSettings: "'FILL' 1" }}>
                    {c.icon}
                  </span>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#0B0B0B] text-[15px]">{c.title}</div>
                  <div className="text-xs text-[#6B7280] mt-0.5 truncate">{c.subtitle}</div>
                </div>
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform"
                  style={{ backgroundColor: c.bg, color: c.tint }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════ OFFRES EN VEDETTE ══════════════ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-extrabold text-[#0B0B0B]" style={{ fontFamily: 'var(--font-manrope)' }}>Offres en vedette</h2>
            <Link href={`/${locale}/shop?sort=deals`} className="inline-flex items-center gap-1 text-sm font-semibold text-[#22C55E] hover:text-[#16A34A] transition-colors">
              Voir toutes les offres
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {OFFERS.map((o) => (
              <article
                key={o.id}
                className="relative bg-white border border-[#F0F0F0] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_14px_34px_rgba(0,0,0,0.08)] transition-all"
              >
                {/* Discount badge */}
                <span className="absolute top-4 right-4 bg-[#EF4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                  -{o.discount}%
                </span>

                {/* Header: logo + name/tagline */}
                <div className="flex items-start gap-3 mb-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: o.logoBg }}
                  >
                    {o.logo}
                  </div>
                  <div className="flex-1 min-w-0 pr-14">
                    <h3 className="font-bold text-[15px] text-[#0B0B0B] truncate">{o.name}</h3>
                    <p className="text-xs text-[#6B7280] mt-0.5 truncate">{o.tagline}</p>
                  </div>
                </div>

                {/* Prices */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-[22px] font-extrabold text-[#22C55E]" style={{ fontFamily: 'var(--font-manrope)' }}>
                    {o.price.toLocaleString('fr-FR')} FCFA
                  </span>
                  <span className="text-xs text-[#6B7280]">{o.unit}</span>
                </div>
                <div className="text-xs text-[#9CA3AF] line-through mb-4">
                  {o.oldPrice.toLocaleString('fr-FR')} FCFA
                </div>

                {/* Rating + CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F5F5F5]">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5 text-[#FACC15]">
                      {[1,2,3,4,5].map((i) => (
                        <span key={i} className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                    <span className="text-xs text-[#6B7280] ml-1">({o.rating})</span>
                  </div>

                  <Link
                    href={`/${locale}/shop/${o.id}`}
                    className="inline-flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>shopping_cart</span>
                    Acheter
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ══════════════ BARRE DE CONFIANCE ══════════════ */}
        <section>
          <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-2xl p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST.map((t) => (
              <div key={t.title} className="flex items-center gap-4">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: t.bg }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color: t.tint, fontVariationSettings: "'FILL' 1" }}>
                    {t.icon}
                  </span>
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[#0B0B0B]">{t.title}</div>
                  <div className="text-xs text-[#6B7280] mt-0.5">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
