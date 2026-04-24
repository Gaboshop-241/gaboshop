# AKIBASTORE — Design System & Specification

Document technique de design, destiné aux développeurs front-end pour
reproduire l'interface d'AKIBASTORE à l'identique.

**Positionnement** : plateforme gabonaise de vente de services numériques
(abonnements streaming, logiciels, gaming, formations) — marketplace à deux
faces (officiel + revendeurs locaux). Ton : **premium, minimaliste, technologique,
rassurant**. Références visuelles : Stripe (espacement, typographie),
Apple (clarté, luxe calme), Shopify (composants e-commerce, trust signals).

---

## 1. Identité visuelle

### 1.1 Palette de couleurs

| Rôle                 | Nom           | Hex       | Usage                                              |
|----------------------|---------------|-----------|----------------------------------------------------|
| **Brand**            | Akiba Green   | `#16A34A` | CTA principaux, liens actifs, indicateurs succès, prix |
| **Brand Dark**       | Deep Black    | `#0B0F0C` | Hero section, footer, texte primaire sur fond clair |
| **Surface Neutral**  | Light Grey    | `#F5F5F5` | Fond inputs, cards secondaires, barre de confiance |
| **Surface Base**     | Pure White    | `#FFFFFF` | Fond principal, cards primaires                   |
| **Text Primary**     | Ink           | `#0B0F0C` | Titres, labels, corps                             |
| **Text Secondary**   | Slate         | `#6B7280` | Sous-titres, descriptions, placeholders           |
| **Text Muted**       | Ash           | `#9CA3AF` | Helpers, timestamps, prix barrés                  |
| **Border**           | Hairline      | `#E5E7EB` | Séparateurs, bordures d'inputs au repos           |
| **Border Strong**    | Slate Edge    | `#D1D5DB` | Bordures actives, diviseurs importants            |
| **Green Tint**       | Green/10      | `#DCFCE7` | Fonds d'icônes catégorie, highlight doux         |
| **Green Deep**       | Green/Press   | `#15803D` | État `active` (press) des CTA verts               |

**Couleurs sémantiques**

| Rôle     | Hex       | Fond tinté | Usage                                      |
|----------|-----------|------------|--------------------------------------------|
| Success  | `#16A34A` | `#DCFCE7`  | Commande confirmée, vérification OK        |
| Warning  | `#F59E0B` | `#FEF3C7`  | Paiement en attente, stock limité          |
| Danger   | `#EF4444` | `#FEE2E2`  | Erreurs formulaires, badge réduction       |
| Info     | `#2563EB` | `#DBEAFE`  | Notifications, bandeaux informatifs        |

**Accent tricolore Gabon** (réservé au logo, carte du pays, ruban drapeau) :
vert `#16A34A`, jaune `#FACC15`, bleu `#2563EB`.

### 1.2 Typographie

| Usage                | Font        | Poids      | Tracking    |
|----------------------|-------------|------------|-------------|
| Titres (H1–H3)       | **Manrope** | 700 / 800  | -0.02em     |
| Sous-titres (H4–H6)  | **Manrope** | 600 / 700  | -0.01em     |
| Corps de texte       | **Inter**   | 400 / 500  | 0           |
| Label / UI           | **Inter**   | 500 / 600  | 0           |
| Code / monospace     | JetBrains Mono | 400     | 0           |

**Échelle typographique** (desktop) :

| Token   | Taille | Line-height | Exemple                           |
|---------|--------|-------------|-----------------------------------|
| `display`| 60px  | 1.05        | Hero H1 : "Accédez aux meilleurs services" |
| `h1`    | 48px   | 1.1         | Page hero, headline                |
| `h2`    | 32px   | 1.2         | Titres de section ("Nos catégories") |
| `h3`    | 24px   | 1.3         | Titres de cartes, sous-sections    |
| `h4`    | 20px   | 1.4         | Sous-titres de composants          |
| `body-lg` | 18px | 1.6         | Introductions, sous-titres hero    |
| `body`  | 16px   | 1.6         | Corps principal                    |
| `body-sm` | 14px | 1.5         | Descriptions de cartes, méta-infos |
| `caption` | 12px | 1.4         | Badges, timestamps, légendes       |
| `micro` | 10px   | 1.4         | Tracking wide, ALL-CAPS labels     |

**Sur mobile** : multiplier les tailles ≥ 24px par 0.8 (ex. `display` 60 → 48,
`h2` 32 → 26).

### 1.3 Espacement

Système en multiples de **4px**. Tokens `spacing-0` à `spacing-32` :

| Token | Valeur | Usage typique                          |
|-------|--------|----------------------------------------|
| 1     | 4px    | Espacement intra-icône                 |
| 2     | 8px    | Petit gap (badge, input padding-y)     |
| 3     | 12px   | Gap standard entre labels et inputs    |
| 4     | 16px   | Padding carte, gap grid mobile         |
| 5     | 20px   | Padding carte large, gap desktop       |
| 6     | 24px   | Section padding bloc, gap colonnes     |
| 8     | 32px   | Inter-section mobile                   |
| 12    | 48px   | Inter-section desktop                  |
| 16    | 64px   | Padding hero vertical                  |
| 20    | 80px   | Padding latéral desktop, inter-grande-section |
| 32    | 128px  | Aération maximum                       |

