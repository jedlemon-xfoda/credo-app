# Attend Forensic Visual Spec
> Side-by-side comparison of `current.png` vs `mockup.jpeg` for all 22 screens.
> **Do not code until this spec is approved.**

---

## 1. Global Design Deltas

These apply to **every screen** without exception.

### 1A. Posture Badge Icons — CRITICAL

| Attribute | Current | Target |
|---|---|---|
| Icon rendering | Thin SVG stroke paths (sw 1.05–1.15) | **Filled solid silhouette pictograms** |
| Color | currentColor (inherits theme) | Warm gold **#B8945A** always |
| STAND | Front-facing stick figure, circle head r=1.35 | Front-facing solid shape: round head, wide-shoulder body block, two leg stumps — one solid gold mass |
| KNEEL | Side-profile thin strokes | Side-profile solid kneeling silhouette: head + angled torso + shins-to-floor |
| SIT | Side-profile thin strokes | Side-profile solid seated: head + torso + horizontal thigh + lower leg |
| PROCESS | Two thin stroke walking figures | Two solid gold walking figures, side-by-side, staggered gait |
| Badge border | ~1px pill outline | ~1.5px pill outline |

The canonical reference is screen 11 (Guidance Elements). Every posture icon in the mockup is a filled silhouette, not a wireframe. The current thin-line SVGs are categorically wrong and must be fully replaced.

### 1B. Guidance Type Chips

Chips are approximately correct in shape. Verify:

