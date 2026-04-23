import Link from 'next/link'
import { getLocale } from 'next-intl/server'

export const metadata = {
  title: 'Aide & Support — Akiba',
  description: 'Trouvez des réponses à vos questions et contactez notre support.',
}

const FAQ = [
  { q: "En combien de temps reçois-je mon abonnement ?",    a: "La plupart des abonnements sont livrés par email en moins de 5 minutes après confirmation du paiement. Pour certaines commandes complexes, le délai peut aller jusqu'à 30 minutes." },
  { q: "Comment puis-je payer ?",                            a: "Nous acceptons Airtel Money, Moov Money, les cartes Visa et Mastercard, ainsi que les virements bancaires pour les professionnels." },
  { q: "Les abonnements sont-ils authentiques ?",            a: "Oui, 100%. Akiba est partenaire officiel de plusieurs plateformes, et tous nos comptes sont garantis authentiques, neufs et fonctionnels." },
  { q: "Que se passe-t-il si un compte ne fonctionne pas ?", a: "Contactez notre support dans les 24h suivant la réception. Nous remplaçons ou remboursons tout compte défectueux sans frais." },
  { q: "Puis-je vendre mes propres produits ?",              a: "Oui ! Créez un compte vendeur depuis la page d'inscription et ouvrez votre boutique sur notre Marketplace local." },
]

export default async function HelpPage() {
  const locale = await getLocale()

  return (
    <div className="bg-[#faf8ff] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#006b2c] to-[#00873a] text-white py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7ffc97] mb-3 block">Centre d'aide</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Comment pouvons-nous vous aider ?</h1>
          <p className="text-lg text-[#d7fde1]">Notre équipe est disponible 7j/7.</p>
        </div>
      </section>

      {/* Contact channels */}
      <section className="py-14 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            { icon: 'forum',            title: 'WhatsApp',        desc: '+241 06 12 34 56', href: 'https://wa.me/24106123456' },
            { icon: 'alternate_email',  title: 'Email',           desc: 'support@gaboshop.ga', href: 'mailto:support@gaboshop.ga' },
            { icon: 'phone',            title: 'Téléphone',       desc: '+241 01 23 45 67', href: 'tel:+2410123456' },
          ].map((c) => (
            <a
              key={c.icon}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="bg-white border border-[#e2e7ff] rounded-2xl p-6 flex items-center gap-4 hover:border-[#006b2c] hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-[#006b2c]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#006b2c] transition-colors">
                <span className="material-symbols-outlined text-[#006b2c] group-hover:text-white transition-colors" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
              </div>
              <div>
                <div className="font-bold text-[#131b2e]">{c.title}</div>
                <div className="text-sm text-[#3e4a3d]">{c.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#131b2e] mb-8">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="bg-white border border-[#e2e7ff] rounded-2xl overflow-hidden group">
                <summary className="px-6 py-5 flex items-center justify-between cursor-pointer font-semibold text-[#131b2e] hover:bg-[#f2f3ff] transition-colors list-none">
                  <span>{item.q}</span>
                  <span className="material-symbols-outlined text-[#006b2c] group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="px-6 pb-5 text-sm text-[#3e4a3d] leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 bg-gradient-to-br from-[#006b2c] to-[#00873a] rounded-2xl p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="text-[#d7fde1] mb-5 text-sm">Contactez directement un conseiller.</p>
            <Link href={`/${locale}/about`} className="inline-flex items-center gap-2 bg-white text-[#006b2c] px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
              Parler à un conseiller
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
