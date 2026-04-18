import LegalPage from '@/components/layout/LegalPage'

export const metadata = { title: 'Politique de retour — GaboShop' }

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Politique de retour & remboursement"
      subtitle="Vos droits en cas de problème avec une commande."
      updated="18 avril 2026"
      sections={[
        { title: '1. Délai de réclamation', body: "En raison de la nature digitale de nos produits (abonnements livrés par email), toute réclamation doit être effectuée dans un délai de 24 heures suivant la réception." },
        { title: '2. Cas éligibles au remboursement', body: [
          "Abonnement non reçu dans les 30 minutes suivant le paiement.",
          "Identifiants fournis non fonctionnels lors de la première connexion.",
          "Compte bloqué par la plateforme dans les 48 heures suivant la livraison (hors faute de l'Utilisateur).",
          "Erreur manifeste sur la commande (ex : mauvais produit livré).",
        ]},
        { title: '3. Cas non éligibles', body: [
          "Partage des identifiants avec des tiers.",
          "Utilisation abusive ou non-conforme aux conditions de la plateforme tierce.",
          "Changement d'avis après livraison réussie (nature digitale du produit).",
          "Blocage du compte au-delà de 48h suivant la livraison.",
        ]},
        { title: '4. Procédure', body: "Contactez notre support à support@gaboshop.ga ou via WhatsApp en précisant votre numéro de commande et la nature du problème. Une réponse vous sera apportée sous 4 heures ouvrées." },
        { title: '5. Modalités de remboursement', body: "En cas d'acceptation, le remboursement est effectué sous 72 heures via le même moyen de paiement utilisé lors de la commande (Airtel Money, Moov Money, carte). Aucun frais de gestion n'est prélevé." },
        { title: '6. Remplacement', body: "GaboShop peut, au choix de l'Utilisateur, remplacer un produit défectueux plutôt que procéder à un remboursement. Le remplacement est généralement effectué sous 15 minutes." },
      ]}
    />
  )
}
