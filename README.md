# 🎉 Viral Stick — KERNEL FORGE

**Studio créatif multimodal IA** pour générer et éditer des mèmes avec compagnons IA, web et mobile !

---

## 🌟 Présentation du projet

Viral Stick est une **application full-stack** conçue pour :
- ✨ Générer des mèmes à partir d'un **contexte textuel** (Context Reader)
- 🎤 Convertir une **transcription vocale** en mème (Voice to Meme)
- 📝 Remixer des images avec captions prêts pour les réseaux sociaux (Status Remixer)
- 🤖 Discuter avec des **compagnons IA** personnalisés
- 🧠 Faire du brainstorming avec tous les compagnons à la fois (Multi-Chat)
- 📱 Expérience mobile premium avec React Native
- 💻 Interface web moderne avec React

Le design suit le style **Duolingo-inspired** : couleurs vives, boutons 3D, typographie amusante !

---

## 👥 Membres de l'équipe — KERNEL FORGE

| Membre | Rôle | Compagnon | GitHub |
|--------|------|------------|--------|
| **NGHOMSI FEUKOUO RAVEL** | Leader du projet | 🤖 Arch | [@Archlord12345](https://github.com/Archlord12345) |
| **NGABISSI NGOUNOU Elisée** | Backend dev 2 | 📊 Data | [@Elisee-25](https://github.com/Elisee-25) |
| **JAM AFANE JEMINA** | Dev Audio/image | 🎨 Art | [@Graziella865](https://github.com/Graziella865) |
| **Demanou kenfack Ange Trecy** | Dev 1 mobile | 🔒 Secu | [@AngeTrecy](https://github.com/AngeTrecy) |
| **NGUEMA ARIDTIDE** | Testeur et rapport | 🐼 Ubu | [@ngurmaaristide](https://github.com/ngurmaaristide) |
| **Nguiffo pierre Ivan** | Testeur et rapport | 🧬 Bio | [@nguiffoloic](https://github.com/nguiffoloic) |
| **SALWE MARSALA** | Backend dev 1 | ⚡ Para | [@salwe-marsala](https://github.com/salwe-marsala) |
| **HASSANE YOUSSOUF OUMAR** | Dev 2 mobile | 🔒 Secu | [@Hawadja](https://github.com/Hawadja) |

---

## 📁 Structure du projet

- `mobile/` — Application mobile React Native
- `web/` — Application web React
- `backend/` — API Express.js et services IA
- `asset/` — Assets graphiques (logo, compagnons)
- `docs/` — Documentation technique
- `scripts/` — Scripts utilitaires (logo, build, etc.)
- `.github/workflows/` — CI/CD GitHub Actions

---

## 🚀 Installation

### Prérequis

- Node.js LTS
- npm
- Java 17 pour Android
- Android Studio (si compilation mobile)

### Installer les dépendances

```bash
cd backend && npm install
cd ../web && npm install
cd ../mobile && npm install
```

---

## 🔐 Variables d'environnement

Le backend utilise les variables suivantes (mettre dans `backend/.env` ou sur Vercel):

| Variable | Usage | Statut |
|----------|-------|--------|
| `PUTER_KEY` | Provider principal pour texte, conversation, images | 🔑 Requis |
| `OPENROUTER_API_KEY` | Fallback texte/image | Optionnel |
| `GEMINI_API_KEY` | Fallback texte/image | Optionnel |
| `MISTRAL_API_KEY` | Fallback texte | Optionnel |
| `DEEPSEEK_API_KEY` | Fallback texte | Optionnel |

---

## 🎯 Fonctionnalités principales

| Fonctionnalité | Description |
|----------------|-------------|
| **Context Reader** | Génère un mème à partir d'une situation écrite |
| **Voice to Meme** | Transforme une transcription vocale en mème |
| **Status Remixer** | Crée des captions prêts pour les réseaux sociaux |
| **Compagnons IA** | Discute avec Arch, Data, Art, Ubu, Bio, Para et Secu ! |
| **Multi Chat** | Interroge tous les compagnons à la fois |
| **Forum** | Partage et réagis aux mèmes de la communauté |
| **WhatsApp Ready** | Exporte des stickers optimisés pour WhatsApp |

---

## Android Build

Pour compiler l'APK :
```bash
npm run apk:debug
```

Pour compiler l'AAB :
```bash
npm run apk:release
```

### Build Security (Release APK)

Pour compiler l'APK de release, le projet nécessite une keystore de signature. **Ne jamais coder en dur** les identifiants dans `mobile/android/app/build.gradle`.

Utilisez plutôt `mobile/android/gradle.properties` :

1. Placez votre `my-upload-key.keystore` dans `mobile/android/app/`.
2. Configurez vos identifiants dans `mobile/android/gradle.properties` :
   ```properties
   MYAPP_RELEASE_STORE_FILE=my-upload-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=VOTRE_MOT_DE_PASSE
   MYAPP_RELEASE_KEY_PASSWORD=VOTRE_MOT_DE_PASSE
   ```
3. Assurez-vous que `mobile/android/gradle.properties` est bien ignoré par git (ajouté au `.gitignore`) pour ne jamais commiter vos secrets.

Les fichiers générés sont dans `mobile/android/app/build/outputs/apk/` et `mobile/builds/`.

---

## 🛠️ Tech Stack

- **Web**: React + CSS custom properties
- **Mobile**: React Native + Expo
- **Backend**: Express.js + Sharp + Firebase
- **IA**: Puter (principal), OpenRouter, Gemini, Mistral, DeepSeek

---

## 🎨 Design

Le projet suit un **Duolingo-inspired design system** :
- Couleur principale: #58cc02 (Viral Green)
- Couleur secondaire: #1cb0f6 (Sky Blue)
- Boutons avec ombre 3D et déplacement lors du clic
- Typographie: Fredoka One (titres) + Nunito (texte)

---

## ⚡ Scripts utiles

| Script | Usage |
|--------|-------|
| `npm run logo` | Met à jour les logos web, mobile et icônes Android |
| `npm run apk:debug` | Compile l'APK debug |
| `npm run apk:release` | Compile l'AAB release |

---

## 📜 Licence

Projet réalisé par **KERNEL FORGE** — 2026
github du projet: https://github.com/KERNEL-FORGE-G/VIRAL-STICK.git
web: viral-stick.vercel.app