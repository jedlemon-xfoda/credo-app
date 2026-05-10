# Full Mass Mockup Plan
## Attend Screen — Liturgy of the Word through Concluding Rites

**Source of truth:** `data/massFlow.ts` (step IDs, guided items, postures, cadence groups, durationHints)  
**Directional reference:** `docs/mockups/00-canonical-board/full-mass-flow-directional.png` (composition rhythm only — not UI spec)  
**Canonical visual baseline:** Introductory Rites mockups 01–08c  

---

## Notation

| Symbol | Meaning |
|---|---|
| `→` | Chip sequence in a grouped page (multiple items, single tap) |
| `(cue)` | cadenceCue — renders as italic text below chip |
| `(hint)` | durationHint — renders as spaced italic below the beat block |
| `⊕` | SacredDivider appears before the chip block (shouldShowDivider = true) |
| `[optional]` | Step is marked optional in massFlow |
| `(proposed)` | Ornament not yet wired in code — needs design + implementation |

**Grouped pages** (cadence groups): all chips and phrases render on one screen, separated by inline SacredDividers between items. The `shouldShowDivider` ornament divider (⊕) appears before the entire chip block only when the page has exactly 1 item.

**Art-present composition:** title `marginBottom: 44`, beatGroup `marginTop: 22`. Use when an ornament renders above the chip.  
**Art-absent composition:** title `marginBottom: 8`, beatGroup `marginTop: 0`. Use for all other screens.

---

---

# LITURGY OF THE WORD

---

## First Reading

### W-01A. Posture Cue
- **Posture:** Sit
- **Chip:** YOU DO
- **Main text:** "Sit for the First Reading."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Transition card. Single declarative action. Compact, no art.

### W-01B. Listen
- **Posture:** Sit
- **Chip:** LISTEN
- **Main text:** "A reading from Sacred Scripture is proclaimed."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Extended sit moment. No durationHint in data; consider adding one ("Let one word find you.") in a future content pass.

### W-01C. Ending + Response *(cadence group)*
- **Posture:** Sit
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The word of the Lord." | "Thanks be to God."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Standard call-response close. "Thanks be to God." is a short phrase — renders at normal phraseSize (26pt), not short-scale. Inline SacredDivider between items.

---

## Psalm

### W-02A. Response Announced
- **Posture:** Sit
- **Chip:** LISTEN
- **Main text:** "The psalm response is announced."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Instruction moment. Cantor introduces the refrain. Compositionally quiet.

### W-02B. Repeat Response
- **Posture:** Sit
- **Chip:** YOU SAY
- **Main text:** "Repeat the psalm response."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Text is an instruction, not a fixed liturgical phrase. Needs visual distinction from YOU SAY responses with actual prayer text — consider slightly dimmed or italic phrasing (design decision, not code change yet).

### W-02C. Verses
- **Posture:** Sit
- **Chip:** LISTEN
- **Main text:** "Listen to the psalm verses."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Sustained ambient listen. Cantor sings; assembly listens. Parallel to homily-listen in role.

### W-02D. Response Returns
- **Posture:** Sit
- **Chip:** YOU SAY
- **Main text:** "Repeat the response when it returns."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Same instruction-style YOU SAY as W-02B. The psalm is cyclical; this mirrors the return of the refrain. Consider whether these two YOU SAY cards should show the actual response text (when known) rather than an instruction — content review question.

---

## Second Reading *(optional step)*

### W-03A. Listen
- **Posture:** Sit
- **Chip:** LISTEN
- **Main text:** "A second reading is proclaimed when appointed."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** `[optional]` — not present on Sundays with only one reading before the Gospel, and typically absent at Daily Mass. Screen should appear only when step is active. Compositionally identical to W-01B.

### W-03B. Ending + Response *(cadence group)*
- **Posture:** Sit
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The word of the Lord." | "Thanks be to God."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Identical pattern to W-01C. Parallel close.

---

## Gospel Acclamation

### W-04A. Stand Cue
- **Posture:** Stand
- **Chip:** YOU DO
- **Main text:** "Stand to welcome the Gospel."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Posture transition. Rising to stand is a bodily declaration of reverence for Christ in the Gospel.

### W-04B. Alleluia
- **Posture:** Stand
- **Chip:** YOU SAY
- **Main text:** "Alleluia."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Text length = 8 chars — hits the `phraseShortSize` threshold (≤8 chars → 40pt). Will render at large scale. Intentionally prominent. During Lent, replaced by branch `gospel-acclamation-lent` ("Praise to you, Lord Jesus Christ, King of endless glory.") — long text, normal phraseSize.

