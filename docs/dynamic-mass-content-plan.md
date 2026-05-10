# Dynamic Mass Content — Codex Execution Plan
**Date:** 2026-05-08  
**Status:** Planning only — no app files modified  
**Scope:** Full dynamic content pipeline for the Attend experience

---

## Phase 0 — Read-Only Audit (Prerequisite)

Before any implementation begins, Codex must audit the following files and produce a written summary of existing IDs, types, and gaps. **No files are modified in Phase 0.**

### Files to read

| File | What to extract |
|------|----------------|
| `data/massFlow.ts` | All step IDs, branch IDs, `MassFlowResolverContext` fields, `resolveMassFlowConfiguration()` logic |
| `services/massContent.ts` | Full `MASS_CONTENT` key inventory; identify which keys have full text vs. stubs |
| `app/(tabs)/home/attend.tsx` | `getFullPrayerContent()` resolution order; `buildGuidedPages()` shape; how `resolveMassTextBlock()` and `MASS_CONTENT` are consumed |
| `data/attendRuntimePolicies.ts` | `getGuidedPagePolicy()` — what it returns and how it affects step rendering |
| `types/index.ts` | Existing types to reuse: `MassTextBlock`, `MassFlowStep`, `MassGuidedItem`, `ContentMetadata`, `ContentTextStatus`, `ContentSourceProvider` |
| `services/liturgicalContentProvider.ts` | Existing `LiturgicalContentProvider` interface and `AttendContent`/`DailyReadings` types — reuse where possible |
| `utils/resolveMassText.ts` | Signature of `resolveMassTextBlock()` |
| `__tests__/attend-flow.test.tsx` | Existing test patterns — how mocks and assertions are structured |

### Phase 0 deliverable

A written audit comment in the PR (not a file) listing:
- All `MassFlowStep` IDs (to be used as canonical step IDs in all phases)
- All existing `MASS_CONTENT` keys marked `full_text` vs. `stub`
- All `MassFlowResolverContext` fields currently present
- Types that can be reused without modification
- Types that need extension (with specific field additions)
- The step IDs where `properKey` will be added to `textBlocks`

---

## Phase 1 — Liturgical Calendar Shell

**Goal:** Wire `new Date()` to a typed `LiturgicalDay` object available throughout Attend. This is the foundation all other phases depend on.

**Guardrail: No UI or style changes.** Attend renders identically to pre-Phase-1. The only visible change: the `MassFlowResolverContext` passed to `resolveMassFlowConfiguration()` is populated from `LiturgicalDay` rather than hardcoded defaults. Gloria and Creed correctly appear/disappear.

### Files touched — Phase 1

| File | Action | Change |
|------|--------|--------|
| `data/liturgicalCalendar.ts` | **Create** | `LiturgicalDay` type + static lookup table covering all Sundays in LY-B (2026) and LY-C (2027) + solemnities |
| `hooks/useLiturgicalDay.ts` | **Create** | Returns `LiturgicalDay` for `new Date()`; memoized by date string |
| `types/index.ts` | **Extend** | Add `approvalStatus?: "approved" \| "pending_review" \| "draft"` and `liturgicalYear?: "A" \| "B" \| "C"` to `ContentMetadata` |
| `app/(tabs)/home/attend.tsx` | **Modify** | Import `useLiturgicalDay`; pass `{ season, includeGloria, includeCreed, gospelAcclamation, dismissal }` into `resolveMassFlowConfiguration()`. No render changes. |
| `data/massFlow.ts` | **Modify** | Add `includeGloria?: boolean`, `includeCreed?: boolean`, `includeSequence?: boolean` to `MassFlowResolverContext`; update `resolveMassFlowConfiguration()` to skip Gloria step when `includeGloria === false` and skip Creed step when `includeCreed === false` |

### What is deferred out of Phase 1

- Any remote API calls
- `DayPropers` / propers resolution
- `useMassPropers` hook
- `properKey` on `MassTextBlock`
- Readings, Collect, Preface, antiphons — all deferred to later phases
- Any new UI components or style tokens

### Test expectations — Phase 1

New test file: `__tests__/liturgicalCalendar.test.ts`

