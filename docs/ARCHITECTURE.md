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
| `useCanRender3D()` gate | Neither the 3D chunk nor the models are fetched on a device that would stutter |
| Models repacked, not shipped raw | 15.7MB of source exports serve as 4.9MB |
| `KHR_mesh_quantization`, not Draco | No wasm decoder fetched at runtime |
| `immutable` on `/models/*` | Both GLBs are paid for once |
| `dpr={[1, 1.75]}` | Caps fragment cost; above ~1.75 the difference is invisible |
| `performance={{ min: 0.5 }}` | R3F degrades resolution instead of dropping frames |
| Closed windows unmount | The tree holds only what is on screen |
| Direct DOM writes during drag | ~120 store writes/second avoided |
| rAF-coalesced scroll | One update per paint, not per event |
| No postprocessing | Bloom is emissive materials + additive points + a CSS vignette |

The two loaded models dominate the 3D budget: 38k vertices for the character
and 91k for the laptop. Everything hand-built — desk, chair, window wall — stays
deliberately cheap, and the city skyline is a single `Points` cloud of 1,100
vertices rather than instanced geometry.

Neither GLB touches the initial bundle. First-load JS for `/` is 179KB; the
models arrive afterwards, in parallel with the room rendering, and only on
devices that passed the capability probe.

---

## 9. The character model

`components/three/avatar-model.tsx` loads `public/models/archit.glb`, which is
**rigged by `scripts/rig-character.mjs`** — the source export carries no
skeleton of its own.

### Why this model could be rigged and the previous one could not

An earlier export stood with hands in pockets and arms flush against the torso.
No weight solver can separate what was scanned as one surface: bending an elbow
dragged the jacket with it. The replacement is a relaxed A-pose, and that is
measurable rather than a matter of taste. Slicing the mesh horizontally and
clustering vertices along X gives:

```
 y        clusters  spans
 -0.79       2      [-0.221,-0.092] [0.088,0.218]                   legs
 -0.20       1      [-0.204, 0.200]                                 jacket hem
 -0.08       3      [-0.414,-0.332] [-0.229,0.225] [0.328,0.410]    arm | torso | arm
  0.31       2      arms beginning to merge at the armpit
  0.70       1      [-0.068, 0.064]                                 neck, narrowest slice
```

Three distinct clusters from y=-0.165 to y=+0.309 is the air gap a solver needs.

That same pass supplies the joint positions rather than assuming proportions:
the crotch where the leg clusters merge, the armpit where the arm clusters
merge, the neck at the narrowest slice, the head top from the bounding box.

### Skinning method

Bone-envelope weighting across 19 bones. For each vertex the distance to each
bone's segment is mapped through a compact falloff `(1 - (d/r)²)²`; the best
four influences are kept and normalised.

Envelopes rather than raw inverse distance, because inverse distance lets a
shoulder vertex pick up the far arm. Two further corrections matter:

- **Limb sidedness.** Left- and right-arm envelopes still overlap across the
  chest, so limb bones reject vertices on the opposite side of the body
  outright. Cheaper and safer than shrinking radii until they happen not to
  overlap.
- **The head/neck blend is special-cased.** It is the one joint that has to
  look right, so its weight is a `smoothstep` up the neck rather than a
  distance falloff — a vertical gradient reads as a head turning, where a
  spherical one shears the jaw.

### What the rig supports

Verified by posing each joint and rendering:

| | Result |
| --- | --- |
| Head + neck turn | Clean to ~30°; no shearing at jaw or collar |
| Arms raised to ~70° | Clean; the jacket follows the shoulder |
| Spine lean, chest breath | Clean |
| **Sitting (hips and knees toward 90°)** | **Pinches at both joints** |

Sitting is not viable, so the figure stands. Envelope weights have no notion of
how tailored fabric folds; at large bends the trouser cross-section collapses.
That needs corrective shape keys, or a model authored seated.

Blinking is also out of reach: the eyes are painted into the albedo texture, so
there is no eyelid geometry to drive and no morph targets to blend.

### The rest pose is not the shipped pose

The A-pose spread is what makes the mesh riggable, but it reads as a scanning
pose rather than a person standing. Because there is now a skeleton, `REST` in
`avatar-model.tsx` rotates the upper arms down and breaks the elbows slightly at
bind time. This is the payoff a static mesh could not offer: the pose the model
ships in no longer has to be the pose on screen.

The idle sway **adds** to those rest rotations rather than assigning over them.
Assigning would snap the arms back out to the scan pose every frame — the same
class of mistake as the placement bug below.

### Cloning

`SkeletonUtils.clone`, not `Object3D.clone`. The latter copies a `SkinnedMesh`
but leaves it bound to the *original* skeleton, so every instance would deform
in lockstep with whichever one moved last.

`frustumCulled` is off on the skinned mesh: its bounds move with the pose, and
culling against the bind-pose box pops the figure out of frame mid-turn.

### One bug worth remembering

The breath animation originally wrote `scale` and `position.y` on the same
group that carried the scale-to-height and foot-offset transform. Assigning
those properties **overwrites** the placement rather than adding to it, so the
figure sank 0.9 units into the floor with only the head and torso above it.

The fix is structural, not arithmetic: anything both laid out and animated needs
the two split across separate groups.

### Sharpness

Three levers, all applied:

- **Textures at 2048²**, up from 1024². The head takes only a small slice of UV
  space — at 1024² the face had roughly 350 texels across something that renders
  240px at 2× DPR, and looked soft. WebP keeps all three maps under 0.5MB even
  at 2048².