### W-04C. Acclamation Verse
- **Posture:** Stand
- **Chip:** LISTEN
- **Main text:** "Listen to the Gospel acclamation verse."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Cantor sings the verse. Assembly listens before repeating the acclamation.

### W-04D. Alleluia Repeat
- **Posture:** Stand
- **Chip:** YOU SAY
- **Main text:** "Alleluia."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Identical to W-04B. Repetition is intentional and structurally correct liturgically.

---

## Gospel

### W-05A. Dialogue *(cadence group)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The Lord be with you." | "And with your spirit."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Standard greeting exchange; same pattern as Preface dialogue. "And with your spirit." = 22 chars, normal phraseSize.

### W-05B. Announcement + Small Crosses + Response *(cadence group, 3 items)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU DO → YOU SAY
- **Main text:** "A reading from the holy Gospel according to the evangelist." | "Make a small cross on your forehead, lips, and heart." | "Glory to you, O Lord."
- **Secondary text:** cadenceCue on middle item: "(forehead, lips, heart)"
- **Ornament:** none (artItem = `gospel-announcement-listen`, no cadenceCue on artItem → art-absent; inline cadenceCue renders under the YOU DO chip)
- **Composition:** art-absent
- **Cadence notes:** 3-item group. The gesture (small crosses) sits between announcement and response. The cadenceCue "(forehead, lips, heart)" is the action rhythm cue — it must be legible at smaller scale below the YOU DO chip. The group is long; all three items stack with inline SacredDividers between them. Consider whether this 3-item group needs extra vertical breathing room.

### W-05C. Proclamation
- **Posture:** Stand
- **Chip:** LISTEN
- **Main text:** "Listen to the Gospel."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Extended listen. The longest sustained LISTEN moment in the Mass. A durationHint ("Receive the Lord's word.") could serve the composition here — content review question.

### W-05D. Ending + Response *(cadence group)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The Gospel of the Lord." | "Praise to you, Lord Jesus Christ."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** "Praise to you, Lord Jesus Christ." = 32 chars — just under the phraseLong threshold (≥34 chars). Renders at normal phraseSize (26pt). Confirm scale looks right at final review.

---

## Homily

### W-06A. Sit Cue
- **Posture:** Sit
- **Chip:** YOU DO
- **Main text:** "Sit for the Homily."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Posture transition. Brief, declarative.

### W-06B. Listen
- **Posture:** Sit
- **Chip:** LISTEN
- **Main text:** "Listen for one truth to carry."
- **Secondary text:** durationHint: "Let the Word settle."
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** durationHint is present in massFlow. This is the only Liturgy-of-the-Word listen with a hint. The instruction "Listen for one truth to carry." is aspirational/directive rather than liturgical text — compositionally this should feel restful, not active. The durationHint should appear with generous space below the beat block.

---

## Profession of Faith

### W-07A. Stand Cue
- **Posture:** Stand
- **Chip:** YOU DO
- **Main text:** "Stand for the Profession of Faith."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Posture transition. Parallel to W-04A (stand to welcome Gospel).

### W-07B. Begin Creed
- **Posture:** Stand
- **Chip:** YOU SAY
- **Main text:** "I believe in one God,"
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Opens the full Nicene Creed. "I believe in one God," = 22 chars, normal phraseSize. fullPrayerKey = `nicene_creed` — "View full prayer" sheet available. The opening phrase is the incipit; the full creed is long. Compact layout here must feel like a beginning, not a summary.

### W-07C. Bow at Incarnation
- **Posture:** Stand
- **Chip:** YOU DO
- **Main text:** "Bow at the words of the Incarnation."
- **Secondary text:** —
- **Ornament:** none (proposed: small cross or downward gesture glyph)
- **Composition:** art-absent
- **Cadence notes:** Gesture within the prayer. No art wired. The bow is a profound liturgical gesture; a small ornament might serve this screen's weight. Design decision needed.

### W-07D. Amen
- **Posture:** Stand
- **Chip:** YOU SAY
- **Main text:** "Amen."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Closes the Creed. "Amen." = 5 chars → phraseShortSize (40pt). Large, deliberate close.

---

## Universal Prayer

