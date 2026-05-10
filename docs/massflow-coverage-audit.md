# Attend MassFlow Coverage Audit

Structural/liturgical audit only. No UI redesign, visual styling, or composition work is included.

## Scope Reviewed

Current implementation reviewed:

- `data/massFlow.ts`
- `data/attendMassHierarchy.ts`
- `app/(tabs)/home/attend.tsx`
- `services/massContent.ts`
- `types/index.ts`
- `__tests__/attend-flow.test.tsx`
- Existing Attend mockup folders under `docs/mockups`

Current MassFlow shape:

- 4 top-level sections are present.
- 28 step-level Mass moments are present.
- Guided moment coverage is concentrated in the Introductory Rites.
- Most later Mass moments exist only as broad step cards with summary/guidance placeholders.
- Variant handling is implemented only for the greeting response overlay.
- Full-prayer text coverage is mostly placeholder/review-only and incomplete.

## 1. Complete MassFlow Coverage Map

Legend:

- Covered: implemented as a distinct MassFlow step or guided page with usable text/guidance.
- Partial: present as a broad step, placeholder, or non-conditional guidance but missing important liturgical substructure.
- Missing: no distinct structural representation.
- Broken: present but structurally incorrect or unreachable/mismatched.

### Introductory Rites

| Intended structure | Current implementation | Status | Notes |
|---|---|---:|---|
| Entrance chant / hymn | `entrance` step with guided items: "Entrance hymn begins", procession ambient | Partial | Present, but no antiphon vs hymn handling, no seasonal/local source, no congregation response behavior. |
| Entrance procession | `entrance-ambient` guided item | Partial | Present as ambient only. No altar reverence or incensation path. |
| Reverence to altar / kiss altar | Not modeled | Missing | Important ambient transition for beginners watching what is happening. |
| Incense at entrance | Not modeled | Missing | Optional solemn Mass path. |
| Sign of the Cross | `greeting-sign-cross` guided item | Covered | Gesture guidance exists. |
| Amen after Sign of Cross | `greeting-amen` guided item | Covered | Present. |
| Liturgical greeting | `greeting` step, content key `greeting` | Partial | Only "The Lord be with you" is canonical/current. Greeting variants are not modeled as real celebrant options. |
| Greeting response | `greeting-response`, variant overlay | Partial | Current overlay includes non-current or incorrect options such as "And also with you" and "The Lord be with you." Needs canonical variant logic. |
| Introduction of the Mass of the day | Not modeled | Missing | Optional priest introduction after greeting is absent. |
| Penitential Act invitation | `penitential-intro` guided item | Partial | Present as label only. No canonical invitation/brief silence structure. |
| Penitential Act Form A: Confiteor | Confiteor cadence fragments | Partial | Opening and fault cadence present, but full prayer is incomplete in guided sequence and textBlocks do not contain the Confiteor. |
| Confiteor breast-strike cadence | Three guided items with `cadenceCue: "strike breast"` | Covered | Best current cadence coverage. |
| Absolution after Penitential Act | Not modeled | Missing | "May almighty God have mercy..." and people's Amen absent. |
| Penitential Act Form B | Not modeled | Missing | "Have mercy on us, O Lord..." path absent. |
| Penitential Act Form C | Not modeled | Missing | Tropes and response pattern absent. |
| Sprinkling Rite replacing Penitential Act | Not modeled | Missing | Important Sunday/Easter/local optional path. |
| Kyrie when not included in Penitential Act | Grouped Kyrie screen | Partial | Basic English response present. No Greek/English variants, call-response alternation, or Form C integration. |
| Gloria included | `glory-to-god` guided item and fullPrayerKey | Partial | Only opening phrase in guided flow; full prayer depends on `MASS_CONTENT.gloria`, which is currently absent. |
| Gloria omitted | `gloria-listen-omitted` guided item | Partial | Omission is shown as a screen inside the same flow rather than conditional seasonal/day logic. |
| Gloria seasonal/day rules | Not modeled | Missing | Sundays outside Advent/Lent, solemnities/feasts, ritual Masses not represented. |
| Collect invitation "Let us pray" | `collect-listen` | Partial | Present as "Opening Prayer"; listen anchor exists. |
| Silent intention before Collect | `collect-intention` | Partial | Data exists but `buildGuidedPages` consumes it and does not render it in the collect guided group. Broken coverage. |
| Collect prayer text | `collect-celebrant` placeholder | Partial | No proper/date-specific Collect text provider. |
| Collect Amen | `collect-amen` | Covered | Present. |