```
- resolveLiturgicalDay("2026-12-25") → { season: "christmas", gloriaMandated: true, creedRequired: false, liturgicalColor: "White", massTitle: "The Nativity of the Lord" }
- resolveLiturgicalDay("2027-03-14") → { season: "lent", gloriaMandated: false, creedRequired: false, liturgicalColor: "Violet" }
- resolveLiturgicalDay("2026-11-01") → { season: "ordinary", rank: "solemnity", gloriaMandated: true, creedRequired: true, massTitle: "All Saints" }
- resolveLiturgicalDay("2026-08-09") → { season: "ordinary", rank: "feria", gloriaMandated: false, creedRequired: false }
```

Extend `__tests__/attend-flow.test.tsx`:
```
- In Advent (season: "advent"): Gloria step is absent from guided pages
- On a Sunday (gloriaMandated: true): Gloria step is present
- On a weekday feria (creedRequired: false): Creed step is absent
- On a solemnity (creedRequired: true): Creed step is present
```

---

## Phase 2 — Day Propers Shell + Hook

**Goal:** Establish the `DayPropers` data shape and `useMassPropers` hook. All fields return `status: "unavailable"` in this phase — no real content yet. The pipeline is plumbed end-to-end so later phases only fill in provider implementations.

**Guardrail: No UI or style changes.** No "View full prayer" behavior changes — unavailable propers simply don't affect the overlay (see content safety gates below). Guided flow is unaffected.

### Files touched — Phase 2

| File | Action | Change |
|------|--------|--------|
| `data/massPropers.ts` | **Create** | `ProperText`, `DayReadings`, `DayPropers` types |
| `services/massProperResolver.ts` | **Create** | `MassProperResolver` interface + `StaticMassProperResolver` returning `status: "unavailable"` for all fields |
| `hooks/useMassPropers.ts` | **Create** | Returns `DayPropers` via resolver; keyed by date string |
| `types/index.ts` | **Extend** | Add `properKey?: string` to `MassTextBlock` |
| `utils/resolveProperText.ts` | **Create** | `resolveWithPropers(block, MASS_CONTENT, dayPropers): string` — resolves `properKey` then `contentKey` then `block.text` |
| `app/(tabs)/home/attend.tsx` | **Modify** | Import `useMassPropers`; pass `dayPropers` into `getFullPrayerContent()`; update resolution to call `resolveWithPropers`. No render changes. |

### What is deferred out of Phase 2

- Any real proper text content (all fields return `"unavailable"`)
- Remote fetch / API calls
- `prefaceLibrary`, `sequenceLibrary`, `memorialAcclamations`
- Adding `properKey` to existing `massFlow.ts` step `textBlocks` — deferred to the phase that populates each proper

### Test expectations — Phase 2

New test file: `__tests__/resolveProperText.test.ts`

```
- resolveWithPropers(block with properKey "collect", MASS_CONTENT, dayPropers with collect.status "unavailable") → returns block.text (fallback)
- resolveWithPropers(block with properKey "collect", MASS_CONTENT, dayPropers with collect.status "available" + collect.text "...") → returns dayPropers.collect.text
- resolveWithPropers(block with contentKey "gloria", MASS_CONTENT, dayPropers) → returns MASS_CONTENT["gloria"]
- resolveWithPropers(block with no keys, MASS_CONTENT, dayPropers) → returns block.text
```

Extend `__tests__/attend-flow.test.tsx`:
```
- getFullPrayerContent for "collect" step with all-unavailable dayPropers → falls back to step.textBlocks text
- "View full prayer" overlay does not expose any placeholder string when propers are unavailable
```

---

## Phase 3 — Readings Integration

**Goal:** First Reading, Psalm, Second Reading, and Gospel text appear in prayer overlays.

**Guardrail: No UI or style changes.** Citation text may appear below prayer text in the existing `fullPrayerLine` style — no new style tokens. Second Reading step is hidden when `status === "unavailable"` via existing optional step logic.

### Files touched — Phase 3

| File | Action | Change |
|------|--------|--------|
| `services/remoteLiturgicalProvider.ts` | **Create** | Implements `LiturgicalContentProvider.getReadingsForDate()` → returns `DayReadings`. Initially returns stub values. |
| `hooks/useMassPropers.ts` | **Modify** | Wire `getReadingsForDate()` into the hook; populate `dayPropers.readings` |
| `data/massFlow.ts` | **Modify** | Add `properKey` to `textBlocks` for: `first-reading` (`"readings.firstReading"`), `psalm` (`"readings.psalm.response"` + `"readings.psalm.verses"`), `second-reading` (`"readings.secondReading"`), `gospel` (`"readings.gospel"`) |
| `data/massFlow.ts` | **Modify** | `resolveMassFlowConfiguration()`: exclude `second-reading` step when `DayReadings.secondReading.status === "unavailable"` |