### 1.4 Rayons

| Token         | Valeur | Usage                                  |
|---------------|--------|----------------------------------------|
| `radius-sm`   | 8px    | Badges, petits boutons, chips          |
| `radius`      | 12px   | Inputs, cards secondaires, petites cards |
| `radius-md`   | 16px   | Cards produits, cards catégories       |
| `radius-lg`   | 20px   | Modales, panneaux hero, sections       |
| `radius-xl`   | 28px   | Conteneur hero principal               |
| `radius-full` | 9999px | Boutons pill, avatars, badges pastilles |

### 1.5 Ombres

| Token      | Valeur                                     | Usage                          |
|------------|--------------------------------------------|--------------------------------|
| `shadow-xs`| `0 1px 2px rgba(0,0,0,0.04)`              | Inputs au repos                |
| `shadow-sm`| `0 2px 8px rgba(0,0,0,0.04)`              | Cards au repos                 |
| `shadow-md`| `0 8px 24px rgba(0,0,0,0.06)`             | Cards survolées, dropdowns     |
| `shadow-lg`| `0 16px 40px rgba(0,0,0,0.08)`            | Modales, pop-overs             |
| `shadow-xl`| `0 30px 80px -10px rgba(0,0,0,0.25)`      | Hero container sombre          |
| `shadow-brand` | `0 10px 30px -5px rgba(22,163,74,0.4)` | Bouton CTA principal           |

### 1.6 Transitions & motion

| Token           | Durée  | Easing                              |
|-----------------|--------|-------------------------------------|
| `transition-fast` | 120ms | `cubic-bezier(0.4, 0, 0.2, 1)`      |
| `transition`    | 200ms  | `cubic-bezier(0.4, 0, 0.2, 1)`      |
| `transition-slow` | 400ms | `cubic-bezier(0.16, 1, 0.3, 1)`     |

**Règles** : hover n'applique qu'une transition de 200ms max. Scale max +3%
pour éviter l'effet "bond". Aucune animation supérieure à 500ms. Prefers-reduced-motion respecté (tout ramené à 0ms).

---

## 2. Layout & grille

### 2.1 Breakpoints

| Nom      | Min-width | Usage                               |
|----------|-----------|-------------------------------------|
| `sm`     | 640px     | Grandes phones / petites tablettes  |
| `md`     | 768px     | Tablette portrait                   |
| `lg`     | 1024px    | Tablette paysage / petit laptop     |
| `xl`     | 1280px    | Desktop standard (baseline design)  |
| `2xl`    | 1536px    | Large desktop                       |

### 2.2 Container

* **Largeur max** : `1280px`
* **Gutter latéral** : `24px` mobile → `48px` desktop (`lg:px-12`)
* **Grid** : 12 colonnes, `gap-6` (24px) par défaut, `gap-8` (32px) sur les sections héro

### 2.3 Z-index

| Layer      | Valeur |
|------------|--------|
| Base       | 0      |
| Dropdowns  | 10     |
| Sticky nav | 50     |
| Modal backdrop | 80 |
| Modal      | 90     |
| Toast      | 100    |

---

## 3. Composants UI

### 3.1 Boutons

**Primary** — action principale, CTA (max 1 par écran visible)

* Fond : `#16A34A` → hover `#15803D` → active scale 0.98
* Texte : `#FFFFFF`, font-weight 600, taille `body` (16px)
* Padding : `12px 24px`, `radius-full` (pill)
* Ombre : `shadow-brand`
* Icône optionnelle : 18px à gauche, gap 8px. Pour le CTA hero, icône droite dans un cercle blanc/20 : flèche →.

**Secondary** — actions alternatives

* Fond : `transparent`
* Texte : `#0B0F0C`, font-weight 600
* Bordure : `1.5px solid #0B0F0C`
* Padding : `12px 24px`, `radius-full`
* Hover : fond `#0B0F0C`, texte blanc

**Ghost** — actions tertiaires (retour, annuler)

* Fond : `transparent`
* Texte : `#6B7280`, font-weight 500
* Hover : fond `#F5F5F5`, texte `#0B0F0C`
* Padding : `10px 16px`, `radius` (12px)

**Destructive** — suppressions, annulations irréversibles

* Fond : `#EF4444` → hover `#DC2626`
* Texte : `#FFFFFF`, font-weight 600

**Tailles**

| Taille | Hauteur | Padding-x | Font-size |
|--------|---------|-----------|-----------|
| `sm`   | 36px    | 16px      | 14px      |
| `md`   | 44px    | 24px      | 16px      |
| `lg`   | 52px    | 28px      | 16px      |

