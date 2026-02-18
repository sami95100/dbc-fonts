---
name: push
description: "Add, commit et push tout sur les deux repos (dbcfront + dbcback)."
user-invocable: true
---

# /push — Push tout sur les deux repos

Tu dois add, commit et push TOUS les changements sur les deux repos :
- **Frontend** : `~/dbcfront`
- **Backend** : `~/dbcback`

## REGLE ABSOLUE

**INTERDICTION de repondre "done" ou "fait" tant que les deux repos n'ont pas ete verifies.**
Tu DOIS executer les 4 etapes ci-dessous dans l'ordre. Pas de raccourci.

## Procedure (les 4 etapes sont OBLIGATOIRES)

### Etape 1 — Verifier les deux repos EN PARALLELE

Lance ces deux commandes en parallele :
```bash
cd ~/dbcfront && git status && git diff --stat
```
```bash
cd ~/dbcback && git status && git diff --stat
```

### Etape 2 — Frontend (`~/dbcfront`)

Si des fichiers sont modifies ou untracked :
1. `git add -A`
2. Commit avec message descriptif (format : `feat:`, `fix:`, `style:`, `refactor:`, `chore:`)
3. `git push`

Si clean → note "dbcfront: clean"

### Etape 3 — Backend (`~/dbcback`)

Si des fichiers sont modifies ou untracked :
1. `git add -A`
2. Commit avec message descriptif
3. `git push`

Si clean → note "dbcback: clean"

### Etape 4 — Verification finale (OBLIGATOIRE)

Lance ces deux commandes en parallele pour CONFIRMER que tout est parti :
```bash
cd ~/dbcfront && git status
```
```bash
cd ~/dbcback && git status
```

Les deux doivent afficher "nothing to commit, working tree clean".
Si ce n'est pas le cas → recommence les etapes 2-3 pour le repo concerne.

### Etape 5 — Resume

Affiche :
```
dbcfront: <commit hash> — <message> (ou "clean")
dbcback:  <commit hash> — <message> (ou "clean")
```

## Regles

- TOUJOURS `git add -A` pour ne rien oublier
- TOUJOURS verifier AVANT et APRES
- Message de commit en anglais, format conventionnel
- NE PAS toucher a `~/BACKEND-MVP`
- Si un push echoue, affiche l'erreur clairement
