# Attend Runtime Interaction Architecture Audit

Scope: implementation-side UX intelligence for Attend runtime behavior and contextual logic.

No UI polish, redesign, spacing, typography, dock geometry, icon styling, or composition work is included.

## Proposed Files for Later Implementation

No implementation changes were made in this pass. If/when the recommendations below are implemented, keep the changes confined to:

- `data/massFlow.ts`: add per-moment metadata for full-prayer, variant, ambient, cadence, and gesture rules.
- `app/(tabs)/home/attend.tsx`: consume rule helpers to decide footer actions, overlays, and inline gesture hooks.
- `components/attend/AttendGestureIllustration.tsx`: new non-styled adapter component for gesture rendering hooks only.
- `assets/attend/gestures/`: future asset hook directory for final art, not needed now.
- `__tests__/attend-flow.test.tsx`: structural tests for action visibility, variant eligibility, and cadence grouping.

Avoid touching:

- `components/attend/AttendPrimitives.tsx`
- dock geometry
- visual spacing/typography constants
- existing style values

## Current Runtime Observations

Attend currently builds guided screens from `step.guidedItems` through `buildGuidedPages(step)`. It groups a small list of hardcoded cadence pairs in `getCadenceGroup(stepId, itemId)`.

Footer behavior is currently broad:

- `Pause` appears on every guided step.
- `View full prayer` appears on every guided step, even ambient/listen/action-only screens.
- `I'm lost` appears broadly and is useful.

Variant behavior is currently narrow:

- `Hearing something different?` appears only for `greeting-response`.
- `VariantOverlay` currently supports only the greeting response.
- New branch scaffolding exists in data for Penitential Act, Sprinkling Rite, Gospel Acclamation, Creed, Eucharistic Prayer, Blessing, and Dismissal, but runtime overlay selection is not wired.

Full prayer behavior is currently broad:

- `FullPrayerSheet` resolves from the first item on the current guided page.
- It falls back to text blocks, guided item text, or step summary/guidance.
- This is structurally useful, but it makes the footer action available on screens where there is no actual prayer to view.

## 1. Contextual View Full Prayer

### Rule Goal

`View full prayer` should appear only when it helps the user see a complete prayer, creed, ordinary text, or stable response that is too long or too fragmentary for the current guided screen.

It should not appear on screens whose primary purpose is posture, ambient observation, processional movement, short responses, or one-line listen prompts.

### Recommended Rule System

Add a rule helper, not visual logic:

```ts
type FullPrayerVisibility = "show" | "hide";

type FullPrayerRule = {
  stepId?: string;
  itemId?: string;
  itemIds?: string[];
  fullPrayerKey?: string;
  visibility: FullPrayerVisibility;
  reason: string;
};
```

Suggested runtime helper:

```ts
function shouldShowFullPrayerAction(step: MassFlowStep, page: GuidedPage): boolean {
  return page.items.some((item) => Boolean(item.fullPrayerKey && isSubstantialPrayerKey(item.fullPrayerKey)));
}
```

Define `isSubstantialPrayerKey(key)` in data/runtime helper code. It should return true for complete prayers and false for short responses.

### Should Show

Show `View full prayer` for:

- Confiteor
- Gloria
- Nicene Creed
- Apostles' Creed
- Lord's Prayer
- Lamb of God
- Eucharistic Prayer branch placeholder/full text
- Sprinkling Rite text when a full blessing text is later available
- Solemn blessing text
- Any future proper prayer with a complete licensed text:
  - Collect
  - Prayer over Offerings
  - Prayer after Communion

### Should Not Show

Hide `View full prayer` for:

- Entrance hymn begins
- Procession/ambient screens
- Posture-only screens:
  - Sit for First Reading
  - Stand for Gospel
  - Kneel after Sanctus
  - Stand for Lord's Prayer
  - Stand for blessing
- Short response-only screens:
  - Amen
  - And with your spirit
  - Thanks be to God
  - Glory to you, O Lord
  - Praise to you, Lord Jesus Christ
  - It is right and just
  - We lift them up to the Lord
  - Blessed be God forever
- Listen-only screens with no stable full text:
  - Reading placeholder
  - Psalm placeholder
  - Homily
  - Universal Prayer intentions
  - Gospel proclamation placeholder
  - Communion minister prompt

### Borderline Cases

