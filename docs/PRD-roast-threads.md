# PRD — "Roast My Threads" (working title)

**Author:** Fauzan
**Status:** Draft v1 — ready for vibe-coding handoff
**Last updated:** 2026-06-26

---

## 0. One-liner

A free, single-purpose web app: a user types their Threads username, uploads a profile photo (compressed client-side), and gets back a shareable, aesthetically-designed "roast card" they want to screenshot and post back to Threads.

**Distribution thesis:** The product is not the app — it's the *output card*. The card must be screenshot-worthy enough that sharing it feels like self-expression, not advertising. Every shared card carries the tool's name → free organic distribution.

---

## 1. Problem Statement

Threads culture spreads through screenshots and quote-posts, not links. A "fun web app" only goes viral if its *output* is share-worthy on its own. Today there's no lightweight, Indonesian-language tool that turns "your Threads persona" into a single, funny, beautiful artifact a user is proud to post. The core problem to solve is not "build a roast generator" — it's "produce an output card with a high voluntary share-rate."

**Who experiences it:** Indonesian Threads users who enjoy self-deprecating, debate-bait, and identity-signaling content (the dominant share mechanics on Threads).

**Cost of not solving it well:** The app gets *used* but not *shared* — fun for the individual, dead as a growth loop.

---

## 2. Goals

Outcomes, not outputs:

1. **High share-rate.** ≥20% of users who generate a card voluntarily download/share it. (This is the make-or-break metric.)
2. **Fast time-to-card.** A user goes from landing to finished card in under 30 seconds.
3. **Brand carry.** 100% of generated cards visibly carry the tool name/handle, so every share is a distribution event.
4. **Repeatability.** The output feels fresh enough that ≥15% of users generate a second card (re-roll) in the same session.
5. **Zero-cost-to-try.** No login, no payment, no friction before the first card.

---

## 3. Non-Goals (explicitly out of scope for v1)

1. **No Threads data fetching.** We do NOT pull profile photos, bios, or posts from Threads. (Threads has no legitimate public API for arbitrary-user profile data; scraping is fragile and against ToS.) The user uploads their own photo and optionally types their own vibe. *Rationale: removes the single biggest technical risk.*
2. **No roasting the uploaded photo.** The AI never analyzes the face/appearance. The photo is **display-only** on the card. *Rationale: appearance-based roasting is easy to get cruel and brushes against sensitive territory; behavior/vibe roasting is funnier and safer.*
3. **No accounts / no database (v1).** Stateless. No persistence of users or cards server-side. *Rationale: ship fast, validate the loop first.*
4. **No payments.** Free tool; monetization is a later question.
5. **No leaderboard / multiplayer / compatibility modes.** Tempting, but each is a separate validation. Parking-lot them.

---

## 4. Target Users

- **Primary:** Indonesian Threads users, casual, mobile-first, who post relatable/funny content. Bahasa Indonesia is the default language of all user-facing copy and roast output.
- **Device reality:** Assume the majority arrive on mobile, often from a Threads in-app browser. Mobile-first design is non-negotiable.

---

## 5. User Stories

Ordered by priority.

- As a Threads user, I want to type my username and get a roast card so I have something funny to post.
- As a mobile user, I want to upload a photo from my phone and have it just work (no manual resizing) so the flow stays fast.
- As a user, I want the card to look genuinely designed (not "AI-generated") so I'm proud to screenshot it.
- As a user, I want to download or share the card in one tap so posting it back to Threads is effortless.
- As a user, I want to re-roll the roast if I don't like the first one so I get a version I love.
- As a user with a slow connection, I want a clear loading state and graceful errors so I don't think the app is broken.
- **Edge / empty states:**
  - As a user who submits no photo, I want a stylized fallback avatar so the card still looks complete.
  - As a user who uploads a huge/wrong-format file, I want a clear message (and auto-compression) rather than a crash.
  - As a user when the AI fails, I want a friendly retry, not a blank screen.