### W-08A. Intentions Announced
- **Posture:** Stand
- **Chip:** LISTEN
- **Main text:** "The intentions of the Church are announced."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Orientation card before the intercession cycle begins.

### W-08B. Response
- **Posture:** Stand
- **Chip:** YOU SAY
- **Main text:** "Lord, hear our prayer."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** The fixed intercession response. "Lord, hear our prayer." = 22 chars, normal phraseSize. fullPrayerKey = `response_lord_hear_our_prayer`.

### W-08C. Repeat After Each Intention
- **Posture:** Stand
- **Chip:** YOU SAY
- **Main text:** "Repeat the response after each intention."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Same instruction-style YOU SAY as W-02B and W-02D. Liturgically this is an ongoing participatory pattern rather than a single fixed phrase. The text is directional, not prayerful. Same design question as Psalm: consider whether actual response text should surface here.

### W-08D. Closing
- **Posture:** Stand
- **Chip:** LISTEN
- **Main text:** "The celebrant concludes the prayer."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Quiet close. Transitions into the Liturgy of the Eucharist.

---

---

# LITURGY OF THE EUCHARIST

---

## Presentation of the Gifts

### E-01A. Sit Cue
- **Posture:** Sit
- **Chip:** YOU DO
- **Main text:** "Sit as the altar is prepared."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Posture transition. Assembly sits while gifts are arranged and collection taken.

### E-01B. Gifts Ambient
- **Posture:** Sit
- **Chip:** AMBIENT
- **Main text:** "Bread and wine are brought to the altar."
- **Secondary text:** —
- **Ornament:** none (proposed: chalice + host or bread glyph — distinct from ChaliceArt used at Collect)
- **Composition:** art-absent
- **Cadence notes:** Watch moment. The procession of gifts is visible. No art currently wired. A simple presentation glyph (bread + chalice) would anchor the composition. Directional board shows a tray/gift element here.

### E-01C. Bread Blessed + Response *(cadence group)*
- **Posture:** Sit
- **Chip:** LISTEN → YOU SAY
- **Main text:** "Blessed are you, Lord God of all creation." | "Blessed be God forever."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** May be said quietly (not sung) at some Masses, in which case the response is omitted. "Blessed be God forever." = 22 chars, normal phraseSize. Standard call-response pattern.

### E-01D. Wine Blessed + Response *(cadence group)*
- **Posture:** Sit
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The celebrant prays over the wine." | "Blessed be God forever."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Parallel to E-01C. Identical response. The brevity of "The celebrant prays over the wine." (33 chars) is just below phraseLong threshold — renders at normal phraseSize.

---

## Prayer over the Offerings

### E-02A. Stand Cue
- **Posture:** Stand
- **Chip:** YOU DO
- **Main text:** "Stand when invited."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Posture transition triggered by the celebrant's invitation ("Pray, brothers and sisters...").

### E-02B. Invitation + Response *(cadence group)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "Pray, brothers and sisters, that my sacrifice and yours may be acceptable to God." | "May the Lord accept the sacrifice at your hands."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Both texts are long. "Pray, brothers and sisters..." = 80 chars → phraseLong scale (26pt, 258 maxWidth). "May the Lord accept..." = 48 chars → phraseLong scale. This grouped page will be vertically heavy. Monitor stacking carefully; both items may need phraseLong treatment simultaneously.

### E-02C. Prayer + Amen *(cadence group)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The celebrant prays the Prayer over the Offerings." | "Amen."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** "Amen." = 5 chars → phraseShortSize (40pt). In a grouped page, the phraseShort scale applies per item; the "Amen." will render large against the listen text above it. Inline SacredDivider separates them.

---

## Preface (Eucharistic Prayer opening)

### E-03A. Lord Be with You / And with Your Spirit *(cadence group)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The Lord be with you." | "And with your spirit."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Identical exchange to W-05A and Blessing (X-02B). The Preface dialogue is structurally the most solemn instance of this greeting — the Church is about to enter the Eucharistic Prayer. The composition should feel weight-bearing.

### E-03B. Lift Up Your Hearts / We Lift Them Up *(cadence group)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "Lift up your hearts." | "We lift them up to the Lord."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** "Lift up your hearts." = 20 chars, normal phraseSize. "We lift them up to the Lord." = 28 chars, normal phraseSize. Both fit comfortably. This exchange has a lifting quality — compositionally the most "upward" moment in the preface dialogue.

