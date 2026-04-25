<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AkibaStore — Manuel d'exploitation des agents

> Tu codes pour vendre. Pas pour démontrer ton intelligence. Chaque ligne soit elle pousse à la conversion, soit elle dégage.

---

## 1. Mission

AkibaStore est une **marketplace de services numériques au Gabon**. Le site existe pour **convertir un visiteur en client en moins de 5 minutes**, paiement Mobile Money inclus.

Tout arbitrage technique se règle avec une seule question : **est-ce que ça augmente le taux de conversion, le LCP, ou les deux ?** Si la réponse est non, ça ne mérite pas un commit.

**Personae prioritaires** : 1) acheteur Gabonais sur 4G mobile (Airtel/Moov), 2) revendeur Gabonais qui veut s'inscrire, 3) admin interne. Dans cet ordre.

---

## 2. Stack imposée — aucune dérogation

| Couche       | Choix                                  | Notes                                        |
|--------------|----------------------------------------|----------------------------------------------|
| Framework    | Next.js 16 App Router (Turbopack)      | `proxy.ts` à la racine de `src/`, **pas** `middleware.ts` |
| Langage      | TypeScript strict                      | `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess` actifs |
| UI           | React 19 + Tailwind CSS v4             | Pas de styled-components, pas de CSS-in-JS runtime |
| i18n         | `next-intl` — FR par défaut, EN secondaire | Toute route dans `[locale]`                |
| Backend      | Supabase (Postgres + Auth + Storage)   | RLS activée sur **toutes** les tables       |
| Déploiement  | Vercel + GitHub auto-deploy            | Branche `master` = production               |
| Icônes       | Material Symbols Outlined (CDN)        | **Interdit** : lucide-react, react-icons, heroicons |
| Polices      | Manrope (titres) + Inter (corps)       | Chargées via `next/font/google`             |
| Toasts       | `sonner`                               | Aucune autre lib de notif                   |
| State client | `zustand`                              | Réservé au panier et UI globale uniquement   |
| 3D           | `@react-three/fiber` + `drei`          | Strictement gated par `dynamic(ssr:false)`  |

**Aucune nouvelle dépendance** sans justification écrite dans le commit (gain de conversion ou de perf chiffré). Toute dépendance ajoutée est une dette : elle se paie en bundle, en CVE, en montée de version.

---

## 3. Architecture — structure de dossiers obligatoire

```
src/
  app/
    [locale]/
      (public)/         # pages publiques avec Header + Footer
      (auth)/           # login, register, forgot — layout minimal, pas de Header
      (dashboard)/      # /client, /vendor, /admin — layout dashboard
    api/                # routes API serveur (jamais d'auth client-side critique)
    layout.tsx          # root — métadonnées, fonts, SpeedInsights
  components/
    layout/             # Header, Footer, LegalPage, MobileNav
    brand/              # AkibaLogo, GabonMap, marques propres
    hero/               # HeroScene, HeroIllustration, HeroScene3D
    shop/               # cards produit, filtres, ProductDetail
    dashboard/          # Sidebar, widgets dashboard
    forms/              # composants de formulaire réutilisables
  lib/
    supabase/           # client, server, admin (3 clients distincts, jamais mélangés)
    i18n/               # config routing
    utils/              # helpers purs uniquement
  store/                # zustand stores (cart.ts uniquement à ce jour)
  proxy.ts              # auth gate + i18n + geo-restriction
public/
  hero/                 # assets hero (statiques)
supabase/
  migrations/           # SQL versionné, numéroté (001_, 002_, …)
```

**Règles dures** :
- Un composant = un fichier. Pas de barrel `index.ts` qui ré-exporte 50 choses.
- Pages = **server components** par défaut. `'use client'` uniquement si état/effets/event handlers nécessaires.
- Aucun composant > 250 lignes. Au-delà, splitte.
- Aucune logique métier dans `components/`. Elle vit dans `lib/` ou dans des routes API.
- `lib/utils/` = fonctions **pures**, sans accès réseau, sans Supabase, sans React.

---

## 4. UI/UX orientée conversion

