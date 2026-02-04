# CLAUDE.md - DBC Front E-commerce

## Projet

Clone BackMarket - Site e-commerce B2C pour telephones reconditionnes.
Design System: Wise (couleurs, typographie, radius).
Layout inspire de BackMarket.

## Design System - Wise

### Approche
- **Mobile-first** : Toujours coder mobile d'abord, puis `sm:`, `md:`, `lg:`
- **Design System Wise** : Couleurs, radius, typographie Wise
- **Layout BackMarket** : Structure pages et composants inspires BackMarket
- **API connectee** : Donnees depuis Flask backend

### Couleurs Wise (override Tailwind dans globals.css)
```css
@theme inline {
  /* Gray scale -> Wise content colors */
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F5F5F5;
  --color-gray-200: #EBEBEB;
  --color-gray-500: #6B6D6B;
  --color-gray-600: #454745;
  --color-gray-900: #0E0F0C;

  /* Green -> Wise green (accent) */
  --color-green-400: #9FE870;    /* Bright green */
  --color-green-700: #163300;    /* Forest green (primary) */

  /* Semantic colors */
  --color-primary: #163300;      /* Forest green */
  --color-accent: #9FE870;       /* Bright green */

  /* Border radius - Wise values */
  --radius-sm: 10px;   /* Mobile */
  --radius-md: 16px;
  --radius-lg: 20px;
}
```

Les classes Tailwind standard (`bg-gray-900`, `text-green-400`, `rounded-lg`) utilisent automatiquement les valeurs Wise.

### Typographie
- **Titres** : Font bold, tracking tight
- **Corps** : Font normal, text-sm a text-base
- **Prix** : Font bold, grande taille

### Espacements
- Padding sections : `py-8 md:py-12 lg:py-16`
- Gaps grilles : `gap-4 md:gap-6`
- Conteneur max : `max-w-7xl mx-auto px-4`

### Composants BackMarket a reproduire

#### Header
- Barre superieure : liens (Notre Pacte Qualite, Reparation, etc.) + langue
- Barre principale : Logo, Recherche, Revendre, Aide, Compte, Panier
- Navigation categories : Smartphones, Tablettes, etc.
- Banniere promo : fond colore avec message

#### Product Card
- Image produit centree
- Pastilles couleurs disponibles
- Nom du modele (bold)
- Note etoiles + nombre avis
- "A partir de" + prix
- Prix barre (neuf)

#### Page Produit (Configurateur)
- Breadcrumb
- HeroSection: Galerie images + infos produit + CTA + Trust badges
- ConditionSection: Selection etat (Parfait, Tres bon, Correct, Imparfait)
- BatterySection: Selection batterie (standard/neuve) - optionnel selon produit
- StorageSection: Selection stockage (128GB, 256GB, etc.) - optionnel
- StickyBottomBar: Barre CTA mobile (prix + bouton)

#### Composants Configurateur Reutilisables

```
src/components/products/configurator/
├── index.ts                    # Export central
├── types.ts                    # Types TypeScript partages
├── RadioOption.tsx             # Bouton radio stylise (condition, batterie, storage)
├── ConfigSection.tsx           # Layout section (image gauche + contenu droite)
├── ImageGallery.tsx            # Galerie images + thumbnails verticaux
├── ColorSelector.tsx           # Selecteur couleurs (pastilles)
├── TrustBadges.tsx             # Badges confiance (livraison, garantie, retour)
├── StickyBottomBar.tsx         # Barre CTA mobile sticky
├── hooks/
│   └── useProductConfigurator.ts  # Hook logique metier (selection, API, prix)
└── sections/
    ├── HeroSection.tsx         # Image + infos + CTA + badges
    ├── ConditionSection.tsx    # Selection condition
    ├── BatterySection.tsx      # Selection batterie
    └── StorageSection.tsx      # Selection stockage
```

#### Utilisation ProductConfigurator

```tsx
// iPhone - toutes options
<ProductConfigurator product={iphone} />

// Mac - sans batterie
<ProductConfigurator product={mac} showBattery={false} />

// Samsung - toutes options
<ProductConfigurator product={samsung} />
```

#### Hook useProductConfigurator

```tsx
const {
  selection,        // { condition, storage, color, battery }
  setCondition,     // (id: string) => void
  setStorage,       // (value: string) => void
  setColor,         // (name: string) => void
  setBattery,       // ('standard' | 'new') => void
  variantInfo,      // { sku, price, quantity, batteryFallback }
  isLoadingVariant, // boolean
  colorImages,      // string[] - URLs images couleur selectionnee
  totalPrice,       // number
  isOutOfStock,     // boolean
  handleAddToCart,  // () => void
} = useProductConfigurator({ product });
```