### E-03C. Let Us Give Thanks / It Is Right and Just *(cadence group)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "Let us give thanks to the Lord our God." | "It is right and just."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** "It is right and just." = 22 chars, normal phraseSize. Confident, declarative response. Closes the preface dialogue before the proper preface text begins.

### E-03D. Preface Prayer
- **Posture:** Stand
- **Chip:** LISTEN
- **Main text:** "Listen as the celebrant gives thanks."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Extended ambient listen. The celebrant prays the variable proper preface. Duration is variable. No durationHint currently in data; consider adding one ("Heaven and earth are full of his glory.").

---

## Holy (Sanctus)

### E-04A. Holy Holy Holy
- **Posture:** Stand
- **Chip:** YOU SAY
- **Main text:** "Holy, Holy, Holy Lord God of hosts."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** "Holy, Holy, Holy Lord God of hosts." = 35 chars → phraseLong scale (26pt, 258 maxWidth). fullPrayerKey = `holy`; full Sanctus text available in "View full prayer" sheet. This is the assembly joining the worship of heaven — the composition should feel expansive. Art-absent currently; a proposed sunburst or radiant glyph (distinct from SunburstArt used at Gloria) could serve this screen.

### E-04B. Kneel Transition
- **Posture:** Kneel
- **Chip:** YOU DO
- **Main text:** "Kneel after the Holy where customary."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Posture change card. Brief and functional. The phrase "where customary" signals local variation — present in text by design.

---

## Consecration

### E-05A. Kneel
- **Posture:** Kneel
- **Chip:** YOU DO
- **Main text:** "Kneel in adoration."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Posture declaration at the opening of the most sacred part of the Mass.

### E-05B. Epiclesis
- **Posture:** Kneel
- **Chip:** LISTEN
- **Main text:** "The celebrant asks the Father to sanctify the gifts."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** The invocation of the Holy Spirit over the gifts. Quiet watch moment. No art wired; this screen may benefit from a simple flame or dove glyph to mark the epiclesis (proposed).

### E-05C. Body of Christ
- **Posture:** Kneel
- **Chip:** LISTEN
- **Main text:** "This is my Body."
- **Secondary text:** —
- **Ornament:** none (proposed: host/wafer elevation glyph)
- **Composition:** art-absent
- **Cadence notes:** "This is my Body." = 16 chars, normal phraseSize. The most sacred words in the Mass. The compact art-absent layout means the phrase sits close under the title. Consider whether this screen warrants a bespoke elevated-host ornament to mark the moment visually. Directional board suggests an elevation treatment here.

### E-05D. Host Elevation
- **Posture:** Kneel
- **Chip:** AMBIENT
- **Main text:** "Adore Christ present under the appearance of bread."
- **Secondary text:** durationHint: "Look with faith."
- **Ornament:** none (proposed: elevated host glyph — distinct from and more prominent than ChaliceArt)
- **Composition:** art-absent
- **Cadence notes:** durationHint is present ("Look with faith."). Extended adoration moment. The AMBIENT chip signals rest and gaze, not response. This and E-05F are the two most contemplative screens in the entire Mass flow. The durationHint must have generous space; the composition should feel like stillness. A proposed elevation ornament (host raised above hands) would be the visual anchor. This is a priority design item.

### E-05E. Chalice
- **Posture:** Kneel
- **Chip:** LISTEN
- **Main text:** "This is the chalice of my Blood."
- **Secondary text:** —
- **Ornament:** none (proposed: chalice glyph — elevated, distinct from ChaliceArt at Collect)
- **Composition:** art-absent
- **Cadence notes:** "This is the chalice of my Blood." = 31 chars, just under phraseLong. Parallel to E-05C. Same bespoke ornament priority as E-05C.

### E-05F. Chalice Elevation
- **Posture:** Kneel
- **Chip:** AMBIENT
- **Main text:** "Adore Christ present under the appearance of wine."
- **Secondary text:** durationHint: "Remain in prayer."
- **Ornament:** none (proposed: elevated chalice glyph)
- **Composition:** art-absent
- **Cadence notes:** durationHint is present ("Remain in prayer."). Direct parallel to E-05D. Both elevation screens must be compositionally identical in structure, distinguished only by glyph (host vs. chalice). Priority design pair.

---

## Mystery of Faith