### Liturgy of the Word

| Intended structure | Current implementation | Status | Notes |
|---|---|---:|---|
| Sit transition after Collect | Step posture changes from Collect stand to First Reading sit | Partial | Posture exists at step level; no explicit transition moment. |
| First Reading | `first-reading` | Partial | Placeholder only. No date-specific reading text, citation, reader ending, or response. |
| Reader ending: "The word of the Lord" | Not modeled | Missing | No "Thanks be to God" response. |
| Responsorial Psalm | `psalm` | Partial | Placeholder only. No psalm response cadence, verses, refrain repetition, or sung/spoken path. |
| Second Reading | `second-reading` optional | Partial | Placeholder and optional flag only. No Sunday/solemnity conditional logic or response. |
| Sequence | Not modeled | Missing | Easter and Pentecost required sequences, optional sequences, and placement before Gospel Acclamation are absent. |
| Stand for Gospel Acclamation | `gospel-acclamation` posture stand | Partial | Step posture exists; no explicit "stand now" transition. |
| Alleluia | `gospel-acclamation` placeholder | Partial | No actual text, refrain cadence, verse, or repeat. |
| Lenten Gospel Acclamation variant | Not modeled | Missing | "Praise to you, Lord Jesus Christ..." and other non-Alleluia forms absent. |
| Gospel dialogue: "The Lord be with you" / response | `gospel` has listen anchor only | Missing | No guided response "And with your spirit." |
| Gospel announcement: "A reading from..." / response | `gospel` placeholder only | Missing | No "Glory to you, O Lord." |
| Triple small Sign of Cross before Gospel | Not modeled | Missing | Critical beginner gesture guidance absent. |
| Gospel proclamation | `gospel` placeholder | Partial | No text/citation/date provider, no deacon/celebrant branch beyond placeholder text. |
| Gospel ending / response | Not modeled | Missing | No "The Gospel of the Lord" / "Praise to you, Lord Jesus Christ." |
| Homily | `homily` | Partial | Present as a placeholder step. No Sunday/holy day required handling or ambient duration guidance. |
| Stand for Creed | `profession-of-faith` posture stand | Partial | Step posture exists, no explicit transition. |
| Nicene Creed | `profession-of-faith` placeholder text | Partial | Full text missing. |
| Apostles' Creed option | Not modeled | Missing | Common variant absent. |
| Bow during Incarnation clause | Not modeled | Missing | Important gesture/posture guidance absent. |
| Kneel/genuflect at Incarnation on Christmas/Annunciation | Not modeled | Missing | Seasonal solemnity gesture variant absent. |
| Creed omission on weekdays/non-appointed days | Not modeled | Missing | No day-rank conditional handling. |
| Universal Prayer introduction | `universal-prayer` | Partial | Placeholder only. |
| Universal Prayer intentions | Not modeled | Missing | No intention-by-intention cadence or category structure. |
| Universal Prayer response | Placeholder "Respond to the prayers..." | Missing | No local response variants: "Lord, hear our prayer", etc. |
| Universal Prayer concluding collect | Not modeled | Missing | Closing celebrant prayer absent. |

### Liturgy of the Eucharist

