import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PaymentLogosRow } from '@/components/PaymentLogos'
import { PlatformsMarquee } from '@/components/PlatformsMarquee'

// ── Static content (production: move to i18n messages) ───────────────────────

const PLATFORMS = [
  { name: 'Netflix',        color: '#E50914', initial: 'N'  },
  { name: 'Spotify',        color: '#1DB954', initial: 'S'  },
  { name: 'Disney+',        color: '#0063E5', initial: 'D+' },
  { name: 'YouTube Premium', color: '#FF0033', initial: 'YT' },
  { name: 'Prime Video',    color: '#00A8E1', initial: 'P'  },
  { name: 'Crunchyroll',    color: '#F47521', initial: 'CR' },
  { name: 'Apple TV+',      color: '#000000', initial: 'TV' },
  { name: 'Canal+',         color: '#ED1B2F', initial: 'C+' },
]

const FEATURES = [
  { icon: 'sell',           title: 'Prix avantageux',        desc: "Jusqu'à -70% sur vos abonnements digitaux préférés — sans compromis sur la qualité.", tint: '#006b2c' },
  { icon: 'bolt',           title: 'Livraison instantanée',  desc: 'Recevez vos accès par email en moins de 5 minutes après paiement — 24/7.',           tint: '#eab308' },
  { icon: 'verified_user',  title: 'Sécurité garantie',      desc: 'Paiements cryptés via Airtel Money, Moov Money et cartes bancaires. Aucun partage.', tint: '#2563eb' },
  { icon: 'support_agent',  title: 'Support local 7j/7',     desc: "Une équipe gabonaise basée à Libreville, disponible par chat, téléphone et email.",  tint: '#9333ea' },
]

const STATS = [
  { value: '10 000+', label: 'Clients satisfaits' },
  { value: '50+',     label: 'Abonnements disponibles' },
  { value: '4.9/5',   label: 'Note moyenne' },
  { value: '< 5 min', label: 'Délai de livraison' },
]

const TESTIMONIALS = [
  { name: 'Marie Obame',       role: 'Cliente à Libreville', initial: 'M', text: 'Mon Netflix reçu en 2 minutes, aucun souci. Je recommande Akiba à toute ma famille.' },
  { name: 'Jean-Paul Nze',     role: 'Abonné Premium',       initial: 'J', text: 'Des prix imbattables et un support réactif. J’ai fait des économies énormes cette année.' },
  { name: 'Sandrine Boussougou', role: 'Étudiante',          initial: 'S', text: 'Parfait pour mon Spotify étudiant. Le paiement Airtel Money est super pratique !' },
]

// ── Data ─────────────────────────────────────────────────────────────────────

