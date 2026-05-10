# Attend Canonical Asset Plan

**Date:** 2026-05-09  
**Status:** Planning / spec only — no SVGs created or edited, no app wiring changed.  
**Source of truth:** `docs/asset-visual-parity-audit.md`

This document defines: (1) the full gesture set to be created, (2) the full Eucharistic symbol set to be created, (3) the canonical asset taxonomy with enforcement rules, (4) the naming and technical spec every asset must satisfy, and (5) the folder structure and migration plan.

---

## 1. Design Language Baseline

All canonical assets follow the same visual grammar established by the existing clean icons in `assets/attend/icons/`:

**Visual character:**
- Thin ceremonial strokes — drawn quality, not constructed. Strokes feel hand-guided, not mechanical.
- Sacred restraint — suggest rather than depict. A folded hand gesture reads from 4 paths; it does not need 40.
- Opacity layering for depth. Primary forms at full opacity. Secondary (supporting anatomy, ground lines) at 0.4–0.8. Tertiary (very subtle: chair back, floor suggestion) at 0.28–0.46.
- No fill anywhere. Every shape is bounded by stroke, not flooded with color.
- `currentColor` throughout — zero hard-coded color values in canonical assets.

**Existing vocabulary to draw from:**  
The following clean icons already establish the design language and serve as reference:
- `posture-stand.svg` — human figure, organic Q-curve torso, quiet grounding line
- `posture-sit.svg` — L-shape torso/thighs, hanging lower leg, almost-invisible chair back
- `chalice.svg` — cup + stem + node + base, paten line at 0.45 opacity
- `lyre.svg` — U-frame, crossbar, 3 strings at 0.78 opacity, resonator foot at 0.48
- `monstrance.svg` — multi-tier ray system (primary, diagonal, off-axis, tertiary), outer halo at 0.32, host circle, cross in host at 0.3, stem + node + base
- `cross-latin.svg` — Catholic proportions: crossbar at 28% from top, 1:2.64 above-to-below ratio
- `cross-penitential.svg` — same geometry, `viewBox="0 0 40 60"`, heavier stroke weight for display scale
- `divider-ornate.svg` — line/diamond/micro-cross/line, 96×24 viewBox, Catholic-ratio cross arms

---

## 2. Gesture SVG Set

Gestures render in the **art ornament zone** of guided steps — the zone between the step title and the guidance chip. This zone is portrait-oriented (taller than wide), approximately 100–130pt tall × 200pt wide in the guided layout.

### 2a. ViewBox Specification for Gestures

Gestures depict a human figure in action, requiring a taller canvas than the 24×24 icon grid.

**Canonical gesture viewBox: `0 0 64 80`**

Rationale:
- Proportioned 4:5 (portrait) — matches the natural figure proportions at small scale.
- Provides enough canvas to show head, torso, and arms without crowding.
- With `preserveAspectRatio="xMidYMid meet"`, a 200pt-wide container renders the figure at ~100pt tall — readable and ceremonial.
- Non-square viewBoxes are already established in the vocabulary (`monstrance.svg` = 24×32, `cross-penitential.svg` = 40×60).

**Stroke weights at 64×80 scale (multiply 24×24 weights by ~2.7):**

| Layer | Weight | Opacity | Usage |
|---|---|---|---|
| Primary outline | 2.8–3.2 | 1.0 | Body contour, head circle, primary arm |
| Secondary | 2.4–2.8 | 0.75–0.85 | Supporting limb, off-hand |
| Tertiary | 1.8–2.2 | 0.38–0.55 | Clothing fold, collar, ground suggestion |
| Ghost | 1.2–1.6 | 0.22–0.35 | Chair, kneeler, barely-there context |

### 2b. Figure Construction Rules

**Head:** Single circle, proportionally small — liturgical pictogram quality, not literal portrait. Radius 4.5–5.5 at 64×80 scale.

**Torso:** Single or double stroke. Prefer a Q-curve suggestion of the body over an anatomically segmented torso. One fluid path is almost always better than three separate body segments.

**Arms:** Suggest presence and gesture direction. Do not draw all five fingers. A closed hand is one rounded path end; an open hand is 2–3 diverging short strokes.

**Ground / context:** Very faint horizontal for standing (suggests floor surface). A kneeler rail for kneeling. A pew seat-back suggestion for sitting. These are ghost-class strokes — 0.22–0.35 opacity. Remove entirely if the gesture reads without them.

**What not to draw:** Feet anatomy, ears, facial features, fingers individually, clothing seams, background figures. Every path that can be removed without losing legibility should be removed.

