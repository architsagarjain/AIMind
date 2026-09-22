# Architecture notes

Supplementary detail to the README. This file records the *why* behind
decisions that are not obvious from reading the code.

---

## 1. One route, not five

The desktop's windows look like pages, and the obvious structure would be
`/about`, `/projects`, `/timeline`, `/resume`, `/ask`. They are deliberately not
routes.

The hero, the cinematic and the desktop share a single WebGL context and a
single scroll context. Navigating between routes would tear down and rebuild the
canvas on every transition — a visible stall, a fresh device-capability check,
and a lost camera position. The windows are the pages; the URL stays put.

Two exceptions exist because they need to be linkable and crawlable:

- `/ask` — a shareable chat URL, and the accessible path for anyone who cannot
  use the desktop metaphor.
- `/resume` — print-optimised, and the target of the Download PDF button.

Both render the same components the windows do.

---

## 2. Why the PDF is a print stylesheet

`Download PDF` opens `/resume?print=1`, which opens the browser's print dialog.
The print stylesheet flattens the dark UI to black-on-white A4.

The alternative — committing `archit-jain-resume.pdf` to `public/` — creates a
binary that silently drifts from `content/resume.ts`. Someone updates the
experience array, the site changes, the downloaded PDF does not, and nobody
notices until a recruiter reads a stale document. Generating from the same
source removes that failure mode entirely.

If a hosted PDF becomes necessary (some ATS uploads require a real file), the
clean approach is a build step that renders `/resume` headlessly to
`public/resume.pdf` — still generated, still single-source.

---

## 3. The offline responder is a product decision

`lib/ai/fallback.ts` is not a stub. It is ~10 hand-written first-person answers
covering the questions the starter prompts ask, streamed through the identical
response path as the real model.

It exists because a portfolio whose headline feature 500s on a fresh clone —
or when a key expires, or when OpenAI has an incident — is worse than one that
degrades. The route catches both the missing-key case and a mid-request API
failure and falls through to it.

It is honest about itself: every offline answer ends with a line saying so, the
response carries `X-AI-Mode: offline`, and the composer footer changes text.
Nobody is misled into thinking they spoke to the model.

---

## 4. Rate limiting is per-instance on purpose

`lib/ai/rate-limit.ts` is an in-memory sliding window. On Vercel each lambda
keeps its own map, so this is a cost guard against one client hammering the
endpoint, **not** a strict global quota.

That is the right trade for a portfolio: zero infrastructure, zero latency, and
it stops the realistic abuse case. If a hard global limit becomes necessary, the
counter moves to Supabase or Upstash behind the same `rateLimit(key)` signature
— the interface is the seam.

---

## 5. Supabase security posture

RLS is enabled on all three tables with **no permissive policies for `anon` or
`authenticated`**. The anon key therefore cannot read or write anything, which
is exactly what makes it safe to expose in the client bundle.

Every write happens server-side with the service-role key, which bypasses RLS.
`lib/supabase/server.ts` imports `server-only`, so pulling it into a client
bundle is a build error rather than a runtime key leak.

If an admin dashboard is added later, add a policy scoped to an authenticated
admin role. Do not loosen `anon`.

---

## 6. Telemetry is allow-listed

`/api/telemetry` accepts six event names and drops everything else. An open
endpoint that writes arbitrary `{name, payload}` into Postgres is a free garbage
dump for anyone who reads the network tab.

Client-side it uses `sendBeacon` where available so events survive page
transitions, and falls back to `fetch(..., { keepalive: true })`. Both are
fire-and-forget; a failure is swallowed. Visitor IDs come from `localStorage`
and every access is wrapped in try/catch, because private mode and blocked
storage both throw.

---

## 7. State is split across two stores

`useExperience` (phase, scroll progress) and `useWindows` (window geometry and
focus) are separate zustand stores rather than one.

They have completely different update frequencies. The experience store is
written on every scroll frame; the windows store is written on discrete user
actions. Merging them would mean every scroll frame invalidates selectors that
window components subscribe to.

The 3D scene goes further and does not subscribe at all — it reads scroll
progress imperatively into a ref via `useExperience.subscribe`. The render loop
already runs at 60fps and only needs the current value, so a ref is both faster
and simpler than a selector that would re-render the component 60 times a second
for no benefit.

---

## 8. Performance budget

| Lever | Effect |
| --- | --- |
| `next/dynamic` on the scene | three + R3F + drei stay out of the initial bundle |
| `useCanRender3D()` gate | The 3D chunk is never fetched on a device that would stutter |
| `dpr={[1, 1.75]}` | Caps fragment cost; above ~1.75 the difference is invisible |
| `performance={{ min: 0.5 }}` | R3F degrades resolution instead of dropping frames |
| Closed windows unmount | The tree holds only what is on screen |
| Direct DOM writes during drag | ~120 store writes/second avoided |
| rAF-coalesced scroll | One update per paint, not per event |
| No postprocessing | Bloom is emissive materials + additive points + a CSS vignette |

