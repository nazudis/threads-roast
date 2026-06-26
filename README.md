# GOSONG 🔥 — Roast My Threads

Free, mobile-first web app: type a Threads username + vibe, upload a photo (compressed in-browser), get a shareable "roast certificate" card. Stateless, no login, no DB.

## Stack
Next.js (App Router) · TypeScript · Tailwind v4 · OpenAI-compatible AI (env-swappable) · `next/og` export · Vitest.

## Setup
```bash
npm install
cp .env.example .env.local   # add your OPENAI_API_KEY
npm run dev
```

## Env
| Var | Purpose |
|---|---|
| `OPENAI_API_KEY` | Provider key (server-only — never `NEXT_PUBLIC_`) |
| `OPENAI_BASE_URL` | Default `https://api.openai.com/v1`; swap for Groq/OpenRouter |
| `OPENAI_MODEL` | Default `gpt-4o-mini` |
| `ROAST_RATE_LIMIT` / `ROAST_RATE_WINDOW_MS` | Per-IP limiter (default 15/60s) |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | Optional Plausible-style analytics |

## Scripts
- `npm run dev` / `build` / `start`
- `npm test` — unit + integration
- `npm run qa:roasts` — batch content-safety review

## Architecture notes
- Photo is **never** sent to the AI; it's display-only, composited into the card by `/api/card` (`next/og`).
- `lib/cardTokens.ts` is the single source of design truth shared by the on-screen card and the OG render.
- Rate limiting is in-memory per-instance (best-effort on serverless) — upgrade to edge KV if it goes viral.

## Manual QA checklist (do before launch)
- [ ] iOS Safari: full flow + Web Share sheet (`navigator.share` present) saves the PNG.
- [ ] Android Chrome: full flow + share sheet.
- [ ] **Threads in-app browser** (the real target): open the URL from a Threads DM/post, run the full flow, confirm card export works.
- [ ] Desktop (no `navigator.share`): Download fallback produces the PNG.
- [ ] No-photo path → fallback monogram avatar renders on card + export.
- [ ] 6MB photo → compresses to ≤~1MB, "mengompres…" shows.
- [ ] PDF upload → friendly error, no crash.
- [ ] AI/provider error → friendly retry, no blank screen, no key in Network tab.
- [ ] Re-roll → visibly different roast.
- [ ] Time-to-card < 30s on a mid mobile connection.
