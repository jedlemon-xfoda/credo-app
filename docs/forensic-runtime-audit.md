# Forensic Runtime Audit — Attend
**Date:** 2026-05-08  
**Auditor:** Systematic screenshot review + source cross-reference  
**Sources:**
- `docs/runtime-audit/` — runtime screenshots (actual implementation state)
- `docs/mockups/00-canonical-board/canonical-board.png` — visual source of truth
- `docs/mockups/full-mass-mockup-plan.md` — structural/cadence target
- `app/(tabs)/home/attend.tsx`, `components/attend/AttendPrimitives.tsx`, `constants/attendTheme.ts`, `data/massFlow.ts`

**Coverage:** All 4 liturgical sections — Introductory Rites (33 screens), Liturgy of the Word, Liturgy of the Eucharist, Communion Rites, Concluding Rites — approximately 130 screens including overlays.

**Classification:**
- **P0** — Ship blocker. Exposes broken or internal state to users.
- **P1** — Degraded experience. Breaks established Attend design language or structural logic.
- **P2** — Composition polish. Deviates from canonical visual standard without fully breaking the language.

---

## P0 — SHIP BLOCKERS

---

### P0-01 · Debug Placeholder Text in Prayer Overlays

**Type:** Content integrity  
**Affected screens:** kneel-mystery-of-screen-02, 4-kneel-doxology-screen-02, communion-screen-10 (02-liturgy-of-the-eucharist), communion-screen-02 (03-communion-rites), blessing-screen-02, blessing-screen-04, blessing-screen-06, dismissal-screen-02, i-sit-or-stand-screen-02

**What is visible:**  
Every prayer overlay tested exposes either:

- `"Review copy for private testing."` — appears in gray italic directly beneath the prayer body text, as a rendered content element within the AttendSheet component. Confirmed in: Mystery of Faith, Doxology, Prayer after Communion, Communion Rite (Behold the Lamb), Blessing (all 3 pages share the same overlay), Dismissal.
- `"Shown from the current guided Mass text."` — variant string. Confirmed in: Announcements overlay (i-sit-or-stand-screen-02). Functionally the same class of defect.

**Likely source:** The `prayerText` field (or equivalent overlay body field) in `massFlow.ts` contains the sentinel strings as placeholder suffixes for steps where production liturgical copy has not yet been finalized. The overlay renders whatever is in that field verbatim, including the testing note.

**Overlay content audit — confirmed real prayer text (not placeholder):**
The following overlays confirmed displaying actual liturgical content:
- Profession of Faith overlay: real Nicene Creed text ✓
- Lord's Prayer overlay: real Our Father text ✓
- Consecration overlay: real descriptive content ✓

All other tested overlays showed placeholder suffixes.

**Why it breaks Attend:** Prayer overlays are the deepest layer of sacred content in the app — where a user goes to read the full text of a prayer during Mass. Exposing "Review copy for private testing." in this context destroys the sacred trust of the moment. It reveals internal testing workflow to users and invalidates the prayer overlay's spiritual function entirely.

**Correction:**  
1. Search `massFlow.ts` (and any other data source feeding overlay content) for the strings `"Review copy for private testing."` and `"Shown from the current guided Mass text."` — remove all instances.  
2. For steps with finalized liturgical text: replace placeholder body with actual prayer copy.  
3. For steps where full prayer text is not yet available: set the overlay body to `null` / empty and suppress the "View full prayer" option for that step rather than showing a placeholder.  
4. Add a CI lint rule that blocks build if either sentinel string appears in any data file.  
5. Verify Lamb of God overlay (lamb-of-god-screen-11, partially visible) — pattern strongly implies debug text present below the visible scroll area.

---

### P0-02 · "Announcements" Renders as "Announcemen / ts" (Mid-Word Line Break)

**Type:** Typography  
**Affected screen:** i-sit-or-stand-screen-01

**What is visible:**  
The step title "Announcements" displays on two lines at `titleSize: 36`. Georgia's line-break algorithm splits the word mid-character at the effective content width, producing:

```
Announcemen
ts
```

This is not a phrase break — it is a mid-word orphan that visually reads as a rendering failure or a corrupted string.

**Why it breaks Attend:** Step titles are the primary orientation landmark — the first thing a user reads when they look up from Mass to locate themselves. A mid-word title break does not communicate "section title"; it communicates "something went wrong." The canonical board shows all step titles as complete, editorially authoritative single-line labels. This is the most severely broken title in the full flow.