### What is deferred

- Collect, Prayer over Offerings, Prayer after Communion — Phase 6
- Entrance/Communion antiphons — Phase 7
- Gospel Acclamation verse — Phase 4 (separate)

### Test expectations — Phase 3

```
- When readings.firstReading.status === "available": first-reading overlay shows ProperText.text + citation
- When readings.secondReading.status === "unavailable": second-reading step is absent from guided pages
- When readings.gospel.status === "available": gospel overlay shows ProperText.text
- Psalm response resolves from readings.psalm.response, not from fallback
```

---

## Phase 4 — Gospel Acclamation Verse

**Goal:** Alleluia verse / Lenten acclamation verse changes daily.

**Guardrail: No UI or style changes.** When verse is unavailable, the existing "Listen to the acclamation verse." guided item text remains unchanged.

### Files touched — Phase 4

| File | Action | Change |
|------|--------|--------|
| `data/massPropers.ts` | **Extend** | Add `gospelAcclamationVerse?: ProperText` to `DayReadings` |
| `data/massFlow.ts` | **Modify** | In `gospel-acclamation-ordinary` and `gospel-acclamation-lent` branches, add `properKey: "readings.gospelAcclamationVerse"` to the verse LISTEN guided item |
| `services/remoteLiturgicalProvider.ts` | **Modify** | Populate `gospelAcclamationVerse` in readings response |

### Test expectations — Phase 4

```
- When gospelAcclamationVerse.status === "available": verse LISTEN item renders the proper verse text
- When gospelAcclamationVerse.status === "unavailable": LISTEN item renders "Listen to the acclamation verse." unchanged
```

---

## Phase 5 — Sequence (Conditional Step)

**Goal:** The four prescribed sequences appear in the flow when the liturgical calendar requires them.

**Guardrail: No UI or style changes.** Sequence step uses existing chip/phrase rendering. No new components.

### Files touched — Phase 5

| File | Action | Change |
|------|--------|--------|
| `data/sequenceLibrary.ts` | **Create** | 4 sequence entries: Victimae Paschali Laudes (Easter), Veni Sancte Spiritus (Pentecost), Lauda Sion (Corpus Christi), Stabat Mater (Our Lady of Sorrows) |
| `data/massFlow.ts` | **Modify** | Add `sequence` step definition (between Second Reading and Gospel Acclamation, `optional: true`); add it to `resolveMassFlowConfiguration()` only when `includeSequence === true` |
| `data/liturgicalCalendar.ts` | **Modify** | Set `sequenceRequired: true` on Easter Sunday, Pentecost, Corpus Christi, Sept. 15 |

### Test expectations — Phase 5

```
- Easter Sunday (sequenceRequired: true): sequence step is present in guided pages between second-reading and gospel-acclamation
- Ordinary Sunday (sequenceRequired: false): sequence step is absent
- Sequence step guided items render Victimae Paschali Laudes text on Easter Sunday
```

---

## Phase 6 — Collect, Prayer over Offerings, Prayer after Communion

**Goal:** The three variable presidential prayers appear in prayer overlays with real text when available.

**Guardrail: No UI or style changes.** When unavailable, "View full prayer" is suppressed for that step (not a UI change — existing `shouldShowFullPrayer` logic controls this).

### Files touched — Phase 6

| File | Action | Change |
|------|--------|--------|
| `data/massFlow.ts` | **Modify** | Add `properKey` to textBlocks: `collect` → `"collect"`, `prayer-over-offerings` → `"prayerOverOfferings"`, `prayer-after-communion` → `"prayerAfterCommunion"` |
| `services/remoteLiturgicalProvider.ts` | **Modify** | Populate `collect`, `prayerOverOfferings`, `prayerAfterCommunion` from source |

### Test expectations — Phase 6

```
- When collect.status === "available": collect overlay shows ProperText.text
- When collect.status === "unavailable": "View full prayer" not shown for collect step
- Same pattern for prayer-over-offerings and prayer-after-communion
```

---

## Phase 7 — Entrance Antiphon + Communion Antiphon

**Goal:** Antiphons appear in prayer overlays when available; guided flow is unaffected when unavailable.

**Guardrail: No UI or style changes.** Guided item text ("Entrance hymn begins") is unchanged when antiphon is unavailable.

### Files touched — Phase 7

