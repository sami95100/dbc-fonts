---
name: feature
description: "Scaffold une feature full-stack de A a Z : migration SQL Supabase, backend Flask (blueprint public/v1), frontend Next.js (types, API, hook, composants, i18n). Utilise les patterns et conventions du projet DBC."
user-invocable: true
disable-model-invocation: true
argument-hint: [feature-name]
---

# Feature Full-Stack — DBC (Supabase + Flask + Next.js)

Tu scaffoldes la feature **$ARGUMENTS** en respectant l'architecture existante du projet.

---

## Etape 1 — Analyse

Avant de coder, lis et comprends le contexte :

1. **Lire CLAUDE.md** pour les conventions projet
2. **Lister les tables Supabase** existantes (`mcp__supabase__list_tables`)
3. **Lister les migrations** existantes (`mcp__supabase__list_migrations`)
4. **Explorer le backend** : `app/routes/public.py`, `app/middleware/`, `app/routes/__init__.py`
5. **Explorer le frontend** : `src/types/`, `src/lib/api/`, `src/hooks/`, `src/components/`, `src/i18n/messages/`

---

## Etape 2 — Migration SQL (Supabase)

Utilise `mcp__supabase__apply_migration` pour creer/modifier les tables.

**Regles :**
- Nom de migration en `snake_case` descriptif
- Toujours `ENABLE ROW LEVEL SECURITY`
- Policies : users voient/modifient leurs propres donnees (`auth.uid() = id`)
- Policy service_role pour le backend : `auth.role() = 'service_role'`
- Trigger `updated_at` si la table a un champ `updated_at`
- `UUID DEFAULT extensions.uuid_generate_v4()` pour les PKs auto
- `TIMESTAMPTZ DEFAULT now()` pour created_at/updated_at
- `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` pour les ajouts

---

## Etape 3 — Backend Flask

### 3a. Middleware (si besoin d'auth)

Reutiliser `app/middleware/supabase_auth.py` :

```python
from app.middleware.supabase_auth import require_supabase_auth
```

Le decorateur `@require_supabase_auth` fournit :
- `g.user_id` (str UUID)
- `g.user_email` (str)
- `g.user` (objet Supabase user)

### 3b. Routes dans `app/routes/public.py`

Ajouter les endpoints au blueprint `public_v1_bp` existant.

**Patterns :**
- Extraire les helpers en fonctions privees `_nom_helper()`
- Constantes module-level en `UPPER_SNAKE` (ex: `frozenset` pour champs autorises)
- Eviter les N+1 : utiliser les joins Supabase `select('*, relation(*)')`
- Retourner `jsonify(...)` avec status codes corrects (200, 201, 400, 401, 404, 500)
- Docstring sur chaque route

**Si les routes sont trop nombreuses :** creer un fichier `app/routes/public_<feature>.py` et l'importer dans `app/routes/public.py`.

### 3c. Enregistrement

Verifier que `public_v1_bp` est bien enregistre dans `app/__init__.py` a `/api/public/v1`.

---

## Etape 4 — Frontend Types

Creer `src/types/<feature>.ts` :

```typescript
export interface FeatureName {
  id: string;
  // ... champs avec types stricts
  created_at: string;
  updated_at: string;
}

export interface UpdateFeaturePayload {
  // ... champs optionnels pour update
}
```

**Regles :** pas de `any`, interfaces pour objets, types pour unions.

---

## Etape 5 — Frontend API

Creer `src/lib/api/<feature>.ts` :

```typescript
import { publicApiWithAuth } from "./client";
import type { FeatureName, UpdateFeaturePayload } from "@/types/<feature>";

export async function getFeature(accessToken: string) {
  return publicApiWithAuth(accessToken).get<FeatureName>("/endpoint");
}

export async function updateFeature(accessToken: string, data: UpdateFeaturePayload) {
  return publicApiWithAuth(accessToken).put<FeatureName>("/endpoint", data);
}
```

**Client API disponible** (`src/lib/api/client.ts`) :
- `api` — admin backoffice (`/api`)
- `publicApi` — catalogue public (`/api/public/v1`)
- `publicApiWithAuth(token)` — public + JWT Supabase (`.get`, `.post`, `.put`, `.delete`)

---

## Etape 6 — Frontend Hook

Creer `src/hooks/use<Feature>.ts` :

```typescript
"use client";

import { useState, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
// ... imports API

export function use<Feature>() {
  const { getAccessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  // ... state

  const fetch = useCallback(async () => { ... }, [getAccessToken]);
  const save = useCallback(async () => { ... }, [getAccessToken, form]);

  return { loading, fetch, save, /* ... */ };
}
```

**Regles :**
- `useCallback` pour les fonctions passees en deps d'effet
- Retourner un objet plat (pas de nesting)
- Le hook gere : loading, error, saved states

---

## Etape 7 — Frontend Composants

Creer dans `src/components/<feature>/` :

```
src/components/<feature>/
├── FeatureForm.tsx        # Formulaire principal
├── FeatureCard.tsx         # Card d'affichage (si liste)
└── FeatureItemRow.tsx      # Ligne individuelle (si items)
```

**Regles :**
- Mobile-first : `px-4 py-6 md:px-6 md:py-8`
- Composant server par defaut, `"use client"` seulement si interactivite
- Props bien typees (pas de `any`)
- Extraire les sous-composants repetitifs (ex: `FormField`)
- Utiliser `@/components/ui/*` (shadcn/ui) pour Input, Button, etc.
- Utiliser `cn()` pour classes conditionnelles

---

## Etape 8 — i18n

Ajouter les traductions dans les DEUX fichiers :
- `src/i18n/messages/fr.json`
- `src/i18n/messages/en.json`

Ajouter une section au bon endroit dans le JSON existant. Ne pas casser la structure.

---

## Etape 9 — Integration dans les pages

Modifier les pages existantes dans `src/app/[locale]/(shop)/` pour utiliser les nouveaux composants et hooks.

**Regles :**
- La page compose les composants, elle ne contient pas de logique metier
- La page fait < 150 lignes idealement
- Utiliser les hooks pour la logique
- Pas de constantes en dur dans les pages (extraire dans `src/lib/constants.ts`)

---

## Etape 10 — Verification

1. **Diagnostics TS** : verifier avec `mcp__ide__getDiagnostics` sur chaque fichier modifie
2. **Pas d'imports inutilises**
3. **Pas de variables non lues**
4. **Conventions CLAUDE.md respectees** (mobile-first, Wise design, pas d'emoji, etc.)

---

## Checklist finale

- [ ] Migration SQL executee et verifiee
- [ ] RLS + policies en place
- [ ] Backend : endpoints dans public_v1_bp, helpers extraits
- [ ] Frontend : types stricts, API typee, hook reutilisable
- [ ] Frontend : composants < 150 lignes, extraire si plus
- [ ] i18n : FR + EN
- [ ] Pages : composent les modules, pas de logique inline
- [ ] Zero erreur TS
- [ ] Pas de duplication (constantes partagees, hook reutilisable)