- `May the Lord accept...`: show only if the current guided phrase is shortened. If the whole response is already shown in the guided phrase, hide.
- Memorial Acclamation: show if variants are implemented or if the guided screen only shows the opening phrase.
- Lenten Gospel Acclamation: hide by default because it is short; show only if a longer seasonal acclamation variant is selected.

## 2. Contextual Hearing Something Different

### Rule Goal

`Hearing something different?` should appear when the user may legitimately hear a different approved variant at that exact point in the Mass.

It should not appear for ordinary fixed responses unless the app has a real branch or language option to offer.

### Recommended Rule System

Add a variant group registry:

```ts
type VariantGroupId =
  | "greeting"
  | "penitential-act"
  | "creed"
  | "eucharistic-prayer"
  | "dismissal"
  | "blessing"
  | "gospel-acclamation";

type VariantRule = {
  groupId: VariantGroupId;
  triggerStepIds: string[];
  triggerItemIds?: string[];
  options: Array<{
    id: string;
    label: string;
    branchId?: string;
    responseText?: string;
  }>;
};
```

Runtime helper:

```ts
function getVariantRuleForPage(step: MassFlowStep, page: GuidedPage): VariantRule | undefined;
```

The existing `VariantOverlay` can stay. It should become data-driven:

- title from variant group
- options from variant rule
- selected value from resolver/session state
- `I'm not sure` closes overlay without changing flow

### Should Show

Show `Hearing something different?` on:

- Greeting dialogue/response:
  - current option: "And with your spirit."
  - future language option: "Et cum spiritu tuo."
- Penitential Act opening screen:
  - Confiteor
  - Dialogue form
  - Kyrie tropes
  - Sprinkling Rite, when available
- Gospel Acclamation:
  - Alleluia
  - Lenten acclamation
- Creed beginning screen:
  - Nicene Creed
  - Apostles' Creed
- Eucharistic Prayer beginning or first EP-specific screen:
  - EP I
  - EP II
  - EP III
  - EP IV
- Blessing screen:
  - simple blessing
  - solemn blessing
- Dismissal screen:
  - ordinary dismissal
  - Easter dismissal

### Should Not Show

Do not show on:

- Reading responses
- Psalm response placeholder
- Gospel announcement response
- Gospel ending response
- Preface dialogue responses
- Lord's Prayer
- Lamb of God
- Communion invitation response
- Communion minister prompt
- Prayer after Communion Amen

These are either fixed responses or not user-selectable variants in the current architecture.

## 3. Guided Cadence Optimization Audit

### Screens That Should Merge

Merge where prompt and response form a tight call-response pair:

- First Reading ending + "Thanks be to God"
- Second Reading ending + "Thanks be to God"
- Gospel dialogue + "And with your spirit"
- Gospel announcement + triple cross + "Glory to you, O Lord"
- Gospel ending + "Praise to you, Lord Jesus Christ"
- Bread offering prayer + "Blessed be God forever"
- Wine offering prayer + "Blessed be God forever"
- Pray brothers and sisters + "May the Lord accept..."
- Prayer over Offerings + Amen
- Each Preface dialogue pair
- Mystery of Faith invitation + selected acclamation
- Doxology + Great Amen
- Peace prayer + Amen
- Peace dialogue + "And with your spirit"
- Communion invitation + "Lord, I am not worthy"
- Minister prompt + Communion Amen
- Prayer after Communion + Amen
- Blessing + Amen
- Dismissal + "Thanks be to God"

Most of these are already represented in `getCadenceGroup`; keep them data-driven rather than growing hardcoded branching.

### Screens That Should Split

Split where a guided screen carries too much action/listen/response complexity:

- Confiteor:
  - Start of prayer
  - breast-strike cadence
  - remaining prayer/full-prayer access
  - absolution + Amen
- Creed:
  - beginning/full prayer
  - Incarnation bow
  - Amen
- Eucharistic Prayer:
  - EP-specific opening
  - epiclesis
  - Body/institution + elevation
  - chalice/institution + elevation
  - memorial acclamation
  - doxology/Great Amen
- Lamb of God:
  - fraction ambient
  - first two invocations can be grouped
  - final "grant us peace" should be distinct or visually/cadentially emphasized
- Communion:
  - invitation + "Lord, I am not worthy"
  - procession
  - minister prompt + Amen
  - return/thanksgiving

### Grouped Cadence Opportunities

Introduce reusable cadence templates:

