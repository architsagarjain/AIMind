# ARCHIT.AI

> **Talk. Explore. Know Me.**
> *Don't read my portfolio. Talk to it.*

An interactive digital version of **Archit Jain** — founder, growth operator,
strategy enthusiast. Not a resume page: a scroll-driven 3D cinematic that flies
you into a laptop screen, which boots into a virtual desktop where every
"folder" is a part of the story, including an AI clone you can interview.

---

## Table of contents

- [The experience](#the-experience)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Folder structure](#folder-structure)
- [Architecture](#architecture)
  - [The cinematic state machine](#the-cinematic-state-machine)
  - [The 3D scene](#the-3d-scene)
  - [The window manager](#the-window-manager)
  - [The AI clone](#the-ai-clone)
- [Design system](#design-system)
- [Database schema](#database-schema)
- [API routes](#api-routes)
- [Editing the content](#editing-the-content)
- [Articles and SEO](#articles-and-seo)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Deployment](#deployment)

---

## The experience

```
┌──────────────┐   scroll    ┌──────────────┐   flash   ┌──────────────┐   ~3.7s   ┌──────────────┐
│     HERO     │ ──────────► │    DIVING    │ ────────► │   BOOTING    │ ────────► │   DESKTOP    │
│ 3D office +  │  camera push│ lens enters  │ reactor   │ reactor HUD, │  iris     │ "Talk to it" │
│ live avatar  │  → laptop   │ the screen   │  cyan     │ log, greeting│  opens    │ prompt, dock │
└──────────────┘             └──────────────┘           └──────────────┘           └──────────────┘
```

1. **Hero** — full-screen split. Copy on the left, a 3D character of Archit
   standing in a night office on the right. He breathes, sways, and turns his head
   toward your cursor.
2. **Scroll** — a 3.4-screen runway drives a camera move: push in on the
   subject, swing across to the desk, then dive into the laptop screen.
3. **Boot** — the laptop sits on standby, showing the ARCHIT.OS arc-reactor
   mark with a live clock, the CV's headline figures and "Scroll to wake
   Archit AI" (drawn live on a canvas from `content/`). The dive lands in that
   reactor at full size: its rings spin up while a boot log runs, a voice
   waveform comes up with a greeting, and the core opens like an iris onto
   the desktop.
4. **Desktop** — a virtual OS that opens on the conversation: a Spotlight-style
   prompt ("Don't read my portfolio. Talk to it.") with suggested questions,
   which starts the chat in the Ask Archit window. Five folders and a dock open
   draggable, resizable windows: About, Projects, Timeline, Resume and Ask
   Archit. On phones, windows fill the screen.

Every step is skippable. The hero's buttons and nav links jump to the desktop,
`Skip` (or Enter) cuts the boot short, and `prefers-reduced-motion` routes
straight to the desktop.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, React Server Components where possible) |
| Language | TypeScript (strict, `noUncheckedIndexedAccess`) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Animation | Framer Motion (UI), GSAP-free scroll rig (see note) |
| 3D | React Three Fiber 9 + three.js |
| State | Zustand (two small stores) |
| AI | OpenRouter, **free models only**, streamed (via the OpenAI-compatible SDK) |
| Data | Supabase (Postgres + RLS) |
| Hosting | Vercel |

> **Note on GSAP.** The brief listed GSAP, but the scroll cinematic ended up
> needing exactly one thing: a damped camera follow driven by scroll progress,
> which runs inside the R3F render loop. Adding GSAP + ScrollTrigger would have
> meant a second animation clock fighting `useFrame` for the same camera, plus
> ~70KB. The rig in `components/three/camera-rig.tsx` does it in ~60 lines. If
> you later want GSAP timelines for the window choreography, it drops in cleanly
> alongside — nothing here depends on Framer Motion specifically.

---

## Getting started

```bash
git clone https://github.com/architsagarjain/AIMind.git
cd AIMind
npm install
cp .env.example .env.local     # optional — the app runs without any keys
npm run dev
```

Open <http://localhost:3000>.

**Everything is optional.** With no `.env.local` at all:

- the site renders completely,
- the 3D scene runs,
- and the chat answers from a hand-written offline responder
  (`lib/ai/fallback.ts`) built from the same content files the real model reads.

Add `OPENROUTER_API_KEY` to switch the chat to the live clone, on free models
only (see [The live clone](#the-live-clone-free-models-only)). The same key turns on
the Listen voice, which uses OpenRouter's free Deepgram Flux TTS. Add the Supabase keys
to start persisting conversations. Neither is required to ship.

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` |

---

## Folder structure

```
.
├── app/
│   ├── layout.tsx              # fonts, metadata, skip-link
│   ├── page.tsx                # the single experience route
│   ├── globals.css             # the entire design system
│   ├── sitemap.ts
│   ├── api/
│   │   ├── chat/route.ts       # streaming chat endpoint
│   │   └── telemetry/route.ts  # allow-listed product events
│   ├── ask/page.tsx            # standalone, linkable chat
│   └── resume/
│       ├── page.tsx            # print-optimised resume
│       ├── print.css           # dark on screen, A4 black-on-white in print
│       └── auto-print.tsx      # ?print=1 opens the dialog
│
├── components/
│   ├── experience-shell.tsx    # orchestrates hero → dive → boot → desktop
│   ├── hero/                   # nav, hero copy, scroll cue, boot sequence
│   ├── three/                  # scene, avatar, laptop, office, camera rig
│   ├── desktop/                # menu bar, folders, dock, window chrome
│   ├── windows/                # the five window bodies
│   ├── chat/                   # chat UI + a tiny markdown renderer
│   └── ui/                     # button, tag, section label
│
├── content/                    # ← SINGLE SOURCE OF TRUTH
│   ├── profile.ts              # identity, bio, hero stats
│   ├── projects.ts             # four case studies
│   ├── timeline.ts             # five milestones
│   └── resume.ts               # experience, education, skills
│
├── lib/
│   ├── ai/                     # system prompt, knowledge base, fallback, rate limit
│   ├── supabase/               # browser client, admin client, queries
│   ├── store/                  # experience + windows (zustand)
│   ├── hooks/                  # chat, preferences, telemetry
│   └── utils.ts
│
├── scripts/                    # build-time asset prep, never run at runtime
│   ├── rig-character.mjs       # fits a skeleton + solves skin weights
│   ├── lib/enhance-character.mjs # materials, skin tone, face projection
│   ├── optimize-laptop.mjs     # repacks the MacBook + bakes its screen
│   └── make-screen-texture.mjs # renders the laptop's fallback standby PNG
│
├── assets/screen.png           # build input, deliberately not in public/
│
├── public/models/              # archit.glb (rigged), macbook.glb
│
├── supabase/
│   ├── migrations/0001_init.sql
│   └── README.md
│
├── types/index.ts
└── docs/ARCHITECTURE.md
```

---

## Architecture

### The cinematic state machine

`lib/store/experience.ts` holds four phases: `hero → diving → booting → desktop`.

Scroll progress (0→1) is written to the store on every frame, but the phase
**latches forward only** — once the camera has entered the laptop, scrolling back
up cannot re-trigger the transition. Returning to the hero is an explicit action
(the `ARCHIT.OS` button in the menu bar).

`components/experience-shell.tsx` owns the scroll listener. It coalesces scroll
events into one `requestAnimationFrame` update, because scroll fires far more
often than the browser paints.

### The 3D scene

`components/three/` is six files:

| File | Role |
| --- | --- |
| `scene.tsx` | The `<Canvas>`: DPR cap, tone mapping, fog, perf guard |
| `avatar-model.tsx` | Loads the rigged character; drives its bones |
| `laptop.tsx` | Loads the MacBook; owns the camera's dive target |
| `office.tsx` | Desk, chair, window wall, city, and all lighting |
| `camera-rig.tsx` | The scroll-driven camera move |
| `texture-quality.ts` | Anisotropic filtering for loaded models |

Three decisions worth calling out:

**The character is a supplied GLB, rigged here.** The scan ships as a single
static mesh with no skeleton, so `scripts/rig-character.mjs` fits a 19-bone
humanoid skeleton to it and solves skin weights. The head then turns toward the
cursor on its own neck, the chest breathes, and the arms sway.

The same script then runs a realism pass (`scripts/lib/enhance-character.mjs`).
It rasterises the mesh into texture space so every texel knows where it is on
the body, splits the texture into skin, hair, suit, shirt, tie and shoes by
colour and height, and gives each its own physical response (wool sheen, silk,
polished leather, a warm skin rim). It matches the skin tone to the reference
photo, and projects the reference face (`assets/reference/head-front.png`)
onto the head, aligned by a least-squares fit on five landmarks. The eight
reference crops in `assets/reference/` are also what to upload to an
image-to-3D tool (Meshy's multi-image mode) for a better base mesh; the
pipeline takes a new export as-is.

That is only possible because the export is a relaxed A-pose: slicing the mesh
horizontally shows three distinct vertex clusters (arm / torso / arm) through
the upper body, which is the air gap a weight solver needs. An earlier export
with hands in pockets could not be rigged at all. Sitting is still not viable —
envelope weights pinch tailored trousers at hip and knee — so the figure stands.
See `docs/ARCHITECTURE.md` §9.

**Models are repacked, not shipped as exported.** The character went from
5.62MB to **2.55MB** (2048² WebP textures, vertex quantization); the MacBook
from 10.11MB to **2.90MB** (welded, WebP textures, vertex quantization — no Draco, so no wasm
decoder is fetched at runtime). Both scripts live in `scripts/`; see
`docs/ARCHITECTURE.md` §9 and §10.

**The laptop screen shows ARCHIT.OS.** It is the surface the cinematic flies
into, so the stock macOS wallpaper is swapped at build time for a rendering of
the desktop the visitor is about to land in.

**Damping is exponential, never `delta * rate`.** `lerp(a, b, delta * 28)` looks
correct and is a bug: `delta * rate` is an interpolation *factor*, not a rate, so
on a stalled frame (slow GPU, backgrounded tab) it exceeds 1 and the lerp
diverges instead of converging. The blink animation hit a world scale of ~10⁹
this way during development and stretched the eyelids into two pillars across
the frame. Everything now uses `1 - Math.exp(-rate * delta)`, which is bounded
to [0, 1).

The scene is code-split via `next/dynamic` and only requested once
`useCanRender3D()` confirms the device can plausibly run it (core count, device
memory, save-data, and an actual WebGL context probe). Otherwise a CSS-only
`SceneFallback` renders — a silhouette lit by the same cyan key, so the hero is
never an empty rectangle.

### The window manager

`lib/store/windows.ts` is a compact window manager: open, close, focus,
minimise, maximise, move, resize, with cascading placement and z-ordering.

`components/desktop/window.tsx` handles the gestures. **Drag and resize write
directly to the DOM during the gesture and commit to the store only on
pointerup.** Writing every `pointermove` into zustand would re-render the window
subtree ~120 times a second and visibly stutter the chat and project lists.

Closed windows **unmount** rather than hide, so a closed Projects window is not
holding four case studies in the tree.

Keyboard: `⌘/Ctrl + 1…5` open windows, `Escape` closes the focused one.

### The AI clone

```
  content/*.ts
       │
       ▼
lib/ai/knowledge.ts ──► compiles a ~3k-token corpus
       │
       ▼
lib/ai/system-prompt.ts ──► persona contract + the corpus
       │
       ▼
app/api/chat/route.ts ──► rate limit → validate → stream → persist
       │
       ├── OPENROUTER_API_KEY set? → free models on OpenRouter, streamed,
       │                             falling back model to model on error
       └── not set / all failed?   → lib/ai/fallback.ts, streamed identically
```

**Why full context instead of RAG.** The whole corpus is a few thousand tokens.
Retrieval would add latency and a failure mode — a missed chunk means the model
fills the gap by inventing — without buying accuracy. Swap to embeddings only if
the corpus outgrows the window.

**The two rules that matter** are stated twice in the prompt on purpose: speak in
first person, and never invent an achievement. The only figures the clone may
quote are the ones in `content/`. Anything it does not know, it says it does not
know.

**Graceful degradation is the design, not a fallback.** If the key is missing or
every free model fails, the route streams the offline responder through the identical
response shape — the client cannot tell the difference except via the `X-AI-Mode`
header, which the UI surfaces honestly in the composer footer.

---

## Design system

Everything lives in `app/globals.css` as Tailwind v4 `@theme` tokens. There are
no hard-coded colours in components.

| Token | Value | Use |
| --- | --- | --- |
| `--color-void` | `#050816` | Page background |
| `--color-surface` / `-raised` | `#080c1f` / `#0d1228` | Panels, windows |
| `--color-accent` | `#6EF2FF` | Primary cyan |
| `--color-accent-2` | `#1D9BF0` | Secondary blue |
| `--color-ink` | `#FFFFFF` | Primary text |
| `--color-muted` | `#9CA3AF` | Body text |
| `--color-faint` | `#6B7280` | Labels, meta |
| `--color-hairline` | `#FFFFFF14` | Borders |

Type: **Inter Tight** for headings (`--font-display`), **Inter** for body
(`--font-sans`), both via `next/font` with `display: swap`.

Component primitives: `.glass`, `.glass-strong`, `.text-gradient-accent`,
`.rule-fade`, `.bloom`. Motion curves: `--ease-out-expo`, `--ease-in-out-quint`.

### Two themes, one token set

The hero is a night office and stays dark. The desktop is a MacBook screen, so
it renders light and macOS-like — `.os-light` on the desktop root **redefines
the same tokens** the components already consume, so the ~90 tokenised colour
utilities across the OS layer re-theme without a single component fork.

Only hard-coded tints needed replacing. Those became semantic
`surface-1/2/3` utilities backed by `--tint-1/2/3`, which flip from white-on-
dark to black-on-light with the scope. Accents are saturated in the OS layer:
the brand cyan `#6EF2FF` is effectively invisible on white.

---

## Database schema

Three tables, all with **RLS enabled and no permissive policies** — the anon key
can do nothing, which is what makes it safe to ship in the client bundle. Every
write goes through the server using the service-role key.

```
conversations ──1:N──► messages
events (standalone)
conversation_summary (view)
```

| Table | Holds |
| --- | --- |
| `conversations` | One row per visitor chat session |
| `messages` | Append-only transcript, with model + latency |
| `events` | Allow-listed product events (window opened, project viewed, …) |

Full DDL in `supabase/migrations/0001_init.sql`; setup in `supabase/README.md`.

---

## API routes

### `POST /api/chat`

Streams the reply as plain text (one consumer, one event type — SSE framing
would be pure overhead).

```jsonc
// request
{ "messages": [{ "role": "user", "content": "How did ZenCabs scale?" }],
  "conversationId": "uuid | null", "visitorId": "uuid | null" }
```

Response headers: `X-Conversation-Id`, `X-AI-Mode` (`live` | `offline` |
`offline-fallback`).

Guards: 12 requests/minute/IP sliding window, 12-message history cap, 1,500-char
message cap, last message must be from the user. Persistence is fire-and-forget
— analytics failing must never take down the chat.

### `POST /api/telemetry`

Allow-listed event names only; anything else is dropped. Sent via `sendBeacon`
where available.

---

## Editing the content

**Everything visitor-facing lives in `content/`.** The hero, the windows, the
resume page and the AI's knowledge base all read from the same four files, so
they cannot drift apart.

> ⚠️ **On metrics.** Every hard figure in this repo comes from Archit's CV and
> lives in `content/` (`heroStats` in `profile.ts`, `metrics` in
> `projects.ts`). Nothing else states a number: the AI's system prompt, the
> boot screen and the laptop's standby screen all derive theirs from these, so
> updating the content updates all of them. Case-study narratives describe
> *approach* rather than claiming unverified outcomes, because the AI clone
> reads these files as fact. **Any number you add to `metrics` will be
> quoted by the clone in interviews** — only add figures you are willing to
> defend.

---

## Articles and SEO

The articles live at `/articles` as their own statically generated pages, so
search engines index them as ordinary documents, independent of the 3D home
page. The desktop's **Writing** app lists the same articles.

| File | What it holds |
| --- | --- |
| `content/articles/*.ts` | The articles, as typed blocks (headings, paragraphs, lists, tables, quotes, figures) plus an FAQ. Text supports `**bold**` and `[label](/path)` |
| `content/articles/index.ts` | The registry: order, reading time, related articles |
| `content/articles/categories.ts` | Frameworks, sector breakdowns, operating playbooks, investment theses |
| `content/articles/retired.ts` | Replaced articles; each old URL redirects permanently to its successor |
| `content/press.ts` | Coverage elsewhere. `featured: true` leads the "Featured in" strip; the strip hides itself while the list is empty |
| `content/apps.ts` | Apps you have built (Nexus AI), shown in Projects and on the hub |

**What the articles are for.** They are work samples for Founder's Office,
Chief of Staff and venture capital recruiters: sector breakdowns, operating
playbooks and investment theses. The house rules:

- Figures about Archit come only from `content/projects.ts` and `content/resume.ts`.
- Industry figures carry a linked source in the article's Sources section, and derived numbers show their working.
- The style is plain: no em or en dashes, no "not X but Y" contrasts, no one-line closers, no bold labels. The live clone is held to the same style, and `tidyDashes` in `lib/ai/answer-guard.ts` normalises any dashes it streams.

**To add an article:** write a new `Article` in `content/articles/`, add it to
the array in `content/articles/index.ts`, and build. The page, sitemap entry,
RSS item, share image, structured data and the AI clone's knowledge all come
from that one object.

**What makes it indexable:**

- `app/robots.ts` allows everything except `/api/` and points to the sitemap by absolute URL.
- `app/sitemap.ts` lists every page and article, with each article's date.
- Every page sets a canonical URL; articles set their own title, description and Open Graph article tags.
- Structured data (`lib/seo.ts`): `Person` and `WebSite` on every page, plus `BlogPosting`, `BreadcrumbList` and `FAQPage` on articles, and a `CollectionPage` on the hub. Press entries are attached to the `Person` as `subjectOf`, which is how search engines connect that coverage to you.
- A share image per article, generated at build time (`app/articles/[slug]/opengraph-image.tsx`).
- An RSS feed at `/articles/rss.xml`.

**Connecting a search console:**

1. Set `NEXT_PUBLIC_SITE_URL` to your real domain, so canonical URLs and the sitemap use it.
2. In Google Search Console, add the site as a **URL prefix** property, choose the **HTML tag** method, and copy the token from `content="…"` into `GOOGLE_SITE_VERIFICATION`. Do the same for Bing Webmaster Tools with `BING_SITE_VERIFICATION`. Redeploy, then click Verify.
3. Submit `https://your-domain/sitemap.xml` under **Sitemaps**.
4. Use **URL Inspection → Request indexing** on `/articles` and the articles you most want found first.

---

## Performance

- 3D is code-split and gated behind a capability check, so the initial JS for
  `/` is ~180KB and three.js never loads on a device that cannot use it.
- `dpr={[1, 1.75]}` — above ~1.75 the extra pixels are invisible and the cost
  is real. `performance={{ min: 0.5 }}` auto-degrades DPR rather than dropping
  frames.
- Scroll handling is rAF-coalesced; drag/resize bypass React entirely during the
  gesture.
- The two models (2.55MB + 2.89MB) are fetched only after the capability check
  passes, in parallel with the room rendering, and served `immutable` for a
  year. They are never requested on a device that would stutter on them.
- Model URLs carry a content hash (`scripts/write-model-manifest.mjs`, run on
  `prebuild`), so that year-long cache can never serve a stale model after the
  file is replaced.
- Fonts via `next/font` (self-hosted, `display: swap`, no layout shift).
- `optimizePackageImports` for `lucide-react`, `framer-motion`, `drei`.
- No postprocessing pass — the cyan bloom is achieved with emissive materials,
  additive points and a CSS vignette, which costs nothing per frame.

## Accessibility

- Skip-to-content link; `main` landmark; windows are `role="dialog"` with
  accessible names.
- Every control is keyboard reachable with a visible `:focus-visible` ring.
- `prefers-reduced-motion` freezes the 3D clock, disables idle animation, skips
  the scroll cinematic and routes straight to the desktop.
- Pinch-zoom is **not** capped (`maximumScale: 5`) — the desktop metaphor
  suffers under zoom, but capping it would fail WCAG 1.4.4.
- `/ask` and `/resume` exist as plain routes so the chat and CV are usable
  without the desktop metaphor at all.

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

Or import the repo at [vercel.com/new](https://vercel.com/new) — the defaults
are correct for Next.js 15.

Set these in **Project → Settings → Environment Variables**:

| Variable | Scope | Required |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | Production, Preview | No — falls back to offline mode |
| `OPENROUTER_MODELS` | All | No — comma-separated preference order; only `:free` IDs are accepted |
| `OPENROUTER_TTS_VOICE` | All | No — Flux voice to try first; defaults to `flux-naveen-en` |
| `OPENROUTER_TTS_MODEL` | All | No — defaults to `deepgram/flux-tts:free`; only `:free` IDs are accepted |
| `NEXT_PUBLIC_SUPABASE_URL` | All | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | No — **never** prefix with `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SITE_URL` | All | No — falls back to the Vercel deployment host. Set it once you have a domain |
| `GOOGLE_SITE_VERIFICATION` | Production | No — the token from Search Console's HTML-tag method |
| `BING_SITE_VERIFICATION` | Production | No — the token from Bing Webmaster Tools |

Then:

1. Run `supabase/migrations/0001_init.sql` against your Supabase project.
2. Point your domain at the deployment and update `NEXT_PUBLIC_SITE_URL`.

> **A blank env var is not an unset one.** `process.env.X ?? fallback` only
> catches `undefined`, so an environment variable added in the Vercel dashboard
> with an empty value arrives as `''` and sails past the default. That is how
> `metadataBase: new URL('')` took down a production build here with
> `ERR_INVALID_URL` on `/_not-found`. `lib/site.ts` now treats blank, unparseable
> and scheme-less values as unset and falls back rather than throwing — a wrong
> OG URL is cosmetic, a failed build is not.

### Self-hosting

```bash
npm run build
npm start          # defaults to :3000
```

The chat route runs on the Node runtime (`runtime = 'nodejs'`) because the
OpenAI-compatible SDK (pointed at OpenRouter) and the Supabase service client
both need it, with `maxDuration = 60`, because free models can be slow to start
and the route may try more than one.

### The live clone: free models only

The clone runs on OpenRouter's free models, and "free only" is enforced in
layers so that no single mistake can route a request to a paid model:

1. **Only `:free` model IDs are ever sent.** Anything else is dropped,
   including anything set through `OPENROUTER_MODELS`, so a typo in an env var
   cannot turn billing on. The route checks again just before each request
   leaves.
2. **Checked against OpenRouter's live catalogue.** The public `/models` list is
   fetched hourly (no key needed), and a model is used only if it is priced at
   exactly zero for both prompt and completion. Free models come and go often,
   so the preference list in `lib/ai/openrouter.ts` is an ordering hint; other
   currently free models fill in behind it.
3. **Explicit model lists.** Each request names its models in OpenRouter's
   `models` array, and OpenRouter only routes to models you name.

**Fallback.** Within a request, OpenRouter tries its two named models in
order. Across requests, the route moves to the next group when a model errors,
is rate-limited, is not accepted within 10s, shows no visible word within 15s
(reasoning models thinking silently), goes quiet for 15s mid-answer, or returns
nothing. If a model fails before writing anything, the next one takes over
unseen.

**Hedging.** A slow free model should cost seconds, not a timeout. If the
model being tried has not produced a verified opening within 4s, the next group
starts alongside it (two requests at most), and whichever passes the guard
first answers; the other is cancelled, so only one model's words ever reach the
visitor. The catalogue is cached across server instances, so a cold start does
not fetch it before the first answer, and the knowledge base drops timeline and
resume lines that its case studies already state, which keeps the prompt about
a fifth smaller. The response starts immediately and the whole attempt runs inside a
40s budget for finding a model; an answer already on screen may stream on to 56s, so long replies are not cut mid-sentence, and it still finishes within Vercel's 60s limit. If an answer reaches the token cap, it says so and offers to continue. If every free
model fails, the visitor gets the pre-written answer, labelled as such.

**No leaked reasoning.** Some free models are reasoning models that write their
thinking into the answer. `lib/ai/answer-guard.ts` strips `<think>` blocks and
holds back the first 80 characters of every answer (and releases every character at the end). If they read as reasoning
("here's a thinking process…", "the user is asking…", or any mention of the
knowledge base or system prompt), that model is dropped for the next one before
the visitor sees a word. Reasoning models are also ranked last, and every
request asks OpenRouter to leave reasoning out.

**Limits.** Free models are rate-limited by OpenRouter, per minute and per day,
and the daily cap is much higher once the account has bought credits. When the
limits are hit, the chat degrades to pre-written answers rather than failing.

**Checking it.** `GET /api/chat` reports whether the key is configured and
which free models it would use, in order, plus any it skipped and why.

---

## Licence

Personal portfolio. The code is yours to learn from; the content is Archit's.