| Intended structure | Current implementation | Status | Notes |
|---|---|---:|---|
| Preparation of the altar | Folded into `presentation` | Partial | No distinct altar-preparation ambient screen. |
| Offertory procession / gifts brought forward | `presentation` summary | Partial | No guided procession/ambient path. |
| Offertory chant/hymn | Not modeled | Missing | Music/ambient transition absent. |
| Sit during preparation of gifts | `presentation` posture sit | Partial | Step posture only. |
| Blessed are you, Lord God of all creation - bread | Listen anchor only | Missing | Text and optional people's response missing. |
| Blessed are you, Lord God of all creation - wine | Listen anchor only | Missing | Text and optional people's response missing. |
| "Blessed be God forever" response | Not modeled | Missing | Needed when prayers are spoken aloud. |
| Water and wine rite | Not modeled | Missing | Ambient/theological guidance absent. |
| Lavabo | Not modeled | Missing | "Wash me..." action absent. |
| Invitation: "Pray, brothers and sisters..." | Listen anchor in `prayer-over-offerings` | Partial | No full invitation or people's response. |
| Response: "May the Lord accept..." | Not modeled | Missing | Required response absent. |
| Prayer over the Offerings | `prayer-over-offerings` placeholder | Partial | Date-specific text absent. |
| Amen after Prayer over Offerings | Not modeled | Missing | Required response absent. |
| Preface dialogue: "The Lord be with you" | `preface` placeholder/listen anchor | Missing | No response coverage. |
| Preface dialogue: "Lift up your hearts" | Listen anchor only | Missing | No "We lift them up to the Lord." |
| Preface dialogue: "Let us give thanks..." | Listen anchor only | Missing | No "It is right and just." |
| Preface text | `preface` placeholder | Partial | No preface source/season/day variant. |
| Sanctus / Holy | `holy` full text block | Covered | Present as text block. No guided cadence. |
| Kneel after Sanctus | `consecration` posture kneel | Partial | Transition exists by next step only; local custom not modeled. |
| Eucharistic Prayer selection I-IV / others | Not modeled | Missing | No EP variant handling. |
| Epiclesis | Folded into `consecration` | Missing | No distinct "extend hands over gifts" ambient/listen moment. |
| Institution narrative over bread | `consecration` listen anchor | Partial | Anchor only. No text/cadence/elevation/silence. |
| Elevation of Host | Not modeled | Missing | Key ambient/gesture guidance absent. |
| Adoration response/silence after elevation | Generic guidance only | Partial | No cadence or "look/adoration" moment. |
| Institution narrative over chalice | `consecration` listen anchor | Partial | Anchor only. No text/cadence/elevation/silence. |
| Elevation of Chalice | Not modeled | Missing | Key ambient/gesture guidance absent. |
| Memorial Acclamation invitation | `mystery-of-faith` listen anchor | Partial | Present only as anchor. |
| Memorial Acclamation option 1 | `mystery-of-faith` text block | Covered | One option present. |
| Memorial Acclamation options 2-3 | Not modeled | Missing | Other approved acclamations absent. |
| Anamnesis/offering/intercessions | Not modeled | Missing | Main body of Eucharistic Prayer after acclamation absent. |
| Doxology | `doxology` | Partial | People's "Amen" present, but no Great Amen cadence or sung/repeated variants. |
| Stand for Lord's Prayer | `lords-prayer` posture stand | Partial | Step posture only; no explicit transition after kneeling. |
| Lord's Prayer invitation | Not modeled | Missing | Priest invitation absent. |
| Lord's Prayer | `lords-prayer` full text block | Covered | Text present. |
| Embolism: "Deliver us, Lord..." | Not modeled | Missing | Required priest prayer absent. |
| Doxology: "For the kingdom..." | Not modeled | Missing | Required people's response absent. |
| Peace prayer: "Lord Jesus Christ..." | Not modeled | Missing | Required prayer absent. |
| Peace response Amen | Not modeled | Missing | Required response absent. |
| "The peace of the Lord..." / response | Not modeled | Missing | "And with your spirit" absent. |
| Optional invitation to exchange peace | `sign-of-peace` anchor/guidance | Partial | Optional sign exists as broad guidance only. |
| Fraction rite | Not modeled | Missing | No breaking of bread ambient moment. |
| Agnus Dei / Lamb of God | `lamb-of-god` full text block | Partial | Text present. No repeat-until-fraction-complete handling. |
| Kneel/stand after Lamb of God | `stand_or_kneel` | Partial | Local custom represented only as broad posture label. |
| Priest private prayers before Communion | Not modeled | Missing | Silent priest prayers absent. |
| Invitation to Communion: "Behold the Lamb..." | `communion` listen anchor | Partial | Anchor only. |
| Response: "Lord, I am not worthy..." | Not modeled | Missing | Required people's response absent. |
| Communion procession | `communion` posture process | Partial | Broad posture only. |
| "The Body of Christ" / Amen | `communion` text block "Amen." | Partial | Amen present without minister prompt, reception options, or guidance. |
| Receiving on tongue/hand, low-gluten, blessing-only/non-Catholic path | Not modeled | Missing | Important beginner guidance and optional paths absent. |
| Communion chant / antiphon | Mentioned in guidance only | Missing | No step/ambient cadence. |
| Sacred silence/song after Communion | Not modeled | Missing | Thanksgiving period absent. |
| Vessels purification / altar clearing | Not modeled | Missing | Ambient transition absent. |
| Stand for Prayer after Communion | `prayer-after-communion` posture stand | Partial | Step posture only. |
| Prayer after Communion text | Placeholder | Partial | Date-specific text absent. |
| Amen after Prayer after Communion | Not modeled | Missing | Required response absent. |