```ts
type CadenceTemplate =
  | "prompt_response"
  | "three_part_dialogue"
  | "litany_threefold"
  | "gesture_response"
  | "prayer_amen"
  | "procession"
  | "ambient_silence"
  | "elevation";
```

Use these templates instead of step-specific hardcoded grouping:

- Preface: `three_part_dialogue`
- Kyrie: `litany_threefold`
- Universal Prayer: repeated `prompt_response`
- Solemn blessing: repeated `prayer_amen`
- Gospel announcement: `gesture_response`
- Eucharistic elevations: `elevation`

### Over-Fragmented Areas

- Short response-only screens can feel too granular if not paired with their prompt.
- Bread/wine offering pairs are good as grouped prompt-response screens, but should not each become multiple screens.
- A single Amen after a prayer should usually group with the prayer prompt.

### Under-Fragmented Areas

- Creed is under-fragmented because the bow is liturgically important and should not be hidden inside the full text.
- Eucharistic Prayer remains under-fragmented if EP branches are not materialized into runtime pages.
- Universal Prayer is under-fragmented because it needs repeated response cadence.
- Psalm is under-fragmented because refrain repetition is structurally important.

## 4. Inline Gesture Illustration Architecture

### Goal

Provide data-driven inline gesture hooks without creating final art or changing current visual styling.

### Gesture Metadata

Add optional metadata to guided items:

```ts
type GestureKind =
  | "sign_of_cross"
  | "breast_strike"
  | "triple_gospel_cross"
  | "bow"
  | "elevation_host"
  | "elevation_chalice"
  | "procession";

type GestureMetadata = {
  kind: GestureKind;
  assetKey?: string;
  fallbackShape?: "cross" | "hand" | "chalice" | "host" | "procession";
  cadenceLabel?: string;
};
```

Later, add `gesture?: GestureMetadata` to `MassGuidedItem`.

### Component Structure

Create a small adapter component:

```tsx
function AttendGestureIllustration({ gesture, item, step }: Props) {
  if (!gesture) return null;
  return <GestureAssetSlot assetKey={gesture.assetKey} fallbackShape={gesture.fallbackShape} />;
}
```

This component should:

- receive data only
- render nothing when no gesture exists
- use existing art area placement from `MomentArt`
- not own spacing/typography
- not alter `AttendPrimitives`

### Asset Hooks

Future asset keys:

- `gesture.sign_of_cross`
- `gesture.breast_strike`
- `gesture.breast_strike.large`
- `gesture.breast_strike.small`
- `gesture.triple_gospel_cross`
- `gesture.bow`
- `gesture.elevation_host`
- `gesture.elevation_chalice`
- `gesture.procession`

Suggested future path:

- `assets/attend/gestures/sign-of-cross.svg`
- `assets/attend/gestures/breast-strike.svg`
- `assets/attend/gestures/breast-strike-large.svg`
- `assets/attend/gestures/breast-strike-small.svg`
- `assets/attend/gestures/triple-gospel-cross.svg`
- `assets/attend/gestures/bow.svg`
- `assets/attend/gestures/elevation-host.svg`
- `assets/attend/gestures/elevation-chalice.svg`
- `assets/attend/gestures/procession.svg`

### Rendering Strategy

Short term:

- Map existing IDs and `cadenceCue` values to gesture metadata through a helper.
- Keep current `MomentArt` behavior.
- Add only nonvisual switch logic when implemented.
- Confiteor breast-strike distinction: `through my fault` should map to a larger breast-strike illustration, while `through my most grievous fault` should map to a smaller/lower-weight breast-strike illustration matching the canonical Confiteor mockup. This belongs in gesture metadata and asset mapping, not layout styling.

Medium term:

- Move ID-based inference into data.
- `MomentArt` becomes a compatibility wrapper around `AttendGestureIllustration`.

Long term:

- Final art assets replace fallback shapes.
- Gesture rendering remains data-driven.

## 5. Ambient Moment Logic

### Ambient Screens to Keep

Keep ambient screens when they represent real liturgical time where the user should not speak and may be unsure what is happening:

- Entrance procession
- Sprinkling Rite movement
- Preparation of the altar/gifts
- Offertory procession
- Epiclesis
- Host elevation
- Chalice elevation
- Fraction rite
- Communion procession
- Return after Communion / thanksgiving
- Post-Communion silence
- Recessional or altar reverence, if final-step behavior can support it

### Ambient Screens to Remove or Merge