### E-06A. Mystery Announce + Proclamation *(cadence group)* ⊕
- **Posture:** Kneel
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The mystery of faith." | "We proclaim your Death, O Lord."
- **Secondary text:** —
- **Ornament:** none ⊕ SacredDivider before chip block (shouldShowDivider = true for `mystery-listen`)
- **Composition:** art-absent
- **Cadence notes:** The ⊕ SacredDivider renders above the LISTEN chip, anchoring this as a structurally important exchange — the first major communal acclamation after the consecration. "We proclaim your Death, O Lord." = 31 chars, just under phraseLong. fullPrayerKey = `mystery_of_faith`; full text ("...and profess your Resurrection until you come again.") available in sheet.

---

## Doxology

### E-07A. Through Him / Great Amen *(cadence group)* ⊕
- **Posture:** Kneel
- **Chip:** LISTEN → YOU SAY
- **Main text:** "Through him, and with him, and in him." | "Amen."
- **Secondary text:** —
- **Ornament:** none ⊕ SacredDivider before chip block (shouldShowDivider = true for `doxology-listen`)
- **Composition:** art-absent
- **Cadence notes:** "Amen." = 5 chars → phraseShortSize (40pt). The Great Amen is the assembly's most important single word in the Mass — it ratifies the entire Eucharistic Prayer. The ⊕ divider and the large-scale "Amen." together must feel like a threshold. fullPrayerKey = `response_great_amen`.

---

---

# COMMUNION RITE

---

## Lord's Prayer

### C-01A. Stand Cue
- **Posture:** Stand
- **Chip:** YOU DO
- **Main text:** "Stand for the Lord's Prayer."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Posture transition out of the post-consecration kneeling.

### C-01B. Invitation
- **Posture:** Stand
- **Chip:** LISTEN
- **Main text:** "At the Savior's command, the celebrant invites the prayer."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Brief orientation before the communal prayer begins. "At the Savior's command..." = 58 chars → phraseLong scale (26pt). Long instruction text — verify visual balance with compact layout.

### C-01C. Our Father
- **Posture:** Stand
- **Chip:** YOU SAY
- **Main text:** "Our Father, who art in heaven,"
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Opens the Lord's Prayer. "Our Father, who art in heaven," = 30 chars, normal phraseSize. fullPrayerKey = `lords_prayer`; full prayer text in "View full prayer" sheet. The opening phrase alone signals the whole prayer — the compact layout should feel like a beginning rather than a truncation.

### C-01D. Embolism + Kingdom *(cadence group)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "Deliver us, Lord, we pray, from every evil." | "For the kingdom, the power and the glory are yours."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Both texts are moderately long. "For the kingdom..." = 51 chars → phraseLong scale. fullPrayerKey = `response_for_the_kingdom` (includes "...now and for ever. Amen."). This group closes the Lord's Prayer sequence and the assembly's praying role in this section — treat as a strong close.

---

## Sign of Peace

### C-02A. Prayer + Amen *(cadence group)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The celebrant prays for peace and unity." | "Amen."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** "Amen." = 5 chars → phraseShortSize (40pt) in the grouped context. The peace prayer is variable; the assembly responds Amen.

### C-02B. Peace Dialogue *(cadence group)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The peace of the Lord be with you always." | "And with your spirit."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Another instance of the "And with your spirit." response. "The peace of the Lord be with you always." = 41 chars → phraseLong scale.

### C-02C. Offer Peace
- **Posture:** Stand
- **Chip:** YOU DO
- **Main text:** "Offer a reverent sign of peace if invited."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Action card. The phrase "if invited" signals that the exchange is at the discretion of the celebrant. This screen should feel gentle, not urgent. 42 chars → phraseLong scale.

---

## Lamb of God

### C-03A. Fraction
- **Posture:** Stand or kneel
- **Chip:** AMBIENT
- **Main text:** "The Bread is broken for Communion."
- **Secondary text:** —
- **Ornament:** none (proposed: fraction/breaking glyph — bread broken in two, or simple host/bread element)
- **Composition:** art-absent
- **Cadence notes:** Watch moment. The breaking of the bread is ancient and visible. Directional board suggests a visual element here. A distinct fraction glyph (different from the presentation chalice) would serve the moment.

### C-03B. First Petition
- **Posture:** Stand or kneel
- **Chip:** YOU SAY
- **Main text:** "Lamb of God, you take away the sins of the world, have mercy on us."
- **Secondary text:** —
- **Ornament:** none (proposed: Agnus Dei cross or lamb glyph)
- **Composition:** art-absent
- **Cadence notes:** 67 chars → phraseLong scale (26pt, 258 maxWidth). Long text for a YOU SAY response. fullPrayerKey = `lamb_of_god`. Three separate pages for the three petitions — each page is its own screen. Identical first two, changed ending on third.

