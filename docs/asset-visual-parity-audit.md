# Asset Visual Parity Audit — Attend SVG Library

**Date:** 2026-05-09  
**Sources:** `assets/icons/attend/` (System A), `assets/attend/` (System B), `docs/mockups/`, `docs/runtime-audit/`  
**Scope:** Rendering status, posture icons, gesture art, ornaments, dividers, navigation icons, line weight / fill style, scale, missing assets, naming and mapping problems.

---

## Asset System Architecture

Two parallel SVG systems exist. Understanding which is which is prerequisite to the findings below.

| | System A | System B |
|---|---|---|
| **Path** | `assets/icons/attend/` | `assets/attend/` |
| **ViewBox** | 24×24 (icons), 96×24 (divider) | 24×24 (clean icons) or 384×384 (illustrations) |
| **Color** | `currentColor` | `currentColor` (clean icons) or hard-coded `#b08a3c` (illustrations) |
| **File size** | < 2 KB | < 2 KB (clean) or 524–987 KB (illustrations) |
| **How wired** | `AttendPrimitives.tsx` + `AttendIconName` type | `AttendAssets.tsx` → `attendAssetSources` |
| **Icons present** | stand, sit, kneel, process, cross, home, more, left-chevron, chalice, lyre-music, gloria-sunburst, sacred-divider-ornament | gestures (4), icons (11), liturgical (3), postures/badges (4), ornaments (5), dividers (3), nav (3), backgrounds (1), guidance/chips (3) |

**`AttendAssets.tsx` current wiring:**

```
attendAssetSources.gestures  →  assets/attend/gestures/*.svg       (illustration class — WRONG)
attendAssetSources.icons     →  assets/attend/icons/*.svg          (clean class — CORRECT)
attendAssetSources.liturgical →  assets/attend/liturgical/*.svg    (illustration class — WRONG)
```

Only 5 of the 11 clean icons in `assets/attend/icons/` are wired: check, close, crossPenitential, speaker, sunburst. The clean lyre, chalice, posture glyphs, and dividers are all unwired.

---

## P0 — Wrong Paradigm / Breaks Mockup Fidelity

### P0-01 · Liturgical illustration SVGs — wrong paradigm, rendering as unrecognizable blobs

**Affected files:**
- `assets/attend/liturgical/attend-liturgical-lyre-winged-default.svg` (~534 KB, 384×384)
- `assets/attend/liturgical/attend-liturgical-chalice-default.svg` (~534 KB, 384×384)
- `assets/attend/liturgical/attend-liturgical-host-eucharist-default.svg` (~534 KB, 384×384)

**What the mockup shows:** Clean thin-stroke golden ornamental icons flanked by horizontal divider lines. The lyre is a delicate 5-string instrument with a U-frame and crossbar. The chalice is a simple goblet profile with a node on the stem.

**What the runtime shows (confirmed in `f-stand-entrance-chant-screen-01/02/03`):** The lyre renders as a golden circle containing three vertical bars — an unrecognizable abstraction. At the guided art ornament size (~80–100pt), the 384×384 viewBox is compressed ~5× and the thousands of complex fill paths average into a circular golden blob. The chalice is slightly more recognizable (goblet silhouette survives compression) but still renders as a flat filled mass with no stroke character.

**Root cause:** These are vector-traced illustrations exported from illustration software. `fill="#b08a3c"` is hard-coded — they cannot respond to `currentColor` or any theme color. The `color` prop passed by `AttendAssetImage` has no effect on them.

**Correct replacement:** `assets/attend/icons/lyre.svg` and `assets/attend/icons/chalice.svg` are clean 24×24 `currentColor` stroke icons that match the mockup thin-stroke language exactly. They exist but are not wired.

---

### P0-02 · Gesture illustration SVGs — wrong paradigm, no clean equivalent exists

**Affected files:**
- `assets/attend/gestures/attend-gesture-sign-cross-default.svg` (~524 KB, 384×384)
- `assets/attend/gestures/attend-gesture-bowing-default.svg` (~524 KB, 384×384)
- `assets/attend/gestures/attend-gesture-strike-breast-default.svg` (~524 KB, 384×384)
- `assets/attend/gestures/attend-gesture-procession-default.svg` (~524 KB, 384×384)