---

## 6. Scope — The Two Views

### View 1 — Input

- Field: **Username** (text, with a leading `@` affordance). Required.
- Field: **Vibe / bio (optional)** — short free-text, e.g. "tukang quote, jarang posting, hobi war di reply." This is what the AI actually roasts. Placeholder copy should teach the user what to write.
- **Photo upload** — tap to pick from gallery/camera. Compress **on upload, client-side** (see §8). Show a small preview + "ganti foto" option. Optional (fallback avatar if skipped).
- Primary CTA: **"Roast gue 🔥"** (or similar). Disabled until username is present.
- Micro-copy setting expectations: this is for fun, roast is about your posting behavior, not your looks.

### View 2 — Result / Card

- The **roast card**: profile photo + `@username` + the AI roast text + tool branding. Designed as a single cohesive artifact (see §7).
- Actions: **Download card** (primary), **Re-roll roast** (secondary), **Roast lagi / mulai ulang** (tertiary, back to View 1).
- The card must be exportable as a single image (see §8, card export).

---

## 7. Design Direction (hard requirement: must NOT look "AI-generated")

The explicit brief: dominant **red ("roasted")**, and it must not read as generic AI slop. Concrete guardrails for the vibe-coding session:

**Aesthetic concept — pick ONE and commit fully.** Recommended: *"fight-poster / hazard-stamp roast certificate"* — loud, printed, a little dangerous. Alternatives worth a look: vintage boxing/wanted poster, thermal-receipt-from-hell, tabloid front page. The point is a *strong point of view*, executed precisely.