**États** : disabled = opacité 50% + curseur `not-allowed` + aucune transition. Loading = spinner 16px + texte "Chargement…". Focus visible = anneau `2px #16A34A` avec offset 2px.

### 3.2 Inputs

**Text / email / password / tel**

* Hauteur : 48px (`md`), 52px (`lg`)
* Fond : `#F5F5F5` au repos → `#FFFFFF` au focus
* Bordure : `1px solid transparent` → focus `2px solid #16A34A`, anneau 3px `#16A34A/20`
* Texte : `#0B0F0C` 14px, placeholder `#9CA3AF`
* Padding : `12px 16px`, `radius` (12px)
* Icône (optionnelle) : gauche ou droite, 18px, couleur `#6B7280`

**Textarea** : mêmes styles, `resize-none`, min-height 120px, `leading-relaxed`.

**Select** : chevron `expand_more` 18px à droite. Menu déroulant en card `shadow-md`, items en hover `bg-[#F5F5F5]`.

**File upload** :
* Zone dashed `2px dashed #D1D5DB`, `radius-md`
* Padding 32px, fond `#F5F5F5/50`
* Icône `upload_file` 32px `#16A34A` au centre
* Texte : "Glissez votre pièce d'identité ici ou **cliquez pour parcourir**"
* Sous-texte : "PNG, JPG ou PDF · 5 Mo max"
* État actif (dragover) : fond `#DCFCE7`, bordure `#16A34A`

**Checkbox / Radio**

* 20×20, `radius-sm`, bordure `#D1D5DB` au repos
* Coché : fond `#16A34A`, check blanc
* Focus : anneau 3px `#16A34A/30`

**Label** : `body-sm` (14px), font-weight 600, couleur `#0B0F0C`, marge basse 8px.
**Error message** : `caption` (12px), couleur `#EF4444`, icône `error` 14px à gauche, marge haute 4px.
**Helper text** : `caption` (12px), couleur `#6B7280`.

### 3.3 Cards

**Product card** (offres en vedette)

* Fond : `#FFFFFF`
* Bordure : `1px solid #F0F0F0`
* Ombre : `shadow-sm` → hover `shadow-md`
* Radius : `radius-md` (16px)
* Padding : 20px
* Contenu :
  1. Rangée haute : logo carré 56px × 56px `radius` (12px) + nom (16px 700) + tagline (12px 400 `#6B7280`)
  2. Badge réduction en position absolue top-right : fond `#EF4444`, texte blanc, `radius-sm`, `caption` 11px 700, padding `2px 8px`
  3. Prix actuel : 22px 800 `#16A34A` (Manrope), unité (12px 400 `#6B7280`)
  4. Ancien prix barré : 12px 400 `#9CA3AF line-through`
  5. Séparateur `border-top #F5F5F5`
  6. Pied : étoiles `#FACC15` 14px remplies + note `(4.9)` 12px `#6B7280` → CTA "Acheter" (taille `sm`, icône cart 16px)

**Category card**

* Fond : `#FFFFFF`
* Bordure `1px solid #F0F0F0` → hover `#E5E7EB`
* Radius : `radius-md` (16px), padding 20px
* Layout horizontal : tuile icône 56px teintée (bg tinté de la couleur catégorie, icône 28px filled) + (titre 15px 700 + description 12px `#6B7280`) + chevron rond à droite
* Transform hover : `-translate-y-0.5` + `shadow-md`

**Testimonial / Info card** : mêmes bases, padding 24px, pas de hover.

### 3.4 Badges

| Variante | Fond       | Texte    | Forme     | Usage                    |
|----------|------------|----------|-----------|--------------------------|
| Success  | `#DCFCE7`  | `#15803D`| pill      | "Paiement confirmé"      |
| Warning  | `#FEF3C7`  | `#92400E`| pill      | "Stock limité"           |
| Danger   | `#FEE2E2`  | `#B91C1C`| radius-sm | Badge réduction "-30%"    |
| Info     | `#DBEAFE`  | `#1E40AF`| pill      | "Nouveau"                |
| Brand    | `#16A34A`  | `#FFFFFF`| pill      | "Populaire"              |
| Neutral  | `#F5F5F5`  | `#6B7280`| pill      | "En attente"             |

Taille : padding `4px 10px`, `caption` 11px 700, `uppercase` + `tracking-wider` optionnel.

### 3.5 Alerts

**Bannière pleine largeur** ou **inline**.

* Fond tinté (ex. `#DCFCE7` pour success), bordure gauche 4px couleur solide (`#16A34A`)
* Padding 16px, radius 12px
* Layout : icône 20px filled + titre 14px 700 + description 13px 400, bouton close optionnel à droite

### 3.6 Autres éléments

**Skeleton loading** : fond `#F5F5F5` → `#EFEFEF` en pulse 1.5s `ease-in-out`, radius identique au composant réel.