All four are wired in `AttendAssets.tsx` as `attendAssetSources.gestures.*`.

**What the mockup shows (`02-sign-of-cross/mockup.jpeg`):** A delicate thin-stroke line figure illustration — a person with head visible, arm raised to forehead making the sign of the cross. Style: fine curved lines, `currentColor`-responsive, fitting gracefully in the art ornament zone above the guidance chip. The figure is legible at small size and matches the overall stroke language.

**What the runtime produces:** At the guided art ornament rendering size, the 384×384 illustration SVGs compress to indistinct golden fills. Same paradigm problem as P0-01. Additionally, `fill="#b08a3c"` is hard-coded throughout — the `color` prop has no effect.

**Gap:** No clean thin-stroke gesture illustration set exists in either asset system. The mockup-quality line figures for sign of cross, bowing, strike breast, and procession are not available as clean SVGs. This is a missing asset — not a mapping error.

---

### P0-03 · Ornament illustration SVGs — wrong paradigm, not yet wired (risk if wired)

**Affected files:**
- `assets/attend/ornaments/attend-ornament-section-divider-default.svg` (~574 KB, 384×384)
- `assets/attend/ornaments/attend-ornament-diamond-accent-default.svg` (~534 KB, 384×384)
- `assets/attend/ornaments/attend-ornament-cross-small-accent-default.svg`
- `assets/attend/ornaments/attend-ornament-star-accent-default.svg`
- `assets/attend/ornaments/attend-ornament-centered-default.svg`

All five are the same illustration class (hard-coded `#b08a3c`, 384×384, 500KB+). None are currently wired. If any were wired as section dividers they would render as compressed golden blobs, breaking the clean divider line aesthetic confirmed working in runtime.

---

### P0-04 · Posture badge SVGs — wrong paradigm, not wired (risk if wired)

**Affected files:**
- `assets/attend/postures/badges/attend-posture-stand-badge-default.svg` (~984 KB)
- `assets/attend/postures/badges/attend-posture-sit-badge-default.svg` (~987 KB)
- `assets/attend/postures/badges/attend-posture-kneel-badge-default.svg` (~989 KB)
- `assets/attend/postures/badges/attend-posture-process-badge-default.svg`

Same illustration class. Not wired. Not suitable for wiring — the System A badge rendering (filled silhouette + pill border) already matches the mockup and renders correctly in all runtime screens.

---

## P1 — Visible Mismatch

### P1-01 · Entrance Chant lyre — wrong SVG wired to art ornament slot

**Runtime:** `LyreWingedLiturgical` renders as a golden circle with vertical bars (P0-01 detail).  
**Fix exists:** `assets/attend/icons/lyre.svg` is present, clean, correct paradigm, unwired.  
**Required change:** Map entrance chant art slot to `attendAssetSources.icons.lyre` rather than `attendAssetSources.liturgical.lyreWinged`. Add `lyre` key to `attendAssetSources.icons` in `AttendAssets.tsx`.

---

### P1-02 · Gloria art — sunburst shape does not match mockup

**Runtime (`gloria-screen-01`):** `SunburstIcon` (`assets/attend/icons/sunburst.svg`) renders as an 8-point starburst / compass rose — a full-circle symmetric radiant shape.

**Mockup (`07-gloria-included/mockup.jpeg`):** Shows a half-circle monstrance/sunrise composition — rays emanating upward from a horizon line, with a cross form at center. This is a distinctly asymmetric, upward-facing shape (glory rising from earth).

**Gap:** No half-circle monstrance/sunrise SVG exists in either asset system. `assets/attend/icons/monstrance.svg` is present — it may be the intended asset. The wired `assets/icons/attend/gloria-sunburst.svg` (System A, center circle at y=9.45 + 8 rays + bottom arc) is also closer to the monstrance shape. Neither has been confirmed as the canonical mockup equivalent.

**Status:** Asset ambiguity — requires design confirmation of which icon is canonical for Gloria.