Polygon counts are kept low deliberately: the character is ~40 primitives, the
office ~60, and the city skyline is a single `Points` cloud of 1,100 vertices
rather than instanced geometry.

---

## 9. The character model

`components/three/avatar-model.tsx` loads `public/models/archit.glb`.

### What the file supports

The supplied model is a **single static mesh**: no skin, no skeleton, no
animations, no morph targets. That is not a defect — it is what a photogrammetry
or generative pipeline produces — but it rules out three things:

| Wanted | Needs | Present? |
| --- | --- | --- |
| Sitting in the chair | A rig, to bend the legs | No |
| Blinking | `eyeBlink*` morph targets | No |
| Head turning independently | A head or neck bone | No |

So the idle animates the **root**, not parts: a breath that scales the figure a
fraction, a slow weight shift, and a gentle turn toward the pointer. Applied to
the whole figure that reads as presence. Applied to a limb of an unrigged mesh
it would read as broken.

The hero composition changed to match. The earlier layout had the subject seated
at the desk; a standing figure cannot be posed into that, so the camera now
frames him standing beside the desk with the laptop to his right.

### Swapping in a rigged model

The wrapper is the seam. Keep `AvatarModel`, and in `useFrame` drive bones and
morph targets instead of the root transform:

```ts
// blink, if the model carries ARKit-style morph targets
const dict = mesh.morphTargetDictionary;
mesh.morphTargetInfluences[dict.eyeBlinkLeft] = blink;

// head tracking, if there is a head bone
headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, pointer.x * 0.3, k);
```

`FOOT_OFFSET` and `SCALE` are the only placement constants; both are derived
from the mesh bounds and would need re-measuring for a new file.

### One bug worth remembering

The breath animation originally wrote `scale` and `position.y` on the same group
that carried the scale-to-height and foot-offset transform. Assigning those
properties **overwrites** the placement rather than adding to it, so the figure
sank 0.9 units into the floor and only the head and torso showed above it.

The fix is structural, not arithmetic: the animated group is now a separate
parent of the static placement group, so the breath is a delta on top of the
layout rather than a replacement for it. Any transform that is both laid out and
animated needs that split.

### Texture repacking

The source export was **4.21MB**, of which ~3MB was three 2048² JPEGs (albedo,
metallic-roughness, normal). At hero size the figure is around 700px tall, so
2048² buys nothing.

`scripts/optimize-model.mjs` resizes the embedded images and rebuilds the
container — relaying out every bufferView with the 4-byte alignment accessors
require, and rebuilding the JSON and BIN chunks with their own padding:

```bash
node scripts/optimize-model.mjs <source.glb> public/models/archit.glb 1024
```

Result: **1.44MB**, a 66% reduction, with no visible loss. The normal map keeps
higher JPEG quality than the colour maps because normals show compression
artefacts as shading noise.

Re-run it whenever the source model is replaced. Do not commit a raw export
into `public/` — a 4MB hero asset undoes the code-splitting the rest of the
scene depends on.

## 10. Derived constants over remembered ones

`LAPTOP_SCREEN` — the point the scroll cinematic flies into — was originally a
hand-computed literal. It silently drifted by 0.018 units the first time the lid
geometry changed, which at the final camera distance of 0.2 is roughly 9% off
centre, and nothing failed loudly.

It is now composed in `laptop.tsx` from the placement constants the JSX itself
uses, so moving the laptop moves the camera target with it. The screen's
position and normal in model space were *measured* off the source GLB — the
bounding-box centre and average vertex normal of the one mesh carrying an
emissive texture — rather than estimated from the lid angle. That measurement
is the only thing to redo if the model is replaced.

The same pattern covers the character: `FOOT_OFFSET` and `SCALE` in
`avatar-model.tsx` come from its mesh bounds.

---

## 12. Things deliberately left out

**GSAP.** See the README note. The scroll cinematic needs a damped camera follow
inside `useFrame`; a second animation clock would fight it for the same camera.

**Postprocessing (`@react-three/postprocessing`).** A real bloom pass is the
single most expensive thing you can add to a scene this simple, and the look is
reachable with emissive materials and a CSS vignette.

**A component library.** Five primitives (`Button`, `Tag`, `SectionLabel`, the
window chrome, the chat) is not enough surface to justify one, and the visual
language is specific enough that most of a library would be overridden.

**Tests.** There is no test suite. For a portfolio of this size the honest
statement is that it was verified by driving the real app — hero, full scroll
cinematic, boot, all five windows, drag/resize/maximise, multi-turn chat, and
mobile/tablet/desktop breakpoints. If this grows, the first tests worth writing
are the window-manager reducer and the chat route's validation branches, both of
which are pure and easy to cover.