### Concluding Rites

| Intended structure | Current implementation | Status | Notes |
|---|---|---:|---|
| Optional announcements | `announcements` optional | Partial | Present as optional broad step. No placement/custom handling. |
| Stand for blessing | `blessing` posture stand | Partial | Step posture only. |
| Greeting before blessing | Not modeled | Missing | "The Lord be with you" / "And with your spirit" absent. |
| Simple blessing | `blessing` placeholder | Partial | No actual blessing text or people's Amen. |
| Solemn blessing | Not modeled | Missing | Multi-response "Amen" path absent. |
| Prayer over the People | Not modeled | Missing | Seasonal optional path, especially Lent, absent. |
| Bishop's blessing variant | Not modeled | Missing | Pontifical greeting/blessing variants absent. |
| Dismissal formulas | `dismissal` placeholder "Go in peace." | Partial | Only one short formula present. Approved dismissal variants absent. |
| Response: "Thanks be to God" | Not modeled | Missing | Required response absent. |
| Altar reverence / recession | Not modeled | Missing | Final ambient transition absent. |
| Recessional hymn | Not modeled | Missing | Optional final music/ambient path absent. |
| Transition to Reflection | Implemented on final step | Covered | App workflow transition works per tests. |

### Overlays and Cross-Cutting Flows

| Intended structure | Current implementation | Status | Notes |
|---|---|---:|---|
| "I'm lost" jump overlay | Implemented | Covered | Can jump by implemented step. Missing deeper canonical moments because they are not in data. |
| Guide/reference overlay | Implemented | Partial | Defines chip types/postures/seasons, but not tied to actual conditional variants. |
| Full prayer overlay | Implemented | Partial | Works structurally, but only has `greeting` and `response_and_with_your_spirit` in `MASS_CONTENT`; many `fullPrayerKey`s resolve to guided fragments or placeholders. |
| Variant overlay | Implemented only for greeting response | Partial | Needs canonical variant engine and cleanup of invalid/currently deprecated options. |
| Latin option | Mockup exists, no implementation found | Missing | No Latin/English toggle, Kyrie Greek path, or Sanctus/Agnus Dei Latin path. |
| Season/solemnity overlays | Reference swatches only | Missing | Advent/Lent/Easter/Christmas behavior not wired into MassFlow. |
| Local custom handling | Type has `profileFlags.localCustomizable`, not used | Missing | Kneel/stand customs, Communion posture, music/parish style not operational. |
| Deacon vs priest variants | Placeholder text only | Missing | Gospel, dismissal, and invitations do not branch by minister. |
| Daily Mass vs Sunday Mass | Profile type exists; not used in MassFlow | Missing | Second reading, Gloria, Creed, homily, sequence, universal prayer behavior need day-rank handling. |
| Optional path engine | `optional: true` labels only | Partial | Optional moments are displayed linearly, not conditionally included/skipped. |
| Posture transitions | Step-level posture labels | Partial | No transition screens for stand/sit/kneel/process changes except where a guided item happens to carry posture. |
| Cadence flows | Early Introductory Rites only | Partial | Confiteor/Kyrie/Greeting/Collect are grouped; Word, Eucharistic Prayer, Communion, and Conclusion lack guided cadence. |
| Gesture guidance | Sign of Cross and breast strike only | Partial | Missing Gospel crosses, bow at Creed, bow before receiving, kneeling/genuflection variants, Communion hands/tongue guidance. |
| Ambient transitions | Entrance and a few Introductory ambient items | Partial | Missing altar reverence, readings silence, offertory, Eucharistic Prayer silence/elevations, Communion procession, post-Communion silence, recession. |
| Beginner guidance | Generic `learnWhat/learnWhatToDo/learnWhy` | Broken/Partial | `learnWhy` checks `liturgy-of-the-word` and `liturgy-of-the-eucharist`, but actual IDs are `liturgy-word` and `liturgy-eucharist`, so section-specific explanations do not fire for those rites. |

## 2. Missing Implementation Audit

### Pervasive Structural Gaps

1. The app has step-level rite coverage but not canonical moment-level coverage.
   The current flow can move a user from Entrance to Dismissal, but most canonical responses and liturgical actions inside those steps are absent.