### CTA
1. **Un seul CTA primaire visible** par fold. Si tu en mets deux, tu en mets zéro.
2. Le CTA primaire est **vert AkibaStore**, pill (`radius-full`), padding minimum `12px 24px`, ombre `shadow-brand`.
3. Verbes au présent à l'impératif. **Interdit** : "En savoir plus", "Découvrir", "Cliquer ici". **Autorisé** : "Acheter", "Commencer", "Soumettre".
4. Tout CTA d'achat affiche le **prix** dans la page (jamais "À partir de…" sans chiffre).

### Hiérarchie visuelle
1. La règle des **3 niveaux** : H1 énorme (display 48–60px) → sous-titre 16–18px gris → CTA. Pas de quatrième niveau dans le hero.
2. Aucune section sans **un objectif mesurable** : convertir, rassurer, ou expliquer un blocage de conversion. Si une section n'en a aucun, elle dégage.
3. Trust signals (note, nombre de clients, paiements acceptés) **au-dessus de la ligne de flottaison**, pas en bas de page.
4. Les prix sont toujours visibles sans cliquer. Ancien prix barré + nouveau prix en vert si réduction.

### Formulaires
1. Un formulaire = **un objectif unique**. Pas de "tant qu'on y est, demande aussi…".
2. Champs minimum requis. Le téléphone gabonais est `+241` préfixé non-modifiable.
3. Validation **inline** au blur, pas seulement à la soumission.
4. Bouton primaire désactivé tant que la validation échoue. Pas de message "champs manquants" générique.
5. Erreur serveur = toast `sonner` + message sous le champ concerné.

### Mobile
1. Cibles tactiles **44 × 44 px minimum**.
2. Tout layout est conçu d'abord en 375px de large, puis scalé.
3. Tableaux interdits sur mobile. Stack de cards ou rien.
4. Aucune section qui force un scroll horizontal involontaire.

---

## 5. Performance — non-négociable

| Métrique             | Cible        | Outil de mesure              |
|----------------------|--------------|------------------------------|
| LCP (mobile)         | < 2.5s       | Vercel Speed Insights        |
| CLS                  | < 0.1        | idem                         |
| INP                  | < 200ms      | idem                         |
| JS first-load        | < 180 KB gz  | `next build` output          |
| Score Lighthouse mobile | ≥ 90 perf, ≥ 95 a11y | CI ou local        |

### Règles
1. **Server components par défaut**. Pages, layouts, composants présentationnels = serveur.
2. `'use client'` ne s'écrit que sur le composant qui a vraiment besoin du client. **Pas** sur sa page parente.
3. Toute image servie par `next/image` avec `sizes` correct. **Aucun** `<img>` brut sauf SVG inline ou data-URI.
4. Tout bundle > 50 KB doit être en `next/dynamic({ ssr: false })` derrière une condition (interaction, scroll, viewport).
5. Polices : `next/font` uniquement, jamais de `<link>` Google Fonts manuel sauf cas Material Symbols (déjà en place).
6. Aucune lib de date type Moment. Si tu as besoin de formater, tu utilises `Intl.DateTimeFormat` natif.
7. **Aucune** lib utilitaire (lodash, ramda) pour faire ce que `Array.prototype` fait.
8. Le hero LCP doit être un asset statique ou un SVG inline. **Jamais** une image distante.

---

## 6. Supabase — règles dures

1. **Trois clients, trois usages, jamais mélangés** :
   - `lib/supabase/client.ts` → composants client uniquement (`'use client'`)
   - `lib/supabase/server.ts` → server components et server actions
   - `lib/supabase/admin.ts` → routes API qui ont besoin du `service_role` key
2. **RLS activée sur toutes les tables.** Aucune table publique sans politique. Une nouvelle table = une migration RLS dans le même fichier SQL.
3. Triggers Postgres = **fault-tolerant** :
   ```sql
   ON CONFLICT (...) DO NOTHING;
   EXCEPTION WHEN OTHERS THEN
     RAISE WARNING '...';
     RETURN new;
   ```
   Un trigger qui throw bloque l'inscription. Inacceptable.