- **Anisotropic filtering** (`components/three/texture-quality.ts`), capped at
  8. Without it any surface at a glancing angle is sampled with a heavy mip bias
  and goes muddy. Fixed-function on the GPU, so effectively free. Capped rather
  than taking the device maximum: past 8 there is nothing visible at this scale,
  and some mobile GPUs report 16 while charging for it.
- **Vertex quantization**, to pay for what the textures cost: 5.62MB →
  **1.98MB**, with the head turn rendering identically before and after.

Still available if more is wanted: an environment map. `envMapIntensity` is set
on the materials but no environment exists in the scene, so image-based lighting
currently contributes nothing.

---

## 10. The laptop model

`components/three/laptop.tsx` loads `public/models/macbook.glb`. It replaced a
procedural laptop built from boxes.

### Preparation

The source export is ~10MB: roughly 7MB of float32 geometry across 121k vertices
and 2.8MB of PNG textures. `scripts/optimize-laptop.mjs` brings it to **2.90MB
(-71%)** by welding, pruning, compressing textures to WebP at 1024², and
quantizing vertex attributes.

**Quantization rather than Draco** is deliberate. Draco needs a ~200KB wasm
decoder fetched at runtime — drei defaults to a Google CDN, an external
dependency on every page load. `KHR_mesh_quantization` is decoded natively by
three with no decoder at all and gets most of the saving.

Geometry stays at 91k vertices. Simplification would cut further, but the
keyboard and port detail is exactly what sells the model during the dive, when
the deck fills the viewport. The file is lazy-loaded behind the
device-capability gate and served `immutable`, so the cost is paid once by
visitors who can actually use it.

### The screen

The stock model ships a macOS wallpaper at `emissiveStrength` 8. That surface is
the cinematic's destination, so the build swaps it for an ARCHIT.OS desktop
generated by `scripts/make-screen-texture.mjs` — the OS the visitor is about to
land in.

Baked into the GLB rather than drawn at runtime: the quad already has UVs, so a
swapped image maps correctly with no extra geometry, no canvas texture upload
and no per-frame cost. The source PNG lives in `assets/`, not `public/` — it is
an input to the build, not something the site serves.

Two fixes were needed, both visible only once the camera arrived:

- **The screen UVs run bottom-up relative to the image.** Unflipped, every glyph
  renders upside down while the reading order stays correct (`Projects` →
  `bɿojɘcƚƨ`) and the menu bar lands along the bottom edge. That signature is
  how you tell a flip from a rotation.
- **The panel shipped as metal 0.9 / roughness 0.1** — a mirror. Against the
  screen spill light that is two blown specular blobs across the UI at exactly
  the moment it fills the frame. An emissive display should not be reflective,
  so the bake forces it matte.

The spill light is also parked well forward of the panel; closer in, its own
reflection washes the UI.

---

## 11. Derived constants over remembered ones

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

### Model URLs are content-hashed for the same reason

`/models/*` is served `Cache-Control: immutable, max-age=31536000`, which is
correct for a multi-megabyte asset — but only if the URL changes when the bytes
do. Originally it did not, and `archit.glb` was replaced three times at the same
path. Every browser that had already loaded the site kept the first version
pinned for a year and rendered a stale model no matter what was deployed. The
deploy looked fine; the page did not change.

`scripts/write-model-manifest.mjs` hashes each GLB and generates
`lib/model-manifest.ts`, which the components import instead of hard-coding
paths. It runs on `prebuild`, so the manifest cannot drift from what is in
`public/models/`.

The general rule: a long `immutable` cache is a promise that the URL identifies
the bytes. Keep that promise in the filename or the query string, or do not make
it.

---

## 12. Two themes from one token set

The hero is a night office; the desktop is the MacBook screen you just flew
into. Those want opposite treatments, and the desktop should read as macOS
rather than as a dark web app wearing traffic lights.

Forking every component into light and dark variants would have doubled the OS
layer. Instead `.os-light` on the desktop root redefines the *same* CSS
variables the components already consume — `--color-ink`, `--color-muted`,
`--color-hairline`, `--color-accent` and the rest — so roughly 90 tokenised
utilities re-theme on their own.

Three things did not come for free:

- **Hard-coded tints.** `bg-white/5` is invisible on white. Those became
  semantic `surface-1/2/3` utilities backed by `--tint-1/2/3`, which the scope
  flips from white alphas to black alphas.
- **Accents.** The brand cyan has almost no contrast on a light surface, so the
  OS layer uses saturated colours in the macOS system family. Desktop folders
  are all one Finder blue — macOS only varies *app* icons — while the dock
  varies per app.
- **Typography.** The scope puts `-apple-system` ahead of Inter, so on a Mac the
  interface renders in San Francisco. That single substitution does more for the
  illusion than any amount of chrome detailing.

Proportions are copied rather than invented: a 26px menu bar, 38px title bars
with the title optically centred over the full width, 52px dock icons on a
22px-radius slab, and traffic lights at 12px with an inset hairline.

---

## 13. Voice

`/api/speak` streams ElevenLabs TTS for an assistant reply; `useSpeech` plays it.

Two decisions worth recording:

- **The voice is resolved by name, not ID.** Voice IDs are account-specific, and
  a wrong one fails at request time with an opaque 400. The route reads the
  account's `/v1/voices`, prefers a stock male voice by name, falls back to
  anything labelled male, and caches the result for the instance.
  `ELEVENLABS_VOICE_ID` short-circuits it.
- **Absence is a UI state, not an error.** With no key the route returns 503 and
  `useSpeech` flips `available` to false, so the Listen control disappears
  instead of offering something that fails. Same posture as the chat's offline
  responder.

The 1,200-character cap is the load-bearing guard: TTS bills per character and
the endpoint is public.

---

## 14. Things deliberately left out

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
