---
name: design
description: "Référence design DBC (style BackMarket/Wise). S'active automatiquement quand on crée ou modifie un composant/écran UI. Contient les tokens, règles UX, Brand DNA, et checklist de conformité."
user-invocable: true
---

# DBC Design System — Next.js + Tailwind + shadcn/ui

Tu es le gardien du design system DBC. Chaque élément UI doit respecter ces règles.

## Stack technique

- **Next.js 16** App Router (server components par défaut, `"use client"` seulement si nécessaire)
- **Tailwind CSS v4** (tokens dans `globals.css` via `@theme inline {}`)
- **@tailwindcss/typography** plugin (classes `prose` pour le contenu textuel long)
- **tailwindcss-animate** plugin (animations `animate-in`/`animate-out`, `slide-in-from-*`, `fade-in-*` pour shadcn Sheet/Dialog)
- **shadcn/ui** + Radix UI (composants primitifs)
- **Lucide React** (icônes)
- **Sonner** (toasts)
- **next-intl** (i18n FR/EN)
- **Zustand** (cart, checkout state)
- **Light mode uniquement** (pas de dark mode)

---

## Brand DNA — Identité DBC

### Personnalité de marque
| Attribut | Description |
|----------|-------------|
| **Simple** | Pas de jargon, tout est immédiatement compréhensible |
| **Inspiring** | On raconte une histoire, on ne vend pas juste un produit |
| **Strong** | Confiance, transparence, engagement assumé |

### Ton de voix
- Jeune, urbain, direct, accessible
- Tutoiement possible dans les messages marketing (pas dans le checkout/légal)
- Phrases courtes et percutantes — pas de discours corporate
- On parle comme un pote expert, pas comme une multinationale

### Messages clés (à utiliser dans le site)
| Message | Emplacement |
|---------|-------------|
| **"On fait bouger l'industrie."** | Hero H1, tagline principale |
| **"Aujourd'hui, avant demain."** | Hero tagline, TopBar |
| **"Le futur, entre vos mains."** | Footer tagline |
| **"DBC, avant d'être un site, c'est 11 magasins physiques."** | Announcement bar, trust sections |

### Trust signal principal
Le différenciateur DBC = **11 magasins physiques**. Contrairement aux pure-players du reconditionné, DBC a une présence physique réelle. Ce message doit être visible dès la homepage.

### Éléments graphiques signature

| Asset | Fichier | Usage |
|-------|---------|-------|
| **Brush underline** | `/images/brand/brush-underline.svg` | Sous les titres importants |
| **Brush strokes** (35 variantes) | `DBC Brand Files/DBC - Graphic Elements/SVG/Asset 1-35.svg` | Backgrounds, dividers, badges |
| **Brush circle** (Asset 10) | Cercle organique | Badges, highlights |
| **Pattern diagonal** | `/images/brand/pattern.svg` | Overlay hero, backgrounds |