2. Guided mode is not consistently implemented across the Mass.
   `guidedItems` exist for Entrance, Greeting, Penitential Act, Gloria, and Collect. From First Reading through Dismissal, most steps fall back to broad text blocks and generic guidance.

3. Optional/variant paths are represented as labels, not flow logic.
   `optional: true` displays "Optional where used"; it does not decide whether to include, skip, replace, or branch.

4. Full prayer coverage is incomplete.
   `MASS_CONTENT` contains only:
   - `greeting`
   - `response_and_with_your_spirit`

   Current `fullPrayerKey` values such as `confiteor`, `kyrie`, and `gloria` do not resolve to full prayer text.

5. Several implemented prayers are placeholders rather than complete liturgical coverage.
   Examples:
   - "Nicene Creed text pending final review."
   - "The celebrant prays the Collect."
   - "The first reading is proclaimed."
   - "The celebrant begins the Eucharistic Prayer."

6. Date-specific propers are not structurally integrated.
   Collect, readings, psalm, Gospel, prayer over offerings, Communion antiphon, prayer after Communion, prefaces, and seasonal acclamations are not connected to a calendar/provider in MassFlow.

7. Posture exists mostly as metadata, not as transitions.
   A beginner needs "sit now", "stand now", "kneel now", "join the Communion procession", and "return to your place" moments at the correct times.

8. Gesture guidance is too narrow.
   Existing gestures:
   - Sign of the Cross
   - Breast strike during Confiteor

   Missing gestures:
   - Small crosses on forehead/lips/heart before Gospel
   - Bow during Creed at the Incarnation
   - Kneel/genuflect at Incarnation on Christmas/Annunciation
   - Bow before receiving Communion where customary
   - Receiving Communion on hand/tongue
   - Reverent return after Communion

9. Cadence coverage is incomplete.
   Existing cadence:
   - Greeting grouped with response
   - Confiteor fragments
   - Kyrie grouped
   - Collect listen/Amen grouped

   Missing cadence:
   - Reading ending/response
   - Psalm refrain/verse/refrain
   - Gospel dialogue/responses
   - Creed gesture moment
   - Universal Prayer intentions/responses
   - Offertory invitation/response
   - Preface dialogue
   - Memorial Acclamation variants
   - Great Amen
   - Lord's Prayer embolism/doxology
   - Peace dialogue
   - Invitation to Communion/response
   - Blessing Amen
   - Dismissal/Thanks be to God

10. Ambient transitions are mostly absent.
    Missing ambient coverage includes altar reverence, incensation, silent prayer after readings/homily, preparation of altar, elevations, post-Communion thanksgiving, altar reverence/recession.

11. Beginner "what is happening" guidance has a section ID bug.
    In `learnWhy`, the code checks `liturgy-of-the-word` and `liturgy-of-the-eucharist`; current section IDs are `liturgy-word` and `liturgy-eucharist`. This prevents intended beginner explanations for those sections.

12. Greeting variant overlay is not canonical-safe.
    It includes "And also with you", which is not the current English Roman Missal response, and "The Lord be with you", which is a prompt rather than the people's response.

13. Collect intention is consumed but not shown.
    `buildGuidedPages` marks `collect-intention` consumed and only renders `collect-listen` plus `collect-amen`. The intended "Bring your intention quietly" guided moment is therefore missing from the live guided flow.

### Missing Sections and Screens

The following should become distinct structural screens or moments, even if visually they reuse existing screen primitives:

- Altar reverence at entrance
- Optional incensation
- Optional introduction to Mass of the day
- Penitential Act Form B
- Penitential Act Form C
- Sprinkling Rite
- Absolution and Amen
- Gloria included/omitted conditional screen
- First Reading ending and response
- Psalm refrain cadence
- Second Reading ending and response
- Sequence
- Lenten Gospel Acclamation variant
- Gospel dialogue and responses
- Triple Sign of Cross before Gospel
- Gospel ending and response
- Creed bow/kneel gesture
- Universal Prayer intention-response cadence
- Preparation of altar
- Offertory prayers over bread/wine and "Blessed be God forever"
- Lavabo
- "Pray, brothers and sisters" and "May the Lord accept..."
- Prayer over Offerings Amen
- Preface dialogue three-response sequence
- Eucharistic Prayer selection/variant
- Epiclesis
- Host elevation
- Chalice elevation
- Memorial Acclamation variants
- Great Amen cadence
- Lord's Prayer invitation
- Embolism and "For the kingdom..."
- Peace prayer, Amen, peace dialogue
- Fraction rite
- Lamb of God repeat-until-complete cadence
- Invitation to Communion and "Lord, I am not worthy..."
- Communion reception guidance
- Non-receiving/spiritual Communion/blessing path
- Communion chant/antiphon
- Thanksgiving after Communion
- Prayer after Communion Amen
- Blessing greeting/response
- Solemn blessing / Prayer over the People
- Dismissal variants and "Thanks be to God"
- Recessional ambient

