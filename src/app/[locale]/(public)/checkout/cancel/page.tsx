import Link from 'next/link'
import { getLocale } from 'next-intl/server'

export default async function CheckoutCancelPage() {
  const locale = await getLocale()

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">

        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span
            className="material-symbols-outlined text-slate-400"
            style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}
          >
            cancel
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'var(--font-manrope)' }}>
          Paiement annulé
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Votre paiement a été annulé. Votre panier est toujours disponible.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/${locale}/checkout`}
            className="flex-1 py-3 rounded-xl bg-[#006b2c] hover:bg-[#005a24] text-white font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_bag</span>
            Réessayer
          </Link>
          <Link
            href={`/${locale}/shop`}
            className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>grid_view</span>
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  )
}