**Divider** : `1px solid #F0F0F0`, marge verticale 32px par défaut.

**Tooltip** : fond `#0B0F0C`, texte blanc 12px, padding `6px 10px`, radius 6px, flèche 6px, apparaît en 120ms.

---

## 4. Header global

**Hauteur** : 80px, fond `#FFFFFF`, border-bottom `1px solid #F0F0F0` (remplacée par `shadow-sm` au scroll).

**Structure** (left → right) :

1. **Logo** AKIBASTORE (monogramme AK avec accent tricolore + wordmark à deux lignes) — dimensions 38–42px, cliquable vers `/`.
2. **Navigation centrale** (lg+ uniquement) :
   * Accueil
   * Catégories
   * Offres
   * Revendeur
   * Contact
   * Gap 40px entre items. Font 14px 600. Actif = couleur `#16A34A` + soulignement 3px `rounded-full` à `-8px` en dessous.
3. **Barre de recherche** pill `#F5F5F5`, largeur 340px (lg) / 280px (md), hauteur 44px, loupe à droite dans un cercle de 32px. Placeholder "Rechercher…".
4. **Icône panier** cercle `44px`, bordure `1px #E5E7EB` → hover `#16A34A`. Badge compteur : cercle vert 20px avec chiffre blanc, ring-2 blanc, position top-right (`-top-1 -right-1`).
5. **Icône compte** même style que panier, icône `person`.
6. **Menu mobile** : icône `menu` dans cercle bordé 44px, visible < lg.

**Version mobile** : menu drawer depuis le haut avec barre de recherche large, liste verticale des liens, séparateur, 2 boutons "S'inscrire" (secondary) + "Connexion" (primary) pleine largeur.

---

## 5. Footer global

**Fond** : `#0B0F0C`. **Texte** : `#CBD5E1` (slate 300), headings blanc, accents verts `#16A34A`.

**Structure** : grille 5 colonnes desktop (2-3-5 tablet, 1 mobile), padding-top 64px, padding-bottom 32px.

**Col 1 — Branding**
* Logo blanc (variant light)
* Paragraphe 13px 400 `#94A3B8`, max 260px
* 4 icônes sociales (Facebook, Instagram, WhatsApp, Telegram) : cercle 36px, fond `white/5`, bordure `white/10` → hover `#16A34A`

**Col 2 — Liens utiles** : Accueil / Catégories / Offres / Revendeur / Contact

**Col 3 — Informations** : À propos / Conditions d'utilisation / Politique de confidentialité / FAQ

**Col 4 — Aide** : Comment ça marche ? / Méthodes de paiement / Livraison / Support

**Col 5 — Nous contacter** + **Carte Gabon**
* Téléphone : icône `call` 18px `#16A34A` + `+241 62 12 34 56`
* Email : icône `mail` 18px + `contact@akibastore.ga`
* Localisation : icône `location_on` 18px + `Libreville, Gabon`
* Silhouette stylisée du Gabon (120px) avec remplissage tricolore (vert / jaune / bleu) à droite

**Barre inférieure**
* Border-top `1px rgba(255,255,255,0.1)`, marge-top 56px, padding-top 24px
* Gauche : `© {année} AKIBASTORE. Tous droits réservés.` (12px `#64748B`)
* Droite : rangée logos paiement — Visa, Mastercard, Moov Money, Airtel Money (tuiles 56×36 px, `radius-sm`, gap 8px)

---

## 6. Pages

### 6.1 Page Accueil

**Objectif** : convertir le visiteur en 1 scroll. Tout doit tenir en "above-the-fold" sur desktop pour la première section.

#### Hero

* Conteneur large (1232px), fond `#0B0F0C`, `radius-xl` (28px), ombre `shadow-xl`
* Grille 2 colonnes sur lg+, padding 48px–64px
* **Colonne gauche** :
  * H1 display 60px 800 blanc : "Accédez aux meilleurs services **à prix réduit**" — les 3 derniers mots en `#16A34A`, avec un halo vert `blur-2xl` derrière
  * Sous-titre 16px `#CBD5E1`, max 420px, 2 lignes : "Streaming, logiciels, abonnements, et plus. Tout ce dont vous avez besoin, au meilleur prix."
  * CTA primary "Commencer maintenant" (icône → dans cercle white/20 à droite)
  * Social proof 40px plus bas : 4 avatars empilés (ring-2 `#0B0F0C`) + 5 étoiles `#FACC15` + "**+ 20 000** clients satisfaits"
* **Colonne droite** : composition SVG/HTML illustrant 8 plateformes (Netflix, Spotify, YouTube, Disney+, Windows, McAfee, Prime Video, Canva), un téléphone couché, un sac AKIBASTORE noir — avec halos colorés derrière les icônes.

#### Bandeau catégories

* Header : H2 "Nos catégories" + lien vert "Voir toutes →"
* Grille 4 colonnes (2 sur mobile) : Streaming (vert) / Logiciels (orange) / Gaming (bleu) / Formations (violet)