| File | Action | Change |
|------|--------|--------|
| `data/massFlow.ts` | **Modify** | `entrance` step textBlock: `properKey: "entranceAntiphon"`; `communion` step textBlock: `properKey: "communionAntiphon"` |
| `services/remoteLiturgicalProvider.ts` | **Modify** | Populate `entranceAntiphon`, `communionAntiphon` |

---

## Phase 8 — Preface System

**Goal:** The correct Preface is identified by key; text surfaced in prayer overlay when licensed.

**Dependency:** Full preface texts require licensing from USCCB/ICEL. Initial implementation uses stubs.

### Files touched — Phase 8

| File | Action | Change |
|------|--------|--------|
| `data/prefaceLibrary.ts` | **Create** | ~80 preface stubs: key + title + `status: "placeholder"`. Full text added per entry as licensing is confirmed. |
| `data/liturgicalCalendar.ts` | **Modify** | Add `prefaceKey` to each `LiturgicalDay` entry |
| `data/massFlow.ts` | **Modify** | `preface` step textBlock: `properKey: "prefaceText"` |
| `hooks/useMassPropers.ts` | **Modify** | Resolve `dayPropers.prefaceText` from `PREFACE_LIBRARY[liturgicalDay.prefaceKey]` |

---

## Phase 9 — Memorial Acclamation Options

**Goal:** Three acclamation forms available; parish/user selects; selected form renders in EP branches.

### Files touched — Phase 9

| File | Action | Change |
|------|--------|--------|
| `data/memorialAcclamations.ts` | **Create** | 3 acclamation entries with `fullPrayerKey` values |
| `data/massFlow.ts` | **Modify** | Add `memorialAcclamationForm?: 1 \| 2 \| 3` to `MassFlowResolverContext`; update EP branches to use selected form's `fullPrayerKey` |

---

## Phase 10 — Eucharistic Prayer Full Texts

**Dependency: Licensing must be secured before implementation.** USCCB/ICEL holds copyright on the Roman Missal English translation. Do not implement until license is confirmed.

### When ready

| File | Action | Change |
|------|--------|--------|
| `services/massContent.ts` | **Modify** | Replace EP I–IV stub strings with full licensed text; update `textStatus` to `"licensed"` |

No structural changes — EP branches already have `fullPrayerKey: "eucharistic_prayer_*"`.

---

## Phase 11 — Parish / Local Custom Hooks

**Goal:** Parish operators can override structural defaults (EP, creed, penitential act) and supply custom antiphon text.

### Files touched — Phase 11

| File | Action | Change |
|------|--------|--------|
| `data/parishConfig.ts` | **Create** | `ParishConfig` type + default config |
| `hooks/useParishConfig.ts` | **Create** | Returns active `ParishConfig` |
| `app/(tabs)/home/attend.tsx` | **Modify** | Merge `ParishConfig` into `MassFlowResolverContext` population |

---

## Content Safety Gates — Prototype Content Cannot Ship Publicly

These gates must be in place before any content is added with `textStatus !== "placeholder"`.

### Gate 1 — Runtime suppression

In `getFullPrayerContent()` (attend.tsx):
```typescript
// After all resolution attempts:
if (content.status === "placeholder" && !__DEV__) {
  return null; // suppress overlay entirely in production
}
```

`"View full prayer"` is shown only when `getFullPrayerContent()` returns non-null.

### Gate 2 — CI string ban

Add a lint check (or Jest test) that runs on every CI build:

```typescript
// __tests__/contentSafety.test.ts
const BANNED_STRINGS = [
  "Review copy for private testing",
  "Shown from the current guided Mass text",
  "placeholder",
  "pending permission",
  "Full licensed text pending",
];

test("MASS_CONTENT contains no banned placeholder strings", () => {
  for (const [key, value] of Object.entries(MASS_CONTENT)) {
    for (const banned of BANNED_STRINGS) {
      expect(value).not.toContain(banned); // will fail until EP texts are licensed
    }
  }
});
```

**Note:** This test will fail for EP I–IV until Phase 10 is complete. The EP keys (`eucharistic_prayer_i` through `iv`) should be excluded from the test until licensing is confirmed, or the MASS_CONTENT stubs must use `null` / omit the keys entirely so the overlay is suppressed rather than showing a stub string.

### Gate 3 — TypeScript enforcement

In `services/massPropers.ts`:
```typescript
export type ProperTextStatus = "available" | "unavailable";
// "placeholder" is intentionally absent from the production type.
// Dev-only content uses a separate DevProperText type not exported from this module.
```

