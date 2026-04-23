import LegalPage from '@/components/layout/LegalPage'

export const metadata = { title: 'Politique de confidentialité — Akiba' }

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      subtitle="Comment nous collectons, utilisons et protégeons vos données."
      updated="18 avril 2026"
      sections={[
        { title: '1. Données collectées', body: [
          "Informations d'identité : nom, prénom, email, téléphone.",
          "Données de commande : produits achetés, montant, mode de paiement.",
          "Données techniques : adresse IP, type de navigateur, pages consultées.",
        ]},
        { title: '2. Finalités', body: [
          "Traiter vos commandes et livrer vos abonnements.",
          "Assurer le support client et traiter les réclamations.",
          "Vous informer de nos offres si vous y consentez (newsletter).",
          "Prévenir la fraude et assurer la sécurité de la plateforme.",
        ]},
        { title: '3. Partage des données', body: "Vos données ne sont jamais vendues. Elles peuvent être partagées uniquement avec nos prestataires techniques (hébergement, paiement) et uniquement dans la mesure nécessaire au service. Tous nos prestataires sont soumis à des obligations de confidentialité." },
        { title: '4. Conservation', body: "Les données sont conservées 5 ans après la dernière activité pour respecter nos obligations comptables. Vous pouvez demander leur suppression à tout moment." },
        { title: '5. Vos droits', body: [
          "Droit d'accès : consulter les données que nous détenons sur vous.",
          "Droit de rectification : corriger des informations erronées.",
          "Droit à l'effacement : demander la suppression de votre compte.",
          "Droit d'opposition : refuser le traitement marketing.",
        ]},
        { title: '6. Contact', body: "Pour exercer vos droits ou toute question : privacy@akiba.ga" },
      ]}
    />
  )
}