### 2c. Gesture Catalog — Specifications

---

#### `attend-gesture-sign-cross.svg`

**Moment:** Sign of the Cross (opening)  
**Composition:** 3/4 frontal figure, right hand raised to forehead (fingertips touching brow). Left hand rests at lower chest in a secondary position. Head slightly bowed.  
**Key paths:**
- Head circle, center ~(32, 10), r~5
- Torso: single stroke, (32, 16) → (32, 52), slight rightward lean
- Right arm: arc from right shoulder (~42, 22) up and inward to forehead (~29, 14). Forearm reads as one curved stroke.
- Right hand suggestion: small rounded end or 2 short strokes at path terminus
- Left arm: short arc from left shoulder (~22, 22) down to chest (~26, 38)
- Left hand: minimal presence — ghost-class, 2 short strokes or rounded terminus
- Ground suggestion: horizontal at y~70, 0.28 opacity

---

#### `attend-gesture-strike-breast.svg`

**Moment:** Confiteor ("through my fault")  
**Composition:** 3/4 frontal figure, right fist pressing against left chest. Head bowed in contrition — the bow is important; it is the visual signal of penitence.  
**Key paths:**
- Head circle, slightly bowed (tilted forward ~5°)
- Torso stroke
- Right arm: tight arc from shoulder to chest (~24, 32), fist at terminus — rounded end, slightly larger
- Left arm: resting at side or secondary position across body
- Posture reads "closed" and inward — contrast with sign-of-cross which reads "upward"

---

#### `attend-gesture-folded-hands.svg`

**Moment:** Prayer / quiet response  
**Composition:** 3/4 frontal figure, both hands folded together at chest height. Head slightly bowed.  
**Key paths:**
- Head circle
- Torso stroke, upright
- Both arms converge to center chest (~32, 36)
- Folded hands: two interlocked ovals or a single diamond-shaped suggestion at chest. Do not draw individual fingers. The gesture reads from shape, not anatomy.
- Ground suggestion

---

#### `attend-gesture-standing.svg`

**Moment:** Standing posture illustration (distinct from the badge glyph)  
**Note:** This is the gesture-zone illustration of a standing figure, shown at a larger/more detailed scale than the `posture-stand.svg` badge glyph. They coexist — badge glyph for the badge pill, gesture illustration for the art zone.  
**Composition:** Full frontal standing figure, upright, arms gently at sides.  
**Key paths:**
- Head circle
- Torso: single Q-curve stroke, (32, 18) → (32, 56)
- Arms: two arcs draping from shoulders, very slight outward curve then settling at sides
- Ground line at y~70

---

#### `attend-gesture-kneeling.svg`

**Moment:** Kneeling posture illustration (art zone scale)  
**Composition:** Side-profile kneeling figure. Both knees on ground (or kneeler). Torso upright. Head slightly bowed.  
**Key paths:**
- Head circle, side-profile position (~36, 10)
- Torso: near-vertical stroke (~36, 16) → (~34, 38)
- Thighs: stroke going backward/downward from base of torso
- Lower legs: suggest horizontal behind the figure
- Kneeler rail: ghost-class horizontal stroke at y~64, 0.28 opacity
- Ground: horizontal at y~68

---

#### `attend-gesture-procession.svg`

**Moment:** Processing / moving toward communion  
**Composition:** Single figure mid-stride, slight lean forward. One leg forward, one back. Arms have gentle walking swing.  
**Key paths:**
- Head circle, slightly forward of center
- Torso: slight diagonal (5–8° forward lean)
- Forward leg: thigh + lower leg angled forward
- Rear leg: pushed back
- Arms: opposite swing to legs — if right leg forward, left arm forward
- Forward momentum is the visual signal. The figure is going somewhere sacred.

---

#### `attend-gesture-bowing.svg`

**Moment:** Bow before receiving Communion; bow at the altar  
**Composition:** Profile figure, torso bowed forward ~30–40°. Head follows the bow (not raised). Hands at sides or slightly forward for balance.  
**Key paths:**
- Head circle, position follows bow angle
- Torso: diagonal stroke at ~35° forward lean from vertical
- Arms: hang toward the floor with slight forward slope
- Legs: upright (contrast between upright legs and bowed torso is the visual signal)
- Ground suggestion

---

#### `attend-gesture-listening.svg`

