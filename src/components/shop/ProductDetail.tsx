'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Review {
  rating: number
  comment: string | null
  created_at: string
}

interface RelatedProduct {
  id: string
  title_fr: string
  title_en: string
  price: number
  images: string[]
  categories: { name_fr: string; name_en: string } | null
}

interface Product {
  id: string
  title_fr: string
  title_en: string
  description_fr: string | null
  description_en: string | null
  price: number
  currency: string
  images: string[]
  type: string | null
  space: 'official' | 'marketplace'
  vendor_id: string | null
  vendors?: { business_name: string; is_verified: boolean } | null
  categories?: { name_fr: string; name_en: string } | null
  reviews?: Review[]
}

type Tab = 'description' | 'details' | 'reviews'

const AVATAR_COLORS = [
  { bg: '#7ffc97', color: '#005320' },
  { bg: '#85f8c4', color: '#002114' },
  { bg: '#6ffbbe', color: '#002113' },
]

const MOCK_REVIEWS = [
  { initials: 'JD', name: 'Jean-Claude D.', rating: 5, text: '"Code reçu en moins de 5 minutes par email. La qualité est vraiment incroyable. Je recommande sans hésiter."' },
  { initials: 'MM', name: 'Mariam M.', rating: 5, text: '"Service rapide et efficace. C\'est mon troisième achat consécutif et je n\'ai jamais eu de soucis."' },
  { initials: 'PT', name: 'Patrick T.', rating: 4, text: '"Excellent rapport qualité-prix. Paiement très fluide. Le support est réactif sur WhatsApp."' },
]

function StarDisplay({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-2xl' : 'text-lg'
  return (
    <div className="flex text-amber-400">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i
        const half = !filled && rating >= i - 0.5
        return (
          <span
            key={i}
            className={`material-symbols-outlined ${cls}`}
            style={{ fontVariationSettings: filled || half ? "'FILL' 1" : "'FILL' 0" }}
          >
            {half ? 'star_half' : 'star'}
          </span>
        )
      })}
    </div>
  )
}