#### Offres en vedette

* Header : H2 "Offres en vedette" + lien vert "Voir toutes les offres →"
* Grille 4 colonnes : Netflix Premium, Spotify Premium, Disney+ Standard, Microsoft 365

#### Barre de confiance

* Conteneur plein largeur, fond `#FAFAFA`, bordure `1px #F0F0F0`, `radius-lg` 20px, padding 24px–32px
* Grille 4 colonnes : Paiement sécurisé · Livraison instantanée · Support 24/7 · Garantie satisfaction
* Chaque bloc : icône teintée 48px + titre 13px 700 + description 12px `#6B7280`

---

### 6.2 Page Catégories

**Hero compact** (fond blanc, pas de visuel lourd) :
* H1 32px 800 "Toutes nos catégories"
* Sous-titre 16px `#6B7280` : "Trouvez l'abonnement digital qui vous correspond, en un clic."
* Barre de recherche centrale identique au header (largeur 640px).

**Grille** : 3 colonnes desktop (2 tablet, 1 mobile), gap 24px.

**Carte catégorie grande**
* Radius `radius-md` (16px), bordure `#F0F0F0`, ombre `shadow-sm` → hover `shadow-md` + `-translate-y-1`
* Ratio 4/3. Padding 24px.
* Fond : dégradé radial discret de la couleur catégorie vers blanc (ex. `radial-gradient(at top left, #DCFCE7 0%, #FFFFFF 60%)`)
* Icône filled 48px (couleur de marque)
* Titre H3 24px 800
* Description 14px `#6B7280` (2 lignes max, `line-clamp-2`) : ex. "Netflix, Spotify, Disney+, Prime Video… tous les grands noms du streaming à prix mini."
* Pied : rangée de 3 logos miniatures superposés + bouton "Voir les offres →" en Secondary taille `sm`

**Hover effect** : l'icône scale 1.1, la description devient visible en totalité, l'ombre s'intensifie.

---

### 6.3 Page Offres

**Top bar** (sticky en dessous du header global) :
* Gauche : résultats trouvés ("**42** abonnements disponibles")
* Centre : filtres par catégorie (chips toggle, couleur de marque si actif)
* Droite : select "Trier par" → Pertinence / Prix croissant / Prix décroissant / Meilleures notes / Nouveautés

**Grille produits** : 4 colonnes desktop, 3 tablet, 2 mobile large, 1 mobile S.

**Card produit** (cf. 3.3 — même structure que homepage) avec variantes :
* Badge réduction plus visible : radius `radius-sm` 8px, ombre douce
* Prix actuel 22px 800 `#16A34A`
* Ancien prix : `line-through` `#9CA3AF` 12px, sous le prix actuel
* Étoiles jaunes + nombre d'avis entre parenthèses
* Bouton "Acheter" primary taille `sm` + icône `shopping_cart`

**Pagination** : barre centrée en bas, boutons ronds 36px avec `<` et `>`, chiffres cliquables, page active en pill `#16A34A`. Ou scroll infinite avec skeleton cards — choisir l'un OU l'autre, pas les deux.

**Empty state** (aucun résultat) :
* Illustration 120px ("inventory_2")
* Titre "Aucune offre ne correspond à votre recherche"
* Texte `#6B7280` : "Essayez d'élargir vos filtres ou explorez nos catégories."
* CTA secondary "Réinitialiser les filtres"

---

### 6.4 Page Contact

**Hero rassurant** (fond blanc, padding vertical 64px) :
* H1 40px 800 "Parlons-en."
* Sous-titre 18px `#6B7280`, 2 lignes : "Notre équipe est basée à Libreville et vous répond en moins de 4 heures, 7 jours sur 7."
* Aucune image — minimalisme assumé.

**Grille 2 colonnes** (60% / 40%) :

**Colonne gauche — Formulaire**
Fond `#FFFFFF`, bordure `1px #F0F0F0`, radius `radius-md`, padding 32px.
* Nom complet (input obligatoire)
* Email (input email obligatoire, pattern validé)
* Sujet (select : "Question commande" / "Problème technique" / "Devenir revendeur" / "Autre")
* Message (textarea min 120px, 500 caractères max avec compteur en bas à droite)
* Bouton Primary pleine largeur "Envoyer mon message" (loading state → "Envoi…" avec spinner)
* Mention légale sous le bouton, 11px `#9CA3AF` : "En envoyant ce formulaire, vous acceptez notre politique de confidentialité."

**Colonne droite — Blocs infos** (pile verticale, gap 16px) :

1. **Téléphone**
   * Card `#F5F5F5`, radius 12px, padding 20px
   * Icône `call` 24px `#16A34A`, titre 14px 700 "Téléphone", numéro 16px 600 `#0B0F0C` "+241 62 12 34 56"
   * Sous-ligne 12px `#6B7280` "Lundi-Samedi · 8h-20h"