### C-03C. Second Petition
- **Posture:** Stand or kneel
- **Chip:** YOU SAY
- **Main text:** "Lamb of God, you take away the sins of the world, have mercy on us."
- **Secondary text:** —
- **Ornament:** none (proposed: same as C-03B)
- **Composition:** art-absent
- **Cadence notes:** Identical to C-03B. Repetition is liturgically intentional. The progress dots (page 2 of 4 in this step, or however the step counts) distinguish this from C-03B.

### C-03D. Third Petition
- **Posture:** Stand or kneel
- **Chip:** YOU SAY
- **Main text:** "Lamb of God, you take away the sins of the world, grant us peace."
- **Secondary text:** —
- **Ornament:** none (proposed: same as C-03B)
- **Composition:** art-absent
- **Cadence notes:** Ending changes from "have mercy on us" to "grant us peace." — 65 chars, phraseLong scale. The change of ending is significant; the phrase pivot toward peace leads directly into Communion.

---

## Communion

### C-04A. Invitation + Worthy Response *(cadence group)*
- **Posture:** Stand or kneel
- **Chip:** LISTEN → YOU SAY
- **Main text:** "Behold the Lamb of God." | "Lord, I am not worthy that you should enter under my roof."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** "Behold the Lamb of God." = 23 chars, normal phraseSize. "Lord, I am not worthy that you should enter under my roof." = 57 chars → phraseLong scale. fullPrayerKey = `response_lord_not_worthy` (includes "...but only say the word and my soul shall be healed."). This is a deeply personal response — the scale and weight of the YOU SAY here matter greatly.

### C-04B. Procession
- **Posture:** Process reverently
- **Chip:** YOU DO
- **Main text:** "Join the Communion procession reverently."
- **Secondary text:** —
- **Ornament:** none (proposed: procession or figure-in-motion glyph, referencing the `process` posture icon)
- **Composition:** art-absent
- **Cadence notes:** 41 chars → phraseLong scale. The posture changes to `process` — "Process reverently" badge shown. This is the only screen in the Mass with the process posture actively directing movement. The badge and art (if any) should reflect movement rather than stillness.

### C-04C. Minister + Amen *(cadence group)*
- **Posture:** Process
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The Body of Christ." | "Amen."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** "Amen." = 5 chars → phraseShortSize (40pt) within the group. "The Body of Christ." = 19 chars, normal phraseSize. The minister's declaration is short; the assembly's single-word Amen is the most personal act of the entire Mass. The large-scale Amen in this context must feel like consent, not recitation.

### C-04D. Thanksgiving
- **Posture:** Sit
- **Chip:** AMBIENT
- **Main text:** "Return to your place and pray quietly."
- **Secondary text:** durationHint: "Give thanks after Communion."
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** durationHint is present ("Give thanks after Communion."). Extended sit-in-silence moment. The AMBIENT chip signals no required response. This is the most interior screen of the entire Mass — the composition should be as quiet as possible. No art; the whitespace itself is the design. The durationHint should appear generously spaced. Posture shifts back to sit.

---

## Prayer after Communion

### C-05A. Stand Cue
- **Posture:** Stand
- **Chip:** YOU DO
- **Main text:** "Stand when the celebrant says, Let us pray."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** 42 chars → phraseLong scale. Posture transition triggered by a specific verbal cue ("Let us pray") from the celebrant. The instruction includes the cue phrase — useful for the assembly to know when to rise.

### C-05B. Prayer + Amen *(cadence group)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The celebrant prays the Prayer after Communion." | "Amen."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** "Amen." = 5 chars → phraseShortSize (40pt) in group. Closes the Communion Rite. Parallel in form to E-02C (offerings prayer + Amen) and other prayer-close pairs.

---

---

# CONCLUDING RITES

---

## Announcements *(optional)*

### X-01A. Listen
- **Posture:** Sit or stand
- **Chip:** LISTEN
- **Main text:** "Announcements may be given if needed."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** `[optional]` step. Variable posture (sit or stand — "Sit or stand" badge shown). Transitional, practical. The phrase acknowledges the announcements are conditional. Compositionally this screen should feel lower-weight than any liturgical moment.

