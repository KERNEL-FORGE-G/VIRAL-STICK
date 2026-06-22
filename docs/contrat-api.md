# Contrat API — Viral Stick

Ce document définit les endpoints obligatoires pour le MVP (Lot 1). Aucun développement côté client (mobile/web) ne doit commencer avant la validation finale de ce contrat par les Backend Devs.

## Endpoints

| Endpoint              | Méthode | Entrée (body)                         | Sortie attendue                                                        |
| --------------------- | ------- | ------------------------------------- | ---------------------------------------------------------------------- |
| `/api/context-reader` | POST    | `{ "texte": string }`                 | `{ "memeTexte": string, "imageUrl": string }`                          |
| `/api/voice-to-meme`  | POST    | `multipart/form-data` (champ "audio") | `{ "transcription": string, "memeTexte": string, "imageUrl": string }` |
| `/api/status-remixer` | POST    | `multipart/form-data` (champ "image") | `{ "memeTexte": string, "imageUrl": string }`                          |

## Clés API (environnement "I_AM_ELON_MUSK")

Les services IA utilisent les clés suivantes, injectées via GitHub Actions :

| Clé                | Service          | Fallback   |
| ------------------ | ---------------- | ---------- |
| `GEMINI_API_KEY`   | Google Gemini AI | Primaire   |
| `DEEPSEEK_API_KEY` | DeepSeek AI      | Fallback 1 |
| `MISTRAL_API_KEY`  | Mistral AI       | Fallback 2 |

## CI/CD

Le build Android est automatisé via `.github/workflows/android-build.yml` :

1. Vérification des clés API (Gemini, DeepSeek, Mistral)
2. Décode le keystore depuis les secrets GitHub
3. Compile APK (debug ou release) + AAB (release)
4. Upload des artefacts dans GitHub Actions