2. **Email** (même structure) : `contact@akibastore.ga` · "Réponse sous 4h ouvrées"

3. **WhatsApp** (même structure, icône `forum` couleur `#25D366`) : "+241 06 12 34 56" · "Discussion instantanée"

4. **Adresse** : "Boulevard Triomphal, Libreville" · "Sur rendez-vous uniquement"

**Section FAQ** (sous la grille, pleine largeur) :
* H2 32px 800 centré "Questions fréquentes"
* Accordion de 6 questions (`<details>`) :
  * Délai de livraison
  * Moyens de paiement
  * Authenticité des comptes
  * Remboursement
  * Compte bloqué
  * Devenir revendeur
* Chaque item : card border `#F0F0F0`, radius 12px, padding 20px, question 16px 600 + chevron `expand_more` qui tourne 180° à l'ouverture. Réponse 14px `#6B7280`, line-height 1.7, padding-top 12px.

---

### 6.5 Page Connexion / Inscription

**Layout split 50/50** sur lg+, stack vertical en mobile.

**Colonne gauche — Panneau visuel** (lg+ seulement)
* Fond `#0B0F0C` avec image de fond subtile (forêt équatoriale opacité 40%, mix-blend-overlay) + halo vert radial en haut-gauche
* Padding 80px
* Logo AKIBASTORE en variant `light` en haut
* Au milieu : H1 56px 800 blanc "Bon retour sur AKIBASTORE" / "Rejoignez la communauté"
* Sous-titre 20px `#7ffc97` (tinted brand) "Vos abonnements digitaux, payés en FCFA, livrés en 5 minutes."
* En bas : social proof — avatars + "Rejoignez plus de 10 000 curateurs digitaux."

**Colonne droite — Formulaire** (fond `#FAFAFA`)
* Largeur max carte 440px, padding 32–48px, `radius-lg`, fond `#FFFFFF`, `shadow-md`
* Logo compact mobile (lg:hidden) en haut
* H2 32px 800 "Connexion" / "Créer un compte"
* Sous-titre 14px `#6B7280` explicatif

**Connexion** (ordre des champs) :
1. Email
2. Mot de passe (icône `visibility` toggle à droite)
3. Lien "Mot de passe oublié ?" à droite du label mot de passe, vert, 12px 600
4. Bouton primary pleine largeur "Se connecter"
5. Divider "OU CONTINUER AVEC" 12px `#9CA3AF` uppercase tracking-widest
6. Bouton Google (white, bordure 1px `#E5E7EB`, icône G officielle)
7. Lien bas "Pas encore de compte ? **Créer un compte**" (le lien cliquable en `#16A34A` 600)

**Inscription** (ordre des champs) :
1. Nom complet (1 champ, pas de split)
2. Email
3. Téléphone (avec sélecteur de pays à gauche affichant drapeau + indicatif)
4. Pays de résidence (select recherchable)
5. Mot de passe — avec **jauge de force en direct** (5 critères : longueur 8+, majuscule, minuscule, chiffre, caractère spécial) + bouton "auto_fix_high" à côté pour générer un mot de passe fort
6. Confirmation
7. Code d'invitation (optionnel, font-mono, uppercase)
8. Mention CGU : "En vous inscrivant, vous acceptez nos [CGU] et [Politique de confidentialité]"
9. Bouton primary pleine largeur "Créer mon compte" (désactivé tant que score mot de passe < 5)
10. Lien bas "Déjà un compte ? **Se connecter**"

**Pied de page discret** (lg seulement, position absolute bottom) : © 2026 AKIBASTORE · Confidentialité · Conditions · Support (10px `#9CA3AF` tracking-widest)

---

### 6.6 Page Revendeur ⚠️ **EXCLUSIVE GABON**

Cette page est réservée aux résidents gabonais. Vérification côté serveur via `profiles.country_code === 'GA'` — si autre pays, afficher un bloc d'explication + CTA "Mettre à jour mon profil".

#### 6.6.1 Hero

Fond `#0B0F0C` avec radial-gradient `#16A34A/20` top-right et `#FACC15/10` bottom-left.
Conteneur radius `radius-xl`, padding 80px vertical / 48px horizontal.

* **Badge pays** (en premier, au-dessus du H1) : pill `rgba(255,255,255,0.1)` backdrop-blur, padding `6px 14px`, radius-full
  * Drapeau Gabon emoji 18px + "RÉSERVÉ UNIQUEMENT AUX GABONAIS" 12px 600 blanc uppercase tracking-wider
* **H1** 60px 800 blanc : "Devenez revendeur **AKIBASTORE** au Gabon"
* **Sous-titre** 18px `#CBD5E1`, max 640px : "Transformez votre savoir-faire digital en revenus réels. Rejoignez la première communauté de revendeurs gabonais et touchez des milliers de clients dès aujourd'hui."
* **Double CTA** :
  * Primary inversé : fond blanc, texte `#16A34A`, icône `storefront` + "Créer ma boutique"
  * Secondary : bordure `2px white/50`, texte blanc, "Comment ça marche ?"

