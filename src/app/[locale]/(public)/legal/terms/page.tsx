import LegalPage from '@/components/layout/LegalPage'

export const metadata = { title: 'Conditions Générales — Akiba' }

export default function TermsPage() {
  return (
    <LegalPage
      title="Conditions Générales d'Utilisation"
      subtitle="Les règles qui régissent votre utilisation de Akiba."
      updated="18 avril 2026"
      sections={[
        { title: '1. Objet', body: "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Akiba (ci-après « la Plateforme »). En accédant à la Plateforme, l'Utilisateur accepte sans réserve les présentes CGU." },
        { title: '2. Inscription et compte', body: "L'Utilisateur doit être âgé de 18 ans minimum. Il s'engage à fournir des informations exactes et à jour lors de son inscription. Tout compte frauduleux ou partagé pourra être suspendu sans préavis." },
        { title: '3. Commandes et livraison', body: [
          "Les abonnements digitaux sont livrés par email dans un délai de 5 à 30 minutes après confirmation du paiement.",
          "Akiba s'engage à fournir des abonnements authentiques et fonctionnels.",
          "En cas de dysfonctionnement, l'Utilisateur dispose de 24 heures pour signaler le problème au support.",
        ]},
        { title: '4. Paiement', body: "Les paiements sont effectués via Airtel Money, Moov Money, Visa ou Mastercard. Toutes les transactions sont sécurisées et chiffrées. Les prix sont affichés en FCFA, toutes taxes comprises." },
        { title: '5. Responsabilité', body: "Akiba agit comme intermédiaire entre les fournisseurs de services et les Utilisateurs. La Plateforme ne peut être tenue responsable des décisions unilatérales des plateformes tierces (blocage de compte, changement de prix, etc.)." },
        { title: '6. Propriété intellectuelle', body: "Tous les contenus de la Plateforme (logo, design, textes) sont la propriété exclusive de Akiba. Toute reproduction sans autorisation écrite est interdite." },
        { title: '7. Droit applicable', body: "Les présentes CGU sont soumises au droit gabonais. Tout litige relève de la compétence exclusive des tribunaux de Libreville." },
      ]}
    />
  )
}