**Moment:** Listening to the Liturgy of the Word; homily  
**Composition:** Seated figure, head slightly raised and tilted toward a sound source (suggested off-screen left). Posture is attentive, not slumped.  
**Key paths:**
- Head circle, slightly tilted upward
- Torso: seated, upright, at ~80% of standing height
- Thighs: horizontal from base of torso
- Lower legs: hanging from knee
- Chair back: ghost-class vertical behind figure, 0.28 opacity
- The key visual: head tilt upward/toward the source reads as attentive listening

---

#### `attend-gesture-priest-proclaiming.svg`

**Moment:** Priest proclaiming the Gospel or Eucharistic Prayer  
**Composition:** Frontal figure with both arms raised at sides in orans posture — elbows at shoulder height, forearms angled slightly upward. This is the priest's prayer posture. Head slightly raised.  
**Key paths:**
- Head circle, slight upward tilt
- Torso: centered, upright
- Both arms: raised arc from shoulder to elbow height, forearms angled outward/upward
- The raised-arms orans is the canonical visual signal for priestly proclamation
- Ground suggestion

---

#### `attend-gesture-receiving-communion.svg`

**Moment:** Receiving Holy Communion  
**Composition:** 3/4 frontal figure, both hands outstretched and cupped (one hand supporting the other) at waist/chest height. Head slightly bowed.  
**Key paths:**
- Head circle, bowed
- Torso: upright
- Both arms extended forward, meeting at center
- Hands: suggested as two overlapping ovals or a shallow cup shape — not individual fingers
- The outstretched receiving hands are the central visual signal

---

#### `attend-gesture-offering-gifts.svg`

**Moment:** Presentation of Gifts / Offertory  
**Composition:** Profile or 3/4 figure carrying an object (suggested: a raised plate/paten shape) forward. One arm extended offering the gift. Motion toward the altar.  
**Key paths:**
- Head circle
- Torso: slight lean toward the offering
- Forward arm extended, at waist height, supporting the offered object
- Object: very simple oval or rectangle — a paten or gift basket suggestion. Ghost-class opacity if needed.
- The gesture of offering outward is the visual signal

---

#### `attend-gesture-gospel-cross.svg`

**Moment:** Small cross gesture on forehead/lips/heart before the Gospel  
**Composition:** Close-up of a hand or head-and-hand, right thumb tracing a small cross on the forehead. Can be simplified to the hand gesture alone at the forehead level, without a full figure.  
**Alternative approach:** If the full figure reads too small, compose as a detail view — just head + right hand at brow, no torso/legs. ViewBox may stay at 64×80 but the composition fills the upper zone.  
**Key paths:**
- Head circle
- Right hand raised to forehead — thumb at brow forming small cross direction
- The thumbtip can be suggested as a rounded terminus with a small cross formed by the gesture arc direction

---

### 2d. Gesture Set Summary Table

| Filename | Moment | ViewBox | New? |
|---|---|---|---|
| `attend-gesture-sign-cross.svg` | Sign of the Cross | 64×80 | Replace illustration |
| `attend-gesture-strike-breast.svg` | Confiteor fault | 64×80 | Replace illustration |
| `attend-gesture-folded-hands.svg` | Prayer | 64×80 | Replace illustration |
| `attend-gesture-standing.svg` | Standing posture (art zone) | 64×80 | Replace illustration |
| `attend-gesture-kneeling.svg` | Kneeling posture (art zone) | 64×80 | Replace illustration |
| `attend-gesture-procession.svg` | Processing toward Communion | 64×80 | Replace illustration |
| `attend-gesture-bowing.svg` | Bowing | 64×80 | Replace illustration |
| `attend-gesture-listening.svg` | Listening (Liturgy of the Word) | 64×80 | Replace illustration |
| `attend-gesture-priest-proclaiming.svg` | Priest orans / proclamation | 64×80 | Replace illustration |
| `attend-gesture-receiving-communion.svg` | Receiving Communion | 64×80 | New |
| `attend-gesture-offering-gifts.svg` | Offertory / Presentation | 64×80 | New |
| `attend-gesture-gospel-cross.svg` | Gospel cross gesture | 64×80 | New |

The first 9 filenames intentionally match the illustration-class files they replace (same name, different content class). This preserves future wiring points without requiring attend.tsx changes.

---

## 3. Eucharistic and Concluding Symbol Set

These are **art ornament icons** — displayed in the same role as the lyre and chalice. They are not gesture figures. They use the standard 24×24 viewBox unless the subject's natural proportions require a taller canvas.

The monstrance already exists (`assets/attend/icons/monstrance.svg`, 24×32). The chalice and lyre already exist (`assets/attend/icons/chalice.svg`, `lyre.svg`, both 24×24). The symbols below are the remaining gaps.