**Color**
- Dominant red, but layered — not one flat red. e.g. deep oxblood/char base, hot vermillion accent, near-black charcoal background (warm-toned, not pure #000). Define as CSS variables.
- Add atmosphere: subtle grain/noise overlay, a faint radial "heat" glow behind the card. Avoid flat solid-color backgrounds.

**Typography (CRITICAL — this is where AItells show)**
- **Ban list:** Inter, Roboto, Arial, system fonts, Space Grotesk. These scream "default."
- Pair a **distinctive heavy display font** (condensed/poster-style for the word "ROAST" and the headline) with a **characterful body/label font** (a mono works great for the "stamped certificate / receipt" feel). Use `next/font`.
- Suggestions (not mandatory): display like Anton / Archivo Black / a high-contrast editorial serif; body/labels in a mono like IBM Plex Mono or JetBrains Mono. Choose intentionally; don't converge on defaults.

**Layout & detail**
- Mobile-first, but the card itself should export at a fixed share-friendly ratio (recommend 4:5 or 1:1 — the Threads/IG-friendly portrait).
- Decorative details that sell the concept: a red ring/frame on the photo, a "severity meter" or stamp ("CERTIFIED CRISPY / WELL DONE / GOSONG"), perforated/ticket edges, a fake serial number, the tool handle as a footer "watermark."
- Unify the uploaded photo into the palette (e.g. slight grayscale + warm/red duotone or a red ring) so user photos of any color don't break the aesthetic.

**Motion (light touch)**
- One well-orchestrated reveal when the card appears (staggered: photo → roast text → stamp). Avoid scattered micro-animations. CSS-first.

---

## 8. Technical Requirements

### Stack
- **Next.js (App Router)** + **TailwindCSS** + **TypeScript**.
- AI via an **OpenAI-compatible** endpoint (works with OpenAI, Groq, OpenRouter, etc.), configured by env so the provider/model is swappable.

### Architecture
- **Frontend:** two views (can be one page with state, or `/` + `/result`). Client component handles upload, compression, and form.
- **Server:** a **Route Handler** (`app/api/roast/route.ts`) that holds the API key and calls the AI. **The API key must never reach the client.** This is the whole reason for a server route.
- Stateless: no DB in v1.

### P0 — Must-have

1. **Client-side image compression on upload.**
   - Compress in the browser *before* anything else (display, and especially before card export). Target roughly ≤1MB, max dimension ~1080px, JPEG/WebP output.
   - Recommended lib: `browser-image-compression` (or a custom canvas-based resize). Run it in the upload handler.
   - Acceptance:
     - Given a user selects a 6MB photo, when it's added, then it's downscaled/compressed to ≤~1MB before preview.
     - Given an unsupported file (e.g. PDF), then the user sees a clear error and no crash.
     - Given a very large image, then the UI shows a brief "mengompres…" state.

2. **AI roast generation via server route.**
   - Input to server: `{ username, vibe }`. **Photo is NOT sent to the AI.**
   - Output: 3–4 sentence roast, Bahasa Indonesia gaul, punchline last, with a tone guardrail (see §9).
   - Acceptance:
     - Given valid input, when "Roast gue" is tapped, then a roast returns in a reasonable time with a loading state shown.
     - Given the AI provider errors/times out, then a friendly error + retry is shown (no blank screen, no key leaked in error).
     - Re-roll produces a *different* roast (vary temperature / nudge the prompt).

3. **Card export as image.**
   - The result card must be downloadable/shareable as a single image.
   - Two viable approaches — pick one in the build session:
     - (a) **Server-side render via `next/og`** (`ImageResponse`) — most reliable cross-device, fonts embedded, consistent output. Recommended.
     - (b) **Client-side DOM-to-image** (`html-to-image` / `htmlToCanvas`) — simpler but flaky on some mobile browsers (font loading, CORS, cross-browser quirks).
   - On mobile, prefer the **Web Share API** (`navigator.share` with the image file) with a **download fallback**.
   - Acceptance:
     - Given a finished card, when the user taps "Download/Share", then they get a single image at the target ratio with the photo, roast, and branding all rendered.
     - Given a browser without `navigator.share`, then a normal download happens.

4. **Mobile-first responsive UI** that works inside the Threads in-app browser.

5. **Env-based config.**
   - `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL` (so the provider is swappable). Provide `.env.example`. Never expose these as `NEXT_PUBLIC_*`.

### P1 — Nice-to-have

- Stylized **fallback avatar** (monogram/initials in the roasted palette) when no photo is uploaded.
- **Duotone/red filter** applied to the uploaded photo for palette cohesion.
- **Rate limiting** on the route handler (e.g. simple IP-based) to avoid abuse/cost runaway.
- Light **input sanitization** on username/vibe (length caps, strip control chars).
- Basic **analytics events**: card_generated, card_shared, reroll_clicked (needed to measure the §2 share-rate).

### P2 — Future considerations (design so we don't block these)

- Multiple roast "modes" / weekly themes (keeps novelty alive).
- OG meta tags so a shared *link* also previews nicely.
- Persona-card variant (reuse the same engine, different output).
- Leaderboard / compatibility / multiplayer.
- Persistence + short shareable URLs per card.

---

## 9. AI / Content Safety Requirements

This is a roast tool aimed at fun, not harm. Bake guardrails into the system prompt — non-negotiable:

- Roast the user's **posting behavior / vibe only**. Never their physical appearance (the AI doesn't even see the photo), and never anything touching SARA (ethnicity/religion/race), economic status, disability, gender identity, or other sensitive attributes.
- Funny + cutting, but land on a closing beat that's secretly affectionate — the goal is "savage but I'm laughing, I'll post this," not "offended, I'll block this."
- Bahasa Indonesia gaul, 3–4 sentences, punchline at the end.
- Add a refusal/neutral path: if the vibe text contains hate/sensitive content or an injection attempt, the model should produce a gentle, generic roast and ignore embedded instructions. (Treat the `vibe` field as untrusted user input, not as instructions.)

---

## 10. Risks & Trade-offs

