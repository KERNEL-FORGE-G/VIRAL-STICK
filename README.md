# Viral Stick — KERNEL FORGE

Générateur de Mèmes & Stickers IA Multimodal.

## 🚀 À propos du projet

Viral Stick est une plateforme de création et de partage de contenus multimodaux (mèmes, stickers IA). Ce projet est le fruit du travail de l'équipe KERNEL FORGE pour l'exercice académique ICT202 (Générateur de Mèmes Multimodal) à l'Université de Yaoundé I.

## 📁 Structure du projet

- `mobile/` — Application mobile (React Native CLI).
- `web/` — Application web (ReactJS).
- `backend/` — API Express.js (MVC).
- `asset/` — Assets graphiques (logos, compagnons).
- `docs/` — Documentation technique et cahier des charges.
- `.github/workflows/` — CI/CD pipelines GitHub Actions.

## ⚙️ Configuration & Installation

### Prérequis

- Node.js (version LTS recommandée)
- npm ou yarn
- Java 17 (pour le build Android)
- Android Studio (pour l'émulateur)

### Installation (chaque module)

```bash
cd backend && npm install
cd ../web && npm install
cd ../mobile && npm install
```

### Initialisation du projet Android (mobile)

```bash
npx react-native@0.74.0 init ViralStick --directory /tmp/rn-init
cp -r /tmp/rn-init/ViralStick/android mobile/android
bash mobile/setup-android.sh mobile/android
```

## 🔐 Variables d'environnement / Secrets GitHub

Le projet utilise des **secrets GitHub** organisés en deux niveaux :

### Niveau 1 — Secrets globaux (Settings → Secrets → Actions)

| Secret                      | Description                                      |
| --------------------------- | ------------------------------------------------ |
| `ANDROID_KEYSTORE`          | Keystore Android encodé en base64                |
| `ANDROID_KEYSTORE_PASSWORD` | Mot de passe du keystore                         |
| `ANDROID_KEY_ALIAS`         | Alias de la clé de signature (`viral-stick-key`) |
| `ANDROID_KEY_PASSWORD`      | Mot de passe de la clé                           |

### Niveau 2 — Environnement "I_AM_ELON_MUSK" (Settings → Environments)

| Secret             | Description                      |
| ------------------ | -------------------------------- |
| `GEMINI_API_KEY`   | Clé API Google Gemini            |
| `DEEPSEEK_API_KEY` | Clé API DeepSeek (fallback IA)   |
| `MISTRAL_API_KEY`  | Clé API Mistral AI (fallback IA) |

### Générer le keystore

```bash
keytool -genkey -v -keystore viral-stick.keystore \
  -alias viral-stick-key -keyalg RSA -keysize 2048 \
  -validity 10000
base64 -w0 viral-stick.keystore > viral-stick.keystore.b64
```

## 🤖 CI/CD — GitHub Actions

Le workflow `.github/workflows/android-build.yml` déclenche automatiquement :

| Événement           | Déclencheur                       |
| ------------------- | --------------------------------- |
| `push`              | Toute branche                     |
| `pull_request`      | Vers `main`                       |
| `workflow_dispatch` | Manuel (avec choix debug/release) |

### Jobs

1. **Lint & Type Check** — ESLint sur le code mobile
2. **Build Android APK + AAB** — Compilation signée ou debug selon le contexte
   - Vérifie la présence des clés API (Gemini, DeepSeek, Mistral)
   - Décode le keystore depuis les secrets
   - Compile APK + AAB signés (release) ou non signés (debug)
   - Uploade les artefacts dans l'onglet "Summary" du run

### Secrets requis pour le CI

Ajoute dans **Settings → Secrets → Actions** et **Settings → Environments → I_AM_ELON_MUSK** les 7 secrets listés ci-dessus.

## 🧩 Modules

| Module            | Description                             | API Endpoint               |
| ----------------- | --------------------------------------- | -------------------------- |
| 📖 Context Reader | Analyse un texte et génère un mème IA   | `POST /api/context-reader` |
| 🎙️ Voice → Mème   | Transcription vocale → mème automatique | `POST /api/voice-to-meme`  |
| 🎨 Status Remixer | Remixe les images en stickers viraux    | `POST /api/status-remixer` |

## 📋 Développement & Workflow

- **Lead Technique :** NGHOMSI FEUKOUO Ravel (« Archlord ») github:@Archlord12345.
- **Workflow Git :** Une branche par feature. Pull Request vers `main` validée par le Lead.
- **Contrat API :** Référez-vous à `docs/contrat-api.md` avant tout développement réseau.

## ⚖️ Règle Designer

Le Designer doit valider chaque écran en temps réel. Aucun écran n'est considéré comme "terminé" sans validation visuelle directe.

## 📱 Mobile — Écrans

| Écran          | Fichier                              | Compagnon       |
| -------------- | ------------------------------------ | --------------- |
| Accueil        | `src/screens/HomeScreen.js`          | bio / ubu / art |
| Context Reader | `src/screens/ContextReaderScreen.js` | art             |
| Voice → Mème   | `src/screens/VoiceToMemeScreen.js`   | ubu             |
| Status Remixer | `src/screens/StatusRemixerScreen.js` | bio             |
| Compagnons     | `src/screens/CompanionChatScreen.js` | les 7           |
| Paramètres     | `src/screens/SettingsScreen.js`      | para            |
| À propos       | `src/screens/AboutScreen.js`         | arch            |

---

_Projet réalisé par KERNEL FORGE — 2026_
