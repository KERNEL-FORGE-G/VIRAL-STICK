# Viral Stick — KERNEL FORGE

Application de génération et d'édition de mèmes, stickers animés (GIF) et compagnons IA.

## Structure

- `backend/` — API Express + pipelines IA (taskRouter)
- `web/` — React SPA
- `mobile/` — React Native
- `docs/` — Documentation technique

## Installation

```bash
cd backend && npm install
cd ../web && npm install
cd ../mobile && npm install
```

## Variables d'environnement

| Variable | Rôle | Priorité |
| --- | --- | --- |
| `GEMINI_API_KEY` | Texte / mèmes | Primary |
| `GROQ_API_KEY` | Transcription Whisper | Primary audio |
| `MISTRAL_API_KEY` | Texte fallback | Fallback 1 |
| `PUTER_KEY` | Texte + image + audio fallback | Fallback 2 |
| `DEEPSEEK_API_KEY` | Texte fallback | Fallback 3 |
| `OPENROUTER_API_KEY` | Texte fallback ultime | Fallback 4 |
| Pollinations.ai | Image | Primary (sans clé) |

Copie `backend/.env.example` vers `backend/.env` et remplis les clés.

## Architecture IA

Chaque requête utilise **un seul provider actif par étape**, avec fallback séquentiel :

```
text  → Gemini > Mistral > Puter > DeepSeek > OpenRouter
image → Pollinations > PollinationsFlux > Puter
audio → Groq Whisper > Puter Whisper
sticker/gif → Sharp + gifenc (local)
```

**Optimisation** : 1 appel texte + 1 appel image par génération de mème (plus de prompt-factory en cascade).

Commentaire compagnon : optionnel (`companionComment: true` dans le body).

## Endpoints principaux

| Route | Description |
| --- | --- |
| `POST /api/memes/generate-from-text` | Texte → mème |
| `POST /api/memes/voice-to-meme` | Audio ou transcription → mème |
| `POST /api/memes/transcribe` | Audio → transcription seule |
| `POST /api/memes/status-remixer` | Remix status/image |
| `POST /api/sticker/studio` | Face swap + texte + export PNG/GIF |
| `POST /api/sticker/gif` | Image → GIF animé |
| `POST /api/sticker/face` | Face swap sticker |

## Modules UI

- **Context Reader** — texte → mème
- **Voice → Mème** — voix → mème (web : MediaRecorder)
- **Status Remixer** — remix visuel
- **Sticker Studio** — sticker + visage + export PNG/GIF
- **Compagnons / Multi-Hub** — chat (1 IA active à la fois)

## Lancement local

```bash
# Backend
cd backend && npm start

# Web
cd web && npm start
```

## Déploiement

Voir `docs/DEPLOYMENT_AND_VALIDATION.md` et `vercel.json`.