---

#### `attend-symbol-host-elevation.svg`

**Moment:** Consecration — elevation of the host  
**Composition:** A chalice or paten with the host disc elevated above it — two upraised hands lifting it. Or: host disc with rays, elevated above a horizontal surface. The host disc should be a circle; the elevation is shown by position at the top of the viewBox.  
**ViewBox:** `0 0 24 32`  
**Approach:** Host circle at top (y~5, r~4), underlined by two raised hand-strokes. Simple and unmistakable. Consider adding 3–4 short rays at 0.5–0.6 opacity to signal sacred elevation.

---

#### `attend-symbol-chalice-elevation.svg`

**Moment:** Consecration — elevation of the chalice  
**Composition:** Chalice lifted high. The existing `chalice.svg` shows a chalice at rest. This variant should show the chalice tilted slightly or lifted — perhaps with two minimal hand strokes below the base, or a subtle upward motion arc at 0.3 opacity.  
**ViewBox:** `0 0 24 32`  
**Note:** Do not duplicate `chalice.svg`. This is the elevation-specific variant — distinct posture, distinct moment.

---

#### `attend-symbol-altar-candles.svg`

**Moment:** Liturgy of the Eucharist ambient — altar setting  
**Composition:** Two candles flanking a central space. Each candle: a thin vertical stroke with a small flame shape at the top (teardrop or pointed oval, stroke not fill). The two candles face each other symmetrically.  
**ViewBox:** `0 0 24 24`  
**Flame:** 3–4 short arcing strokes suggesting flame, not a filled teardrop. Opacity 0.7–0.9.

---

#### `attend-symbol-sanctuary-lamp.svg`

**Moment:** Tabernacle presence; Eucharistic adoration  
**Composition:** A hanging lamp — a small cup/bowl suspended by a chain or cord from above. Flame or glow suggestion within the cup. The hanging chain is 3–4 dashes or short strokes.  
**ViewBox:** `0 0 24 32` (lamp hangs from top of viewBox)  
**Chain:** Ghost-class strokes, 0.4–0.5 opacity.

---

#### `attend-symbol-incense.svg`

**Moment:** Incensation — Gospel procession, Offertory, Consecration  
**Composition:** A thurible (censer) with rising smoke. Thurible body: small vessel at bottom-center. Smoke: 2–3 sinuous ascending curves rising from the vessel, progressively fading (1.0 → 0.6 → 0.28 opacity as they rise).  
**ViewBox:** `0 0 24 32` (smoke rises to top)  
**Smoke curves:** Avoid perfectly parallel paths. Each smoke curve should diverge slightly from the others to suggest natural diffusion.

---

#### `attend-symbol-agnus-dei.svg`

**Moment:** Agnus Dei — Lamb of God  
**Composition:** A simplified lamb figure — body as an oval or rounded rectangle, head as a smaller circle, a cross or banner staff. This is the Agnus Dei iconographic tradition. Keep it schematic, not naturalistic.  
**ViewBox:** `0 0 24 24` or `0 0 32 24` (landscape — the lamb faces right by convention)  
**Cross/banner:** A thin cross rising from the back of the lamb, with a small pennant at the top (2 short strokes, not a filled flag). This identifies it as the Agnus Dei rather than a generic animal.

---

#### `attend-symbol-peace-gesture.svg`

**Moment:** Sign of Peace  
**Composition:** Two profile figures facing each other, with hands extended in a handshake or greeting gesture. OR: a single pair of hands clasped. The facing-figures composition is richer; the clasped-hands composition is simpler. Choose based on art zone clarity at ~80pt render.  
**ViewBox:** `0 0 48 32` (landscape — two figures side by side) or `0 0 24 24` (clasped hands variant)  
**Preferred:** Clasped-hands variant at 24×24. Two simple hand outlines meeting at center — more universally legible than two small figures at small size.

---

#### `attend-symbol-blessing.svg`

**Moment:** Final blessing / benediction  
**Composition:** Priest figure, frontal, right hand raised in blessing (three fingers upright, two folded — the traditional priestly blessing gesture). OR: simplified — just an upraised right hand with fingers suggested.  
**ViewBox:** `0 0 24 32` (figure needs vertical space for raised arm)  
**Key signal:** The raised right hand in blessing is visually distinct from the orans (both arms raised) of `attend-gesture-priest-proclaiming.svg`. Only one arm is raised; the other rests at the side.

---

#### `attend-symbol-recessional.svg`

