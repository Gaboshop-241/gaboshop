import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Devenir revendeur — Akiba',
  description: "Rejoignez Akiba Market : vendez vos abonnements et services digitaux à toute la communauté gabonaise.",
}

const STEPS = [
  { num: '01', icon: 'how_to_reg',   title: 'Créez votre compte',     text: 'Inscrivez-vous gratuitement en moins de 2 minutes avec votre email et téléphone gabonais.' },
  { num: '02', icon: 'storefront',   title: 'Configurez votre boutique', text: 'Donnez un nom, une description et présentez vos produits ou services digitaux.' },
  { num: '03', icon: 'verified',     title: 'Vérification rapide',     text: 'Notre équipe valide votre boutique sous 24-48h pour garantir la confiance des acheteurs.' },
  { num: '04', icon: 'payments',     title: 'Vendez et encaissez',    text: 'Recevez vos paiements directement sur Airtel Money, Moov Money ou compte bancaire local.' },
]

const ADVANTAGES = [
  { icon: 'public_off',         title: '0 frais d’inscription',         text: 'Créez votre boutique gratuitement. Vous ne payez qu’une commission sur les ventes.' },
  { icon: 'support_agent',      title: 'Accompagnement local',          text: 'Une équipe gabonaise vous assiste à chaque étape, de la mise en ligne au support client.' },
  { icon: 'trending_up',        title: 'Audience nationale',            text: '+10 000 acheteurs gabonais actifs accèdent à vos produits dès la mise en ligne.' },
  { icon: 'currency_exchange',  title: 'Paiements en FCFA',             text: 'Encaissez en FCFA directement, aucune conversion ni frais cachés à l’international.' },
]

const REQUIREMENTS = [
  'Être résident au Gabon avec un numéro de téléphone local actif',
  'Disposer d’une pièce d’identité valide (CNI, passeport ou titre de séjour)',
  'Posséder un compte Airtel Money, Moov Money ou un compte bancaire',
  'Vendre des produits ou services légaux conformes aux conditions Akiba',
]

export default async function BecomeVendorPage() {
  const locale = await getLocale()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Auth gate: send to login with return URL
  if (!user) {
    redirect(`/${locale}/auth/login?redirectTo=${encodeURIComponent(`/${locale}/become-vendor`)}`)
  }

  // Fetch profile to check role + country
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, country_code, full_name')
    .eq('user_id', user.id)
    .maybeSingle()

  // Already vendor → straight to vendor dashboard
  if (profile?.role === 'vendor' || profile?.role === 'admin') {
    redirect(`/${locale}/vendor`)
  }

  const isGabon = profile?.country_code === 'GA'

  return (
    <div className="bg-[#faf8ff] min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001d0c] via-[#003d19] to-[#006b2c] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-[#fff170]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-[#7ffc97]/20 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-lg">🇬🇦</span>
            <span className="text-xs font-medium text-white/90 uppercase tracking-wider">Réservé aux résidents du Gabon</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Vendez sur <span className="bg-gradient-to-r from-[#7ffc97] via-[#fff170] to-white bg-clip-text text-transparent">Akiba Market</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#d7fde1] max-w-2xl mx-auto leading-relaxed mb-10">
            Transformez votre savoir-faire digital en revenus réels. Rejoignez la première communauté de revendeurs gabonais et touchez des milliers de clients dès aujourd’hui.
          </p>

          {!isGabon ? (
            <div className="max-w-xl mx-auto bg-amber-500/10 border border-amber-300/40 rounded-2xl p-6 text-left">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-300 shrink-0 mt-0.5" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>info</span>
                <div className="space-y-2">
                  <p className="font-bold text-white">Pays non éligible pour le moment</p>
                  <p className="text-sm text-amber-100/90 leading-relaxed">
                    Akiba Market est réservé aux résidents du Gabon. Mettez à jour votre pays dans votre profil si vous résidez au Gabon, ou abonnez-vous à notre newsletter pour être informé de l’ouverture dans votre pays.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link href={`/${locale}/client`} className="inline-flex items-center gap-2 bg-white text-[#006b2c] px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                      Mettre à jour mon profil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/auth/vendor-onboarding`}
                className="group inline-flex items-center gap-2 bg-white text-[#006b2c] px-7 py-4 rounded-xl font-bold text-base shadow-xl shadow-[#001d0c]/40 hover:scale-[1.03] transition-all"
              >
                <span className="material-symbols-outlined">storefront</span>
                Créer ma boutique
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2 border-2 border-white/50 text-white px-7 py-4 rounded-xl font-bold text-base hover:bg-white/10 transition-all">
                Comment ça marche ?
              </a>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#006b2c] font-bold tracking-widest text-xs uppercase mb-2 block">Étapes</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#131b2e] leading-tight max-w-2xl mx-auto">
              Lancez votre boutique en 4 étapes simples
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.num} className="relative bg-white border border-[#e2e7ff] rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <span className="absolute top-4 right-5 text-5xl font-black text-[#006b2c]/10 select-none" style={{ fontFamily: 'var(--font-manrope)' }}>{s.num}</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006b2c] to-[#00873a] flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-[#131b2e] mb-2">{s.title}</h3>
                <p className="text-sm text-[#3e4a3d] leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 px-6 lg:px-8 bg-[#f2f3ff]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#006b2c] font-bold tracking-widest text-xs uppercase mb-2 block">Avantages</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] leading-tight max-w-2xl mx-auto">
              Pourquoi vendre avec Akiba Market ?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((a) => (
              <div key={a.icon} className="bg-white border border-[#e2e7ff] rounded-2xl p-7">
                <div className="w-12 h-12 rounded-xl bg-[#7ffc97]/20 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[#006b2c] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                </div>
                <h3 className="text-base font-bold text-[#131b2e] mb-2">{a.title}</h3>
                <p className="text-sm text-[#3e4a3d] leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#131b2e] to-[#283044] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#7ffc97]/10 rounded-full blur-3xl" />
            <div className="relative">
              <span className="text-[#7ffc97] font-bold tracking-widest text-xs uppercase mb-3 block">Conditions</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Conditions d’éligibilité</h2>
              <ul className="space-y-4">
                {REQUIREMENTS.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#7ffc97] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[#003d19]" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>check</span>
                    </span>
                    <span className="text-slate-200 leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {isGabon && (
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#131b2e] mb-4 leading-tight">
              Prêt à rejoindre Akiba Market ?
            </h2>
            <p className="text-lg text-[#3e4a3d] mb-8 max-w-2xl mx-auto">
              Créez votre boutique en quelques minutes et commencez à vendre dès la validation de votre compte.
            </p>
            <Link
              href={`/${locale}/auth/vendor-onboarding`}
              className="inline-flex items-center gap-2 bg-[#006b2c] hover:bg-[#00873a] text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-[#006b2c]/30 hover:scale-105 transition-all"
            >
              <span className="material-symbols-outlined">storefront</span>
              Démarrer maintenant
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