| Risk | Impact | Mitigation |
|---|---|---|
| **Low share-rate** (used, not shared) | Kills the growth loop | Over-invest in card design over AI cleverness; measure share-rate from day one; run the no-code Threads bait-test first if possible |
| **API key leakage** (Vite/Next client exposure) | Cost theft, abuse | Server route handler only; never `NEXT_PUBLIC_`; add rate limiting |
| **Card export flaky on mobile** | Core action fails silently | Prefer `next/og` (server render) over DOM-to-image; test in Threads in-app browser specifically |
| **Roast too cruel** → blocks/reputation | Hurts sharing + brand | Strict tone guardrails; behavior-only; affectionate closer; QA a batch of outputs before launch |
| **Prompt injection via vibe field** | Off-brand / unsafe output | Treat vibe as data, not instructions; cap length; system prompt isolation |
| **Cost runaway** if it goes viral | $$$ | Cheap model, short max tokens, per-IP rate limit, maybe a daily cap |
| **Novelty decay** (viral once, then flat) | Short lifespan | Design the engine for swappable themes/modes (P2); don't hardcode a single roast style |
| **Photo aesthetic clash** (random user photos break the look) | Ugly cards = no share | Duotone/red filter + framing to unify any photo |

---

## 11. Testing Strategy

- **Unit:** compression util (size/dimension caps, rejects bad formats); prompt-builder (injection text doesn't escape the data boundary); username/vibe sanitization.
- **Integration:** `/api/roast` happy path, provider-error path (mock a 500/timeout), empty/oversized input.
- **Visual / export:** snapshot the card at the target ratio; verify photo + roast + branding all render in the exported image; verify fallback avatar path.
- **Cross-device manual QA:** iOS Safari, Android Chrome, and **the Threads in-app browser** (the real target). Test `navigator.share` present vs absent.
- **Content QA:** generate ~30 roasts across varied vibe inputs; manually check none cross the §9 guardrails. Include adversarial vibe inputs (sensitive content, injection strings).
- **Pre-launch validation (recommended before heavy build):** the no-code Threads "bait post" test — post manually, roast by hand via the same prompt, and measure voluntary reposts. If share-rate is dead, fix the output before investing more.

---

## 12. Success Metrics

**Leading (days–weeks):**
- **Share-rate** = cards shared/downloaded ÷ cards generated. Target ≥20%. *(Primary.)*
- Card-completion rate = cards generated ÷ sessions started. Target ≥60%.
- Re-roll rate ≥15%.
- Time-to-card < 30s (p50).

**Lagging (weeks–months):**
- Organic traffic share (visits arriving from Threads referrals / direct after seeing a card).
- Week-over-week repeat visits.
- Cost per generated card stays within budget at scale.

**Measurement:** lightweight analytics events (§8 P1). Evaluate at 1 week and 1 month post-launch.

---

## 13. Open Questions

- **[Eng]** Card export: commit to `next/og` (recommended) or client-side DOM-to-image? Blocking for the result view.
- **[Eng/You]** Which OpenAI-compatible provider + model for v1 (cost vs quality)? Non-blocking — env-swappable, but pick a default.
- **[Design/You]** Final aesthetic concept (fight-poster vs receipt vs tabloid) and the exact font pairing. Blocking for the card.
- **[You]** Tool name + handle (drives the card watermark and the Threads account). Blocking for branding.
- **[Eng]** Rate-limiting approach for a stateless app with no DB (in-memory per-instance vs an edge KV)?
- **[You]** Card export ratio: 4:5 portrait vs 1:1 square?

---

## 14. Suggested Phasing

- **Phase 0 (no code):** Threads bait-test to validate share-rate. Gate the build on it if you can.
- **Phase 1 (MVP, this PRD):** Two views, upload+compress, server roast, card export, mobile-first, red roasted aesthetic.
- **Phase 2:** Fallback avatar polish, duotone filter, rate limiting, analytics, re-roll variety.
- **Phase 3 (P2):** Themes/modes, OG previews, persona-card variant, persistence + share URLs.