4. **Cookies SSR** dans `proxy.ts` : `setAll` doit miroir les cookies dans **request** ET **response**. Sinon la rotation de token bounce l'utilisateur vers `/auth/login`. Le bug nous a coûté une demi-journée — ne le réintroduis pas.
5. Migrations numérotées et versionnées dans `supabase/migrations/NNN_description.sql`. Idempotentes (`IF NOT EXISTS`, `IF EXISTS`).
6. Aucun `select('*')` en production. Tu sélectionnes les colonnes dont tu as besoin.
7. **Pas** de logique métier dans le client Supabase. Toute opération multi-table passe par une route API ou une fonction RPC.

---

## 7. Sécurité

1. Le `service_role` key ne quitte **jamais** le serveur. S'il apparaît dans `NEXT_PUBLIC_*`, c'est une faille critique.
2. Toute route API valide la session + le rôle avant action. Aucune confiance dans l'`x-user-id` venant du client.
3. Auth gate côté **proxy** + check de rôle côté **server component**. Double rideau.
4. Inputs utilisateurs sanitisés au boundary serveur uniquement. Pas de validation client comme seule défense.
5. Aucun secret en dur dans le code. `.env.local` git-ignoré, et tout ce qui ressemble à un token (`sk_`, `sbp_`, `postgres://`) est rejeté en review.
6. CSRF : Supabase gère via cookies SameSite. Ne pas casser ce comportement avec des cookies custom.
7. Uploads (`storage`) limités par taille et MIME au niveau de la policy Supabase, pas seulement côté UI.

---

## 8. TypeScript

1. `strict: true`. Non-négociable.
2. **Aucun** `any`. Si tu ne sais pas le type, utilise `unknown` et narrow.
3. **Aucun** `// @ts-ignore` ni `// @ts-expect-error` sans commentaire qui explique pourquoi sur la même ligne.
4. Types des données Supabase = typés à la main dans `lib/supabase/types.ts`. Pas de génération auto pour le moment (l'app est petite, le coût de maintenance des types générés dépasse le gain).
5. Props de composants = `type Props = { … }` au-dessus du composant. Pas de `React.FC`.
6. Les fonctions exportées ont un return type explicite si elles sont publiques.

---

## 9. Interdictions strictes

- **Pas** de `console.log` qui passe en production. `console.error` autorisé pour les erreurs catch.
- **Pas** de commentaires `// TODO` sans ticket associé.
- **Pas** de feature flags pour des features qui ne seront jamais désactivées.
- **Pas** de wrappers de wrappers (`useMyButton`, `<MyButton>` qui rend juste `<button>` avec deux classes).
- **Pas** de fichiers `index.ts` qui ré-exportent juste leurs voisins.
- **Pas** d'abstractions prématurées. Trois usages similaires = OK de copier. Cinq = peut-être un helper. Jamais avant.
- **Pas** de framework de tests si on n'écrit pas de tests. (Quand on en écrira : Vitest + React Testing Library, c'est tout.)
- **Pas** de `useEffect` pour synchroniser un état dérivable. Le calcul direct vit dans le rendu.
- **Pas** de routes dynamiques juste pour faire joli. Si une page est statique, elle reste statique.

---

## 10. Workflow Git

- Une feature = un commit cohérent. Squash si besoin avant push.
- Message : `type(scope): résumé impératif` — `feat(hero): …`, `fix(auth): …`, `docs: …`, `chore: …`.
- Body : *pourquoi* le changement, pas *quoi* (le diff dit déjà quoi).
- Co-author Claude : `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` sur tout commit assisté.
- Pas de `--force` sur `master`. Pas de `--no-verify`.
- Avant push : `npx tsc --noEmit` doit passer. Si rouge, tu nettoies (`rm -rf .next`) et tu relances avant de paniquer.

---

## 11. Definition of Done

Une PR n'est livrable que si **toutes** ces cases sont cochées :

- [ ] Typecheck propre
- [ ] Testé en mobile (DevTools 375px) ET desktop
- [ ] Aucun `console.log` ni texte en dur non traduit
- [ ] CTAs vérifiés : un primaire par fold, libellé impératif, prix visible
- [ ] LCP < 2.5s vérifié sur la prévisualisation Vercel
- [ ] RLS active si la PR touche le schéma DB
- [ ] Pas de nouvelle dépendance sans justification dans le commit message
- [ ] Routes auth-gated vérifiées avec un compte non connecté

Si tu ne peux pas cocher, tu ne pushes pas.