### Missing Responses

Required or common responses not structurally covered:

- "Thanks be to God" after First Reading
- Psalm response/refrain
- "Thanks be to God" after Second Reading
- Gospel dialogue: "And with your spirit"
- Gospel announcement: "Glory to you, O Lord"
- Gospel ending: "Praise to you, Lord Jesus Christ"
- Universal Prayer response variants
- "Blessed be God forever"
- "May the Lord accept the sacrifice at your hands..."
- Amen after Prayer over Offerings
- Preface dialogue responses:
  - "And with your spirit"
  - "We lift them up to the Lord"
  - "It is right and just"
- Memorial Acclamation variants beyond "We proclaim your Death..."
- Great Amen
- "For the kingdom, the power and the glory are yours now and for ever"
- Amen after peace prayer
- "And with your spirit" before Sign of Peace
- "Lord, I am not worthy..."
- Amen when receiving Communion with minister prompt
- Amen after Prayer after Communion
- Amen after blessing
- "Thanks be to God" after dismissal

### Missing Prayer Coverage

Incomplete or absent prayers/texts:

- Full Confiteor
- Penitential Act Forms B and C
- Kyrie Greek/English variants
- Full Gloria
- Date-specific Collects
- Readings, Psalm, Gospel, citations, and day-specific responses
- Sequence texts
- Full Nicene Creed
- Apostles' Creed option
- Universal Prayer structure
- Offertory prayers
- Prayer over Offerings
- Preface dialogue and prefaces
- Eucharistic Prayers and acclamation variants
- Embolism after Lord's Prayer
- Peace prayer
- Invitation to Communion
- Communion antiphon
- Prayer after Communion
- Simple blessing, solemn blessings, Prayer over the People
- Dismissal formulas

### Broken or Incomplete Transitions

- Collect intention is defined but not rendered in the grouped Collect guided page.
- `learnWhy` section IDs do not match the actual section IDs for Word/Eucharist.
- Optional Gloria omission is linear rather than conditional, so users may see both included and omitted states.
- Optional steps such as Entrance, Second Reading, Communion, and Announcements are not skipped or selected by day/parish context.
- Step-level postures change abruptly without explicit transition guidance.
- Guided progress dots represent only guided items in early steps, not the full canonical flow.

## 3. Priority Ranking

### P0 Required for MVP

P0 means the Attend MassFlow cannot be considered structurally complete for a Novus Ordo MVP without this coverage.

1. Add complete canonical response coverage for the ordinary people's responses:
   - Reading responses
   - Gospel responses
   - Preface dialogue
   - Offertory response
   - Communion invitation response
   - Blessing/Dismissal responses

2. Add full prayer coverage for ordinary fixed texts:
   - Confiteor
   - Kyrie
   - Gloria
   - Creed
   - Sanctus
   - Memorial Acclamation variants
   - Lord's Prayer plus embolism/doxology response
   - Agnus Dei
   - "Lord, I am not worthy"

3. Convert broad Eucharistic Prayer coverage into canonical guided moments:
   - Preface dialogue
   - Sanctus
   - Epiclesis/consecration ambient
   - Host elevation
   - Chalice elevation
   - Memorial Acclamation
   - Doxology/Great Amen

4. Add Communion Rite structural coverage:
   - Lord's Prayer invitation
   - Embolism
   - Peace prayer/dialogue
   - Fraction/Lamb of God
   - Invitation to Communion
   - Communion reception prompt and Amen
   - Post-Communion silence

5. Add Liturgy of the Word response and gesture coverage:
   - Reading endings and "Thanks be to God"
   - Psalm refrain cadence
   - Gospel dialogue
   - Triple Sign of Cross
   - Gospel ending response