**Moment:** Dismissal / recessional procession  
**Composition:** A figure (or two figures) in procession, walking with forward lean. Similar to `attend-gesture-procession.svg` but composed as a symbol (smaller, more schematic, less detailed) rather than an art-zone illustration. Can use two figures walking in procession.  
**ViewBox:** `0 0 32 24` (landscape) or `0 0 24 24`  
**Distinction from procession gesture:** This is a symbol, not a gesture illustration. It reads at smaller sizes and is used as an ornament/art icon, not as a full gesture illustration.

---

### 3a. Eucharistic Symbol Summary Table

| Filename | Moment | ViewBox | Status |
|---|---|---|---|
| `attend-symbol-host-elevation.svg` | Host consecration | 24×32 | New |
| `attend-symbol-chalice-elevation.svg` | Chalice consecration | 24×32 | New |
| `attend-symbol-altar-candles.svg` | Altar/Eucharist setting | 24×24 | New |
| `attend-symbol-sanctuary-lamp.svg` | Tabernacle/Real Presence | 24×32 | New |
| `attend-symbol-incense.svg` | Incensation | 24×32 | New |
| `attend-symbol-agnus-dei.svg` | Agnus Dei / Lamb of God | 24×24 or 32×24 | New |
| `attend-symbol-peace-gesture.svg` | Sign of Peace | 24×24 | New |
| `attend-symbol-blessing.svg` | Final blessing | 24×32 | New |
| `attend-symbol-recessional.svg` | Dismissal / recessional | 24×24 | New |

**Already exists (no action):**
- `attend-symbol` for Entrance Chant → `lyre.svg` ✓
- `attend-symbol` for Opening Prayer → `chalice.svg` ✓
- `attend-symbol` for Gloria → `monstrance.svg` (pending design confirmation — see P1-02)
- `attend-symbol` for penitential / cross contexts → `cross-penitential.svg`, `cross-latin.svg` ✓

---

## 4. Asset Taxonomy

Five canonical categories. Every SVG in the project belongs to exactly one category. Category determines wiring eligibility.

---

### Category 1: Runtime-Safe Icons

**Definition:** Small ornamental / functional icons. Render correctly at 16–48pt. Used for posture badges, nav dock, art ornament zone, in-content decoration.

**Technical requirements (all must pass):**
- `fill="none"` on root SVG element
- Every colored element uses `stroke="currentColor"` or `fill="currentColor"`. Zero hard-coded hex colors.
- `viewBox` in the approved set: `0 0 24 24` · `0 0 24 32` · `0 0 32 24` · `0 0 40 60` · `0 0 48 16` · `0 0 48 24` · `0 0 96 24` (see Section 4a for full spec)
- File size ≤ 3 KB
- No `<image>`, no `<use>`, no external references, no `clip-path` on the root element
- `xmlns:xlink` absent or unused

**Confirmed existing members:**  
All files in `assets/attend/icons/` + `assets/icons/attend/` (excluding `before/`) + `assets/attend/dividers/` + `assets/attend/nav/`

**Wiring allowed:** Yes.

---

### Category 2: Runtime-Safe Gestures

**Definition:** Art-zone figure illustrations. Render correctly at 80–160pt. Used for gesture guidance in the guided view art zone.

**Technical requirements (all must pass):**
- Same `fill="none"` / `currentColor` rule as Category 1
- `viewBox` must be `0 0 64 80` (the canonical gesture viewBox)
- File size ≤ 6 KB (gesture figures have more paths than icons; limit is relaxed proportionally)
- No `<image>`, no `<use>`, no external references
- Stroke weights within the gesture scale spec (Section 2a)

**Target members:** The 12 files in Section 2c above.

**Wiring allowed:** Yes — after creation passes review.

---

### Category 3: Ornaments and Dividers

**Definition:** Horizontal layout elements — dividers, section breaks, accent ornaments. Used inline between content zones.

**Technical requirements:**
- `fill="none"` / `currentColor`
- `viewBox` must be wide-format: `0 0 96 24`, `0 0 48 16`, or `0 0 48 24`
- File size ≤ 2 KB
- No external references

**Existing members:** `assets/attend/dividers/divider-ornate.svg`, `divider-plus.svg`, `divider-line.svg` · `assets/icons/attend/sacred-divider-ornament.svg`

**Wiring allowed:** Yes.

---

### Category 4: Archived Illustration Exports

**Definition:** Vector-traced illustrations from external design tools. Hard-coded colors, 384×384+ viewBox, hundreds of KB. These were produced as design exploration artifacts and are not usable in the app.

