import LegalPage from '@/components/layout/LegalPage'

export const metadata = { title: 'Politique cookies — GaboShop' }

export default function CookiesPage() {
  return (
    <LegalPage
      title="Politique de cookies"
      subtitle="Les cookies utilisés sur GaboShop et comment les gérer."
      updated="18 avril 2026"
      sections={[
        { title: '1. Qu\'est-ce qu\'un cookie ?', body: "Un cookie est un petit fichier texte déposé sur votre appareil lors de votre visite sur un site. Il permet au site de mémoriser des informations (préférences, panier, session) pour améliorer votre expérience." },
        { title: '2. Cookies utilisés', body: [
          "Cookies essentiels : authentification, panier, préférences de langue. Obligatoires au fonctionnement du site.",
          "Cookies analytiques : nous aident à comprendre comment les visiteurs utilisent le site (anonymisé).",
          "Cookies marketing : uniquement avec votre consentement explicite.",
        ]},
        { title: '3. Durée de conservation', body: "Les cookies essentiels durent le temps d'une session ou jusqu'à 30 jours. Les cookies analytiques sont conservés 13 mois maximum, conformément à la réglementation." },
        { title: '4. Gérer les cookies', body: "Vous pouvez refuser les cookies non essentiels depuis le bandeau affiché à votre première visite, ou à tout moment dans les paramètres de votre navigateur. Le refus des cookies essentiels peut empêcher le bon fonctionnement du site." },
      ]}
    />
  )
}