6. Add required posture transition moments:
   - Sit for readings
   - Stand for Gospel
   - Sit for homily
   - Stand for Creed/Universal Prayer
   - Sit for Preparation of Gifts
   - Stand for Prayer over Offerings/Preface
   - Kneel after Sanctus where customary
   - Stand for Lord's Prayer
   - Communion procession
   - Stand for Prayer after Communion and blessing

7. Fix known structural bugs:
   - `learnWhy` section ID mismatch
   - Collect intention consumed but not rendered
   - Greeting variant overlay options

8. Add conditional handling for core Sunday vs weekday behavior:
   - Second Reading
   - Gloria
   - Creed
   - Homily
   - Universal Prayer

### P1 Important

P1 means important for trust, beginner usability, and common parish reality, but not necessarily blocking the first structurally honest MVP.

1. Add Penitential Act variants:
   - Form A Confiteor
   - Form B
   - Form C
   - Sprinkling Rite replacement

2. Add season/day variant handling:
   - Advent/Lent Gloria omission
   - Lenten Gospel Acclamation
   - Easter/Pentecost Sequence
   - Christmas/Annunciation Creed kneel/genuflect

3. Add local custom handling:
   - Stand/kneel after Sanctus
   - Stand/kneel after Lamb of God
   - Communion posture and reception customs
   - Parish music/sung-spoken behavior

4. Add Universal Prayer cadence:
   - Intention categories
   - Local response variants
   - Concluding prayer

5. Add Offertory detail:
   - Gifts procession
   - Bread/wine prayers
   - "Blessed be God forever"
   - Lavabo

6. Add Concluding Rites variants:
   - Solemn blessing
   - Prayer over the People
   - Dismissal formulas
   - Recessional ambient

7. Add deacon/celebrant branching:
   - Gospel proclamation
   - Universal Prayer invitations
   - Dismissal

8. Add non-receiving Communion guidance:
   - Spiritual Communion
   - Blessing-only/local custom caution
   - Not Catholic/not prepared path

### P2 Enhancement

P2 means valuable polish/depth after the core structure is reliable.

1. Latin/Greek options:
   - Kyrie eleison
   - Sanctus
   - Agnus Dei
   - Latin ordinary toggle

2. Incense and solemnity ambience:
   - Entrance incensation
   - Gospel incensation
   - Offertory incensation
   - Elevation bells/incense

3. Music-aware cadence:
   - Sung Gloria
   - Sung Psalm
   - Alleluia verse and repeat
   - Sung Great Amen
   - Communion chant/refrain

4. More granular ambient screens:
   - Procession duration
   - Silence after readings
   - Homily reflection prompt
   - Thanksgiving after Communion
   - Recessional hymn

5. Richer source metadata:
   - Liturgical source provenance per prayer
   - Rights status per text
   - Calendar/provider confidence state

6. Beginner mode tuning:
   - "What do I do with my hands?"
   - "What if I miss a response?"
   - "What if everyone around me does something different?"
   - Parish custom explanations

## 4. Recommended Screen Architecture

This is an architecture recommendation only; it does not prescribe visual redesign.

### A. Keep Four Top-Level Rites

Maintain the existing top-level sections:

- Introductory Rites
- Liturgy of the Word
- Liturgy of the Eucharist
- Concluding Rites

These are correct and should remain the primary navigation groups.

### B. Split Each Step Into Canonical Moments

Current `MassFlowStep` is too broad for many parts of the Mass. Add a lower-level canonical unit, for example:

- `MassFlowStep`: user-visible liturgical step, such as "Gospel" or "Communion"
- `MassFlowMoment`: atomic guided moment inside a step, such as "The Lord be with you", "And with your spirit", "Small Sign of Cross", "Glory to you, O Lord"

Each moment should support:

- role: priest, deacon, reader, cantor, all, you, ambient
- guidance type: you_say, you_do, listen, ambient
- posture
- gesture
- cadence group
- optional/conditional rule
- full prayer key
- source metadata
- beginner note

### C. Add a Conditional Flow Resolver

Do not show every optional path linearly. Introduce a resolver that builds today's MassFlow from:

- calendar/day rank
- season
- Sunday vs weekday
- solemnity/feast/memorial/ferial
- parish/local custom profile
- Mass context flags:
  - deacon present
  - sung vs spoken
  - sprinkling rite used
  - Eucharistic Prayer selected
  - Creed appointed
  - Gloria appointed
  - second reading appointed
  - sequence appointed