**Si l'utilisateur n'est PAS gabonais** : remplace les CTA par un bloc alerte (fond `#F59E0B/10`, bordure `#FACC15/40`, radius 16px) : "Pays non éligible pour le moment" + explication 14px `amber-100/90` + CTA secondary "Mettre à jour mon profil".

#### 6.6.2 Section Avantages

* H2 32px 800 "Pourquoi vendre avec AKIBASTORE ?" (centré)
* Overline vert 12px 700 tracking-wider "AVANTAGES"
* Grille 4 colonnes (2 mobile) :

| Icône                | Titre                      | Description                                                                 |
|----------------------|----------------------------|-----------------------------------------------------------------------------|
| `savings`            | Prix revendeur exclusifs   | Marges garanties de 20 à 40 % sur chaque abonnement revendu.                |
| `payments`           | Revenus stables            | Paiements hebdomadaires sur Airtel Money, Moov Money ou compte bancaire.    |
| `support_agent`      | Support dédié 7j/7         | Un chargé de compte gabonais joignable par WhatsApp pour vous accompagner.  |
| `trending_up`        | Audience nationale         | +10 000 acheteurs gabonais actifs accèdent à votre boutique dès la mise en ligne. |

Chaque carte : fond blanc, bordure `#F0F0F0`, radius-md, padding 28px, icône filled 28px dans tuile `#DCFCE7` 48px, titre 16px 700, description 14px `#6B7280` line-height 1.6.

#### 6.6.3 Section Étapes (Comment ça marche)

Titre H2 + 4 cartes numérotées (01 / 02 / 03 / 04) en pill géant en fond de carte, couleur `#16A34A/10`.

1. **Créez votre compte** — "Inscription gratuite en 2 minutes avec votre numéro +241."
2. **Complétez votre dossier** — "Pièce d'identité, motivation, coordonnées bancaires."
3. **Validation manuelle** — "Notre équipe vérifie votre demande sous 24-48h."
4. **Vendez et encaissez** — "Dès la validation, commencez à revendre et recevez vos gains."

#### 6.6.4 Section Conditions d'éligibilité

Fond `#0B0F0C` avec halo vert, radius-lg, padding 48px. Texte blanc.

Overline `#16A34A` "CONDITIONS"
H2 32px 800 "Qui peut devenir revendeur ?"

Liste à puces (icône `check_circle` dans pastille `#16A34A`) :
* Être **résident au Gabon** avec un numéro de téléphone local actif
* Disposer d'une **pièce d'identité gabonaise valide** (CNI, passeport ou titre de séjour)
* Posséder un **compte Airtel Money, Moov Money ou un compte bancaire**
* Accepter une **vérification manuelle** de votre dossier sous 48 heures
* Vendre uniquement des **produits autorisés** conformes aux conditions AKIBASTORE

#### 6.6.5 Formulaire de candidature

**Card pleine largeur** (max 720px centrée), fond `#FFFFFF`, radius-lg, padding 40px, shadow-md.

Header :
* Icône `storefront` 32px dans tuile `#DCFCE7` 56px
* H3 "Votre candidature"
* Sous-titre 14px `#6B7280` : "Tous les champs sont obligatoires sauf mention contraire."

**Champs (ordre strict)** :

| # | Label              | Type         | Contraintes                                      |
|---|---------------------|--------------|--------------------------------------------------|
| 1 | Prénom              | text         | min 2 caractères                                 |
| 2 | Nom de famille      | text         | min 2 caractères                                 |
| 3 | Téléphone           | tel          | Préfixe `+241` fixé non-modifiable, 8 chiffres   |
| 4 | Adresse email       | email        | pattern RFC, unicité vérifiée côté serveur       |
| 5 | Ville               | select       | Liste : Libreville / Port-Gentil / Franceville / Oyem / Moanda / Lambaréné / Autre |
| 6 | Pièce d'identité    | file         | PNG/JPG/PDF, 5 Mo max, drag & drop               |
| 7 | Motivation          | textarea     | min 80 caractères, max 500. Compteur en direct   |

**Checkbox obligatoire** (sous les champs, avant le bouton) :
* 20×20 + label 13px `#0B0F0C` : "J'accepte les **conditions du programme revendeur** et je certifie être résident au Gabon."
* Les deux mots en gras sont liens `#16A34A` 600 qui ouvrent les CGU dans un nouvel onglet.

**Message de sécurité** (card info avant le bouton) :
* Fond `#DBEAFE`, bordure gauche 4px `#2563EB`, radius 12px, padding 16px
* Icône `shield` 20px `#2563EB` + texte 13px `#1E40AF` : "Votre pièce d'identité est chiffrée et ne sera consultée que par notre équipe de vérification. Elle sera supprimée si votre candidature est rejetée."