**Correction — choose one:**  
- **Option A (preferred):** Rename the step label. "Notices" or "Announcements" rendered at a smaller size. "Notices" (7 chars) fits on a single line at titleSize 36 with wide margin.  
- **Option B:** Define `attendTypography.titleSizeCompact: 28` and apply when `title.length > 14`. At 28pt, "Announcements" fits on one line.  
- **Option C:** Apply `adjustsFontSizeToFit={true}` + `minimumFontScale={0.75}` + `numberOfLines={1}` to the title Text component, capped to `titleSize`. This auto-scales to fit without wrapping.

---

## P1 — DEGRADED EXPERIENCE

---

### P1-01 · Systematic Excess Whitespace on Art-Absent Single-Item Pages

**Type:** Composition  
**Affected screens:** Dozens across all four sections. Representative sample:

| Screen | Step | Content |
|--------|------|---------|
| universal-prayer-screen-01 | Universal Prayer | LISTEN, 1 item |
| universal-prayer-screen-03 | Universal Prayer | YOU SAY, 1 item |
| universal-prayer-screen-07 | Universal Prayer | LISTEN, 1 item |
| presentation-screen-01 | Presentation | YOU DO, 1 item |
| prayer-over-screen-01 | Prayer over Offerings | YOU DO, 1 item |
| weit-on-os-tt-screen-01 | Holy (Sanctus) | YOU SAY, 1 item |
| weit-on-os-a-screen-01 | Holy (kneeling) | YOU DO, 1 item |
| 4-kneel-consecration-screen-01 | Consecration | YOU DO, 1 item |
| lord-s-prayer-screen-01 | Lord's Prayer | YOU DO, 1 item |
| lord-s-prayer-screen-05 | Lord's Prayer | YOU SAY, 1 item |
| blessing-screen-01 | Blessing | YOU DO, 1 item |

**What is visible:**  
On every art-absent page with a single guidance item (no SacredDivider group below), the content cluster (posture badge + section label + title + chip + phrase) occupies approximately 40–50% of screen height and is positioned in the upper zone. The lower 45–55% of visible screen is bare parchment. The cluster lacks a compositional anchor pulling it toward the screen midpoint.

Art-present pages do not have this problem — the ornament zone fills the gap between title and chip, distributing vertical weight throughout the screen.

**Why it breaks Attend:** Attend's design language draws from the editorial tradition of printed missals and liturgical books — measured, intentional, weighted. The canonical board shows content distributed across the available space with deliberate verticality. The systematic empty lower half on art-absent pages does not read as sacred breathing room; it reads as an incomplete screen. The content cluster appears to be parked at the top rather than settled into the composition. This is the single most pervasive visual defect in the runtime — visible across every section of the Mass.

**Correction:**  
In the art-absent compact layout, shift the content cluster toward the vertical midpoint of the space between the posture badge and the progress dots. Approaches:  
1. Reduce `guidedClusterTop` (currently 48) to approximately 28–32 in compact layout.  
2. Alternatively, apply `flex: 1` with `justifyContent: 'center'` to the content container in the art-absent branch — letting the content float to true vertical center.  
3. Ensure the phrase container has sufficient `paddingBottom` that the cluster bottom is pulled away from the title with balanced whitespace above and below.  
The goal: on a single-item art-absent page, the content cluster reads as centered or slightly upper-centered — not top-parked.

---

### P1-02 · Step Titles Wrap to 2 Lines at `titleSize: 36`

**Type:** Typography  
**Affected screens:**

| Step | Wraps as | Section |
|------|----------|---------|
| Entrance Chant | "Entrance / Chant" | Introductory Rites |
| Second Reading | "Second / Reading" | Liturgy of the Word |
| Gospel Acclamation | "Gospel / Acclamation" | Liturgy of the Word |
| Profession of Faith | "Profession of / Faith" | Liturgy of the Word |
| Universal Prayer | "Universal / Prayer" | Liturgy of the Word |
| Prayer over Offerings | "Prayer over / Offerings" | Liturgy of the Eucharist |
| Mystery of Faith | "Mystery of / Faith" | Liturgy of the Eucharist |
| Prayer after Communion | "Prayer after / Communion" | Liturgy of the Eucharist |

"Announcements" additionally breaks mid-word (see P0-02). Total affected: 9 step titles.

**What is visible:**  
At `titleSize: 36` (Georgia), the effective content width (~280–300pt based on runtime measurement) cannot accommodate two-word liturgical step names on a single line. The line break falls at the natural word boundary, producing a 2-line title display throughout the flow.

