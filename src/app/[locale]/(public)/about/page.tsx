import Link from 'next/link'
import { getLocale } from 'next-intl/server'

export const metadata = {
  title: 'À propos — Akiba',
  description: 'Découvrez Akiba, la plateforme de référence pour vos abonnements digitaux au Gabon.',
}

export default async function AboutPage() {
  const locale = await getLocale()

  return (
    <div className="bg-[#faf8ff] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#006b2c] to-[#00873a] text-white py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7ffc97] mb-3 block">À propos</span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Le digital, <br className="hidden md:block" />au service du Gabon.
          </h1>
          <p className="text-lg md:text-xl text-[#d7fde1] max-w-2xl mx-auto leading-relaxed">
            Fondé en 2025, Akiba est la première plateforme gabonaise 100% dédiée à la distribution d'abonnements digitaux premium à prix local.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: 'rocket_launch', title: 'Notre mission', text: 'Rendre accessibles Netflix, Spotify, Disney+ et les meilleurs services digitaux à chaque Gabonais, en FCFA et avec un paiement local.' },
            { icon: 'groups',        title: 'Notre équipe',  text: 'Une équipe 100% gabonaise basée à Libreville, passionnée de tech et au service de sa communauté, 24 heures sur 24.' },
            { icon: 'verified',      title: 'Notre promesse', text: 'Des abonnements authentiques, une livraison en moins de 5 minutes, et un support réactif en cas de problème.' },
          ].map((b) => (
            <div key={b.icon} className="bg-white border border-[#e2e7ff] rounded-2xl p-7">
              <div className="w-12 h-12 bg-[#006b2c]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#006b2c] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-[#131b2e] mb-2">{b.title}</h3>
              <p className="text-sm text-[#3e4a3d] leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-[#f2f3ff]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#131b2e] mb-4">Une question ? Nous sommes à l'écoute.</h2>
          <p className="text-[#3e4a3d] mb-8">Notre équipe basée à Libreville est disponible 7j/7 pour vous accompagner.</p>
          <Link href={`/${locale}/help`} className="inline-flex items-center gap-2 bg-[#006b2c] hover:bg-[#00873a] text-white px-7 py-3.5 rounded-xl font-bold shadow-lg shadow-[#006b2c]/20 transition-all">
            Contacter le support
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
