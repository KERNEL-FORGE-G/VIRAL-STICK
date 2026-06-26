# Deployment & Validation Guide

## Environment variables

### Local backend
Use `backend/.env` or `backend/.env.local`.

Recommended values:

```env
PUTER_KEY=...
PUTER_PROMPT_MODEL=openai/gpt-oss-120b
PUTER_TEXT_MODEL=openai/gpt-oss-120b
PUTER_CHAT_MODEL=zai-org/GLM-4.5V
PUTER_REASONING_MODEL=zai-org/GLM-4.5V
PUTER_MODEL=black-forest-labs/FLUX.1-schnell
```

## Vercel
Add the same variables in Project Settings -> Environment Variables.

## Functional validation checklist

### Backend
```bash
node backend/scripts/check_env.js
node backend/scripts/testPuterModels.js
node backend/scripts/discoverPuterImageModels.js
node backend/scripts/testImageProvider.js "Un mème visuel orange premium, réaction WhatsApp, composition forte, style Viral Stick"
```

### Web
```bash
npm run build
```

Pages covered by the current codebase:
- `/`
- `/context`
- `/chat`
- `/multi-chat`
- `/remix`
- `/settings`
- `/about`

### Android
```bash
cd mobile/android
./gradlew assembleRelease
```

APK output:
`mobile/android/app/build/outputs/apk/release/app-release.apk`

## Status Remixer input contract
`POST /api/memes/status-remixer`

JSON body can include:

```json
{
  "text": "optional text prompt",
  "location": "international",
  "imageContext": "optional visual hints",
  "inputImageUrl": "optional remote/local image url",
  "inputImageBase64": "optional data URL or base64"
}
```

Response includes:

```json
{
  "meme_text": "...",
  "visual_enhancements": ["..."],
  "descriptionImage": "...",
  "sourceImageUrl": "...",
  "imageUrl": "...",
  "imageProvider": "...",
  "fallback": false,
  "companionComment": "..."
}
```

## Notes
- Web supports image upload as base64 input.
- Backend accepts larger JSON payloads for image base64 (`20mb`).
- Mobile currently supports image-aware pipeline fields, but not a full native gallery/camera picker yet.
- Image generation uses Pollinations.ai (primary, free) with Puter fallback.
- If Puter Router returns `402 Payment Required` on text models, your monthly included credits are exhausted; text generation will rely on configured fallbacks when available.
