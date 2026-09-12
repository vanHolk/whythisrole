# whythisrole

Browser-only tool for candidates who have already been asked to submit a short
video answer. Paste a job description, generate talking points and a short
script, then record with a cue overlay near the camera.

Video never leaves the browser tab. There are no accounts and no server-side
storage.

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

This repo pins Vite 6 so it runs on Node 22.11. Camera and microphone permission are required for the recorder. Use a desktop browser: Chrome, Edge, or Firefox first; Safari is best-effort.

## Environment

Copy `.env.example` to `.env` when you wire real APIs. Keys stay on the server
(`GROQ_API_KEY`, `STRIPE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`,
`UPSTASH_REDIS_REST_TOKEN`). Do not prefix those with `VITE_`.

`npm run dev` defaults `USE_MOCK_GENERATE=true` so generate uses static
placeholder copy. Set `USE_MOCK_GENERATE=false` and `GROQ_API_KEY` to
call Groq locally. Production should leave mock off and set Upstash for
per-IP rate limits (5/min). Without Upstash, the real path uses a process-local
in-memory limiter only.

Payments are still stubbed. `npm run dev` serves `/api` through a local Vite
plugin so the full loop works without Vercel.

## Deploy

Vercel (static app + Edge Functions in `/api`). This hosts the app and the
small proxy functions only — not video.
