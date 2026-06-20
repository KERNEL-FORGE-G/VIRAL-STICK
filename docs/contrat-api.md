# Contrat API — Viral Stick

Ce document définit les endpoints obligatoires pour le MVP (Lot 1). Aucun développement côté client (mobile/web) ne doit commencer avant la validation finale de ce contrat par les Backend Devs.

| Endpoint | Méthode | Entrée (body) | Sortie attendue |
| --- | --- | --- | --- |
| `/api/context-reader` | POST | `{ "texte": string }` | `{ "memeTexte": string, "imageUrl": string }` |
| `/api/voice-to-meme` | POST | `multipart/form-data` (champ "audio") | `{ "transcription": string, "memeTexte": string, "imageUrl": string }` |
| `/api/status-remixer` | POST | `multipart/form-data` (champ "image") | `{ "memeTexte": string, "imageUrl": string }` |