async function getFeaturedProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, title_fr, title_en, price, currency, images, space, vendor_id, categories(id, name_fr, name_en, slug)')
    .eq('is_active', true)
    .limit(6)
    .order('created_at', { ascending: false })
  return data ?? []
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [locale, products] = await Promise.all([getLocale(), getFeaturedProducts()])

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] selection:bg-[#7ffc97] selection:text-[#002109]">

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001d0c] via-[#003d19] to-[#006b2c] text-white">
        {/* Background photo */}
        <div className="pointer-events-none absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1920&q=80"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#001d0c]/90 via-[#003d19]/85 to-[#006b2c]/80" />
          <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-[#7ffc97]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-[#fff170]/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="flex -space-x-2">
                {[1,2,3].map((i) => (
                  <span key={i} className="w-5 h-5 rounded-full bg-[#7ffc97] border-2 border-[#006b2c] text-[#006b2c] text-[9px] font-bold flex items-center justify-center">
                    {['A','B','C'][i-1]}
                  </span>
                ))}
              </span>
              <span className="text-xs font-medium text-white/90">
                <span className="font-bold text-[#7ffc97]">+10 000</span> clients nous font confiance
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
              Tous vos abonnements<br />
              <span className="bg-gradient-to-r from-[#7ffc97] via-[#fff170] to-white bg-clip-text text-transparent">digitaux, au Gabon.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#d7fde1] mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Payez en toute sécurité en <span className="font-bold text-white">FCFA</span> avec les moyens de paiement locaux. Livraison instantanée par email, support local 7j/7.
            </p>

            {/* Real payment logos */}
            <div className="mb-8 flex flex-col sm:flex-row items-center lg:items-center gap-3 justify-center lg:justify-start">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60">Paiements acceptés</span>
              <PaymentLogosRow />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
              <Link
                href={`/${locale}/shop`}
                className="group inline-flex items-center gap-2 bg-white text-[#006b2c] px-7 py-4 rounded-xl font-bold text-base shadow-xl shadow-[#003d19]/40 hover:shadow-2xl hover:scale-[1.03] transition-all"
              >
                Voir les abonnements
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link
                href={`/${locale}/marketplace`}
                className="inline-flex items-center gap-2 border-2 border-white/50 text-white px-7 py-4 rounded-xl font-bold text-base hover:bg-white/10 hover:border-white transition-all"
              >
                Akiba Market
              </Link>
            </div>

            {/* Social proof rating */}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <span key={i} className="material-symbols-outlined text-[#ffc93c]" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <span className="text-white/90">
                <span className="font-bold">4.9/5</span> · <span className="text-white/70">basé sur 1 248 avis</span>
              </span>
            </div>
          </div>

          {/* Right: Platform cards collage */}
          <div className="hidden lg:block relative h-[32rem]">
            {/* Glass card: transaction success */}
            <div className="absolute top-0 right-0 w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#E50914] flex items-center justify-center text-white font-black text-xl">N</div>
                  <div>
                    <div className="font-bold text-white">Netflix Premium</div>
                    <div className="text-xs text-white/60">1 mois · 4K UHD</div>
                  </div>
                </div>
                <span className="bg-[#7ffc97] text-[#003d19] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Actif</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Prix</span>
                  <span className="font-bold text-white">4 500 FCFA</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Économie</span>
                  <span className="font-bold text-[#7ffc97]">-65%</span>
                </div>
              </div>
            </div>

            {/* Spotify */}
            <div className="absolute top-44 left-0 w-72 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl rotate-[-3deg]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#1DB954] flex items-center justify-center text-white font-black text-xl">S</div>
                <div>
                  <div className="font-bold text-white">Spotify Premium</div>
                  <div className="text-xs text-white/60">Famille · 6 comptes</div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-extrabold text-white">3 000<span className="text-sm text-white/60 font-normal ml-1">FCFA/mois</span></span>
                <span className="material-symbols-outlined text-[#7ffc97]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>

            {/* Disney+ */}
            <div className="absolute bottom-8 right-8 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl rotate-[4deg]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0063E5] flex items-center justify-center text-white font-black text-sm">D+</div>
                <div className="flex-1">
                  <div className="font-bold text-white text-sm">Disney+</div>
                  <div className="text-xs text-[#7ffc97] font-semibold">Livraison instantanée</div>
                </div>
              </div>
            </div>

            {/* Airtel Money confirmation */}
            <div className="absolute bottom-40 left-8 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 w-60">
              <div className="w-10 h-10 rounded-xl bg-[#7ffc97] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#006b2c]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <div className="flex-1">
                <div className="text-[#131b2e] font-bold text-sm">Paiement reçu</div>
                <div className="text-[#3e4a3d] text-[10px]">Airtel Money · 2 min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform strip — auto-scroll marquee with hover pause */}
        <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
              Plateformes disponibles
            </p>
            <PlatformsMarquee platforms={PLATFORMS} />
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#006b2c] font-bold tracking-widest text-xs uppercase mb-2 block">Pourquoi Akiba</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#131b2e] leading-tight max-w-2xl mx-auto">
              La manière la plus simple de s'abonner, au Gabon
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.icon}
                className="group relative bg-white border border-[#e2e7ff] rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${f.tint}15` }}
                >
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ color: f.tint, fontVariationSettings: "'FILL' 1" }}
                  >
                    {f.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#131b2e] mb-2">{f.title}</h3>
                <p className="text-sm text-[#3e4a3d] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ TWO SPACES ══════════════ */}
      <section className="py-16 px-6 lg:px-8 bg-[#f2f3ff]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Boutique officielle */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#006b2c] to-[#00873a] p-8 md:p-10 min-h-[340px] flex flex-col justify-between hover:shadow-2xl hover:shadow-[#006b2c]/30 transition-all">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-[#7ffc97]/20 rounded-full group-hover:scale-110 transition-transform" />
            <div className="relative">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3">Akiba Store</h2>
              <p className="text-[#d7fde1] max-w-sm leading-relaxed">
                Abonnements certifiés Netflix, Spotify, Disney+ et plus. Garantie 100% Akiba, livraison en 5 min.
              </p>
            </div>
            <Link
              href={`/${locale}/shop`}
              className="relative mt-6 inline-flex items-center gap-2 bg-white text-[#006b2c] px-6 py-3 rounded-full font-bold text-sm w-fit hover:shadow-lg hover:scale-105 transition-all"
            >
              Voir les abonnements
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>

          {/* Marketplace */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#283044] to-[#131b2e] p-8 md:p-10 min-h-[340px] flex flex-col justify-between hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-slate-600/30 rounded-full group-hover:scale-110 transition-transform" />
            <div className="relative">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#82f5c1] text-3xl">groups</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3">Akiba Market</h2>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Achetez et vendez en toute sécurité avec nos revendeurs partenaires à travers tout le Gabon.
              </p>
            </div>
            <Link
              href={`/${locale}/marketplace`}
              className="relative mt-6 inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 rounded-full font-bold text-sm w-fit hover:bg-white/10 hover:border-white transition-all"
            >
              Explorer le marché
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ TRENDING PRODUCTS ══════════════ */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-12">
            <div>
              <span className="text-[#006b2c] font-bold tracking-widest text-xs uppercase mb-2 block">Tendances actuelles</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#131b2e]">Les plus populaires</h2>
            </div>
            {products.length > 0 && (
              <Link href={`/${locale}/shop`} className="inline-flex items-center gap-2 text-[#006b2c] font-semibold group w-fit">
                Voir tout
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[20px]">arrow_forward</span>
              </Link>
            )}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((p) => (
                <ProductCard key={p.id} product={p as any} locale={locale} />
              ))}
            </div>
          ) : (
            <EmptyState locale={locale} />
          )}
        </div>
      </section>

      {/* ══════════════ TRUST / STATS / TESTIMONIALS ══════════════ */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#faf8ff] to-[#f2f3ff]">
        <div className="max-w-7xl mx-auto">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white border border-[#e2e7ff] rounded-2xl p-6 text-center hover:border-[#006b2c] transition-colors">
                <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-[#006b2c] to-[#00873a] bg-clip-text text-transparent mb-1">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm text-[#3e4a3d] font-medium uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="text-center mb-12">
            <span className="text-[#006b2c] font-bold tracking-widest text-xs uppercase mb-2 block">Avis clients</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#131b2e]">Ils nous font confiance</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white border border-[#e2e7ff] rounded-2xl p-7 hover:shadow-lg transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <span key={i} className="material-symbols-outlined text-[#ffc93c]" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-[#131b2e] leading-relaxed mb-5">« {t.text} »</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#e2e7ff]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#006b2c] to-[#00873a] flex items-center justify-center text-white font-bold">
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-bold text-[#131b2e] text-sm">{t.name}</div>
                    <div className="text-xs text-[#3e4a3d]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PAYMENT TRUST ══════════════ */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#131b2e] to-[#283044] rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(127,252,151,0.12),transparent_60%)] pointer-events-none" />

          <div className="w-full md:w-1/2 relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
              Payez en toute sécurité, en <span className="text-[#7ffc97]">FCFA</span>
            </h2>
            <p className="text-slate-300 text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Paiements locaux intégrés nativement — Airtel Money, Moov Money, cartes Visa/Mastercard. Chiffrement de bout en bout.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <PaymentBadge icon="phone_iphone" label="Airtel Money" tint="#FF0000" />
              <PaymentBadge icon="phone_iphone" label="Moov Money" tint="#FFC300" />
              <PaymentBadge icon="credit_card"  label="Visa / Mastercard" tint="#006b2c" />
            </div>
          </div>

          <div className="w-full md:w-1/2 relative z-10">
            <div className="relative mx-auto w-56 md:w-72 aspect-[9/19] bg-slate-950 rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#006b2c]/30 via-transparent to-[#00873a]/40" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-b-2xl" />
              <div className="absolute top-14 left-0 w-full px-5 space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-[10px] text-white/60 mb-1">Abonnement</div>
                  <div className="text-sm font-bold text-white">Netflix Premium · 1 mois</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-[10px] text-white/60 mb-1">Total</div>
                  <div className="text-xl font-extrabold text-[#7ffc97]">4 500 FCFA</div>
                </div>
              </div>
              <div className="absolute bottom-10 left-0 w-full px-5 text-center">
                <div className="bg-[#7ffc97] text-[#003d19] py-3 rounded-xl font-bold text-sm mb-3 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Paiement confirmé
                </div>
                <div className="text-[10px] text-white/60">Airtel Money Gabon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA FINAL ══════════════ */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#131b2e] mb-4 leading-tight">
            Prêt à débloquer vos abonnements ?
          </h2>
          <p className="text-lg text-[#3e4a3d] mb-8 max-w-2xl mx-auto">
            Rejoignez plus de 10 000 clients au Gabon et commencez à profiter de vos plateformes préférées dès aujourd'hui.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/shop`}
              className="inline-flex items-center gap-2 bg-[#006b2c] hover:bg-[#00873a] text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-[#006b2c]/30 hover:scale-105 transition-all"
            >
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
              Voir les abonnements
            </Link>
            <Link
              href={`/${locale}/auth/register`}
              className="inline-flex items-center gap-2 border-2 border-[#006b2c] text-[#006b2c] px-8 py-4 rounded-xl font-bold hover:bg-[#006b2c] hover:text-white transition-all"
            >
              Créer un compte gratuit
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────────

function PaymentBadge({ icon, label, tint }: { icon: string; label: string; tint: string }) {
  return (
    <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex items-center gap-3">
      <span
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${tint}30` }}
      >
        <span className="material-symbols-outlined text-base" style={{ color: tint === '#FFC300' ? '#FFC300' : '#7ffc97' }}>
          {icon}
        </span>
      </span>
      <span className="text-white font-semibold text-sm">{label}</span>
    </div>
  )
}

function EmptyState({ locale }: { locale: string }) {
  return (
    <div className="bg-white border-2 border-dashed border-[#e2e7ff] rounded-3xl p-16 text-center">
      <div className="w-20 h-20 bg-[#f2f3ff] rounded-full flex items-center justify-center mx-auto mb-5">
        <span className="material-symbols-outlined text-[#006b2c] text-4xl">inventory_2</span>
      </div>
      <h3 className="text-xl font-bold text-[#131b2e] mb-2">Aucun produit disponible pour le moment</h3>
      <p className="text-sm text-[#3e4a3d] max-w-sm mx-auto mb-6">
        Notre catalogue est en cours de constitution. Revenez bientôt pour découvrir nos premiers abonnements !
      </p>
      <Link
        href={`/${locale}/shop`}
        className="inline-flex items-center gap-2 text-[#006b2c] font-semibold hover:underline"
      >
        Explorer la boutique
        <span className="material-symbols-outlined text-lg">arrow_forward</span>
      </Link>
    </div>
  )
}

function ProductCard({
  product,
  locale,
}: {
  product: {
    id: string
    title_fr: string
    title_en: string
    price: number
    images: string[] | null
    space: string
    categories: { name_fr: string; name_en: string } | null
  }
  locale: string
}) {
  const title = locale === 'fr' ? product.title_fr : product.title_en
  const href = `/${locale}/${product.space === 'official' ? 'shop' : 'marketplace'}/${product.id}`

  return (
    <Link
      href={href}
      className="bg-white border border-[#e2e7ff] rounded-2xl overflow-hidden group hover:shadow-xl hover:border-[#006b2c] transition-all duration-300 flex flex-col"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-[#f2f3ff]">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[#006b2c] text-6xl">inventory_2</span>
          </div>
        )}
        {product.space === 'official' && (
          <div className="absolute top-3 left-3 bg-[#7ffc97] text-[#003d19] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
            Officiel
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[#3e4a3d] text-xs font-medium">Akiba</span>
          <span className="material-symbols-outlined text-[#006b2c] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        </div>
        <h3 className="text-base font-bold mb-3 group-hover:text-[#006b2c] transition-colors line-clamp-2">{title}</h3>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#e2e7ff]">
          <span className="text-xl font-extrabold text-[#006b2c]">
            {product.price.toLocaleString()} <span className="text-xs font-semibold text-[#3e4a3d]">FCFA</span>
          </span>
          <span className="bg-[#f2f3ff] p-2.5 rounded-xl group-hover:bg-[#006b2c] group-hover:text-white transition-all">
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
