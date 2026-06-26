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
| `PUTER_KEY` | Provider principal pour texte, conversations et images | Fortement recommandée |
| `PUTER_PROMPT_MODEL` | Modèle HF pour fabriquer les prompts optimisés | Optionnelle |
| `PUTER_TEXT_MODEL` | Modèle HF pour génération texte structurée | Optionnelle |
| `PUTER_CHAT_MODEL` | Modèle HF pour les conversations compagnons | Optionnelle |
| `PUTER_REASONING_MODEL` | Modèle HF pour tâches de raisonnement renforcé | Optionnelle |
| `PUTER_MODEL` | Modèle HF pour la génération d’image | Optionnelle |
| `OPENROUTER_API_KEY` | Fallback texte ou image OpenRouter | Optionnelle |
| `OPENROUTER_MODEL` | Modèle texte OpenRouter | Optionnelle |
| `OPENROUTER_IMAGE_MODEL` | Fallback image OpenRouter | Optionnelle |
| `OPENROUTER_SITE_URL` | Référent d’application envoyé à OpenRouter | Optionnelle |
| `OPENROUTER_SITE_NAME` | Nom d’application envoyé à OpenRouter | Optionnelle |
| `GEMINI_API_KEY` | Fallback secondaire texte + image Gemini | Optionnelle |
| `MISTRAL_API_KEY` | Fallback secondaire génération texte | Optionnelle |
| `DEEPSEEK_API_KEY` | Fallback secondaire génération texte | Optionnelle |

### Remarques importantes

- Les **valeurs réelles des clés** ne sont pas vérifiables ici si vos `.env` sont privés.
- En local, le backend charge automatiquement `backend/.env.local`, `backend/.env`, puis les variantes racine si elles existent, via `backend/loadEnv.js`.
- Sur Vercel, les variables doivent être configurées dans le dashboard Vercel Project Settings → Environment Variables ; elles seront injectées par la plateforme sans dépendre du fichier `.env`.
- Le chargeur d'env n'écrase rien côté Vercel si la plateforme a déjà injecté les variables : les variables système restent prioritaires par l'ordre réel de déploiement.
- Le backend est conçu pour **continuer à fonctionner côté texte** même si un provider secondaire est absent.
- Le backend utilise **Puter** comme provider principal pour le texte, les conversations compagnons et les images.
- OpenRouter, Mistral, DeepSeek et Gemini restent des fallbacks selon le type de requête.
- Sans `PUTER_KEY` (ou `PUTER_TOKEN` legacy), le backend bascule automatiquement sur les providers secondaires configurés.

## 🧠 Providers IA actuellement prévus

### Texte
Ordre de fallback dans `backend/services-ia/aiService.js` :
1. Puter Prompt Model → Puter Text Model
2. Mistral
3. DeepSeek
4. Gemini
5. OpenRouter

### Conversations compagnons
Ordre actuel :
1. Puter Prompt Model → Puter Chat Model
2. Mistral / DeepSeek / Gemini / OpenRouter via fallback standard

### Image
Ordre actuel :
1. Puter Prompt Model → Puter Image Model `black-forest-labs/FLUX.1-schnell`
2. fallback image HF : `stabilityai/stable-diffusion-3-medium-diffusers`
3. fallback sans image (`puter-text-only-fallback`) si `hf-inference` n'est pas disponible pour votre compte

### Modèles recommandés par opération
- Prompt engineering général : `openai/gpt-oss-120b`
- Génération texte structurée / JSON : `openai/gpt-oss-120b`
- Conversations compagnons : `zai-org/GLM-4.5V`
- Raisonnement plus poussé / raffinage : `zai-org/GLM-4.5V`
- Génération image premium / économique : `black-forest-labs/FLUX.1-schnell`
- Fallback image HF validé : `stabilityai/stable-diffusion-3-medium-diffusers`

Le backend essaie maintenant plusieurs modèles Puter plausibles avant de basculer sur les providers de secours. La compatibilité réelle dépend toujours de votre token HF et doit être validée via `node backend/scripts/testPuterModels.js`. Sur ton compte actuel, les modèles image HF validés sont `black-forest-labs/FLUX.1-schnell` et `stabilityai/stable-diffusion-3-medium-diffusers` ; le système reste strictement Puter pour l'image et tombe proprement en `puter-text-only-fallback` si aucun modèle image HF n'est autorisé.

## 🖼️ Services IA image gratuits ou avec entrée gratuite

Si vous voulez une génération d’image utilisable sans gros budget, voici les meilleures options de départ :

### 1. Puter
**Le plus simple pour commencer gratuitement** si vous avez juste besoin de tester ou d’avoir un petit volume.

Avantages :
- onboarding rapide,
- plusieurs modèles image disponibles,
- token unique,
- bonne option pour prototype produit.

Dans ce projet, c’est désormais la colonne vertébrale côté backend via `PUTER_KEY`.

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

Documentation complémentaire :
- `docs/DEPLOYMENT_AND_VALIDATION.md`
- `docs/WHATSAPP_INTEGRATIONS.md`

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
- `PUTER_KEY`
- `PUTER_PROMPT_MODEL`
- `PUTER_TEXT_MODEL`
- `PUTER_CHAT_MODEL`
- `PUTER_REASONING_MODEL`
- `PUTER_MODEL`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `OPENROUTER_IMAGE_MODEL`
- `OPENROUTER_SITE_URL`
- `OPENROUTER_SITE_NAME`
- `GEMINI_API_KEY`
- `DEEPSEEK_API_KEY`
- `MISTRAL_API_KEY`
- `PUTER_TOKEN` uniquement pour compatibilité legacy

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
- génération image Puter,
- fallback image.

Script de validation rapide :
```bash
node backend/scripts/check_env.js
node backend/scripts/testPuterModels.js
node backend/scripts/discoverPuterImageModels.js
node backend/scripts/testImageProvider.js "Un mème visuel orange premium, réaction WhatsApp, composition forte, style Viral Stick"
```

Pour scanner une liste personnalisée de modèles image HF :
```bash
node backend/scripts/discoverPuterImageModels.js black-forest-labs/FLUX.1-Krea-dev Qwen/Qwen-Image runwayml/stable-diffusion-v1-5
```

---

_Projet réalisé par KERNEL FORGE — 2026_