---

### P1-03 · Three parallel posture glyph sets — canonical choice not enforced

Three distinct posture icon styles exist simultaneously:

| Set | Location | Style | Wired? | Matches mockup? |
|---|---|---|---|---|
| System A | `assets/icons/attend/{stand,sit,kneel,process}.svg` | Filled silhouette (rects + circles + `fill="currentColor"`) | Yes — PostureBadge + PostureGlyphIcon | **Yes** |
| New pictogram | `assets/attend/icons/posture-{stand,sit,kneel,process}.svg` | Ceremonial stroke pictogram (organic Q-curve torso, single-weight strokes) | No | No — mockup shows filled |
| Badge illustration | `assets/attend/postures/badges/*.svg` | 984KB complex illustration | No | No (P0-04) |

System A is correct. The new pictogram set in `assets/attend/icons/` represents an unwired alternative that would reduce legibility at badge size relative to the mockup's filled-silhouette style. The stroke pictogram files contain inline comments describing their design intent ("small head, elongated body, liturgical pictogram quality") — these appear to be exploratory design work, not the canonical choice.

---

### P1-04 · Chalice wiring — illustration SVG used where clean icon exists

**Runtime (`f-stand-collect-screen-01`):** Art ornament slot renders a golden chalice. It is slightly more legible than the lyre (goblet silhouette is recognizable) but still renders as a flat golden fill mass, not the mockup's thin-stroke line.

**Wired:** `attendAssetSources.liturgical.chalice` → `ChaliceLiturgical` (534KB, hard-coded `#b08a3c`).  
**Available:** `assets/attend/icons/chalice.svg` (24×24, `currentColor`, thin stroke, has stem node detail).  
**Fix:** Same pattern as P1-01 — add `chalice` to `attendAssetSources.icons`, map collect art slot there.

---

### P1-05 · Sacred divider ornament — improved version not wired

**Wired (`assets/icons/attend/sacred-divider-ornament.svg`):** `viewBox="0 96 24"` — diamond center + 4 cross arms + flanking rules. Renders correctly in runtime.

**Not wired (`assets/attend/dividers/divider-ornate.svg`):** Same composition but with corrected geometry: diamond is slightly taller than wide (vertical sacred emphasis), cross arms use 3:2 vertical:horizontal ratio per Catholic-ratio design notes in file comments. A refinement over the wired version.

**Not blocking** — the wired version renders correctly. P1 because the improved geometry exists and is unwired.

---

## P2 — Refinement

### P2-01 · Parchment color discrepancy

`assets/attend/manifest.json` defines parchment as `#F6FEE3`. `constants/attendTheme.ts` defines `attendColors.parchment` as `#F6EFE3`. These differ in the middle two hex digits (`FE` vs `EF`). At small gamut differences, the visual effect is minimal but the specification is inconsistent.

---

### P2-02 · Nav home — stroke vs filled variants

**Wired (`assets/icons/attend/home.svg`):** Filled polygon house + white door cutout, `fill="currentColor"`. Renders as solid dark icon in nav dock. Matches mockup nav.

**Unwired (`assets/attend/nav/home.svg`):** Pure stroke outline house with stroke door, `currentColor`. More refined geometry (airy gable angle, proportional door), but stroke-weight nav icons don't match the mockup's filled home icon.

System A version is correct for the mockup. New nav version is an unused alternative.

---

### P2-03 · Cathedral background not wired

`assets/attend/backgrounds/cathedral-sketch.svg` exists but is not referenced anywhere in the app. No background artwork renders in any runtime screen. Mockup screens do not show a background illustration either — so absence is not confirmed wrong, but the asset's purpose is undefined.

---

### P2-04 · Guidance chip SVGs not wired

`assets/attend/guidance/chips/attend-guidance-{pray,reflect,silence}-chip-default.svg` exist. File sizes suggest they may be in the illustration class (not verified — could not read due to size limits). No chip SVG art renders in runtime. Guidance chips render as text-only `GuidanceChip` components.

---

### P2-05 · Divider-plus and divider-line not wired