#### Selection Condition (Grades)
Style RadioOption :
- Bordure neutre par defaut (`border-gray-200`)
- Bordure noire + fond gris clair quand selectionne (`border-gray-900 bg-gray-50`)
- Badge "Best-seller" sur option populaire
- Prix a droite de chaque option

## Stack Technique

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript (strict mode)
- **Styling** : Tailwind CSS v4 (CSS-first config)
- **UI Components** : shadcn/ui (style new-york)
- **State** : Zustand (cart avec localStorage)
- **i18n** : next-intl (FR + EN)
- **Tests** : Vitest + Testing Library
- **Paiement** : Stripe Payment Element
- **Backend** : Flask API (dbcback) - CONNECTE
- **Hebergement** : Vercel

## Architecture API

### Couche API (`src/lib/api/`)

```
src/lib/api/
├── client.ts        # Clients HTTP (api, publicApi)
├── products.ts      # Fonctions API typees
├── transformers.ts  # Conversion API → types frontend
└── orders.ts        # API commandes
```

### Client HTTP

```typescript
// publicApi = API publique catalogue (sans auth)
// api = API admin backoffice (avec auth)

import { publicApi } from '@/lib/api/client';
const { data, error } = await publicApi.get<Model>('/models/123');
```

### Fonctions API typees

```typescript
import {
  getModels,        // Liste modeles
  getModelBySlug,   // Detail par slug
  getModelOptions,  // Options (storage, color, sim, battery)
  getModelPrices,   // Prix par grade
  getModelImages,   // Images par couleur
  findVariant,      // Recherche variante disponible
} from '@/lib/api/products';
```

### Transformation donnees

```typescript
import { apiModelToProduct } from '@/lib/api/transformers';

// Convertit reponse API → type Product frontend
const product = apiModelToProduct({
  model: apiModel,
  prices: pricesData,
  options: optionsData,
  images: imagesData,
});
```

## Types API (`src/types/product.ts`)

```typescript
interface PhoneModel { id, name, brand, slug, prices... }
interface PhoneVariant { sku, storage, color, grade, price, quantity... }
interface ModelOptions { storages, colors, sims, batteries }
interface VariantSearchResult { variant, sku, price, battery_fallback... }
```

## Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Homepage
│   │   └── (shop)/
│   │       ├── layout.tsx           # Header/Footer BackMarket
│   │       ├── products/
│   │       │   ├── page.tsx         # Catalogue (grille produits)
│   │       │   └── [brand]/
│   │       │       ├── page.tsx     # Liste marque (iPhone, Samsung)
│   │       │       └── [model]/
│   │       │           └── page.tsx # Configurateur produit
│   │       ├── cart/
│   │       └── checkout/
│   └── globals.css
├── components/
│   ├── ui/                          # shadcn/ui
│   ├── layout/
│   │   ├── Header.tsx               # Header complet BackMarket
│   │   ├── TopBar.tsx               # Barre liens haut
│   │   ├── MainNav.tsx              # Nav principale
│   │   ├── CategoryNav.tsx          # Nav categories
│   │   ├── PromoBanner.tsx          # Banniere promo
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   └── SearchBar.tsx
│   ├── products/
│   │   ├── ProductCard.tsx          # Card produit
│   │   ├── ProductGrid.tsx          # Grille responsive
│   │   ├── FilteredProductGrid.tsx  # Grille avec filtres
│   │   ├── Breadcrumb.tsx
│   │   ├── TrustBar.tsx             # Barre garantie/livraison
│   │   ├── ProductConfigurator.tsx  # Composant principal config
│   │   └── configurator/            # Composants reutilisables
│   │       ├── index.ts             # Export central
│   │       ├── types.ts             # Types partages
│   │       ├── RadioOption.tsx      # Bouton radio stylise
│   │       ├── ConfigSection.tsx    # Layout section
│   │       ├── ImageGallery.tsx     # Galerie images
│   │       ├── ColorSelector.tsx    # Selecteur couleurs
│   │       ├── TrustBadges.tsx      # Badges confiance
│   │       ├── StickyBottomBar.tsx  # Barre CTA mobile
│   │       ├── hooks/
│   │       │   └── useProductConfigurator.ts
│   │       └── sections/
│   │           ├── HeroSection.tsx
│   │           ├── ConditionSection.tsx
│   │           ├── BatterySection.tsx
│   │           └── StorageSection.tsx
│   ├── cart/
│   └── shared/
│       └── TrustBar.tsx             # Barre garantie/livraison/retour
├── data/
│   └── mock/                        # Donnees en dur
│       ├── products.ts
│       ├── brands.ts
│       └── categories.ts
├── lib/
├── stores/
├── hooks/
├── types/
└── i18n/
```

## Conventions

### Mobile-First (OBLIGATOIRE)
```tsx
// CORRECT - Mobile first
<div className="px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
<div className="text-sm md:text-base lg:text-lg">

