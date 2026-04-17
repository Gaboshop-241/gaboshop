import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#283044] text-slate-400">
      <div className="w-full py-12 px-8 grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">

        {/* Col 1: Brand */}
        <div className="col-span-1">
          <Link href="/fr" className="text-xl font-bold text-white mb-6 block">GaboShop</Link>
          <p className="text-sm leading-relaxed mb-6">
            La solution de confiance pour vos achats digitaux et physiques au Gabon. Sécurité, rapidité et proximité.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#006b2c] transition-colors"
            >
              <span className="material-symbols-outlined text-white text-xl">social_leaderboard</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#006b2c] transition-colors"
            >
              <span className="material-symbols-outlined text-white text-xl">alternate_email</span>
            </a>
          </div>
        </div>

        {/* Col 2: Explorer */}
        <div>
          <h4 className="text-white font-bold mb-6">Explorer</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/fr/shop" className="hover:text-white transition-all">Boutique Officielle</Link></li>
            <li><Link href="/fr/marketplace" className="hover:text-white transition-all">Marketplace Local</Link></li>
            <li><Link href="/fr/shop?category=iptv" className="hover:text-white transition-all">Abonnements IPTV</Link></li>
            <li><Link href="/fr/auth/register?vendor=1" className="hover:text-white transition-all">Vendre sur GaboShop</Link></li>
          </ul>
        </div>

        {/* Col 3: Assistance */}
        <div>
          <h4 className="text-white font-bold mb-6">Assistance</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/fr/about" className="hover:text-white transition-all">À propos</Link></li>
            <li><Link href="/fr/legal/terms" className="hover:text-white transition-all">Conditions</Link></li>
            <li><Link href="/fr/help" className="hover:text-white transition-all">Aide &amp; Support</Link></li>
            <li><Link href="/fr/legal/returns" className="hover:text-white transition-all">Politique de retour</Link></li>
          </ul>
        </div>

        {/* Col 4: Payment + Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-6">Modes de paiement</h4>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="h-10 w-16 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
              <span className="text-[10px] font-bold text-white">AIRTEL</span>
            </div>
            <div className="h-10 w-16 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
              <span className="text-[10px] font-bold text-white">MOOV</span>
            </div>
            <div className="h-10 w-16 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
              <span className="material-symbols-outlined text-white text-xl">payments</span>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl">
            <p className="text-xs text-slate-500 mb-3">Inscrivez-vous à la newsletter</p>
            <div className="flex">
              <input
                type="email"
                className="bg-transparent border border-slate-700 rounded-l-xl text-xs w-full px-3 py-2 focus:ring-[#006b2c] focus:border-[#006b2c] focus:outline-none text-white placeholder:text-slate-500"
                placeholder="Email"
              />
              <button className="bg-[#006b2c] text-white p-2 rounded-r-xl hover:bg-[#00873a] transition-colors">
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-8 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs">© 2024 GaboShop. Tous droits réservés.</p>
        <div className="flex gap-6 text-xs font-medium">
          <Link href="/fr/legal/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
          <Link href="/fr/legal/cookies" className="hover:text-white transition-colors">Cookies</Link>
          <Link href="/fr/legal/mentions" className="hover:text-white transition-colors">Mentions Légales</Link>
        </div>
      </div>
    </footer>
  )
}