**Members (complete list):**
- `assets/attend/liturgical/attend-liturgical-*.svg` (14 files)
- `assets/attend/gestures/attend-gesture-*-default.svg` (9 files — current, to be replaced by Category 2)
- `assets/attend/ornaments/attend-ornament-*-default.svg` (5 files)
- `assets/attend/postures/badges/attend-posture-*-badge-default.svg` (4 files)
- `assets/attend/guidance/chips/attend-guidance-*-chip-default.svg` (3 files — pending size verification)

**Wiring allowed:** No. These must never be imported into `AttendAssets.tsx` or any component. See Section 5 for migration plan.

---

### Category 5: Forbidden-to-Wire

**Definition:** Superseded assets — old design iterations kept in place to avoid git history rewriting. These are the `before/` versions of the System A icons.

**Members:**
- All files in `assets/icons/attend/before/` (12 files)

**Wiring allowed:** No.

---

## 5. Naming Convention

### 5a. Filename Structure

```
attend-{category-prefix}-{subject}-{variant}.svg
```

| Category | Prefix | Example |
|---|---|---|
| Gesture | `gesture` | `attend-gesture-sign-cross.svg` |
| Eucharistic/liturgical symbol | `symbol` | `attend-symbol-incense.svg` |
| Ornament / divider | `ornament` | (existing ornament files keep their names) |
| Posture glyph (icon size) | `posture` | `attend-posture-stand.svg` (maps to `assets/attend/icons/posture-stand.svg`) |
| Navigation | `nav` | (existing nav files keep their names) |

**No `-default` suffix on new files.** The `-default` suffix was used by the illustration export pipeline (e.g., `attend-gesture-sign-cross-default.svg`). Omitting it from new canonical files makes the class distinction immediately visible in the filesystem: files without `-default` are canonical; files with `-default` are archived illustrations.

**No version numbers or dates in filenames.** The filename is the canonical identifier. Version history lives in git.

### 5b. currentColor Requirement

Every stroke, fill, and opacity in a canonical asset (Categories 1–3) must use `currentColor`. The verification test:

```
grep -E 'fill="#|stroke="#|fill="rgb|stroke="rgb' <filename>
```

A canonical asset returns zero matches. Any match is a disqualifying defect.

**Exception:** `opacity` attributes on individual paths (e.g., `opacity=".45"`) are allowed — they layer the `currentColor` transparently and do not hard-code a color value.

### 5c. ViewBox Rules

| Asset type | Required viewBox values |
|---|---|
| Standard icon | `0 0 24 24` |
| Tall icon (vessel, candle, lamp) | `0 0 24 32` |
| Wide icon (lamb, peace, divider) | `0 0 32 24` or `0 0 48 24` |
| Display-scale cross | `0 0 40 60` |
| Gesture illustration | `0 0 64 80` |
| Divider / ornament | `0 0 96 24` or `0 0 48 16` |

`viewBox` must always start at `0 0`. Non-zero origin viewBoxes are not permitted (they indicate an export artifact from illustration software).

### 5d. Stroke Weight Rules

For 24×24 icons:

| Layer | Weight range | Opacity |
|---|---|---|
| Primary (main form) | 1.1 – 1.35 | 1.0 |
| Secondary (supporting) | 0.9 – 1.1 | 0.6 – 0.85 |
| Tertiary (accent) | 0.7 – 0.95 | 0.38 – 0.6 |
| Ghost (barely-there context) | 0.6 – 0.8 | 0.22 – 0.38 |

For 64×80 gesture illustrations: multiply all weights by 2.7 (see Section 2a).

**`stroke-linecap="round"` is the default.** Use `stroke-linejoin="round"` wherever paths join. Square linecaps are not used in this vocabulary.

**No `stroke-dasharray`** in primary or secondary paths. Dashes are permitted only in ghost-class paths where a dashed line is semantically meaningful (e.g., the motion arc between footsteps in `footstep.svg`).

### 5e. Maximum File Size Rules

| Category | Limit |
|---|---|
| Runtime-Safe Icon (Cat. 1) | 3 KB |
| Runtime-Safe Gesture (Cat. 2) | 6 KB |
| Ornament / Divider (Cat. 3) | 2 KB |
| Archived Illustration (Cat. 4) | No limit (not wired) |

Exceeding the limit is a sign that the SVG has too many paths and should be simplified. The design rule is: fewer paths, cleaner read.

---

## 6. Canonical Folder Structure

### 6a. Target State

