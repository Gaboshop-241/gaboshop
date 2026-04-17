import Link from 'next/link'
import { getLocale } from 'next-intl/server'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams
  const locale = await getLocale()

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">

        {/* Success icon */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100">
          <span
            className="material-symbols-outlined text-[#006b2c]"
            style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'var(--font-manrope)' }}>
          Paiement réussi !
        </h1>
        <p className="text-slate-500 text-sm mb-2">
          Votre commande a été confirmée et est en cours de traitement.
        </p>
        {orderId && (
          <p className="text-xs text-slate-400 mb-8">
            Référence : <span className="font-mono font-medium text-slate-600">#{orderId.slice(0, 12)}</span>
          </p>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 text-left">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Prochaines étapes</h2>
          <div className="space-y-3">
            {[
              { icon: 'mail', text: 'Un email de confirmation vous a été envoyé' },
              { icon: 'inventory_2', text: 'Votre commande est en préparation' },
              { icon: 'local_shipping', text: 'Vous recevrez une notification à la livraison' },
            ].map(({ icon, text }) => (
              <div key={icon} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#006b2c]" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>
                    {icon}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/${locale}/client`}
            className="flex-1 py-3 rounded-xl bg-[#006b2c] hover:bg-[#005a24] text-white font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>dashboard</span>
            Mes commandes
          </Link>
          <Link
            href={`/${locale}/shop`}
            className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>grid_view</span>
            Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  )
}