// INCORRECT - Desktop first
<div className="px-8 py-12 md:px-6 md:py-8 sm:px-4 sm:py-6">
```

### Breakpoints
- `sm`: 640px (tablette portrait)
- `md`: 768px (tablette paysage)
- `lg`: 1024px (desktop)
- `xl`: 1280px (grand ecran)

### TypeScript
- Mode strict actif
- Pas de `any` - utiliser `unknown`
- Interfaces pour objets, types pour unions

### Composants
- Functional components uniquement
- Un composant par fichier
- Noms en PascalCase: `ProductCard.tsx`
- `'use client'` uniquement si necessaire
- Props bien typees

### Tailwind v4
- Config dans `globals.css` avec `@theme`
- Utiliser `cn()` pour classes conditionnelles
- Classes ordonnees : layout > spacing > sizing > typography > colors > effects

### Donnees Mock
Pour l'instant, donnees en dur dans `src/data/mock/`
```ts
// src/data/mock/products.ts
export const MOCK_PRODUCTS = [
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    brand: "apple",
    priceFrom: 683,
    priceNew: 1229,
    rating: 4.5,
    reviewCount: 6763,
    colors: ["#1d1d1f", "#f5f5f7", "#4b4845", "#d4c5b3"],
    image: "/images/products/iphone-16-pro.png",
  },
  // ...
];
```

## Grades (Conditions)

| Grade | Label FR | Label EN | Description |
|-------|----------|----------|-------------|
| Correct | Etat correct | Good | Legers signes d'usure |
| Tres bon | Tres bon etat | Very good | Micro-rayures invisibles |
| Parfait | Parfait etat | Excellent | Comme neuf |
| Premium | Premium | Premium | Neuf reconditionne |

## Regles

1. **Mobile-first** : Toujours coder pour mobile d'abord
2. Pas d'emojis dans le code
3. Composants Server par defaut, Client si interactivite
4. Images via next/image avec placeholder
5. Loading states avec Skeleton
6. **Utiliser l'API** : API reelle via `@/lib/api/products`, fallback mock si erreur
7. **Design System Wise** : Couleurs, radius Wise via globals.css
8. Espacements genereux, design aere
9. **Toujours typer** : Pas de `any`, utiliser types de `@/types/product.ts`
10. **Composants reutilisables** : Extraire logique dans hooks, UI dans composants atomiques
11. **memo()** : Utiliser React.memo pour composants purs frequemment re-rendus

### Appels API (OBLIGATOIRE)

```typescript
// BON - Utiliser fonctions typees
import { getModelBySlug } from '@/lib/api/products';
const { data, error } = await getModelBySlug(slug);

// MAUVAIS - Fetch direct
const res = await fetch('/api/...');  // NON
```

### Fallback sur mock

```typescript
const { data, error } = await getModels();
if (error || !data) {
  // Fallback mock si API down
  return mockProducts;
}
return data;
```

## Tests

```bash
npm run test         # Mode watch
npm run test:run     # Run once
npm run test:run -- --coverage
```

**Structure tests:**
```
src/__tests__/
├── setup.ts                    # Mocks Next.js, next-intl
└── lib/api/
    ├── transformers.test.ts    # Tests transformation donnees
    └── products.test.ts        # Tests client API
```

### Ecrire un test

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('myFunction', () => {
  it('should do something', () => {
    expect(result).toBe(expected);
  });
});
```

## Commandes

```bash
npm run dev          # Dev server
npm run build        # Build production
npm run lint         # ESLint
npm run test         # Tests watch
npm run test:run     # Tests once
```

## Variables d'environnement

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_PUBLIC_API_URL=http://localhost:5000/api/public/v1
```

## Git

```bash
git commit -m "feat: add product configurator"
git commit -m "fix: cart total calculation"
git commit -m "style: improve mobile nav"
```
