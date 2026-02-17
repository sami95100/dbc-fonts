---
name: ui-check
description: "Audit un écran ou composant DBC contre le design system + Brand DNA. Vérifie la conformité des couleurs, spacing, touch targets, UX patterns, branding et architecture."
user-invocable: true
disable-model-invocation: true
argument-hint: [screen-or-component-path]
allowed-tools: Read, Grep, Glob
---

# Audit UI — DBC Design System + Brand DNA (Next.js + Tailwind + shadcn/ui)

Tu audites le fichier `$ARGUMENTS` contre le design system DBC.

## Procédure d'audit

### 1. Lire le fichier cible
Lis le fichier `$ARGUMENTS`. Si c'est un nom sans chemin, cherche dans `src/app/[locale]/(shop)/`, `src/components/`, et `src/screens/`.

### 2. Vérifier les couleurs
- [ ] Utilise les classes Tailwind (pas de hex en dur)
- [ ] CTA principal = `bg-green-700 text-white hover:bg-green-800`
- [ ] CTA hero/highlight = `bg-highlight text-highlight-foreground`
- [ ] Selected states = `border-green-700 bg-green-50`
- [ ] Texte principal = `text-gray-900`, secondaire = `text-gray-500`/`text-gray-600`
- [ ] Bordures = `border-gray-200`
- [ ] Hero/Footer backgrounds = `bg-primary`
- [ ] Pas de couleurs non-sémantiques (`'#333'`, `'gray'`, `rgb(...)`)

### 3. Vérifier les composants shadcn/ui
- [ ] Utilise `<Button>` de `@/components/ui/button` (pas `<button>` custom stylé)
- [ ] Utilise `<Input>` de `@/components/ui/input` (pas `<input>` natif stylé)
- [ ] Utilise `<Card>` pour les conteneurs structurés
- [ ] Utilise `<Sheet>` pour les drawers, `<Dialog>` pour les modales
- [ ] Utilise `<Skeleton>` pour les loading states

### 4. Vérifier les icônes
- [ ] Icônes via **Lucide React** uniquement (`import { Icon } from "lucide-react"`)
- [ ] PAS d'inline `<svg>` (sauf logo DBC via `DbcLogo`/`DbcLogoIcon` et brush strokes brand via `<Image>`)
- [ ] Tailles cohérentes : `h-4 w-4`, `h-5 w-5`, `h-6 w-6`
- [ ] `aria-hidden="true"` sur les icônes décoratives

### 5. Vérifier la typographie & spacing
- [ ] Titres en `font-display` (Almarena Neue Display) — explicite sur les h1 hors prose containers
- [ ] `prose-headings:font-display` pour les h2/h3 dans les prose containers
- [ ] Conteneur principal = `max-w-7xl mx-auto px-4`
- [ ] Pages légales = `max-w-3xl mx-auto px-4` (exception acceptée)
- [ ] Espacements en classes Tailwind standard (multiples de 4px)
- [ ] Section spacing = `py-8` à `py-12`

### 6. Vérifier les classes conditionnelles
- [ ] Utilise `cn()` de `@/lib/utils` pour les classes conditionnelles
- [ ] PAS de template literals `` `${condition ? 'class-a' : 'class-b'}` ``

### 7. Vérifier l'i18n
- [ ] Textes UI via `useTranslations()` (client) ou `getTranslations()` (server) de `next-intl`
- [ ] PAS de texte hardcodé en français ou anglais pour les labels/boutons/titres
- [ ] PAS de `locale === "fr" ? "..." : "..."` inline
- [ ] **Exception acceptée** : contenu body des pages légales (CGV, mentions légales, etc.) peut rester en FR dans le JSX — nécessite traduction pro
- [ ] Dates internationalisées (pas de "juillet 2025" en dur, utiliser clé i18n)

### 8. Vérifier les touch targets & accessibilité
- [ ] Éléments interactifs >= 44x44px sur mobile (min-h-[44px] si nécessaire)
- [ ] `aria-label` sur les boutons sans texte visible
- [ ] `aria-hidden="true"` sur les icônes décoratives
- [ ] `aria-pressed` sur les toggles/radio buttons
- [ ] `type="button"` explicite sur les boutons non-submit
- [ ] `<caption className="sr-only">` sur les `<table>` HTML
- [ ] Liens contact actionables : `href="tel:..."`, `href="mailto:..."`, `href="https://wa.me/..."`

### 9. Vérifier l'architecture
- [ ] Server component par défaut, `"use client"` seulement si hooks/events
- [ ] Pas de fetch/API call direct dans les composants (sauf hooks)
- [ ] Types TypeScript définis (pas de `any`, pas de `as any`)
- [ ] `memo()` sur les composants de liste (items répétés)

### 10. Vérifier le responsive (MOBILE-FIRST)
- [ ] **Mobile-first obligatoire** : styles de base = mobile, breakpoints ajoutent le desktop
- [ ] Pas de styles desktop-only sans équivalent mobile
- [ ] Breakpoints utilisés : `sm:`, `md:`, `lg:`, `xl:` (jamais de styles desktop en base)
- [ ] Éléments cachés/affichés correctement (`hidden md:flex`, `md:hidden`)
- [ ] Grilles : `grid-cols-1` en base, `sm:grid-cols-2`, `lg:grid-cols-3`, `xl:grid-cols-4`
- [ ] Bottom sheets/modales : pleine largeur en mobile, card positionnée en desktop
- [ ] CTA sticky en mobile (`StickyBottomBar`), header sticky en desktop
- [ ] Texte lisible sans zoom sur mobile (min `text-sm` = 14px)

### 11. Vérifier la Brand DNA
- [ ] **Messages** : utilise les messages clés DBC si pertinent ("On fait bouger l'industrie", etc.)
- [ ] **Brush strokes** : éléments graphiques brush utilisés comme accents si section de marque (hero, values, about)
- [ ] **Social media** : liens vers TikTok + Snapchat UNIQUEMENT (pas Facebook/Twitter/Instagram)
- [ ] **Trust signals** : "11 magasins physiques" visible si homepage/trust section
- [ ] **Logo** : utilise les composants `DbcLogo` / `DbcLogoIcon` (pas de copie SVG inline)
- [ ] **Ton** : messages marketing = direct, jeune, accessible (pas corporate)

## Format du rapport

```
## Audit UI : [nom du fichier]

### Score : X/11 catégories conformes

### Conforme
- [liste des points OK]

### Avertissements
- [points non-bloquants à améliorer]

### Non conforme
- [violations du design system avec ligne et correction suggérée]

### Corrections proposées
[Code exact des corrections à appliquer]
```