**Mention vérification manuelle** (juste sous le bouton, 12px `#6B7280` italique centré) :
"Chaque dossier est vérifié manuellement par notre équipe sous 24 à 48 heures. Vous recevrez une notification par email et SMS dès que votre candidature aura été traitée."

**Bouton** Primary pleine largeur, hauteur 52px :
* Label : "Soumettre ma demande"
* Icône droite : `arrow_forward` dans cercle white/20
* État disabled si checkbox non cochée ou un champ obligatoire vide
* État loading : spinner + "Envoi en cours…"

**Après soumission** : redirection vers `/revendeur/candidature-envoyee` avec :
* Illustration `mark_email_read` 80px `#16A34A`
* H2 "Merci, votre candidature est enregistrée."
* Texte `#6B7280` : "Vous recevrez un retour par email dans les 48 prochaines heures. En attendant, découvrez notre [guide du revendeur](/revendeur/guide)."

---

## 7. UX / Bonnes pratiques

### 7.1 Mobile-first

* Toute maquette doit être **pensée mobile d'abord** (375px), puis scalée vers desktop.
* Grilles systématiquement responsive : `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.
* Cibles tactiles **min 44×44 px** pour tout élément cliquable.
* Padding latéral mobile : **24px** (jamais moins).
* Les tables de données doivent devenir des **stacks de cards** en mobile, jamais de scroll horizontal forcé.

### 7.2 Feedback visuel

**Hover** : ombre renforcée + translation verticale `-2px` ou scale `1.02` (jamais les deux). Durée 200ms.
**Focus** : anneau vert 2px + offset 2px, toujours visible au clavier (jamais `outline: none` sans alternative).
**Active** : scale `0.98`, durée 120ms.
**Loading** : spinner inline + désactivation du bouton. Pas de page entière bloquée.
**Success** : toast vert en bas-droite (ou haut-centre mobile), auto-dismiss 4s, icône `check_circle`, animation slide+fade.
**Error** : toast rouge même comportement, titre + description. Formulaires : erreur sous le champ + scroll vers le premier champ en erreur.

### 7.3 États vides

Chaque grille ou liste doit définir son empty state :
* Illustration monochrome 120px `#6B7280`
* Titre 18px 700
* Description 14px `#6B7280` (1-2 lignes)
* CTA suggéré

### 7.4 Chargement rapide

* Images servies par `next/image` (WebP, responsive `sizes`)
* Polices auto-hébergées ou `next/font` avec `display: swap`
* Scripts lourds (WebGL, vidéo) en `dynamic()` avec `ssr: false`
* Skeletons pour toute liste de données (ne jamais laisser un espace blanc)

### 7.5 Accessibilité

**Contraste** : tout texte normal doit atteindre **WCAG AA 4.5:1**, texte large (≥18px bold ou ≥24px regular) **3:1**. La palette ci-dessus est validée (vert `#16A34A` sur blanc = 4.54:1).

**Navigation clavier** : ordre de tabulation logique, focus visible, pas de pièges (modales ferment avec Esc, focus restitué).

**Sémantique** : `<button>` pour actions, `<a>` pour navigation, `<h1>` unique par page, hiérarchie linéaire (pas de `h1 → h3`).

**ARIA** :
* Icônes décoratives : `aria-hidden="true"`
* Boutons icône seule : `aria-label="Ouvrir le panier"`
* Formulaires : `<label>` explicite, `aria-describedby` pour les erreurs
* Alertes dynamiques : `role="alert"` + `aria-live="assertive"` pour les erreurs, `polite` pour les succès

**Images** : `alt=""` explicite si décoratif, `alt="description concrète"` sinon.

**Prefers-reduced-motion** : désactiver translations, scales et fades pour les utilisateurs concernés.

### 7.6 Internationalisation

Le site est bilingue (FR / EN). Toute chaîne visible doit passer par le système i18n.
* Pas de texte en dur dans les composants présentationnels
* Dates, nombres et devises via `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' })`
* Direction de lecture LTR (pas de support RTL à ce jour)

---

## 8. Checklist de livraison

À cocher avant de considérer une page comme livrable :

* [ ] Fonctionne sur Chrome, Safari, Firefox, Edge (dernières versions)
* [ ] Responsive testé sur 375 / 768 / 1024 / 1440 px
* [ ] Lighthouse Performance ≥ 85 (mobile), Accessibilité ≥ 95
* [ ] Tous les `<img>` ont un `alt`, toutes les icônes standalone un `aria-label`
* [ ] Focus visible au clavier sur 100% des éléments interactifs
* [ ] États `hover`, `focus`, `active`, `disabled`, `loading` implémentés
* [ ] Empty state défini pour toute liste/grille
* [ ] Aucun `console.log` ni texte en dur non traduit
* [ ] Soumis à une relecture design (conformité aux tokens de ce document)

---

*Document maintenu par l'équipe design AKIBASTORE. Toute déviation doit être tracée en PR avec justification.*
