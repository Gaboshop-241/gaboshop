import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-1 mb-3">
              <span className="text-xl font-bold text-primary">Gabo</span>
              <span className="text-xl font-bold">Shop</span>
            </div>
            <p className="text-sm text-muted-foreground">
              La marketplace numérique du Gabon. Produits et services livrés instantanément.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Boutique</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/fr/shop" className="hover:text-foreground">Boutique officielle</Link></li>
              <li><Link href="/fr/marketplace" className="hover:text-foreground">Marketplace</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Revendeurs</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/fr/auth/register?vendor=1" className="hover:text-foreground">Devenir revendeur</Link></li>
              <li><Link href="/fr/vendor" className="hover:text-foreground">Espace vendeur</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/fr/client/support" className="hover:text-foreground">Centre d&apos;aide</Link></li>
              <li><a href="mailto:support@gaboshop.ga" className="hover:text-foreground">support@gaboshop.ga</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-muted-foreground">© {year} GaboShop. Tous droits réservés.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/fr/legal/privacy" className="hover:text-foreground">Confidentialité</Link>
            <Link href="/fr/legal/terms" className="hover:text-foreground">CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