| Chip | Target fill | Target text |
|---|---|---|
| YOU SAY | Deep navy **#1D2E44** | White, bold, all-caps |
| YOU DO | Gold **#B8945A** | White, bold, all-caps |
| LISTEN | Warm dark charcoal-gray (~#5C6B7A) | White, bold, all-caps |
| AMBIENT | Very light parchment/cream, barely-visible border | Dark charcoal, all-caps |

### 1C. Screen Density — Structural Change

The current app shows **one beat per screen**. The mockup combines multiple beats per screen with a divider between them. This affects three sections significantly:

| Section | Current | Target |
|---|---|---|
| Greeting | 2 screens (LISTEN / YOU SAY) | **1 screen** — LISTEN + divider + YOU SAY + "Hearing something different?" |
| Kyrie | 3 screens | **1 screen** — all 3 YOU SAY responses with 2 dividers |
| Collect | 3 screens (LISTEN / YOU DO / YOU SAY) | **1 screen** — LISTEN + chalice icon + description + divider + YOU SAY Amen |

### 1D. Beat Divider Spec

Between beats on a combined screen:

```
────────────────◆────────────────
```

- Thin horizontal lines from each edge, meeting a center diamond ornament
- Diamond: small gold rhombus (~5×5px)
- Line weight: ~0.6px
- Color: gold **#B8945A**
- Component height: 24px
- Margin: 24px above + 24px below

This is the existing `divider-ornate.svg` asset — use it between beats.

### 1E. Section Title Visibility

| Context | Current | Target |
|---|---|---|
| Section-intro screens | Shows section name ✓ | Shows section name ✓ |
| Beat-only screens within a section | Shows section name ❌ | **No section title** |
| "Introductory Rites" subtitle | Present on most screens | **Not present** in mockup |

Remove the section title and section subtitle from every screen that is not a section intro.

### 1F. Bottom Navigation

| Item | Current | Target |
|---|---|---|
| Home icon | Thin outline house (stroke only) | **Filled solid dark house** silhouette |
| Home label | "Home" ✓ | "Home" ✓ |
| Center cross button | Gold circle + Latin cross ✓ | Same ✓ |
| More | ••• ✓ | ••• ✓ |

### 1G. Description / Body Text

Several section-intro screens show a 1–2 line description below the section icon. Current app shows **none**. Add per section (see per-screen table below).

### 1H. Progress Dots

Current: 5 dots, uniform small size, one slightly darker.
Target: current dot = **filled dark**, inactive = lighter open circle. Dots are slightly larger. Count varies per section cadence.

---

## 2. Screen-by-Screen Table

### 01 — Entrance Chant

| Element | Current | Target | Action |
|---|---|---|---|
| Screen title | "Entrance" | **"Entrance Chant"** | Add "Chant" to title string |
| Section icon | Thin circular icon with bar elements (broken lyre) | Proper **lyre illustration**: oval resonating body, vertical strings, two curved side arms | Replace icon with correct lyre SVG |
| Beat layout | 1 beat (YOU SAY only) | AMBIENT beat + divider + YOU SAY | Add AMBIENT beat above divider |
| Posture badge | Thin outline STAND | Filled solid STAND | → Global 1A |
| Section subtitle | "Introductory Rites" | Not shown | Remove |

### 01b — Entrance Procession

Merge into 01. The AMBIENT beat shown here belongs on the combined 01 screen.

### 02 — Sign of the Cross

| Element | Current | Target | Action |
|---|---|---|---|
| Screen title | **"Greeting"** ❌ | "Sign of the Cross" | Fix title string |
| Section icon | Small abstract gesture icon | **Large right-hand gesture illustration** (~50% screen width): hand raised, fingers in signing position | Replace with proper gesture illustration |
| Beat layout | 1 beat (YOU DO) | YOU DO + divider + YOU SAY "Amen." | Add second beat |
| Posture badge | Thin outline STAND | Filled solid STAND | → Global 1A |

### 02b — Sign of the Cross Amen

Merge into 02 as second beat (YOU SAY "Amen.").

### 03 — Greeting

| Element | Current | Target | Action |
|---|---|---|---|
| Beat layout | 1 beat (LISTEN) | LISTEN + divider + YOU SAY "And with your spirit." + "Hearing something different?" link | Add second beat, divider, and variant link |
| "Hearing something different?" | Missing | Gold underlined link text below response text | Add gold link component |
| Posture badge | Thin outline STAND | Filled solid STAND | → Global 1A |

### 03b — Greeting Response

Merge into 03 as second beat. Screen 03b is eliminated.

### 04 — Penitential Act Intro

| Element | Current | Target | Action |
|---|---|---|---|
| Cross icon | Small (~40px) thin gold cross | **Large dramatic cross illustration** (~50% screen width): cross pattée style, bold filled arms, radiating light lines behind, season-specific color (appears deep navy/purple tint) | Replace tiny icon with full illustration |
| Description text | Missing | Body description of the rite (italic, ~14sp) | Add description |
| Posture badge | Thin outline KNEEL | Filled solid KNEEL | → Global 1A |

### 05 — Confiteor (Opening)

| Element | Current | Target | Action |
|---|---|---|---|
| Section title above chip | "Penitential Act" shown | **Not shown** | Remove section title from this screen |
| Display text | "I confess to almighty God" (fragment, ~56sp) | "I confess to almighty God and to you, my brothers and sisters," (full phrase, ~32–36sp) | Merge full opening phrase; reduce font size |
| Beat layout | Fragment only | Full opening Confiteor phrase on one beat | Merge 05 + 05b content |
| Posture badge | Thin outline KNEEL | Filled solid KNEEL | → Global 1A |

### 05b — Confiteor (Brothers and Sisters)

Merge into 05. Same beat, same phrase.

### 05c — Confiteor (Fault)

| Element | Current | Target | Action |
|---|---|---|---|
| Gesture illustration | Abstract broken circle + diagonal line (~40px) ❌ | **Large illustrated figure** (~40% screen height): semi-realistic gold-outline figure showing hand placed on breast | Replace abstract icon with full gesture illustration |
| "(strike breast)" | Present ✓ | Present, italic ✓ | Keep |
| Display text | "through my fault" ✓ | Same ✓ | — |
| Section title above chip | Shown | Not shown | Remove |

### 05d — Confiteor (Grievous Fault)

Same fixes as 05c. Mockup shows slightly smaller version of the same gesture figure illustration.

### 06, 06b, 06c — Kyrie (Lord / Christ / Lord)

| Element | Current (3 screens) | Target (1 screen) | Action |
|---|---|---|---|
| Screen structure | 3 separate screens | **Single screen**, all 3 responses | Merge into one screen |
| Section title | "Penitential Act" shown ❌ | **Not shown** | Remove |
| Beat 1 | "Lord, have mercy." YOU SAY | Same ✓ | — |
| Beat 2 | "Christ, have mercy." YOU SAY | Same + diamond divider above | Add divider |
| Beat 3 | "Lord, have mercy." YOU SAY | Same + diamond divider above | Add divider |
| Posture badge | Thin outline STAND | Filled solid STAND | → Global 1A |

### 07 — Gloria (Included)

| Element | Current | Target | Action |
|---|---|---|---|
| Section icon | Small asterisk-circle ornament (Venus/circle ornament) ❌ | **Large sunburst/monstrance illustration** (~45% screen width): gold radiating rays in semicircle with cross rising at center horizon line | Replace ornament with sunburst illustration |
| Display text line 1 | "Glory to God in the highest," ✓ | Same ✓ | — |
| Display text line 2 | **Missing** | "and on earth peace to people of good will." (slightly smaller, continuation) | Add second line of text |
| Illustration position | Absent | Sunburst illustration below text block | Add illustration |
| Posture badge | Thin outline STAND | Filled solid STAND | → Global 1A |

### 07b — Gloria (Omitted)

| Element | Current | Target | Action |
|---|---|---|---|
| Section icon | Small asterisk-circle ornament ❌ | Not shown — **no icon** on omitted screen | Remove icon |
| Display text | "The Gloria **may be** omitted today." | "The Gloria **is** omitted today." | Fix wording |
| Illustration | Absent | **Ornate cross illustration** with horizontal rule extending on both sides (decorative section close) | Add ornate cross illustration |
| LISTEN chip | Present ✓ | Present ✓ | — |

### 07c — Gloria (Ambient)

The mockup file references the 07b layout. Either: share the ornate cross illustration from 07b, or clarify with designer whether 07c gets its own treatment.

### 08 — Collect (Opening Prayer)

| Element | Current (3 screens: 08, 08b, 08c) | Target (1 screen) | Action |
|---|---|---|---|
| Beat layout | 3 separate screens | **Single screen**: LISTEN + chalice icon + description + divider + YOU SAY "Amen." | Merge all three beats |
| Section icon | Abstract circle-on-stem ❌ | **Liturgical chalice** with IHS cross on cup body (~60px, gold outline) | Replace with chalice SVG |
| Description text | Missing | "The priest prays on behalf of the Church." (body text) | Add description |
| YOU SAY "Amen." | Separate screen (08c) | Second beat on same screen, below divider | Merge |
| YOU DO "Bring your intention quietly." (08b) | Separate screen | May be a third beat above Amen or an earlier beat — confirm with designer | Needs clarification |
| Posture badge | Thin outline STAND | Filled solid STAND | → Global 1A |

### 09 — Variant Overlay (Hearing Something Different?)

| Element | Current | Target | Action |
|---|---|---|---|
| Close button | Small text "×" in card corner | **Circular outline button** (border-radius circle) with × inside | Change to circular × button |
| Speaker icon | Small muted outline (~14px) | **Larger filled solid** speaker with wave arcs (~22px) | Increase size; use filled variant |
| Option row separator | Very thin hairline | Slightly heavier divider with more vertical padding per row | Increase separator weight + row padding |
| Card style | White card on parchment | Same (acceptable) | Minor — low priority |

### 10 — Latin Option Toggle (no current implementation)

New screen required. Spec from mockup:

- Back chevron `<` top-left
- Title: "Latin Responses" (large bold)
- Subtitle: "Show traditional Latin responses when used at this Mass."
- Gold toggle switch (ON state shown)
- Horizontal separator
- Three list rows, each with `>` chevron:
  - "And with your spirit." / *Et cum spiritu tuo.*
  - "Holy, Holy, Holy..." / *Sanctus, Sanctus, Sanctus...*
  - "Lamb of God..." / *Agnus Dei...*

English text: bold/regular. Latin text: italic, muted. Row separator: hairline.

### 11 — Guidance Elements Reference Card (no current implementation)

New screen required. Reference card showing all guidance chips + posture icons with labels and definitions:

**Chips:**
- YOU SAY — "Verbal response by the people"
- YOU DO — "Action or gesture"
- LISTEN — "Listen to the priest or ministers"
- AMBIENT — "Ambient or transitional moment"

**Posture icons (6 total):**
- STAND (front-facing filled solid)
- KNEEL (side-profile filled solid)
- SIT (side-profile filled solid)
- Standing variant (same as STAND)
- Sitting variant (seated with elbow/arm detail)
- PROCESS (two walking figures, label: "Process / Move")

Dashed separator line between chips section and posture section.

---

## 3. Posture Icon Correction Spec

### Current approach (wrong)
```xml
<!-- Example: thin stroke stand -->
<circle cx="12" cy="4.2" r="1.35" stroke="currentColor" stroke-width="1.05"/>
<path d="M12 7.4 Q11.88 13.5 12 20.4" stroke="currentColor" stroke-width="1.15"/>
```
Renders as wireframe stick figure — NOT the target style.

### Target approach
```xml
<!-- All posture icons: filled silhouette, NO stroke, fill="currentColor" -->
<!-- Caller sets color to #B8945A via style or prop -->
<svg fill="currentColor" stroke="none">
  <!-- solid filled shapes only -->
</svg>
```

### Shape guidance per icon

**STAND (front-facing):**
- Head: filled ellipse/circle, centered top
- Shoulders: filled trapezoid (wider at top)
- Body: filled rectangle tapering slightly
- Legs: two filled rounded rectangles side by side
- No arm detail needed — shoulder width implies arms
- Proportions: head ~18% of total height; legs ~40%

**KNEEL (side-profile):**
- Head: filled circle, upper-left
- Torso: filled rounded rectangle, slight forward lean
- Upper legs (thighs): short horizontal filled rectangle going right
- Lower legs/shins: filled rectangle going straight down
- Small foot detail at base
- Reads as: person on both knees, torso upright

**SIT (side-profile):**
- Head: filled circle, upper-left
- Torso: filled rectangle, roughly vertical
- Seat: implied by thigh angle
- Thigh: filled horizontal rectangle going right
- Lower leg: filled rectangle going down from thigh end
- Reads as: person seated in pew

**PROCESS (two figures, front-facing walking):**
- Two STAND-style figures side by side
- Left figure: one leg slightly forward (staggered)
- Right figure: slightly behind or offset
- Figures overlap slightly to read as a pair
- Reads as: procession / movement

---

## 4. Implementation Priority

| Priority | Change | Screens affected |
|---|---|---|
| **P0** | Replace all 4 posture icons with filled silhouettes | Every screen |
| **P0** | Set posture icon color hardcoded to #B8945A | Every screen |
| **P1** | Merge multi-beat screens (Greeting, Kyrie, Collect) | 03, 06, 08 |
| **P1** | Replace bottom nav Home icon with filled house | All screens |
| **P2** | Remove section title from beat-only screens | 05, 06, and others |
| **P2** | Remove "Introductory Rites" subtitle from beat screens | Multiple |
| **P3** | Fix Sign of the Cross title ("Greeting" → "Sign of the Cross") | 02 |
| **P3** | Fix Entrance Chant title (add "Chant") | 01 |
| **P3** | Fix Gloria Omitted wording ("may be" → "is") | 07b |
| **P3** | Fix Kyrie: remove "Penitential Act" section title | 06 |
| **P4** | Add "Hearing something different?" link to Greeting | 03 |
| **P4** | Add description texts to section-intro screens | 04, 08 |
| **P5** | Penitential Act: replace tiny cross with large cross pattée illustration | 04 |
| **P5** | Gloria: replace ornament with sunburst illustration; add second line | 07 |
| **P5** | Gloria Omitted: remove ornament; add ornate cross illustration | 07b |
| **P5** | Confiteor Fault: replace abstract icon with gesture figure illustration | 05c, 05d |
| **P5** | Collect: replace abstract icon with chalice SVG | 08 |
| **P6** | Variant overlay: circular close button, larger speaker icon | 09 |
| **P7** | Implement Latin Option screen | 10 (new) |
| **P7** | Implement Guidance Elements reference screen | 11 (new) |

---

## 5. Assets Still Needed

| Asset | Description | Location |
|---|---|---|
| `posture-stand-filled.svg` | Filled silhouette, front-facing standing | `assets/attend/icons/` |
| `posture-kneel-filled.svg` | Filled silhouette, side-profile kneeling | `assets/attend/icons/` |
| `posture-sit-filled.svg` | Filled silhouette, side-profile seated | `assets/attend/icons/` |
| `posture-process-filled.svg` | Two filled walking figures | `assets/attend/icons/` |
| `illustration-cross-penitential-large.svg` | Large cross pattée with radial light | `assets/attend/icons/` |
| `illustration-confiteor-gesture.svg` | Gold-outline figure, hand on breast | `assets/attend/icons/` |
| `illustration-gloria-sunburst.svg` | Sunburst/monstrance, radiating rays | `assets/attend/icons/` |
| `illustration-gloria-cross-ornate.svg` | Ornate cross with horizontal rule arms | `assets/attend/icons/` |
| `icon-chalice.svg` | Liturgical chalice with IHS cross | `assets/attend/icons/` |
| `icon-lyre.svg` | Proper lyre: oval body, strings, curved arms | `assets/attend/icons/` |
| `nav-home-filled.svg` | Filled solid house silhouette | `assets/attend/nav/` |