```
assets/
  attend/
    icons/           ← Category 1: runtime-safe icons (standard 24×24 and variant viewBoxes)
      chalice.svg
      lyre.svg
      monstrance.svg
      sunburst.svg
      cross-latin.svg
      cross-penitential.svg
      cross-circle.svg
      posture-stand.svg
      posture-sit.svg
      posture-kneel.svg
      posture-process.svg
      footstep.svg
      flower-optional.svg
      speaker.svg
      sound-wave.svg
      candles-advent.svg
      star-christmas.svg
      lent-cross.svg
      easter-sunrise.svg
      olive-branch.svg
      heart.svg
      check.svg
      close.svg
      cadence-dot-active.svg
      cadence-dot-inactive.svg
      chevron-left.svg
      chevron-right.svg
      attend-symbol-host-elevation.svg      ← new (Section 3)
      attend-symbol-chalice-elevation.svg   ← new
      attend-symbol-altar-candles.svg       ← new
      attend-symbol-sanctuary-lamp.svg      ← new
      attend-symbol-incense.svg             ← new
      attend-symbol-agnus-dei.svg           ← new
      attend-symbol-peace-gesture.svg       ← new
      attend-symbol-blessing.svg            ← new
      attend-symbol-recessional.svg         ← new

    gestures/        ← Category 2: runtime-safe gesture illustrations (64×80)
      attend-gesture-sign-cross.svg              ← new (replaces illustration)
      attend-gesture-strike-breast.svg           ← new (replaces illustration)
      attend-gesture-folded-hands.svg            ← new (replaces illustration)
      attend-gesture-standing.svg                ← new (replaces illustration)
      attend-gesture-kneeling.svg                ← new (replaces illustration)
      attend-gesture-procession.svg              ← new (replaces illustration)
      attend-gesture-bowing.svg                  ← new (replaces illustration)
      attend-gesture-listening.svg               ← new (replaces illustration)
      attend-gesture-priest-proclaiming.svg      ← new (replaces illustration)
      attend-gesture-receiving-communion.svg     ← new
      attend-gesture-offering-gifts.svg          ← new
      attend-gesture-gospel-cross.svg            ← new

    dividers/        ← Category 3: ornaments and dividers
      divider-ornate.svg
      divider-plus.svg
      divider-line.svg

    nav/             ← Category 1 (nav variant)
      home.svg
      menu.svg
      cross-circle.svg

    backgrounds/     ← unclassified; not wired
      cathedral-sketch.svg

    _archive/        ← Category 4: illustration exports, never to be wired
      liturgical/
        attend-liturgical-lyre-winged-default.svg
        attend-liturgical-chalice-default.svg
        attend-liturgical-host-eucharist-default.svg
        attend-liturgical-crucifix-default.svg
        attend-liturgical-cross-processional-default.svg
        attend-liturgical-gospel-open-default.svg
        attend-liturgical-sanctuary-lamp-default.svg
        attend-liturgical-altar-candles-default.svg
        attend-liturgical-incense-default.svg
        attend-liturgical-dove-default.svg
        attend-liturgical-sacred-heart-default.svg
        attend-liturgical-lily-default.svg
        attend-liturgical-wheat-default.svg
        attend-liturgical-grapes-default.svg
      gestures-illustration/
        attend-gesture-sign-cross-default.svg
        attend-gesture-strike-breast-default.svg
        attend-gesture-folded-hands-default.svg
        attend-gesture-standing-default.svg
        attend-gesture-kneeling-default.svg
        attend-gesture-procession-default.svg
        attend-gesture-bowing-default.svg
        attend-gesture-listening-default.svg
        attend-gesture-priest-proclaiming-default.svg
      ornaments/
        attend-ornament-cross-small-accent-default.svg
        attend-ornament-diamond-accent-default.svg
        attend-ornament-star-accent-default.svg
        attend-ornament-section-divider-default.svg
        attend-ornament-centered-default.svg
      postures/
        badges/
          attend-posture-stand-badge-default.svg
          attend-posture-sit-badge-default.svg
          attend-posture-kneel-badge-default.svg
          attend-posture-process-badge-default.svg
      guidance/
        chips/
          attend-guidance-pray-chip-default.svg
          attend-guidance-reflect-chip-default.svg
          attend-guidance-silence-chip-default.svg

  icons/
    attend/          ← System A (Category 1 and Category 5)
      stand.svg
      sit.svg
      kneel.svg
      process.svg
      cross.svg
      home.svg
      more.svg
      left-chevron.svg
      chalice.svg
      lyre-music.svg
      gloria-sunburst.svg
      sacred-divider-ornament.svg
      before/        ← Category 5: forbidden-to-wire
        (12 files, unchanged)
```