### Gate 4 — `textStatus` check at build time

Add to `ContentTextStatus` in `types/index.ts`:
```
"placeholder" — blocked from production rendering (runtime check in getFullPrayerContent)
"review_only" — allowed in __DEV__ only; production renders as "unavailable"
"licensed" — allowed in production
"public_domain" — allowed in production
"user_configured" — allowed in production
```

---

## What Phase 1 Implements vs. What Must Be Deferred

### Phase 1 implements (only):
- `LiturgicalDay` type and static date lookup table
- `useLiturgicalDay()` hook
- `includeGloria` / `includeCreed` / `includeSequence` fields on `MassFlowResolverContext`
- Wiring of `useLiturgicalDay()` result into `resolveMassFlowConfiguration()` in attend.tsx
- Tests for liturgical calendar resolution

### Phase 1 must NOT touch:
- `DayPropers`, `useMassPropers`, `massProperResolver`
- `properKey` on `MassTextBlock`
- `resolveWithPropers`
- Any overlay or prayer content change
- `MASS_CONTENT` entries
- Any component render output (no UI changes)
- Remote fetch logic

---

## Risks and Rollback Notes

### Phase 1
**Risk:** Incorrect `LiturgicalDay` data (wrong season, wrong Gloria/Creed flag) causes steps to appear/disappear incorrectly.  
**Mitigation:** Static lookup table is fully test-covered before wiring into attend.tsx.  
**Rollback:** Revert the `useLiturgicalDay()` import and context construction in attend.tsx — one function call reverts to hardcoded defaults. All other Phase 1 files are additive (new files only).

### Phase 2
**Risk:** `resolveWithPropers` resolution order bug causes static `MASS_CONTENT` to be bypassed, returning empty strings.  
**Mitigation:** Unit tests for all resolution paths in `resolveProperText.test.ts` before wiring into attend.tsx.  
**Rollback:** Revert `getFullPrayerContent()` to pre-Phase-2 implementation — one function. New files remain but are unused.

### Phase 3 (Readings)
**Risk:** Remote provider returns unexpected shape, breaking `DayReadings` parsing and causing overlay to crash.  
**Mitigation:** All remote data is validated against `DayReadings` type at fetch boundary; invalid shape → treat as `status: "unavailable"` across all reading fields.  
**Rollback:** Set `StaticMassProperResolver` (Phase 2's stub) as the active resolver — remote provider is bypassed.

### Phase 5 (Sequence)
**Risk:** Sequence step appears incorrectly on non-prescribed days.  
**Mitigation:** `sequenceRequired` is a boolean in `LiturgicalDay` set explicitly only for 4 known dates per year. Default is `false`.  
**Rollback:** Remove `includeSequence` from context construction — sequence step becomes inaccessible.

### Phase 8 (Preface)
**Risk:** Wrong preface key surfaced for a given Mass.  
**Mitigation:** Preface key is part of `LiturgicalDay`'s static lookup table — each date has an explicit key. Mismatch is caught by calendar tests.  
**Rollback:** Set `prefaceText.status = "unavailable"` globally — overlay is suppressed for preface step; guided flow unaffected.

### Phase 10 (EP Full Texts)
**Risk:** Licensing dispute or incorrect text.  
**Mitigation:** Text is added to `MASS_CONTENT` only after legal sign-off. `textStatus: "licensed"` is set at that time.  
**Rollback:** Replace EP text entries in `MASS_CONTENT` with `null` or remove keys — overlays suppressed automatically.

### General rollback principle
Every phase is additive or isolated to a clearly bounded change in attend.tsx. No phase modifies the Attend render tree structure or style system. Any phase can be reverted by: (a) removing new files, and (b) reverting the one hook/function wiring in attend.tsx.

---

## Summary: Content Resolution Priority (All Phases)

```
1. User/parish structural config (EP, creed, penitential act, blessing form)
2. MASS_CONTENT[fullPrayerKey] — invariant ordinary texts (Confiteor, Gloria, Nicene Creed, etc.)
3. dayPropers resolved via properKey — day-specific proper text (if status === "available")
4. Bundled static propers JSON — pre-shipped for next 4 weeks (offline-safe, Phase 3+)
5. step.textBlocks resolved via contentKey → MASS_CONTENT
6. step.guidedItems text — structural fallback (always available)
7. Suppress overlay — if no content available; guided flow continues unchanged
```

No placeholder strings reach users at any resolution level.