---

## Blessing

### X-02A. Stand Cue
- **Posture:** Stand
- **Chip:** YOU DO
- **Main text:** "Stand for the blessing."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Final posture transition of the Mass.

### X-02B. Dialogue *(cadence group)*
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "The Lord be with you." | "And with your spirit."
- **Secondary text:** —
- **Ornament:** none
- **Composition:** art-absent
- **Cadence notes:** Third instance of this exchange (Preface: E-03A; Gospel: W-05A; Blessing: here). Each carries different liturgical weight — this is the departing greeting before the final blessing and dismissal.

### X-02C. Sign of Cross + Amen *(cadence group)*
- **Posture:** Stand
- **Chip:** YOU DO → YOU SAY
- **Main text:** "Make the Sign of the Cross as the blessing is given." | "Amen."
- **Secondary text:** —
- **Ornament:** none (note: `blessing-cross` does NOT match `item.id.includes("sign-cross")` in current code — no GestureArt rendered; proposed: wire the existing GestureArt "sign" variant, or a distinct blessing cross glyph)
- **Composition:** art-absent (current) — FLAGGED for art wiring
- **Cadence notes:** The action is making the sign of the cross — the same gesture as the Mass-opening (W-02A equivalent in Introductory Rites). The opening had `greeting-sign-cross` which is wired to GestureArt. `blessing-cross` is not. This is a code gap: the two bookending Sign-of-Cross moments should be visually consistent. Proposed: extend `hasArtForPage` and `MomentArt` to include `id === "blessing-cross"`. "Amen." = 5 chars → phraseShortSize (40pt). The final Amen of the Blessing.

---

## Dismissal

### X-03A. Go in Peace / Thanks Be to God *(cadence group)* ⊕
- **Posture:** Stand
- **Chip:** LISTEN → YOU SAY
- **Main text:** "Go in peace." | "Thanks be to God."
- **Secondary text:** —
- **Ornament:** none ⊕ SacredDivider before chip block (shouldShowDivider = true for `dismissal-listen`)
- **Composition:** art-absent
- **Cadence notes:** The ⊕ divider anchors this as the final threshold of the Mass. "Go in peace." = 12 chars, normal phraseSize. "Thanks be to God." = 17 chars, normal phraseSize. Both phrases are short but not at the ≤8 char threshold for phraseShortSize. This is the `finalStep` screen — the dock shows "Continue to Reflection" label on the advance button. The composition should feel conclusive and releasing, not rushed. No ornament currently wired; an outward/procession glyph (proposed) could mark the sending.

---

---

# OPEN DESIGN QUESTIONS

These screens or patterns need bespoke attention before mockup production:

1. **Consecration elevation pair (E-05D, E-05F)** — The highest-priority new ornament design need. Host and chalice elevation glyphs required. Must differ from ChaliceArt used at Collect. Priority: P0.

2. **Blessing Sign of Cross (X-02C)** — `blessing-cross` not matched by current `hasArtForPage` logic. The gesture is identical to the Mass-opening Sign of Cross. Extend art wiring to include `id === "blessing-cross"`. Priority: P1.

3. **Consecration words (E-05C, E-05E)** — "This is my Body." and "This is the chalice of my Blood." — most sacred single-phrase moments. Consider whether a subtle elevation glyph above the chip serves these screens or whether intentional artlessness (whitespace only) is more appropriate. Design decision.

4. **Communion Thanksgiving (C-04D)** — Most interior screen of the Mass. Art-absent is correct. Confirm that the durationHint spacing is generous enough to feel like rest, not clutter. No code change; visual QA item.

5. **Psalm instruction-style YOU SAY (W-02B, W-02D, W-08C)** — These YOU SAY chips carry instructional text rather than fixed prayer text. The visual chip is identical to prayer-text YOU SAY. Consider a future content-review pass to supply actual psalm response text when possible.

6. **Lamb of God ornament (C-03B–D)** — Three identical-chip pages in sequence. Progress dots distinguish them, but the screens feel visually monotonous. A proposed Agnus Dei glyph would anchor the sequence; alternatively, the three petitions could be grouped into a single 3-item page (architecture decision, out of scope for visual mockup).

7. **Dismissal glyph (X-03A)** — The final screen of the Mass. Directional board suggests an outward/procession motif. A subtle door or procession glyph (proposed) would mark the threshold. The ⊕ divider plus large whitespace may be sufficient without art.
