---
name: push
description: "Add, commit et push tout sur les deux repos (dbcfront + dbcback)."
user-invocable: true
---

# /push — Push tout sur les deux repos

Tu dois add, commit et push TOUS les changements sur les deux repos :
- **Frontend** : `~/dbcfront`
- **Backend** : `~/dbcback`

## Procédure

### 1. Frontend (`~/dbcfront`)

```bash
cd ~/dbcfront
git status
```

- S'il y a des fichiers modifiés ou untracked :
  1. `git add -A`
  2. Crée un commit avec un message descriptif basé sur les changements (format conventionnel : `feat:`, `fix:`, `style:`, `refactor:`, `chore:`)
  3. `git push`
- S'il n'y a rien à commit, passe au backend

### 2. Backend (`~/dbcback`)

```bash
cd ~/dbcback
git status
```

- S'il y a des fichiers modifiés ou untracked :
  1. `git add -A`
  2. Crée un commit avec un message descriptif basé sur les changements
  3. `git push`
- S'il n'y a rien à commit, confirme que tout est clean

### 3. Résumé

Affiche un résumé clair :
- Frontend : ce qui a été pushé (ou "already clean")
- Backend : ce qui a été pushé (ou "already clean")

## Règles

- TOUJOURS utiliser `git add -A` pour ne rien oublier
- TOUJOURS vérifier le status avant et après
- Message de commit en anglais, format conventionnel
- NE PAS toucher à `~/BACKEND-MVP` — c'est un projet séparé
- Si un push échoue, affiche l'erreur clairement