The resolver should output a linear list of moments for the live Attend session.

### D. Use Reusable Cadence Groups

Create reusable cadence templates for repeated structures:

- prompt-response
- three-part dialogue
- repeated litany
- refrain and verse
- optional silence
- gesture-response
- procession
- kneel/stand transition
- prayer with final Amen

Examples:

- Preface dialogue: 3 prompt-response pairs.
- Psalm: refrain, verse, refrain cycles.
- Universal Prayer: intention, response repeated.
- Lamb of God: repeated invocation until fraction completes, then final "grant us peace."
- Solemn blessing: invocation and Amen repeated.

### E. Separate Text Coverage From Screen Coverage

MassFlow should not depend on hardcoded placeholder strings for canonical text. Use:

- ordinary fixed text store for stable prayers/responses
- proper text provider for date-specific prayers/readings
- variant text store for approved alternatives
- licensing/status metadata per text

This lets screens exist structurally even when a particular proper text is unavailable.

### F. Recommended MVP Screen/Moment Inventory

Minimum moment inventory for a structurally honest Novus Ordo MVP:

1. Entrance
2. Sign of Cross
3. Greeting and response
4. Penitential Act selected form
5. Kyrie if applicable
6. Gloria if applicable
7. Collect and Amen
8. Sit for readings
9. First Reading and response
10. Psalm refrain
11. Second Reading and response if applicable
12. Sequence if applicable
13. Stand for Gospel
14. Gospel Acclamation
15. Gospel dialogue, triple cross, announcement response
16. Gospel ending response
17. Homily
18. Creed if applicable, including bow/kneel variant
19. Universal Prayer cadence
20. Preparation of Gifts
21. Offertory prayers and response if spoken
22. "Pray, brothers and sisters" response
23. Prayer over Offerings and Amen
24. Preface dialogue
25. Sanctus
26. Kneel transition
27. Consecration/elevations
28. Memorial Acclamation
29. Great Amen
30. Stand for Lord's Prayer
31. Lord's Prayer
32. Embolism and doxology
33. Peace prayer/dialogue/sign
34. Lamb of God
35. Invitation to Communion and "Lord, I am not worthy"
36. Communion procession and Amen
37. Thanksgiving after Communion
38. Prayer after Communion and Amen
39. Optional announcements
40. Blessing and Amen
41. Dismissal and "Thanks be to God"
42. Recessional ambient / transition to reflection

### G. Recommended Data Architecture

Suggested structural fields:

- `id`
- `riteId`
- `stepId`
- `momentId`
- `title`
- `kind`: prompt, response, prayer, gesture, posture_transition, ambient, optional_path
- `actor`: priest, deacon, reader, cantor, assembly, user, ministers
- `textKey`
- `fallbackText`
- `posture`
- `gesture`
- `cadenceGroupId`
- `variantGroupId`
- `condition`
- `source`
- `beginnerGuidance`
- `listenAnchors`

Suggested condition model:

- `required`
- `optional`
- `whenSeason`
- `whenDayRank`
- `whenMassType`
- `whenLocalCustom`
- `whenMinisterPresent`
- `replaces`
- `omits`

### H. Recommended Implementation Sequence

1. Fix current structural bugs:
   - `learnWhy` IDs
   - Collect intention rendering
   - Greeting variant options

2. Add fixed ordinary text keys:
   - responses, Confiteor, Kyrie, Gloria, Creed, Sanctus, Memorial Acclamations, Lord's Prayer, Agnus Dei, Communion response, dismissal response.

3. Add moment-level structure for Liturgy of the Word.

4. Add moment-level structure for Liturgy of the Eucharist.

5. Add moment-level structure for Concluding Rites.

6. Add conditional resolver for Sunday/weekday/seasonal variants.

7. Add optional/local custom branches.

8. Add proper text provider integration.

## Bottom Line

Attend currently has the correct top-level Novus Ordo skeleton and a strong early guided prototype for the Introductory Rites. It does not yet have complete liturgical coverage. The largest gaps are the missing moment-level responses, incomplete ordinary prayer text, absent Eucharistic Prayer structure, absent Communion Rite responses, missing conditional variant handling, and missing posture/gesture/cadence transitions after the Collect.

For MVP, the priority should be to make the flow structurally truthful from Entrance through Dismissal before expanding visual polish or optional devotional depth.