Remove or merge ambient screens that only restate a section title:

- `penitential-intro` as a standalone "Penitential Act" screen should become either:
  - a real invitation/silence screen, or
  - part of the selected Penitential Act branch.
- `gloria-ambient` as "Praise follows mercy" should not be a runtime screen unless used as a pause after a long Gloria.
- Generic "Announcements may be given" can remain optional but should be suppressed when announcements are not selected.

### Ambient Rules

Add:

```ts
type AmbientPolicy = "required" | "optional" | "suppress_by_default";
```

Examples:

- Elevations: `required`
- Entrance procession: `required`
- Announcements: `optional`
- Recessional: `optional`
- Generic transition copy: `suppress_by_default`

## 6. Overlay Interruption Audit

### Current Risks

- `View full prayer` can interrupt during posture-only or ambient moments where it is not useful.
- Variant overlay currently appears inside the grouped greeting screen only; future variants must not pop up automatically.
- Opening overlays pauses attention but not the actual Mass; this is acceptable only if the user intentionally requests the overlay.
- Final Dismissal is sensitive because the dock action completes Attend; avoid adding post-dismissal overlays or extra pages unless final-step completion is adjusted.

### Recommended Overlay Rules

Overlays should be user-initiated only.

Opening an overlay should:

- stop propagation from the guided page press
- preserve `guidedIndex`
- not advance the Mass
- not write `attendPosition`
- close automatically when `step.id` changes

This mostly matches current behavior.

### Overlay Priority

Only one overlay should be open at a time. Recommended priority:

1. `lostOpen`
2. `variantOpen`
3. `fullPrayerNotice`
4. `moreOpen`

When opening one overlay, close the others.

Current behavior partly does this on step change and navigation, but not consistently across every open action.

### Overlay Timing

Do not show overlays on:

- host/chalice elevation pages
- procession pages
- Communion minister prompt
- final dismissal response unless user explicitly opens guide/lost

Allow overlays on:

- full prayer starts
- long prayers
- variant decision points
- "I'm lost" at any time, because it is recovery-critical

## Lightweight Runtime Scaffolding Recommendation

Add a single nonvisual policy module later:

```ts
// data/attendRuntimePolicies.ts
export function getGuidedPagePolicy(step, page) {
  return {
    showFullPrayer: shouldShowFullPrayerAction(step, page),
    variantGroup: getVariantRuleForPage(step, page),
    ambientPolicy: getAmbientPolicy(step, page),
    gesture: getGestureForPage(step, page),
    overlayLock: getOverlayLock(step, page)
  };
}
```

Then `AttendScreen` consumes only:

- `policy.showFullPrayer`
- `policy.variantGroup`
- `policy.gesture`
- `policy.overlayLock`

This avoids visual churn and keeps runtime intelligence testable.

## Recommended Structural Tests

Add tests for:

- `View full prayer` appears for Confiteor, Gloria, Creed, Lord's Prayer, Lamb of God.
- `View full prayer` does not appear for posture-only, ambient-only, and short-response-only pages.
- Variant overlay eligibility exists for Greeting, Penitential Act, Creed, Eucharistic Prayer, Dismissal, and Blessing.
- Variant overlay is absent for fixed response pages.
- Opening variant/full-prayer overlays does not advance guided index.
- Gesture metadata exists for Sign of Cross, breast strike, triple Gospel cross, bow, elevations, and procession.
- Required ambient moments are present.
- Suppressed ambient moments are not rendered by default once resolver support exists.

## Immediate Findings

- `View full prayer` is currently overexposed.
- `Hearing something different?` is currently underexposed.
- Variant data exists, but the overlay remains greeting-specific.
- Gesture rendering is ID/cadence inferred, not data-driven.
- Ambient screens need a policy layer so necessary quiet moments survive and generic filler screens disappear.
- Cadence grouping should move from hardcoded `getCadenceGroup` entries toward reusable templates.
- Overlay behavior is mostly safe but should enforce one-overlay-at-a-time.

## Recommended Next Implementation Order

1. Add `data/attendRuntimePolicies.ts` with no visual dependencies.
2. Add full-prayer visibility rules.
3. Convert `VariantOverlay` options to data-driven variant rules without changing layout.
4. Add gesture metadata helpers while preserving current `MomentArt`.
5. Add ambient policy metadata and tests.
6. Replace hardcoded cadence grouping with cadence templates.