export default function ProductDetail({
  product,
  locale,
  relatedProducts,
}: {
  product: Product
  locale: string
  relatedProducts: RelatedProduct[]
}) {
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()
  const currentLocale = useLocale()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<Tab>('description')

  const title = locale === 'fr' ? product.title_fr : product.title_en
  const description = locale === 'fr' ? product.description_fr : product.description_en
  const categoryName = locale === 'fr' ? product.categories?.name_fr : product.categories?.name_en

  const hasRealReviews = (product.reviews?.length ?? 0) > 0
  const avgRating = hasRealReviews
    ? product.reviews!.reduce((s, r) => s + r.rating, 0) / product.reviews!.length
    : 4.8
  const reviewCount = hasRealReviews ? product.reviews!.length : 128

  const images = product.images.length > 0 ? product.images : []
  const mainImage = images[selectedImage] ?? null
  const thumbnails = images.slice(0, 4)

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        productId: product.id,
        title,
        price: product.price,
        currency: product.currency,
        image: images[0] ?? null,
        space: product.space,
        vendorId: product.vendor_id,
      })
    }
    toast.success(`${title} ajouté au panier`)
  }

  function handleBuyNow() {
    handleAddToCart()
    router.push(`/${currentLocale}/checkout`)
  }

  return (
    <div className="pb-28 md:pb-10 max-w-7xl mx-auto px-4 md:px-8 pt-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-sm text-[#3e4a3d] font-medium flex-wrap">
        <Link href={`/${currentLocale}`} className="hover:text-[#006b2c] transition-colors">Accueil</Link>
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
        <Link href={`/${currentLocale}/shop`} className="hover:text-[#006b2c] transition-colors">Boutique</Link>
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
        <span className="text-[#131b2e] line-clamp-1">{title}</span>
      </nav>

      {/* Main product section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px] gap-12 items-start">

        {/* Left: Gallery */}
        <div className="space-y-6">
          <div className="aspect-square bg-white rounded-xl overflow-hidden group border border-[#bdcaba]/10">
            {mainImage ? (
              <img
                src={mainImage}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-[#eaedff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#006b2c]" style={{ fontSize: '96px' }}>inventory_2</span>
              </div>
            )}
          </div>

          {thumbnails.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {thumbnails.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? 'border-[#006b2c] ring-2 ring-[#006b2c]/10'
                      : 'border-[#bdcaba]/10 hover:border-[#006b2c]/50'
                  }`}
                >
                  <img src={img} alt={`${title} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product info (sticky) */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-28">

          <div className="space-y-4">
            {categoryName && (
              <span className="inline-flex items-center px-3 py-1 bg-[#82f5c1] text-[#00714e] text-xs font-semibold rounded-full uppercase tracking-wider">
                {categoryName}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#131b2e]">{title}</h1>

            <div className="flex items-center gap-3 py-1 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f3ff] rounded-lg">
                <span className="w-2 h-2 bg-[#006b2c] rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-[#131b2e]">Akiba Officiel</span>
                <span
                  className="material-symbols-outlined text-[#006b2c] text-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <div className="flex items-center gap-1">
                <StarDisplay rating={avgRating} />
                <span className="text-sm text-[#3e4a3d] font-medium ml-1">({reviewCount} avis)</span>
              </div>
            </div>

            <div className="flex items-end gap-3 pt-4">
              <span className="text-4xl font-extrabold text-[#006b2c] tracking-tighter">
                {product.price.toLocaleString()} FCFA
              </span>
            </div>
          </div>

          {/* Delivery info box */}
          <div className="bg-[#82f5c1]/20 border border-[#82f5c1]/30 p-5 rounded-xl space-y-4">
            {[
              { icon: 'mail', title: 'Livraison instantanée par email', sub: 'Code envoyé sur votre boîte de réception' },
              { icon: 'schedule', title: 'Accès dans les 10 minutes', sub: "Temps d'activation moyen constaté" },
              { icon: 'support_agent', title: 'Support 7j/7', sub: 'Une assistance dédiée à vos côtés' },
            ].map((item) => (
              <div key={item.icon} className="flex items-start gap-4">
                <span className="material-symbols-outlined text-[#006b2c] bg-white p-2 rounded-lg shadow-sm flex-shrink-0">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#131b2e]">{item.title}</p>
                  <p className="text-xs text-[#3e4a3d]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quantity + CTA */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-[#f2f3ff] rounded-xl border border-[#bdcaba]/10">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-[#e2e7ff] transition-colors rounded-l-xl"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="w-12 text-center font-bold text-[#131b2e]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-[#e2e7ff] transition-colors rounded-r-xl"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-br from-[#006b2c] to-[#00873a] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#006b2c]/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Ajouter au panier
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              className="w-full bg-transparent border-2 border-[#006b2c] text-[#006b2c] font-bold py-4 rounded-xl hover:bg-[#006b2c]/5 transition-colors"
            >
              Acheter maintenant
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[#3e4a3d] py-2">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock</span>
            <p className="text-xs font-medium">
              Paiement 100% sécurisé via{' '}
              <span className="font-bold text-[#131b2e]">Chariow</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <section className="mt-20 border-t border-[#bdcaba]/20 pt-10">
        <div className="flex gap-10 border-b border-[#bdcaba]/10 mb-8 overflow-x-auto whitespace-nowrap">
          {(
            [
              { key: 'description', label: 'Description' },
              { key: 'details', label: 'Détails' },
              { key: 'reviews', label: `Avis (${reviewCount})` },
            ] as { key: Tab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 text-sm px-2 transition-all ${
                activeTab === tab.key
                  ? 'font-bold text-[#006b2c] border-b-2 border-[#006b2c]'
                  : 'font-semibold text-[#3e4a3d] hover:text-[#131b2e]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Description tab */}
        {activeTab === 'description' && (
          <div className="max-w-3xl space-y-6 text-[#3e4a3d] leading-relaxed">
            <p className="text-[#131b2e] font-semibold text-lg">{title}</p>
            {description && <p>{description}</p>}
            <ul className="space-y-4 pt-4">
              {[
                { bold: 'Qualité garantie :', text: 'Tous nos produits sont testés et vérifiés avant livraison.' },
                { bold: 'Accès immédiat :', text: 'Recevez vos codes et accès par email en quelques minutes.' },
                { bold: 'Multi-appareils :', text: 'Utilisez votre abonnement sur tous vos appareils compatibles.' },
                { bold: 'Support dédié :', text: 'Notre équipe est disponible 7j/7 pour vous accompagner.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined text-[#006b2c] flex-shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span>
                    <strong className="text-[#131b2e]">{item.bold}</strong> {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Details tab */}
        {activeTab === 'details' && (
          <div className="max-w-3xl">
            {[
              { label: 'Catégorie', value: categoryName ?? '—' },
              { label: 'Type', value: product.type ?? 'Produit digital' },
              { label: 'Devise', value: product.currency ?? 'FCFA' },
              { label: 'Espace', value: product.space === 'official' ? 'Boutique Officielle' : 'Marketplace' },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-4 py-3 border-b border-[#bdcaba]/10">
                <span className="text-sm text-[#3e4a3d] w-32 font-medium flex-shrink-0">{row.label}</span>
                <span className="text-sm text-[#131b2e] font-semibold">{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#131b2e] mb-2">Avis clients</h2>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-extrabold text-[#131b2e]">
                    {avgRating.toFixed(1)}
                  </span>
                  <div>
                    <StarDisplay rating={avgRating} size="lg" />
                    <p className="text-xs text-[#3e4a3d] font-medium">Basé sur {reviewCount} avis</p>
                  </div>
                </div>
              </div>
              <button className="hidden md:block text-[#006b2c] font-bold text-sm border border-[#006b2c] px-6 py-2.5 rounded-xl hover:bg-[#006b2c]/5 transition-all">
                Donner mon avis
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hasRealReviews
                ? product.reviews!.slice(0, 3).map((review, i) => (
                    <div key={i} className="bg-[#f2f3ff] p-6 rounded-2xl border border-[#bdcaba]/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                          style={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                        >
                          <span className="material-symbols-outlined text-base">person</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#131b2e]">Client vérifié</p>
                          <StarDisplay rating={review.rating} size="sm" />
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-[#3e4a3d] leading-relaxed italic">&quot;{review.comment}&quot;</p>
                      )}
                    </div>
                  ))
                : MOCK_REVIEWS.map((mock, i) => (
                    <div key={i} className="bg-[#f2f3ff] p-6 rounded-2xl border border-[#bdcaba]/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                          style={AVATAR_COLORS[i]}
                        >
                          {mock.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#131b2e]">{mock.name}</p>
                          <StarDisplay rating={mock.rating} size="sm" />
                        </div>
                      </div>
                      <p className="text-sm text-[#3e4a3d] leading-relaxed italic">{mock.text}</p>
                    </div>
                  ))}
            </div>
          </div>
        )}
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl font-bold text-[#131b2e] mb-8">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map((p) => {
              const pTitle = locale === 'fr' ? p.title_fr : p.title_en
              const pCategory = locale === 'fr' ? p.categories?.name_fr : p.categories?.name_en
              return (
                <Link key={p.id} href={`/${currentLocale}/shop/${p.id}`} className="group">
                  <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden mb-4 relative group-hover:bg-[#e2e7ff] transition-colors shadow-sm">
                    {p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt={pTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#eaedff] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#006b2c] text-5xl">inventory_2</span>
                      </div>
                    )}
                    {pCategory && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight shadow-sm">
                        {pCategory}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-[#131b2e] text-sm mb-1 line-clamp-1">{pTitle}</h3>
                  <p className="text-[#006b2c] font-extrabold text-sm">{p.price.toLocaleString()} FCFA</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