**Why it breaks Attend:** The canonical board shows every step title as a complete, single-line editorial label — functioning as a chapter heading with the authority of print typography. A 2-line wrapped title has two specific consequences:

1. **Editorial authority loss.** "Prayer over / Offerings" splits a prepositional phrase. "Mystery of / Faith" separates the defining noun from its qualifier. "Gospel / Acclamation" orphans the noun. Each split weakens the label's declarative force.

2. **Vertical rhythm disruption.** The title occupies 2 × `titleLineHeight` (88pt) instead of 44pt. In the art-present composition, this pushes the ornament zone lower, compressing the spacing below. In the art-absent compact composition, the taller title further crowds the top-heavy cluster.

**Correction:**  
Define `attendTypography.titleSizeCompact: 28` (or 30) in `attendTheme.ts`. Apply conditionally in `attend.tsx`:

```typescript
const titleFontSize = title.length > 14
  ? attendTypography.titleSizeCompact
  : attendTypography.titleSize;
```

Target: all 9 wrapping titles render on a single line at the compact size. Verify each step title's character count at the font metric for both size options before settling on the threshold. Do not alter line-height token without also verifying art-present ornament zone spacing remains correct.

---

### P1-03 · Two Adjacent Steps Share the Title "Holy"

**Type:** Structural / Navigation clarity  
**Affected screens:** weit-on-os-tt-screen-01, weit-on-os-a-screen-01

**What is visible:**  
Two consecutive pages both display the step title "Holy":
- Page 1: STAND badge, YOU SAY chip, "Holy, Holy, Holy Lord God of hosts."
- Page 2: KNEEL badge, YOU DO chip, "Kneel after the Holy where customary."

The posture and chip type change, but the title does not. Advancing from page 1 produces a screen with an identical title, forcing the user to parse the badge and chip to understand they have moved to a new liturgical moment.

**Why it breaks Attend:** Step titles are the primary mechanism for orienting a user who has looked away from the screen or lost their place. At the Sanctus → post-Sanctus kneeling transition — the most architecturally significant posture change in the entire Mass — an identical title reads as a navigation failure or a stuck screen. The canonical board treats the Sign of the Cross, Greeting, and Penitential Act as distinct named steps; the same principle requires the kneeling transition to have its own named identity.

**Correction:**  
Rename the second step (kneeling after Sanctus) in `massFlow.ts`. The new title must not duplicate "Holy" and must reflect the posture/action:
- "Kneeling" (matches the posture change, 8 chars, fits single line)
- "After the Holy" (preserves liturgical reference, 14 chars — verify single-line fit at titleSizeCompact)
- "Adoration" (theologically accurate for the post-Sanctus kneeling)

---

### P1-04 · Universal Prayer Call-and-Response Is Not Cadence-Grouped

**Type:** Structural  
**Affected screens:** universal-prayer-screen-01, universal-prayer-screen-03

**What is visible:**  
The Universal Prayer (Prayer of the Faithful) structure across 4 pages:
- Screen 01: LISTEN "The intentions of the Church are announced." — dot 1/4
- Screen 03: YOU SAY "Lord, hear our prayer." — dot 2/4
- Screen 05: YOU SAY "Repeat the response after each intention." — dot 3/4
- Screen 07: LISTEN "The celebrant concludes the prayer." — dot 4/4

The LISTEN announcement and YOU SAY congregational response are on separate pages.

**Why it breaks Attend:** The SacredDivider cadence grouping is the visual syntax for liturgical call-and-response dialogue throughout the flow. Every other exchange of this form uses it:

| Moment | LISTEN | YOU SAY | Grouped? |
|--------|--------|---------|---------|
| Greeting | "The Lord be with you." | "And with your spirit." | ✓ |
| Preface | "The Lord be with you." | "And with your spirit." | ✓ |
| Sign of Peace | "The peace of the Lord..." | "And with your spirit." | ✓ |
| Blessing | "The Lord be with you." | "And with your spirit." | ✓ |
| Dismissal | "Go in peace." | "Thanks be to God." | ✓ |
| Universal Prayer | "The intentions..." | "Lord, hear our prayer." | ✗ |

Breaking the Universal Prayer cadence across pages severs the liturgical relationship between announcement and response. On a single-page cadence group, the user simultaneously sees the prompt and their answer — which mirrors how participatory dialogue actually works in the Mass. Separated, the LISTEN announcement slides by without the response paired to it.

