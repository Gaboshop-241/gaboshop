import LegalPage from '@/components/layout/LegalPage'

export const metadata = { title: 'Mentions légales — GaboShop' }

export default function MentionsPage() {
  return (
    <LegalPage
      title="Mentions légales"
      subtitle="Informations légales relatives à l'éditeur du site."
      updated="18 avril 2026"
      sections={[
        { title: 'Éditeur', body: "GaboShop SARL\nCapital social : 1 000 000 FCFA\nRCCM : GA-LBV-01-2025-B12-00123\nNIF : 12345678Z\nSiège social : Libreville, Gabon" },
        { title: 'Directeur de publication', body: "Le directeur de publication est le gérant de la société GaboShop SARL." },
        { title: 'Hébergeur', body: "Vercel Inc.\n340 S Lemon Ave #4133\nWalnut, CA 91789, USA\nhttps://vercel.com" },
        { title: 'Contact', body: "Email : contact@gaboshop.ga\nTéléphone : +241 01 23 45 67\nWhatsApp : +241 06 12 34 56" },
        { title: 'Propriété intellectuelle', body: "L'ensemble du contenu du site (textes, logos, graphismes, photos) est la propriété exclusive de GaboShop. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable." },
      ]}
    />
  )
}