**Règles d'utilisation brush strokes :**
- En SVG uniquement (pas de PNG pour le web)
- `opacity-10` à `opacity-30` pour les backgrounds
- `brightness-0 invert` pour rendre blanc sur fond sombre
- Couleur `primary` (#034638) ou `highlight` (#D8E142)
- Apportent un côté **humain/artisanal/urbain** au design géométrique

### Logos
| Variante | Fichier | Usage |
|----------|---------|-------|
| Logo horizontal (icon + "DBC") | `/images/logo.svg` | Header (fond clair) |
| Logo icon seul (flag) | `/images/logo-icon.svg` | Favicon, hero, avatar |
| Logo blanc | Composant `DbcLogo` | Footer (fond sombre) |
| Logo icon lime | Composant `DbcLogoIcon` | Hero sur fond primary |

### Social media (CORRECTS)
| Plateforme | Handle | Lien |
|------------|--------|------|
| TikTok | @dbclille | https://tiktok.com/@dbclille |
| Snapchat | dbc_story | https://snapchat.com/add/dbc_story |
| ~~Facebook~~ | — | NE PAS utiliser |
| ~~Twitter~~ | — | NE PAS utiliser |
| ~~Instagram~~ | — | NE PAS utiliser |

---

## Principes (par priorité)
1. **Mobile-first responsive** : styles de base = mobile, breakpoints (`sm:`, `md:`, `lg:`, `xl:`) pour desktop
2. **Minimum de clics** : chaque bouton/écran supplémentaire doit être justifié
3. **Fluidité** : animations snappy, transitions naturelles
4. **Clarté** : chaque élément immédiatement compréhensible
5. **Breathing room** : espace blanc généreux, le contenu respire

## Tokens de couleur (Tailwind)

### Palette DBC
| Token Tailwind | Hex | Usage |
|----------------|-----|-------|
| `green-700` / `primary` | `#034638` | CTA principal, texte accent, selected states, radio/checkbox checked |
| `green-800` | `#034638` | Hover CTA |
| `green-500` / `accent` | `#00BF6F` | Badge panier, accent secondaire, savings badge |
| `green-50` | `#E6F7F1` | Fond selected state (radio options, cards) |
| `green-100` | `#C2EBD9` | Fond savings badge |
| `yellow-300`/`400`/`500` / `highlight` | `#D8E142` | Promo banner, badges promotionnels, hero CTA |
| `gray-50` | `#FAFAFA` | Fond sections alternées |
| `gray-100` | `#F5F5F5` | Fond badges, icônes trust |
| `gray-200` | `#EBEBEB` | Bordures par défaut |
| `gray-400` | `#A3A3A3` | Texte désactivé, line-through |
| `gray-500` | `#6B6D6B` | Texte secondaire (léger) |
| `gray-600` | `#454745` | Texte secondaire (moyen) |
| `gray-900` | `#0E0F0C` | Texte principal |
| `red-500`/`600` | `#EF4444`/`#DC2626` | Erreur, destructif |
| `blue-50` | — | Fond info boxes (livraison, retour) |
| `blue-600` | — | Icônes info |

### Couleurs sémantiques (CSS variables)
```
--color-primary: #034638        → bg-primary, text-primary
--color-primary-foreground: #FFF → text-primary-foreground
--color-accent: #00BF6F         → bg-accent
--color-highlight: #D8E142      → bg-highlight
--color-highlight-foreground: #034638 → text-highlight-foreground
--color-destructive: #DC2626    → bg-destructive
--color-background: #FFFFFF     → bg-background
--color-foreground: #000000     → text-foreground
--color-muted: #F5F5F5          → bg-muted
--color-muted-foreground: #454745 → text-muted-foreground
--color-border: #EBEBEB         → border-border
```

### Règles de couleur OBLIGATOIRES
- **CTA principal** : `bg-green-700 text-white hover:bg-green-800` (vert foncé DBC)
- **CTA hero/highlight** : `bg-highlight text-highlight-foreground` (lime DBC, utilisé dans le hero)
- **Selected state** (radio, option) : `border-green-700 bg-green-50`
- **Badge panier** : `bg-green-500 text-white`
- **Savings** : `bg-green-100 text-green-700`
- **Promo** : `bg-yellow-200` (lime DBC)
- **Liens accent** : `text-green-700 hover:text-green-800`
- **Hero background** : `bg-primary` avec pattern overlay
- **Footer background** : `bg-primary` avec texte blanc/green-200
- JAMAIS de hex en dur dans les composants — toujours classes Tailwind

## Typographie

### Fonts
| Usage | Font | Classe Tailwind |
|-------|------|-----------------|
| Corps de texte | General Sans | `font-sans` (par défaut) |
| Titres (h1-h6) | Almarena Neue Display | `font-display` |
| Monospace | system monospace | `font-mono` |

Note : le site Shopify utilise Barlow/Inter (défaut thème), mais le brand kit officiel prescrit General Sans + Almarena. Le nouveau site utilise les bonnes polices.

### Échelle typo
| Style | Classes Tailwind | Usage |
|-------|-----------------|-------|
| Hero h1 | `text-4xl md:text-5xl lg:text-6xl font-bold` | Titre principal homepage |
| Page title | `text-3xl md:text-4xl font-bold font-display` | Titre de page |
| Section title | `text-xl md:text-2xl font-bold` / `font-semibold` | Titre de section |
| Body title | `text-lg font-semibold` | Sous-titre, nom produit |
| Body | `text-base` (16px) / `text-sm` (14px) | Texte courant |
| Caption | `text-xs` (12px) / `text-sm` | Labels secondaires, métadonnées |
| Button | `text-sm font-medium` / `text-base font-semibold` | Selon taille du bouton |

## Spacing (base 4px via Tailwind)

| Token | Valeur | Classe |
|-------|--------|--------|
| xs | 4px | `p-1`, `gap-1` |
| sm | 8px | `p-2`, `gap-2` |
| md | 16px | `p-4`, `gap-4` |
| lg | 24px | `p-6`, `gap-6` |
| xl | 32px | `p-8`, `gap-8` |
| xxl | 48px | `p-12`, `gap-12` |

### Layout
- **Container max-width** : `max-w-7xl mx-auto`
- **Page padding** : `px-4` (16px sur mobile, suffisant avec max-w-7xl)
- **Section spacing** : `py-8` à `py-12` entre sections
- **Card padding** : `p-4` à `p-6`
- **Pages légales** : `max-w-3xl mx-auto px-4` (exception prose content)

## Radius

| Usage | Classe | Valeur |
|-------|--------|--------|
| Boutons pill (CTA checkout, hero) | `rounded-full` | 9999px |
| Cartes, sections | `rounded-2xl` ou `rounded-xl` | 16px / 12px |
| Inputs, selects | `rounded-lg` | 8px |
| Badges, pills filtres | `rounded-full` | 9999px |
| Images produit | `rounded-xl` à `rounded-3xl` | 12px-24px |
| Petits badges | `rounded` | 4px |

## Composants shadcn/ui — TOUJOURS les utiliser

### Button (`@/components/ui/button`)
```tsx
import { Button } from "@/components/ui/button";

// CTA principal
<Button className="w-full rounded-xl py-6 bg-green-700 hover:bg-green-800 text-white text-base font-semibold">
  Ajouter au panier
</Button>

// Variantes disponibles : default, destructive, outline, secondary, ghost, link
// Tailles : xs, sm, default, lg, icon, icon-xs, icon-sm, icon-lg
```

### Input (`@/components/ui/input`)
TOUJOURS utiliser `<Input>` de shadcn au lieu de `<input>` natif.

### Card (`@/components/ui/card`)
Pour les conteneurs structurés. Utiliser Card, CardHeader, CardTitle, CardContent, CardFooter.

### Sheet (`@/components/ui/sheet`) — pour les drawers/bottom sheets
```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
```
**IMPORTANT** : le Sheet (et Dialog) nécessite `tailwindcss-animate` pour les animations slide/fade. Vérifier que `@plugin "tailwindcss-animate"` est dans `globals.css`. Sans ce plugin, les drawers s'ouvrent/ferment sans transition.

### Dialog (`@/components/ui/dialog`) — pour les modales centrées

### Skeleton (`@/components/ui/skeleton`) — pour les loading states

## Icônes — Lucide React UNIQUEMENT

```tsx
import { ShoppingCart, Check, Truck, Search, SlidersHorizontal } from "lucide-react";

// Tailles standard
<Icon className="h-4 w-4" />  // Small (dans texte, badges)
<Icon className="h-5 w-5" />  // Default (boutons, listes)
<Icon className="h-6 w-6" />  // Large (header, actions principales)
```

**JAMAIS d'inline SVG** sauf :
- Logo DBC (composant `DbcLogo` / `DbcLogoIcon` dans `@/components/ui/dbc-logo.tsx`)
- Brush strokes brand (images SVG via `<Image>` ou CSS background)

Icônes DBC :
| Action | Icône Lucide |
|--------|-------------|
| Panier | `ShoppingCart` |
| Recherche | `Search` |
| Filtres | `SlidersHorizontal` |
| Retour | `ArrowLeft` |
| Fermer | `X` |
| Check/Succès | `Check` |
| Livraison | `Truck` |
| Retour produit | `RotateCcw` |
| Calendrier | `Calendar` |
| Câble | `Cable` |
| Compte | `User` |
| Menu | `Menu` |
| Chevron | `ChevronDown`, `ChevronRight` |
| Étoile | `Star` |
| Bouclier | `Shield` / `ShieldCheck` |
| PDF | `FileText` |
| Modifier | `Pencil` |
| Supprimer | `Trash2` |
| WhatsApp | `MessageCircle` |
| Téléphone | `Phone` |
| Email | `Mail` |
| Horloge | `Clock` |

## Règles UX obligatoires

### Navigation & Layout
- Server components par défaut, `"use client"` seulement pour interactivité
- `max-w-7xl mx-auto px-4` pour le conteneur principal
- Mobile-first : styles de base = mobile, breakpoints pour desktop (`sm:`, `md:`, `lg:`, `xl:`)
- `StickyBottomBar` fixe en mobile pour le CTA principal (`fixed bottom-0 left-0 right-0 z-50`)
- `StickyHeader` en scroll sur desktop

### Boutons & Actions
- **1 seul bouton Primary par écran** (le CTA principal)
- CTA principal : `bg-green-700 text-white hover:bg-green-800`, pleine largeur sur mobile
- Boutons pill (checkout, filtres) : `rounded-full`
- Active state : `active:scale-[0.98]` pour le feedback tactile
- Success state temporaire : `bg-green-600 scale-[1.02]` pendant 2s après action

### Formulaires
- **Label visible au-dessus** de chaque champ (`<label className="mb-1 block text-sm font-medium text-gray-700">`)
- Utiliser `<Input>` de shadcn, PAS `<input>` natif
- Validation inline : `border-red-500` + message `<p className="mt-1 text-sm text-red-600">`
- PAS d'`Alert.alert()` ou `window.alert()` pour les erreurs
- Input type adapté : `type="email"`, `type="tel"`, `inputMode="numeric"`
- Focus ring : automatique via shadcn (`focus-visible:ring-ring/50`)

### Feedback
- **Toasts** : Sonner `toast.success()` / `toast.error()` — auto-dismiss, courtes
- **Loading** : Skeleton screens (`<Skeleton />`) pour le chargement initial
- **Spinner** : uniquement pour les actions en cours (submit, add to cart)
- Transitions CSS : `transition-all duration-150` (rapide) à `duration-300` (standard)

### Touch targets & accessibilité
- **Minimum 44x44px** pour tout élément interactif sur mobile
- `aria-label` sur les boutons icônes sans texte
- `aria-hidden="true"` sur les icônes décoratives
- `aria-pressed` pour les toggles/radio buttons
- Rôle `button` explicite via `type="button"` sur les boutons non-submit
- `<caption className="sr-only">` sur les `<table>` pour les screen readers

### Responsive (MOBILE-FIRST)
- **Toujours coder mobile d'abord**, puis ajouter les breakpoints pour desktop
- Breakpoints Tailwind : `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- Grid responsive : `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Éléments hidden/visible : `hidden md:flex`, `md:hidden`
- Bottom sheets : pleine largeur en mobile, carte positionnée en desktop (`md:w-[420px] md:right-6`)
- Sticky CTA : `StickyBottomBar` en mobile, `StickyHeader` en desktop
- Touch targets : >= 44px sur mobile (voir section Touch targets)

## Classes conditionnelles — TOUJOURS `cn()`

```tsx
import { cn } from "@/lib/utils";

// BON
<div className={cn(
  "rounded-2xl border p-4",
  selected ? "border-green-700 bg-green-50" : "border-gray-200 bg-white"
)} />

// MAUVAIS — template literals
<div className={`rounded-2xl border p-4 ${selected ? "border-green-700" : "border-gray-200"}`} />
```

## i18n — next-intl OBLIGATOIRE

```tsx
// Client component
import { useTranslations } from "next-intl";
const t = useTranslations("product");

// Server component
import { getTranslations } from "next-intl/server";
const t = await getTranslations({ locale, namespace: "product" });

// BON
<span>{t("addToCart")}</span>

// MAUVAIS — texte en dur
<span>Ajouter au panier</span>

// MAUVAIS — condition locale inline
<span>{locale === "fr" ? "Ajouter" : "Add"}</span>
```

**Note** : les pages légales (CGV, mentions légales, refund, etc.) ont le contenu body en français dans le JSX. C'est un compromis accepté — le contenu légal nécessite une traduction professionnelle. Les titres et labels UI sont i18n.

## Architecture

### Pattern de fichiers
```
src/
├── app/[locale]/(shop)/         # Pages (server components)
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Layout : TopBar + Header + CategoryNav + Footer
│   ├── products/                # Pages produits
│   ├── cart/page.tsx            # Panier
│   ├── checkout/                # Checkout flow
│   ├── help/page.tsx            # FAQ / Centre d'aide
│   ├── cgv/page.tsx             # Conditions Générales de Vente
│   ├── legal/page.tsx           # Mentions légales
│   ├── refund/page.tsx          # Politique retours/remboursements
│   └── shipping/page.tsx        # CGU / Politique d'expédition
├── components/
│   ├── ui/                      # shadcn/ui primitifs (NE PAS MODIFIER)
│   ├── layout/                  # Header, Footer, TopBar, CategoryNav, PolicyPage
│   ├── products/                # ProductCard, ProductGrid, configurator/
│   ├── filters/                 # FilterBar, FilterDropdown
│   ├── cart/                    # CartItemRow
│   └── home/                    # HeroSection, BrandValues
├── hooks/                       # Custom hooks
├── stores/                      # Zustand stores
├── lib/api/                     # API calls (services)
├── types/                       # TypeScript types
└── i18n/messages/               # FR/EN translations
```

### Séparation des responsabilités
1. **Pages** (`page.tsx`) : Fetch data (server), passer aux composants
2. **Composants** : JSX + appels hooks, PAS de fetch direct
3. **Hooks** : Logique métier, state management
4. **Stores** (Zustand) : State global persisté
5. **lib/api/** : Appels API backend

```tsx
// BON — page server component fetch + composant client
// page.tsx (server)
const data = await fetchProducts();
return <ProductGrid products={data} />;

// MAUVAIS — fetch dans le composant
function ProductGrid() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch('/api/...') }, []);  // NON
}
```

## Checklist avant validation
- [ ] Utilise les composants shadcn/ui (Button, Input, Card, Sheet, Dialog, Skeleton)
- [ ] Icônes Lucide uniquement (pas d'inline SVG sauf logo DBC et brush strokes)
- [ ] CTA principal : `bg-green-700 text-white hover:bg-green-800`, 1 seul par écran
- [ ] Classes conditionnelles via `cn()` (pas de template literals)
- [ ] Textes UI via `useTranslations()` / `getTranslations()` (pas de hardcoded FR/EN)
- [ ] Labels visibles sur tous les champs de formulaire
- [ ] Validation inline (pas d'alert)
- [ ] Touch targets >= 44px, `aria-label` sur boutons icônes, `aria-hidden` sur icônes déco
- [ ] Mobile-first responsive (`sm:`, `md:`, `lg:`)
- [ ] Animations < 300ms (`duration-150` à `duration-300`), `tailwindcss-animate` actif pour Sheet/Dialog
- [ ] Toasts via Sonner pour le feedback utilisateur
- [ ] Server component par défaut, `"use client"` seulement si nécessaire
- [ ] Types TypeScript définis (pas de `any`)
- [ ] Pas de hex/couleur en dur — toujours classes Tailwind
- [ ] `font-display` explicite sur les h1 hors prose containers
- [ ] Social media = TikTok + Snapchat uniquement (pas Facebook/Twitter/Instagram)
