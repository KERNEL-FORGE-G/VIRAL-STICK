# Spécifications — Viral Stick

Ce répertoire contient les **spécifications fonctionnelles** du projet Viral Stick.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  Mobile RN   │────▶│  Backend API  │────▶│ Services IA │
│  (React)     │◀────│  (Express)    │◀────│ (Gemini/...) │
└─────────────┘     └──────────────┘     └────────────┘
```

## CI/CD — GitHub Actions

**Fichier :** `.github/workflows/android-build.yml`

**Déclencheurs :**

- `push` sur toute branche
- `pull_request` vers `main`
- `workflow_dispatch` (manuel)

**Jobs :**

1. **Lint** — ESLint sur `mobile/src/`
2. **Build Android** — APK + AAB, signé ou debug

**Environnement GitHub :** `I_AM_ELON_MUSK`

**Secrets :**

- `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, `MISTRAL_API_KEY` (environment-scoped)
- `ANDROID_KEYSTORE`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` (repository-scoped)

## Thème & Design System

- **Dark theme :** Fond `#0A0A1A`, accents violet `#7C3AED` / cyan `#06B6D4`
- **Light theme :** Fond `#F5F3FF`, accents violet `#7C3AED` / cyan `#0891B2`
- **Glassmorphism :** Arrière-plan semi-transparent avec flou, bordure subtile
- **Typographie :** System (Inter sur Android), échelle xs → hero
- **Composants :** GlassCard, AnimatedButton, CompanionAvatar, GradientText

## Écrans

| Écran          | Route         | Compagnon       |
| -------------- | ------------- | --------------- |
| Accueil        | Home          | bio / ubu / art |
| Context Reader | ContextReader | art             |
| Voice → Mème   | VoiceToMeme   | ubu             |
| Status Remixer | StatusRemixer | bio             |
| Compagnons     | CompanionChat | Les 7           |
| Paramètres     | Settings      | para            |
| À propos       | About         | arch            |

> **À faire** : l'équipe devra ajouter les documents `.md`, `.docx` ou `.pdf` décrivant chaque exigence.