### 6b. Migration Plan

**Step 1 — Archive illustration SVGs (no app changes required)**

Move all Category 4 files from their current locations into `assets/attend/_archive/`:
- `assets/attend/liturgical/` → `assets/attend/_archive/liturgical/`
- `assets/attend/gestures/*.svg` (illustration class, those with `-default.svg`) → `assets/attend/_archive/gestures-illustration/`
- `assets/attend/ornaments/` → `assets/attend/_archive/ornaments/`
- `assets/attend/postures/` → `assets/attend/_archive/postures/`
- `assets/attend/guidance/` → `assets/attend/_archive/guidance/`

**Warning:** `AttendAssets.tsx` currently imports from `assets/attend/gestures/` and `assets/attend/liturgical/`. Moving these files **will break the build** until Step 3 is complete. Steps 1 and 3 must be done together in a single commit.

**Step 2 — Create new canonical gesture SVGs**

Create the 12 gesture SVGs (Section 2c) in `assets/attend/gestures/`. Names match the old illustration files (e.g., `attend-gesture-sign-cross.svg` — no `-default` suffix). These are Category 2 files.

Create the 9 Eucharistic symbol SVGs (Section 3) in `assets/attend/icons/`.

**Step 3 — Update AttendAssets.tsx imports**

Update imports to point to the new canonical files:
- `assets/attend/gestures/attend-gesture-sign-cross.svg` (new) replaces `attend-gesture-sign-cross-default.svg` (archived)
- `assets/attend/icons/lyre.svg` replaces `attend-liturgical-lyre-winged-default.svg`
- `assets/attend/icons/chalice.svg` replaces `attend-liturgical-chalice-default.svg`
- `assets/attend/icons/monstrance.svg` replaces `attend-liturgical-host-eucharist-default.svg` (pending design confirmation of Gloria art — see P1-02)

**Step 4 — Remove System A redundancies (optional, deferred)**

After the new icons are fully wired and tested, the System A equivalents (`assets/icons/attend/chalice.svg`, `assets/icons/attend/lyre-music.svg`) may be consolidated into the `assets/attend/icons/` canonical location. This requires `AttendIconName` type updates and is deferred until the new gesture set is stable.

---

## 7. Content Safety Gate for Assets

Two enforcement mechanisms should be added alongside asset creation (not blocking creation, but required before any asset is wired):

**Gate 1 — currentColor grep in CI**

```bash
# Fails if any canonical asset file contains a hard-coded color
grep -rE 'fill="#|stroke="#|fill="rgb|stroke="rgb' assets/attend/icons/ assets/attend/gestures/ assets/attend/dividers/ assets/attend/nav/
```

This should return zero matches. Any match blocks wiring.

**Gate 2 — File size check**

```bash
# Warns on any icon exceeding 3 KB, gesture exceeding 6 KB
find assets/attend/icons -name "*.svg" -size +3k -print
find assets/attend/gestures -name "*.svg" -size +6k -print
```

**Gate 3 — _archive/ import ban**

Add a lint rule (or comment in `AttendAssets.tsx`) that imports from `_archive/` are forbidden. A dead simple check:

```bash
grep -r "_archive" components/ app/
```

Must return zero matches.

---

## 8. Open Design Decisions

These require a decision before the affected asset can be finalized:

| # | Question | Options | Blocking |
|---|---|---|---|
| D1 | Which icon is canonical for Gloria art zone? | `monstrance.svg` (half-circle, upward-facing rays) vs `sunburst.svg` (8-point full starburst) vs `assets/icons/attend/gloria-sunburst.svg` (y=9.45 off-center circle + 8 rays + bottom arc) | Blocks `attend-symbol` mapping for Gloria step |
| D2 | Peace gesture — two figures or clasped hands? | Two profile figures (32×24 viewBox, wider composition) vs clasped hands (24×24, simpler) | Blocks `attend-symbol-peace-gesture.svg` spec |
| D3 | Do the new `posture-*.svg` liturgical pictograms (organic Q-curve style) replace the System A filled silhouettes for any role? | Keep System A for all badge uses (matches mockup) — new pictograms unused, or new pictograms as art-zone standing/kneeling gesture complement | Blocks whether `gesture-standing.svg` and `gesture-kneeling.svg` coexist with or replace the posture glyph files |
| D4 | Is the cathedral-sketch background intended for any screen? | Wire as ambient background layer · Keep as unused design asset · Archive | Not blocking for gesture/symbol work |
