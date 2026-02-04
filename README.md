# DBC Frontend - Next.js E-commerce

## Vue d'ensemble

Frontend Next.js 16 pour l'application e-commerce de smartphones reconditionnés.
Design System: Wise (couleurs, typographie, radius).

## Stack technique

- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4 (CSS-first config)
- **i18n:** next-intl (fr/en)
- **API:** Flask backend (`/api/public/v1`)

## Architecture

```
src/
├── app/
│   └── [locale]/
│       ├── (shop)/
│       │   ├── products/page.tsx           # Liste produits
│       │   ├── products/[brand]/page.tsx   # Produits par marque
│       │   └── products/[brand]/[model]/page.tsx  # Page produit
│       └── layout.tsx
├── components/
│   ├── ui/                    # Composants UI génériques (shadcn)
│   └── products/
│       ├── ProductCard.tsx
│       ├── ProductGrid.tsx
│       ├── Breadcrumb.tsx
│       ├── ProductConfigurator.tsx   # Composant principal config produit
│       └── configurator/             # Composants réutilisables
│           ├── index.ts              # Export central
│           ├── types.ts              # Types TypeScript
│           ├── RadioOption.tsx       # Bouton radio stylisé
│           ├── ConfigSection.tsx     # Layout section (image + contenu)
│           ├── ImageGallery.tsx      # Galerie images + thumbnails
│           ├── ColorSelector.tsx     # Sélecteur couleurs
│           ├── TrustBadges.tsx       # Badges confiance
│           ├── StickyBottomBar.tsx   # Barre CTA mobile
│           ├── hooks/
│           │   └── useProductConfigurator.ts  # Logique métier
│           └── sections/
│               ├── HeroSection.tsx      # Image + infos produit
│               ├── ConditionSection.tsx # Sélection condition
│               ├── BatterySection.tsx   # Sélection batterie
│               └── StorageSection.tsx   # Sélection stockage
├── lib/
│   └── api/
│       ├── client.ts          # Client API (fetch wrapper)
│       ├── products.ts        # Fonctions API produits
│       └── transformers.ts    # API -> Frontend types
├── data/
│   └── mock/
│       └── products.ts        # Données mock (fallback)
└── types/
    └── product.ts             # Types produits
```

## Design System (Wise)

Le thème Tailwind est override dans `globals.css` pour matcher le design system Wise:

```css
@theme inline {
  /* Couleurs Wise */
  --color-gray-900: #0E0F0C;     /* Content primary */
  --color-green-400: #9FE870;    /* Accent bright */
  --color-green-700: #163300;    /* Primary forest */

  /* Border radius Wise */
  --radius-sm: 10px;   /* Mobile: 10px, Desktop: 16px */
  --radius-lg: 20px;   /* Mobile: 20px, Desktop: 30px */
}
```

Les classes Tailwind standard (`bg-gray-900`, `rounded-lg`) utilisent automatiquement les valeurs Wise.

## ProductConfigurator

Composant modulaire pour la configuration produit (style BackMarket).

### Usage

```tsx
import { ProductConfigurator } from "@/components/products/ProductConfigurator";

// iPhone - toutes les options
<ProductConfigurator product={iphone} />

// Mac - sans option batterie
<ProductConfigurator product={mac} showBattery={false} />

// Samsung - toutes les options
<ProductConfigurator product={samsung} />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `product` | `ExtendedProduct` | required | Produit à configurer |
| `showBattery` | `boolean` | `true` | Afficher section batterie |
| `showStorage` | `boolean` | `true` | Afficher section stockage |
| `showCondition` | `boolean` | `true` | Afficher section condition |

### Hook useProductConfigurator

Encapsule toute la logique métier:

```tsx
const {
  selection,        // { condition, storage, color, battery }
  setCondition,     // (id: string) => void
  setStorage,       // (value: string) => void
  setColor,         // (name: string) => void
  setBattery,       // ('standard' | 'new') => void
  variantInfo,      // { sku, price, quantity, batteryFallback }
  isLoadingVariant, // boolean
  colorImages,      // string[] - URLs images pour couleur sélectionnée
  totalPrice,       // number - Prix total calculé
  isOutOfStock,     // boolean
  handleAddToCart,  // () => void
} = useProductConfigurator({ product });
```

## API Integration

### Endpoints utilisés

| Endpoint | Fonction |
|----------|----------|
| `GET /models` | `getModels()` |
| `GET /models/by-slug/:slug` | `getModelBySlug()` |
| `GET /models/:id/options` | `getModelOptions()` |
| `GET /models/:id/prices` | `getModelPrices()` |
| `GET /models/:id/images` | `getModelImages()` |
| `POST /models/:id/find-variant` | `findVariant()` |

### Transformation API -> Frontend

```tsx
import { apiModelToProduct } from "@/lib/api/transformers";

const product = apiModelToProduct({
  model: apiModel,
  prices: pricesData,
  options: optionsData,
  images: imagesData,
});
```

## Développement

```bash
# Installer dépendances
npm install

# Développement
npm run dev

# Build production
npm run build

# Linter
npm run lint
```

## Variables d'environnement

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_PUBLIC_API_URL=http://localhost:5000/api/public/v1
```
