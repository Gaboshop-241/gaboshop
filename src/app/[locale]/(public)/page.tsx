import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

async function getFeaturedProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, title_fr, title_en, price, currency, images, space, vendor_id, categories(id, name_fr, name_en, slug)')
    .eq('is_active', true)
    .limit(3)
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function HomePage() {
  const [locale, products] = await Promise.all([
    getLocale(),
    getFeaturedProducts(),
  ])

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] selection:bg-[#7ffc97] selection:text-[#002109]">

      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#16a34a] to-[#00873a] text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-8 relative z-10 flex flex-col lg:flex-row items-center">
          {/* Left */}
          <div className="w-full lg:w-3/5">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              La marketplace <br />du Gabon
            </h1>
            <p className="text-xl lg:text-2xl text-[#62df7d] mb-10 max-w-xl font-medium">
              Abonnements, services digitaux et revendeurs locaux réunis sur une seule plateforme sécurisée.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/shop`}
                className="bg-white text-[#006b2c] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#f2f3ff] transition-all duration-300 shadow-xl shadow-[#00873a]/20"
              >
                Découvrir la boutique
              </Link>
              <Link
                href={`/${locale}/marketplace`}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Accéder au marketplace
              </Link>
            </div>
          </div>

          {/* Decorative blob */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none opacity-20">
            <svg className="w-full h-full scale-125" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.1,-71.4C55.4,-64.1,67.6,-53.4,76.5,-40.3C85.5,-27.2,91.3,-11.6,89.5,3.1C87.6,17.7,78.2,31.4,67.4,43.2C56.6,55.1,44.4,65,30.7,71.4C16.9,77.7,1.5,80.5,-14.8,79C-31,77.5,-48,71.8,-61.1,61.1C-74.2,50.3,-83.4,34.5,-87,17.7C-90.7,0.9,-88.9,-17,-81.1,-32.5C-73.4,-47.9,-59.8,-61,-44.6,-67.5C-29.3,-74.1,-14.7,-74.2,0.4,-74.8C15.4,-75.4,30.8,-76.5,42.1,-71.4Z" fill="currentColor" transform="translate(250 250)" />
            </svg>
          </div>

          {/* Right images */}
          <div className="hidden lg:block w-2/5 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl rotate-3 bg-white p-2">
              <img
                alt="GaboShop Lifestyle"
                className="w-full h-full object-cover rounded-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFEpEg13C6v8T79GywuDFy4Bj_Q8E4zKIqSR_LW6nstP5gNDOMVnzImqsgQPJvlrfOOFw3UuSXWN8SAAqRUc2AzlD0iIy5qa8HOJB1ZB9M595hWzkUbdrkqfSvmLRryjBk_1bC039pUZ8uaiSdTDZXUXGbKrvEi3wvbh0oYLBGm0kuhrt3EAimYyQkXRyiVEfnkVyLx_FW8hfccS19ci5hOrb7L5powj-NHzJYAv7-ENfWulWSiQZRfeu4gCdJIKN9PVMXnAIbFd0h"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 aspect-square w-48 rounded-3xl overflow-hidden shadow-2xl -rotate-6 border-4 border-white bg-[#e2e7ff]">
              <img
                alt="Shopping local"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcOEwKjThkSMFgcCj-zn7Kxp5MvixKnZ7lA66ChMr7V1bo0fWQ1G7iz14GgFjrAf27XSKSYsMqDrfmvK9wOwWWGeEi76CLEEINmfdihWV2iy_uHg0p2sjAsbHH7kBoq9QfiXyALdzH7yh6jOFImUzT-X883wo9M8U96WRDZC6i5ME92ozOLFrI7MvNB7RddyBGA_vc9-iV51NAIpUu6hgfRLUgHI3mMisNamoYZwv5w1KI1Be-1nM7umgBmIlegzgdDelxSYN62PXn"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TWO SPACES */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Boutique Officielle */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-[#006b2c] p-10 flex flex-col justify-between min-h-[400px] transition-all hover:scale-[1.02] duration-300">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-[#00873a] rounded-full opacity-30 group-hover:scale-110 transition-transform" />
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Boutique Officielle</h2>
              <p className="text-[#7ffc97] max-w-xs font-medium opacity-90">
                Produits certifiés, abonnements IPTV, licences logicielles et garanties exclusives GaboShop.
              </p>
            </div>
            <Link
              href={`/${locale}/shop`}
              className="relative mt-8 w-fit bg-white text-[#006b2c] px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
            >
              Voir les exclusivités
            </Link>
          </div>

          {/* Marketplace Local */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-[#283044] p-10 flex flex-col justify-between min-h-[400px] transition-all hover:scale-[1.02] duration-300">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-slate-700 rounded-full opacity-30 group-hover:scale-110 transition-transform" />
            <div className="relative">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-[#82f5c1] text-4xl">groups</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Marketplace Local</h2>
              <p className="text-slate-400 max-w-xs font-medium">
                Achetez et vendez en toute sécurité avec nos partenaires locaux à travers tout le Gabon.
              </p>
            </div>
            <Link
              href={`/${locale}/marketplace`}
              className="relative mt-8 w-fit border-2 border-slate-600 text-white px-8 py-3 rounded-full font-bold hover:bg-white/5 transition-all"
            >
              Explorer le marché
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-[#f2f3ff]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[#006b2c] font-bold tracking-widest text-xs uppercase mb-2 block">Tendances actuelles</span>
              <h2 className="text-4xl font-extrabold text-[#131b2e]">Produits populaires</h2>
            </div>
            <Link href={`/${locale}/shop`} className="text-[#006b2c] font-semibold flex items-center gap-2 group">
              Voir tout{' '}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[20px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((p) => (
                <ProductCard key={p.id} product={p as any} locale={locale} />
              ))
            ) : (
              <>
                <StaticProductCard
                  img="https://lh3.googleusercontent.com/aida-public/AB6AXuBMZNelW-r-as5bzeSnefM7SMdc9BksfhaOBKXP2tmbZjxZJgxYomzcWE21QAWwGOiiGuCarlSmqeudxkg-kT4f7lVocNY33LVjmviJZ9p3O12e3leMRBnZW-2d0cO_ddScPvGdY3IiVt6mUct3VIYs3ArWT2WZs_VZSscsYdNMD-RhL0C-r5AL5mzN-gr8OaR6vsYLTKSdDp818TSn2ORp3ktgJhDFXUEBDEGy2AJrFuC781X2J7nDVKBVnKFnDwNJPrWnz4k5NoBi"
                  badge="Officiel"
                  seller="GaboShop Digital"
                  title="Pack Divertissement Plus (12 mois)"
                  stars={5}
                  reviews={48}
                  price="45,000 FCFA"
                  href={`/${locale}/shop`}
                />
                <StaticProductCard
                  img="https://lh3.googleusercontent.com/aida-public/AB6AXuCsawceMlU__3CcNeObzdd-UyuXXiZzVZDmFXJIvbgtv_9R2Isn9uqDjlTNwUtbnhg1_0d5ZV_PKNExDotwXZRblKmwlCQTwBJp0iyX8YGz2_dk9tW4n7so07-8XEUtm8e29gycOnYLNjdyteB2wuEn0A7NCDjweRNai7BOMrMH9MWkh1E7whafdiKANIxScpCB5hRSbJOumIdCfJ445-LfTMDx5KERyykbu3h8Zhd1yG5RS6TMG2Xjfi7yfj8fgdAxTvpcOm9F15I4"
                  seller="Boutique Libreville"
                  title='Laptop Air 13" - 8GB RAM 256GB'
                  stars={4}
                  reviews={12}
                  price="320,000 FCFA"
                  href={`/${locale}/shop`}
                />
                <StaticProductCard
                  img="https://lh3.googleusercontent.com/aida-public/AB6AXuAWpcLSoSa-VqqKaKfajZEavgsEunrsAGrseCBdGW46P3vlLpmS8FU8UaMiO3hcoNwlxNziyZ5ENq0n5SYGE9GlnlilFGQnObBOCXFsqCYM7mh-HfdwqE8dpc1bCNBIrRqhJA_2YczijbJ1MH6LRyj14S3AUJ1Y6hm7IvxWRDWNoUZbpKsCOunpYQ1UiJJllFmz33i5z6dn4rB42dgpSETw1oBfcl6-XntFRmf-rFhrPnjs1_Mcl8r0mDbxB0QET9v3x-euezlW4_dL"
                  badge="Digital"
                  seller="GaboShop Software"
                  title="Antivirus Total Protection (2 Postes)"
                  stars={5}
                  reviews={124}
                  price="15,500 FCFA"
                  href={`/${locale}/shop`}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* PAYMENT TRUST BANNER */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto bg-[#283044] rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(0,107,44,0.1),_transparent,_transparent)] pointer-events-none" />

          <div className="w-full md:w-1/2 relative z-10 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Payez en toute sécurité avec Airtel Money &amp; Moov Money
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto md:mx-0">
              Le premier écosystème de commerce digital au Gabon intégrant nativement les paiements locaux pour une expérience sans friction.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4">
                <span className="material-symbols-outlined text-[#7ffc97] text-3xl">verified_user</span>
                <div className="text-left">
                  <div className="text-white font-bold">Sécurité 100%</div>
                  <div className="text-slate-500 text-xs">Paiements cryptés</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4">
                <span className="material-symbols-outlined text-[#7ffc97] text-3xl">local_shipping</span>
                <div className="text-left">
                  <div className="text-white font-bold">Livraison Rapide</div>
                  <div className="text-slate-500 text-xs">Partout au Gabon</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="relative z-10 mx-auto w-64 md:w-80 aspect-[9/19] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden">
              <img
                alt="Mobile App"
                className="w-full h-full object-cover opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPu6TD8HCR6pvdrIAsaZcjkm5BRh39SAiK7U75yoZTXB0Vj4FXmzk7TH4i15Wj2xPnjz3mKhb1jpTM6y5FsE_SNs4OCzgUjGjfvE1X2dBD0W2JOJcPGsQJAw76H8FdHV2TlOd_luEmQrK6vTK1WVJ-DnDUkCH4fAoAvwxwTUC8nXwYFbwGXuT0eHuKqGj10UwFVKinWlviw-AB5BX_rkaH-kMycs8efXA34mW2Y9Grc22i2E0uWu1xPMU9ptFcn2pJ-ygrlD1XOVMs"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-0 w-full px-6 text-center">
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                <div className="text-white text-sm font-bold">Transaction Réussie</div>
              </div>
            </div>
            <div className="absolute top-1/4 -left-12 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7ffc97] rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[#006b2c]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <div>
                <div className="text-[#131b2e] font-bold text-sm">Paiement reçu</div>
                <div className="text-[#3e4a3d] text-[10px]">Airtel Money Gabon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

function Stars({ count, total = 5 }: { count: number; total?: number }) {
  return (
    <>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-sm ${i < count ? 'text-amber-500' : 'text-slate-300'}`}
          style={i < count ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          star
        </span>
      ))}
    </>
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
    images: string[]
    space: string
    categories: { name_fr: string; name_en: string } | null
  }
  locale: string
}) {
  const title = locale === 'fr' ? product.title_fr : product.title_en
  const href = `/${locale}/${product.space === 'official' ? 'shop' : 'marketplace'}/${product.id}`

  return (
    <div className="bg-white rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-[#eaedff] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#006b2c] text-6xl">inventory_2</span>
          </div>
        )}
        {product.space === 'official' && (
          <div className="absolute top-4 left-4 bg-[#82f5c1] text-[#00714e] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Officiel
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#3e4a3d] text-xs font-medium">GaboShop</span>
          <span className="material-symbols-outlined text-[#006b2c] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        </div>
        <Link href={href}>
          <h3 className="text-xl font-bold mb-2 group-hover:text-[#006b2c] transition-colors">{title}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-4">
          <Stars count={5} />
          <span className="text-xs text-[#3e4a3d] ml-1">(--)</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-[#006b2c]">{product.price.toLocaleString()} FCFA</span>
          <Link href={href} className="bg-[#e2e7ff] p-3 rounded-xl hover:bg-[#006b2c] hover:text-white transition-all">
            <span className="material-symbols-outlined">add_shopping_cart</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StaticProductCard({
  img,
  badge,
  seller,
  title,
  stars,
  reviews,
  price,
  href,
}: {
  img: string
  badge?: string
  seller: string
  title: string
  stars: number
  reviews: number
  price: string
  href: string
}) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {badge && (
          <div className="absolute top-4 left-4 bg-[#82f5c1] text-[#00714e] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {badge}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#3e4a3d] text-xs font-medium">{seller}</span>
          <span className="material-symbols-outlined text-[#006b2c] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-[#006b2c] transition-colors">{title}</h3>
        <div className="flex items-center gap-1 mb-4">
          <Stars count={stars} />
          <span className="text-xs text-[#3e4a3d] ml-1">({reviews})</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-[#006b2c]">{price}</span>
          <Link href={href} className="bg-[#e2e7ff] p-3 rounded-xl hover:bg-[#006b2c] hover:text-white transition-all">
            <span className="material-symbols-outlined">add_shopping_cart</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
