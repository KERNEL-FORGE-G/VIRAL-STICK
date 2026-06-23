# Viral Stick — KERNEL FORGE

Application de génération et d’édition de mèmes texte + image, avec compagnons IA, studio web et expérience mobile premium.

## 🚀 Vision produit

Viral Stick est pensé comme un **studio créatif multimodal** :
- génération de mèmes à partir d’un **contexte écrit**,
- transformation d’une **transcription vocale** en mème,
- **remix visuel / captioning** pour images, stickers et posts,
- système de **compagnons IA** comme identité produit et interface conversationnelle.

## 📁 Structure du projet

- `mobile/` — Application mobile React Native
- `web/` — Application web React
- `backend/` — API Express.js et services IA
- `asset/` — Assets graphiques (logo, compagnons)
- `docs/` — Documentation technique et cahier des charges
- `.github/workflows/` — CI/CD GitHub Actions

## ⚙️ Installation

### Prérequis

- Node.js LTS
- npm ou yarn
- Java 17 pour Android
- Android Studio si vous compilez le mobile

### Installer les dépendances

```bash
cd backend && npm install
cd ../web && npm install
cd ../mobile && npm install
```

## 🔐 Variables d’environnement IA

Le backend lit dynamiquement les variables suivantes :

| Variable | Usage | Statut |
| --- | --- | --- |
| `GEMINI_API_KEY` | Génération texte principale + tentative image Gemini | Recommandée |
| `MISTRAL_API_KEY` | Fallback génération texte | Optionnelle |
| `DEEPSEEK_API_KEY` | Fallback génération texte | Optionnelle |
| `HF_TOKEN` | Génération image via Hugging Face Inference Router (`FLUX.1-Krea-dev`) | Fortement recommandée |

### Remarques importantes

- Les **valeurs réelles des clés** ne sont pas vérifiables ici si vos `.env` sont privés.
- Le backend est conçu pour **continuer à fonctionner côté texte** même si un provider secondaire est absent.
- Côté **image**, si Gemini image ne répond pas ou n’est pas supporté dans votre environnement, le backend bascule vers **Hugging Face** si `HF_TOKEN` est présent.
- Sans `HF_TOKEN`, la génération image peut retomber sur un **fallback texte-only**.

## 🧠 Providers IA actuellement prévus

### Texte
Ordre de fallback dans `backend/services-ia/aiService.js` :
1. Gemini
2. Mistral
3. DeepSeek

### Image
Ordre actuel :
1. Hugging Face Inference Router sur `black-forest-labs/FLUX.1-Krea-dev`
2. fallback Gemini image (`gemini-2.5-flash-image`) si disponible
3. fallback sans image (`fallback-text-only`)

## 🖼️ Services IA image gratuits ou avec entrée gratuite

Si vous voulez une génération d’image utilisable sans gros budget, voici les meilleures options de départ :

### 1. Hugging Face
**Le plus simple pour commencer gratuitement** si vous avez juste besoin de tester ou d’avoir un petit volume.

Avantages :
- onboarding rapide,
- plusieurs modèles image disponibles,
- token unique,
- bonne option pour prototype produit.

Dans ce projet, c’est déjà la meilleure piste gratuite côté backend via `HF_TOKEN`.

### 2. Replicate
Souvent très pratique pour tester des modèles image modernes.

Avantages :
- UX simple,
- modèles variés,
- bonne doc.

Limite :
- gratuité généralement limitée en crédits.

### 3. Together AI / fal
Intéressant pour tester des modèles image performants.

Limite :
- les quotas gratuits évoluent selon les périodes.

### 4. Self-host open source
La vraie option “gratuite long terme” consiste à héberger vous-même un modèle open source (Flux, SDXL, etc.).

Limite :
- demande une machine GPU adaptée,
- plus complexe à opérer.

## 📦 Modules fonctionnels

| Module | Description | Rôle produit |
| --- | --- | --- |
| `Context Reader` | Analyse un contexte écrit et le transforme en mème 2 lignes | génération texte à partir d’une situation |
| `Voice → Mème` | Transforme une transcription orale en mème | préserve l’énergie du parlé |
| `Status Remixer` | Produit caption + suggestions d’édition visuelle | édition visuelle / social-ready |
| `Companion Chat` | Discute avec les compagnons IA | guidance produit / univers de marque |
| `Multi Chat` | Interroge tous les compagnons à la fois | brainstorming et réponses croisées |

## 🤖 CI/CD — GitHub Actions

Le workflow Android déclenche notamment :
- lint mobile,
- build APK / AAB,
- vérification de la présence des clés IA requises selon le pipeline.

### Secrets actuellement attendus

#### Globaux
- `ANDROID_KEYSTORE`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

#### Environnement / build
- `GEMINI_API_KEY`
- `DEEPSEEK_API_KEY`
- `MISTRAL_API_KEY`
- `HF_TOKEN` si vous activez réellement la génération image fallback Hugging Face

## 📱 Mobile — écrans principaux

- `mobile/src/screens/HomeScreen.js`
- `mobile/src/screens/ContextReaderScreen.js`
- `mobile/src/screens/VoiceToMemeScreen.js`
- `mobile/src/screens/StatusRemixerScreen.js`
- `mobile/src/screens/CompanionChatScreen.js`
- `mobile/src/screens/MultiChatScreen.js`
- `mobile/src/screens/SettingsScreen.js`
- `mobile/src/screens/AboutScreen.js`

## ⚠️ Points à connaître

- Les tests automatisés projet sont encore faibles ou absents selon les modules.
- La validité runtime exacte de certains providers dépend de vos clés et quotas réels.
- Un endpoint de debug sensible peut exister côté backend selon votre environnement : il doit être restreint avant une mise en prod publique.

## 🛠️ Validation utile

### Web
```bash
npm run build --prefix web
```

### Backend
Prévoyez des tests manuels avec des clés réelles pour :
- génération texte,
- fallback texte,
- génération image Gemini,
- fallback image Hugging Face.

---

_Projet réalisé par KERNEL FORGE — 2026_