**Correction:**  
Restructure Universal Prayer in `massFlow.ts` / `getCadenceGroup()` to group the intention announcement (LISTEN) and "Lord, hear our prayer." (YOU SAY) on one cadence page, separated by SacredDivider. This matches the structural pattern of all other dialogue moments in the flow.

---

### P1-05 · Penitential Act Ambient Intro Page Restates the Title Verbatim

**Type:** Composition / Content  
**Affected screen:** penitential-act-screen-01

**What is visible:**  
Page 1 of the Penitential Act step shows:
- Title: "Penitential Act"
- Gold cross ornament (art-present composition)
- AMBIENT chip
- Phrase: "Penitential Act"

The AMBIENT phrase is word-for-word identical to the step title displayed 44pt above it. The user reads the same four words twice with no additional context.

**Why it breaks Attend:** AMBIENT pages serve as transitional moments — atmospheric, orienting beats that give the user context for what is about to happen. The canonical board's Penitential Act annotation reads "We acknowledge our sins and ask God for mercy." — which both explains the liturgical act and invites the user into the proper disposition. Restating the step title as the phrase content is functionally empty. It adds no meaning, creates typographic redundancy, and wastes the transitional moment's capacity to shape the user's experience.

**Correction:**  
Update the AMBIENT phrase for Penitential Act page 1 in `massFlow.ts` to meaningful directional text. Canonical board reference: "We acknowledge our sins and ask God for mercy." Ensure the new text is long enough to trigger `phraseSize` (26pt, ≥9 chars) rather than `phraseShortSize` to avoid an oversized rendering of the ambient phrase.

---

## P2 — COMPOSITION POLISH

---

### P2-01 · Ornament Scale Is Icon-Sized Relative to Canonical Illustration Target

**Type:** Composition / Visual  
**Affected screens:** All art-present pages — f-stand-entrance-chant-screen-01, greeting-screen-01, penitential-act-screen-01, gloria-screen-01, and all art-present pages in subsequent sections.

**What is visible:**  
The MomentArt zone renders small circular icon ornaments (approximately 60–70pt diameter) flanked by thin horizontal lines. The canonical board shows full figurative illustrations (a chalice, a stylized figure) that occupy significantly more vertical space and visual weight in the ornament zone.

**Why it matters:**  
The ornament zone between title and chip (`guidedTitle.marginBottom: 44`, `guidedBeatGroup.marginTop: 22`) is sized for illustration-scale art. Icon-scale ornaments underoccupy this zone — creating perceptible empty band above and below the ornament. The composition "breathes" more than intended, and the sacred gravitas of the moment is lighter than the canonical target.

**Note:** This may be an intentional phase decision (icon assets used during development; full illustrations planned for production). If so, confirm the ornament zone spacing will accommodate the planned illustration dimensions without requiring layout reflow.

**Correction:**  
If icons are the final format: increase icon render size to 90–100pt to better fill the ornament zone.  
If full illustrations are planned: design the illustration dimensions to match the `marginBottom: 44` + `marginTop: 22` zone (~90–100pt total available height) or adjust those margins to match the illustration's natural dimensions.

---

### P2-02 · LISTEN Phrase "Entrance hymn begins" Missing Terminal Period

**Type:** Typography / Copy consistency  
**Affected screen:** f-stand-entrance-chant-screen-01

**What is visible:**  
"Entrance hymn begins" — no period. Every other LISTEN guidance phrase in the flow uses sentence punctuation: "The intentions of the Church are announced." / "The peace of the Lord be with you always." / "The celebrant prays for peace and unity." / "Announcements may be given if needed."

**Why it matters:**  
Editorial precision is a core expression of Attend's design language. An inconsistently punctuated phrase reads as a copy error.

**Correction:**  
Update to "Entrance hymn begins." in `massFlow.ts`.

---

### P2-03 · Entrance Chant Italic Subtitle Wording Diverges from Canonical Board

**Type:** Copy  
**Affected screen:** f-stand-entrance-chant-screen-01

**Runtime:** "Let the procession gather your attention."  
**Canonical board:** "The priest and ministers process to the altar."

**What is visible:**  
The italic secondary text (ambient contextual note below the phrase) uses different wording than the canonical board reference.

**Why it matters:**  
The canonical board wording is descriptive and external ("what is happening"). The runtime wording is meditative and internal ("how to respond"). Both are defensible — but only one should be canonical. If the intent changed from the board to implementation, flag for copy alignment.

