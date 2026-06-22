# Planning — Viral Stick

Ce répertoire contient le planning détaillé du projet, incluant les sprints, les jalons et les dates de livrable.

## Sprint 1 — Définition du MVP 🎯

- Définition des 3 modules Core (Context Reader, Voice-to-Meme, Status Remixer)
- Mise en place de l'infrastructure (Backend Express, React Native CLI)
- Création du contrat API (`docs/contrat-api.md`)
- Mise en place du CI/CD GitHub Actions

## Sprint 2 — Backend & API 🖥️

- Développement des 3 endpoints API
- Intégration des services IA (Gemini, DeepSeek, Mistral)
- Middleware d'upload (Multer)
- Tests d'API

## Sprint 3 — Mobile & UI 📱

- Conception UI/UX (thème, glassmorphism, compagnons)
- Implémentation des 7 écrans (Home, Context Reader, Voice-to-Meme, Status Remixer, Settings, About, Companion Chat)
- Navigation Drawer animée
- Splash screen et icônes Android

## Sprint 4 — CI/CD & Build 🚀

- Pipeline GitHub Actions (lint → build APK → build AAB → upload artefacts)
- Signature Android (keystore via secrets GitHub)
- Environnement "I_AM_ELON_MUSK" pour les clés API
- Build de production APK/AAB

## CI/CD Pipeline

```yaml
Déclencheurs:
  - push (toute branche)
  - pull_request (vers main)
  - workflow_dispatch (manuel)

Jobs:
  1. Lint & Type Check (ESLint)
  2. Build Android:
     - Vérifie les secrets
     - Décode le keystore
     - Compile APK + AAB
     - Upload artefacts
```

## Secrets GitHub requis

| Niveau                       | Secret                    | Usage                  |
| ---------------------------- | ------------------------- | ---------------------- |
| Environment (I_AM_ELON_MUSK) | GEMINI_API_KEY            | Google Gemini AI       |
| Environment (I_AM_ELON_MUSK) | DEEPSEEK_API_KEY          | Fallback DeepSeek      |
| Environment (I_AM_ELON_MUSK) | MISTRAL_API_KEY           | Fallback Mistral       |
| Repository                   | ANDROID_KEYSTORE          | Signature APK (base64) |
| Repository                   | ANDROID_KEYSTORE_PASSWORD | Mot de passe keystore  |
| Repository                   | ANDROID_KEY_ALIAS         | Alias clé signature    |
| Repository                   | ANDROID_KEY_PASSWORD      | Mot de passe clé       |

> **À compléter** : ajoutez les fichiers `.md` ou `.xlsx` détaillant le calendrier.