`assets/attend/dividers/divider-plus.svg` (48×16, plus sign + flanking lines) and `assets/attend/dividers/divider-line.svg` exist. Both are clean `currentColor` stroke SVGs. No intra-page dividers other than `SacredDivider` render in runtime.

---

## Confirmed Correct

| Element | Evidence |
|---|---|
| STAND / SIT / KNEEL / PROCESS posture badges | Runtime all 4 screens — filled silhouette in pill border matches mockup exactly |
| STAND / KNEEL posture glyph in badge | STAND and KNEEL runtime screens confirm glyph renders correctly at badge icon size |
| Home nav icon | All runtime screens — filled house renders correctly |
| Cross (attend dock) | All runtime screens — cross in circle renders correctly |
| More nav icon (`···`) | All runtime screens — three dots render correctly |
| Left-chevron (`‹`) | Runtime screens with back navigation — renders correctly |
| Sacred divider ornament | Entrance Chant runtime — diamond + flanking lines render at correct opacity and weight |
| CrossPenitentialIcon | Penitential Act runtime — simple `+` cross renders correctly using `currentColor` |
| SunburstIcon | Gloria runtime — starburst renders (shape mismatch per P1-02, but technical rendering is correct) |
| YOU SAY / YOU DO / LISTEN / AMBIENT chips | All runtime screens — correct color, label, style |
| Progress dots | All guided step screens — active/inactive states render correctly |
| Full-prayer overlay (close button) | Runtime confirms close button renders |

---

## Summary Table

| ID | Dimension | Severity | Status |
|---|---|---|---|
| P0-01 | Liturgical illustration SVGs — wrong paradigm | P0 | Active — wired via AttendAssets |
| P0-02 | Gesture illustration SVGs — wrong paradigm, no replacement | P0 | Active — wired via AttendAssets; clean set missing |
| P0-03 | Ornament illustration SVGs — wrong paradigm | P0 | Latent — not wired yet |
| P0-04 | Posture badge illustration SVGs — wrong paradigm | P0 | Latent — not wired yet |
| P1-01 | Entrance Chant lyre — wrong SVG wired | P1 | Active — clean lyre exists unwired |
| P1-02 | Gloria art shape mismatch vs mockup | P1 | Active — design confirmation needed |
| P1-03 | Three parallel posture glyph sets | P1 | Ambiguity — System A is canonical |
| P1-04 | Chalice — illustration SVG where clean icon available | P1 | Active — clean chalice exists unwired |
| P1-05 | Improved divider-ornate not wired | P1 | Latent — wired version is functional |
| P2-01 | Parchment color inconsistency | P2 | Spec discrepancy |
| P2-02 | Nav home stroke vs filled variants | P2 | System A is correct |
| P2-03 | Cathedral background asset not wired | P2 | Purpose undefined |
| P2-04 | Guidance chip SVGs not wired | P2 | Text-only render |
| P2-05 | Divider-plus / divider-line not wired | P2 | Not blocking |

---

## Recommended Fix Order

1. **Replace `attendAssetSources.liturgical.lyre` with `attendAssetSources.icons.lyre`** — add `lyre` key to `AttendAssets.tsx` icons map, remap entrance chant art slot. Clean SVG exists, zero design work required.

2. **Replace `attendAssetSources.liturgical.chalice` with `attendAssetSources.icons.chalice`** — same pattern as above.

3. **Design decision on Gloria art** — confirm whether `monstrance.svg`, `sunburst.svg`, or the System A `gloria-sunburst.svg` is canonical for the Gloria step art ornament.

4. **Commission thin-stroke gesture illustrations** — the gesture art (sign of cross, bowing, etc.) requires new SVG creation. No existing asset is usable. These should follow the 24×24 `currentColor` stroke language of the clean icon set.

5. **Delete or clearly quarantine illustration SVGs** — `assets/attend/liturgical/`, `assets/attend/gestures/` (illustration class), and `assets/attend/ornaments/` and `assets/attend/postures/badges/` should be clearly separated from the usable clean icon set to prevent future miswiring. Consider a `_unused/` or `_archive/` subdirectory.