**Correction:**  
Confirm which wording is the intended final copy and standardize. This is a copy decision, not a design one.

---

### P2-04 · Lamb of God Overlay Bottom Truncated — Debug Text Presence Unconfirmed

**Type:** Content integrity (see P0-01)  
**Affected screen:** lamb-of-god-screen-11

**What is visible:**  
The Lamb of God overlay is open, displaying: "Lamb of God, you take away the sins of the world, / have mercy on us. / Lamb of God, you take away the sins of the world, / have mercy on us. / Lamb of God, you take away the sins of the world," — the content continues below the visible screen area. It is not possible to confirm from the screenshot whether "Review copy for private testing." appears at the bottom.

**Why it matters:**  
Given "Review copy for private testing." is confirmed in every other tested overlay, the probability of it appearing in the Lamb of God overlay is very high.

**Correction:**  
Verify and strip along with all other instances in P0-01. Do not treat as a separate defect — fold into the P0-01 fix pass.

---

### P2-05 · Sign of Peace Page 1 — "Amen." at 40pt Visually Dominates 26pt LISTEN Phrase

**Type:** Composition  
**Affected screen:** f-stand-sign-of-screen-01

**What is visible:**  
Cadence group: LISTEN "The celebrant prays for peace and unity." (phraseSize 26pt) + SacredDivider + YOU SAY "Amen." (phraseShortSize 40pt, because char count ≤ 8).

The `phraseShortSize: 40` rule triggers on "Amen." (5 chars), rendering it at 54% larger than the LISTEN phrase it responds to. Within the cadence group, the YOU SAY becomes the visually dominant element — which inverts the liturgical flow (LISTEN is the primary, YOU SAY is the brief confirmation).

**Note:** This same pairing occurs in the Doxology step (4-kneel-doxology-screen-01) where LISTEN "Through him, and with him, and in him..." + YOU SAY "Amen." also uses 40pt — but that composition reads as beautifully climactic because the long LISTEN phrase earns the large "Amen." The Sign of Peace case is shorter and the imbalance is more noticeable.

**Why it matters:**  
Sacred design restraint requires that short acclamations ("Amen.") not visually overwhelm the priestly formula they respond to. The eye lands on "Amen." first due to size, reversing the order of reading.

**Correction:**  
Evaluate whether "Amen." as a RESPONSE (rather than as a standalone declaration) should trigger `phraseShortSize` based on its role in a cadence group, not just its character count. Consider: if a YOU SAY item is grouped with a preceding LISTEN item via SacredDivider, cap its size at phraseSize (26pt) regardless of character count. The `phraseShortSize` rule is most appropriate for standalone short declarations where the size expresses the declaration's weight, not its role in a dialogue.

---

### P2-06 · Progress Dots Show 5 Windowed Dots for 6-Page Steps — Active Dot Position Can Mislead

**Type:** Navigation  
**Affected screens:** 4-kneel-consecration-screen-01 (6 total pages, windowed to 5 dots shown)

**What is visible:**  
The Consecration step has 6 pages. `getVisibleProgressDots()` correctly windows to show 5 dots max. On page 1 (dot index 0), the window shows dots 0–4, with dot 0 active. On page 6 (dot index 5), the window shifts to show dots 1–5, with dot 5 active.

**Why it matters:**  
When the window shifts, dots that were showing positions 1–5 suddenly show positions 2–6 (the previous "second dot" is now "first dot"). A user who reads relative position ("I'm at dot 2 of 5") will misread their absolute position when the window has shifted. The windowed dot display communicates relative progress reliably, but loses absolute position information.

**Note:** This is a known tradeoff of windowed progress indicators. The implementation (`start = Math.max(0, Math.min(currentIndex - 2, total - 5))`) is correct and industry-standard. Flagging as P2 because at 5 visible dots + 6 total pages, the window shift is barely perceptible — a user at page 3 sees dots [1,2,3,4,5] with dot 3 active, which reads naturally. The issue only becomes noticeable at step totals significantly above 6.

**Correction:**  
No code change required for current step lengths. If future steps exceed 8–10 pages, consider adding a text indicator (e.g., "3 of 9") beneath the dots rather than expanding the dot window.

---

## CONFIRMED CORRECT — ARCHITECTURE AND CADENCE

The following design and structural decisions are correctly implemented and match the canonical standard:

**Cadence grouping:**
- Greeting: LISTEN + YOU SAY ✓
- Preface: LISTEN + YOU SAY ✓
- Mystery of Faith: LISTEN + YOU SAY ✓
- Doxology: LISTEN + YOU SAY + phraseShortSize "Amen." ✓
- Sign of Peace: LISTEN + YOU SAY (both pages) ✓
- Blessing: LISTEN + YOU SAY (inner pages) ✓
- YOU DO + YOU SAY ("Make the Sign of the Cross... / Amen." in Blessing) ✓
- Dismissal: LISTEN + YOU SAY ✓
- Presentation: LISTEN + YOU SAY cadence within step ✓
- Communion Rite: LISTEN "Behold the Lamb of God." + YOU SAY "Lord, I am not worthy..." ✓

**Section label transitions:**
- Introductory Rites → Liturgy of the Word: ✓ (confirmed at First Reading entry)
- Liturgy of the Word → Liturgy of the Eucharist: ✓ (confirmed at Presentation)
- Liturgy of the Eucharist → Concluding Rites: ✓ (confirmed at Announcements/i-sit-or-stand)

**Posture badges:**
- STAND, SIT, KNEEL, STAND OR KNEEL, SIT OR STAND, PROCESS REVERENTLY — all rendering with correct icons per `postureToIcon()` ✓

**Chip color semantics:**
- YOU SAY: rgba(29,46,68,0.84) dark navy ✓
- LISTEN: rgba(29,46,68,0.60) medium navy ✓
- YOU DO: #B8945A gold ✓
- AMBIENT: rgba(29,46,68,0.11) light cream with dark text ✓

**Prayer overlay content (where real copy exists):**
- Profession of Faith: real Nicene Creed text ✓
- Lord's Prayer: real Our Father text ✓
- Consecration: real descriptive content ✓

**Final-step indicator:**
- "Mass is ending" in `mutedGold` (#B8945A) below progress dot on Dismissal page 1 ✓

**Italic secondary text (ambient contextual notes):**
- Established in Entrance Chant: "Let the procession gather your attention." — this treatment is canonical per the board and confirmed as intentional design for ambient/transitional moments. ✓

**SacredDivider rendering:**
- Width 214, marginVertical 3, line + rotated diamond + line — consistent throughout ✓

**Art-present layout:**
- Title → ornament zone → chip → phrase vertical structure ✓
- `guidedTitle.marginBottom: 44` + `guidedBeatGroup.marginTop: 22` correctly implemented ✓

---

## SUMMARY TABLE

| ID | Priority | Type | Fix Complexity | Description |
|----|----------|------|----------------|-------------|
| P0-01 | P0 | Content integrity | Medium — data audit + CI rule | Debug text in all prayer overlays |
| P0-02 | P0 | Typography | Low — label rename or font-size condition | "Announcements" renders as "Announcemen / ts" |
| P1-01 | P1 | Composition | Medium — compact layout spacing adjustment | Systemic whitespace excess on art-absent single-item pages |
| P1-02 | P1 | Typography | Low — add `titleSizeCompact` token + condition | 9 step titles wrap to 2 lines at titleSize 36 |
| P1-03 | P1 | Structural | Low — rename step in massFlow | Two adjacent steps share title "Holy" |
| P1-04 | P1 | Structural | Low — restructure Universal Prayer cadence grouping | LISTEN + YOU SAY separated instead of cadence-grouped |
| P1-05 | P1 | Content | Low — update AMBIENT phrase text | Penitential Act intro restates title verbatim as phrase |
| P2-01 | P2 | Composition | Medium — asset scale decision | Art ornaments smaller than canonical illustration target |
| P2-02 | P2 | Copy | Trivial — add period | "Entrance hymn begins" missing terminal period |
| P2-03 | P2 | Copy | Trivial — confirm wording | Entrance Chant subtitle differs from canonical board |
| P2-04 | P2 | Content integrity | Fold into P0-01 | Lamb of God overlay truncated — debug text likely present |
| P2-05 | P2 | Composition | Low — conditional size logic for cadence group YOU SAY | "Amen." at 40pt dominates 26pt LISTEN in Sign of Peace |
| P2-06 | P2 | Navigation | None currently — informational | Windowed progress dots lose absolute position at >6 pages |

**Recommended ship order:** Fix P0-01 (debug text) and P0-02 (Announcements break) before any user-facing testing. Address P1-01 through P1-05 before public release. P2 findings addressable in post-launch polish pass.
