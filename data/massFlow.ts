import type { ListenAnchor, MassFlowSection, MassFlowStep, MassGuidedItem, MassPosture, MassSourceMetadata, MassTextBlock } from "../types";

const reviewSource: MassSourceMetadata = {
  sourceProvider: "manual_review",
  textStatus: "review_only",
  licensingNote: "Review copy - pending permission for official liturgical texts where applicable. Do not distribute publicly.",
  lastUpdated: "2026-05-01"
};

const companionSource: MassSourceMetadata = {
  sourceProvider: "mock",
  textStatus: "placeholder",
  licensingNote: "Draft companion guidance for local review. Replace or verify before production.",
  lastUpdated: "2026-05-01"
};

type StepInput = Omit<MassFlowStep, "sectionId" | "sectionTitle" | "source" | "listenAnchors"> & {
  source?: MassSourceMetadata;
  listenAnchors?: ListenAnchor[];
};

type SectionInput = {
  id: string;
  title: string;
  summary: string;
  steps: StepInput[];
};

function textBlock(id: string, role: MassTextBlock["role"], text: string, source = reviewSource): MassTextBlock {
  return { id, role, text, source };
}

function guidedItem(
  id: string,
  guidanceType: MassGuidedItem["guidanceType"],
  text: string,
  options: Omit<MassGuidedItem, "id" | "guidanceType" | "text"> = {}
): MassGuidedItem {
  return { id, guidanceType, text, ...options };
}

function anchors(...phrases: string[]): ListenAnchor[] {
  return phrases.map((phrase, index) => ({
    id: `${phrase.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${index}`,
    phrase,
    confidenceHint: "medium"
  }));
}

const sectionInputs: SectionInput[] = [
  {
    id: "introductory-rites",
    title: "Introductory Rites",
    summary: "The Church gathers, asks mercy, and prepares to hear the Word.",
    steps: [
      {
        id: "entrance",
        title: "Entrance Chant",
        subtitle: "Entrance Chant",
        summary: "The Church gathers as one body.",
        posture: "stand",
        optional: true,
        textBlocks: [],
        guidedItems: [
          guidedItem("entrance-listen", "listen", "Entrance hymn begins", {
            posture: "stand",
            durationHint: "Let the procession gather your attention."
          }),
          guidedItem("entrance-ambient", "ambient", "The priest and ministers process to the altar.", {
            posture: "stand"
          })
        ],
        guidance: "Entrance chant or antiphon begins the Mass. Some parishes sing a hymn instead.",
        listenAnchors: anchors("In the name of the Father", "Entrance chant")
      },
      {
        id: "greeting",
        title: "Greeting",
        subtitle: "Greeting",
        summary: "The celebrant greets the assembly in the name of the Lord.",
        posture: "stand",
        textBlocks: [
  {
    ...textBlock("greeting-celebrant", "celebrant", "Fallback greeting"),
    contentKey: "greeting",
  }
],
        guidedItems: [
          guidedItem("greeting-sign-cross", "you_do", "Make the Sign of the Cross", {
            posture: "stand"
          }),
          guidedItem("greeting-amen", "you_say", "Amen.", {
            posture: "stand"
          }),
          guidedItem("greeting-listen", "listen", "The Lord be with you.", {
            posture: "stand"
          }),
          guidedItem("greeting-response", "you_say", "And with your spirit.", {
            posture: "stand",
            fullPrayerKey: "response_and_with_your_spirit"
          })
        ],
        guidance: "Receive the greeting as the beginning of sacred worship.",
        listenAnchors: anchors("The Lord be with you")
      },
      {
        id: "penitential-act",
        title: "Penitential Act",
        subtitle: "Penitential Act",
        summary: "We acknowledge our sins and ask for mercy.",
        posture: "stand",
        textBlocks: [textBlock("penitential-you", "you", "Lord, have mercy.\nChrist, have mercy.\nLord, have mercy.")],
        guidedItems: [
          guidedItem("penitential-intro", "ambient", "Penitential Act", {
            posture: "stand"
          }),
          guidedItem("confiteor-1", "you_say", "I confess to almighty God", {
            posture: "kneel",
            fullPrayerKey: "confiteor"
          }),
          guidedItem("confiteor-2", "you_say", "and to you, my brothers and sisters,", {
            posture: "kneel",
            fullPrayerKey: "confiteor"
          }),
          guidedItem("confiteor-fault-1", "you_say", "through my fault", {
            posture: "kneel",
            cadenceCue: "strike breast",
            fullPrayerKey: "confiteor"
          }),
          guidedItem("confiteor-fault-2", "you_say", "through my fault", {
            posture: "kneel",
            cadenceCue: "strike breast",
            fullPrayerKey: "confiteor"
          }),
          guidedItem("confiteor-fault-3", "you_say", "through my most grievous fault", {
            posture: "kneel",
            cadenceCue: "strike breast",
            fullPrayerKey: "confiteor"
          }),
          guidedItem("kyrie-lord-1", "you_say", "Lord, have mercy.", {
            posture: "stand",
            fullPrayerKey: "kyrie"
          }),
          guidedItem("kyrie-christ", "you_say", "Christ, have mercy.", {
            posture: "stand",
            fullPrayerKey: "kyrie"
          }),
          guidedItem("kyrie-lord-2", "you_say", "Lord, have mercy.", {
            posture: "stand",
            fullPrayerKey: "kyrie"
          })
        ],
        guidance: "Come honestly before God.",
        listenAnchors: anchors("Let us acknowledge our sins", "Lord have mercy")
      },
      {
        id: "glory-to-god",
        title: "Glory to God",
        subtitle: "Glory to God",
        summary: "The Church gives glory to God.",
        posture: "stand",
        textBlocks: [],
        guidedItems: [
          guidedItem("gloria-you-say", "you_say", "Glory to God in the highest,", {
            posture: "stand",
            fullPrayerKey: "gloria"
          }),
          guidedItem("gloria-listen-omitted", "listen", "The Gloria may be omitted today.", {
            posture: "stand"
          }),
          guidedItem("gloria-ambient", "ambient", "Praise follows mercy.", {
            posture: "stand"
          })
        ],
        guidance: "The Gloria is sung or said when appointed. Praise follows mercy.",
        listenAnchors: anchors("Glory to God in the highest")
      },
      {
        id: "collect",
        title: "Collect",
        subtitle: "Collect",
        summary: "The celebrant gathers the prayers of the Church.",
        posture: "stand",
        textBlocks: [textBlock("collect-celebrant", "celebrant", "The celebrant prays the Collect.")],
        guidedItems: [
          guidedItem("collect-listen", "listen", "Opening Prayer", {
            posture: "stand"
          }),
          guidedItem("collect-intention", "you_do", "Bring your intention quietly.", {
            posture: "stand"
          }),
          guidedItem("collect-amen", "you_say", "Amen.", {
            posture: "stand"
          })
        ],
        guidance: "Bring your intention quietly.",
        listenAnchors: anchors("Let us pray")
      }
    ]
  },
  {
    id: "liturgy-word",
    title: "Liturgy of the Word",
    summary: "Scripture is proclaimed and opened for the assembly.",
    steps: [
      {
        id: "first-reading",
        title: "First Reading",
        subtitle: "First Reading",
        summary: "God speaks through the Scriptures.",
        posture: "sit",
        textBlocks: [textBlock("first-reading-reader", "reader", "The first reading is proclaimed.")],
        guidedItems: [
          guidedItem("first-reading-sit", "you_do", "Sit for the First Reading.", {
            posture: "sit"
          }),
          guidedItem("first-reading-listen", "listen", "A reading from Sacred Scripture is proclaimed.", {
            posture: "sit"
          }),
          guidedItem("first-reading-ending", "listen", "The word of the Lord.", {
            posture: "sit"
          }),
          guidedItem("first-reading-response", "you_say", "Thanks be to God.", {
            posture: "sit",
            fullPrayerKey: "response_thanks_be_to_god"
          })
        ],
        guidance: "Listen for one word or phrase.",
        listenAnchors: anchors("A reading from")
      },
      {
        id: "psalm",
        title: "Psalm",
        subtitle: "Psalm",
        summary: "The Church responds to the Word with prayer.",
        posture: "sit",
        textBlocks: [
          textBlock("psalm-cantor", "cantor", "The psalm is sung or proclaimed."),
          textBlock("psalm-you", "you", "The response becomes your prayer.", companionSource)
        ],
        guidedItems: [
          guidedItem("psalm-response-announced", "listen", "The psalm response is announced.", {
            posture: "sit"
          }),
          guidedItem("psalm-response-repeat", "you_say", "Repeat the psalm response.", {
            posture: "sit"
          }),
          guidedItem("psalm-verses", "listen", "Listen to the psalm verses.", {
            posture: "sit"
          }),
          guidedItem("psalm-response-return", "you_say", "Repeat the response when it returns.", {
            posture: "sit"
          })
        ],
        guidance: "Let the response become your own prayer.",
        listenAnchors: anchors("Responsorial Psalm", "The response is")
      },
      {
        id: "second-reading",
        title: "Second Reading",
        subtitle: "Second Reading",
        summary: "The apostolic witness strengthens the Church.",
        posture: "sit",
        optional: true,
        textBlocks: [textBlock("second-reading-reader", "reader", "The second reading is proclaimed when appointed.")],
        guidedItems: [
          guidedItem("second-reading-listen", "listen", "A second reading is proclaimed when appointed.", {
            posture: "sit"
          }),
          guidedItem("second-reading-ending", "listen", "The word of the Lord.", {
            posture: "sit"
          }),
          guidedItem("second-reading-response", "you_say", "Thanks be to God.", {
            posture: "sit",
            fullPrayerKey: "response_thanks_be_to_god"
          })
        ],
        guidance: "Receive the faith handed on.",
        listenAnchors: anchors("A reading from the letter")
      },
      {
        id: "gospel-acclamation",
        title: "Gospel Acclamation",
        subtitle: "Gospel Acclamation",
        summary: "We stand to welcome Christ in the Gospel.",
        posture: "stand",
        textBlocks: [
          textBlock("gospel-acclamation-cantor", "cantor", "The acclamation is sung or proclaimed."),
          textBlock("gospel-acclamation-you", "you", "The acclamation welcomes Christ present in the Gospel.", companionSource)
        ],
        guidedItems: [
          guidedItem("gospel-acclamation-stand", "you_do", "Stand to welcome the Gospel.", {
            posture: "stand"
          }),
          guidedItem("gospel-acclamation-alleluia", "you_say", "Alleluia.", {
            posture: "stand"
          }),
          guidedItem("gospel-acclamation-verse", "listen", "Listen to the Gospel acclamation verse.", {
            posture: "stand"
          }),
          guidedItem("gospel-acclamation-repeat", "you_say", "Alleluia.", {
            posture: "stand"
          })
        ],
        guidance: "Prepare to hear the Lord.",
        listenAnchors: anchors("Alleluia")
      },
      {
        id: "gospel",
        title: "Gospel",
        subtitle: "Gospel",
        summary: "Christ speaks to His Church.",
        posture: "stand",
        textBlocks: [
          textBlock("gospel-deacon", "deacon", "The deacon proclaims the Gospel when present."),
          textBlock("gospel-celebrant", "celebrant", "If no deacon is present, the celebrant proclaims the Gospel.")
        ],
        guidedItems: [
          guidedItem("gospel-dialogue-listen", "listen", "The Lord be with you.", {
            posture: "stand"
          }),
          guidedItem("gospel-dialogue-response", "you_say", "And with your spirit.", {
            posture: "stand",
            fullPrayerKey: "response_and_with_your_spirit"
          }),
          guidedItem("gospel-announcement-listen", "listen", "A reading from the holy Gospel according to the evangelist.", {
            posture: "stand"
          }),
          guidedItem("gospel-small-crosses", "you_do", "Make a small cross on your forehead, lips, and heart.", {
            posture: "stand",
            cadenceCue: "forehead, lips, heart"
          }),
          guidedItem("gospel-announcement-response", "you_say", "Glory to you, O Lord.", {
            posture: "stand",
            fullPrayerKey: "response_glory_to_you"
          }),
          guidedItem("gospel-proclamation", "listen", "Listen to the Gospel.", {
            posture: "stand"
          }),
          guidedItem("gospel-ending-listen", "listen", "The Gospel of the Lord.", {
            posture: "stand"
          }),
          guidedItem("gospel-ending-response", "you_say", "Praise to you, Lord Jesus Christ.", {
            posture: "stand",
            fullPrayerKey: "response_praise_to_you"
          })
        ],
        guidance: "Listen with reverence.",
        listenAnchors: anchors("The Lord be with you", "A reading from the holy Gospel")
      },
      {
        id: "homily",
        title: "Homily",
        subtitle: "Homily",
        summary: "The Word is opened for the assembly.",
        posture: "sit",
        textBlocks: [textBlock("homily-celebrant-or-deacon", "celebrant", "The homily helps the Word take root.")],
        guidedItems: [
          guidedItem("homily-sit", "you_do", "Sit for the Homily.", {
            posture: "sit"
          }),
          guidedItem("homily-listen", "listen", "Listen for one truth to carry.", {
            posture: "sit",
            durationHint: "Let the Word settle."
          })
        ],
        guidance: "Ask what the Lord wants you to carry.",
        listenAnchors: anchors("Homily")
      },
      {
        id: "profession-of-faith",
        title: "Profession of Faith",
        subtitle: "Profession of Faith",
        summary: "The Church professes the faith received from the apostles.",
        posture: "stand",
        textBlocks: [textBlock("creed-all", "all", "Nicene Creed text pending final review.")],
        guidedItems: [
          guidedItem("creed-stand", "you_do", "Stand for the Profession of Faith.", {
            posture: "stand"
          }),
          guidedItem("creed-begin", "you_say", "I believe in one God,", {
            posture: "stand",
            fullPrayerKey: "nicene_creed"
          }),
          guidedItem("creed-incarnation-bow", "you_do", "Bow at the words of the Incarnation.", {
            posture: "stand"
          }),
          guidedItem("creed-amen", "you_say", "Amen.", {
            posture: "stand",
            fullPrayerKey: "response_amen"
          })
        ],
        guidance: "You are not alone in believing.",
        listenAnchors: anchors("I believe in one God")
      },
      {
        id: "universal-prayer",
        title: "Universal Prayer",
        subtitle: "Universal Prayer",
        summary: "The Church prays for the world.",
        posture: "stand",
        textBlocks: [textBlock("universal-prayer-you", "you", "Respond to the prayers of the Church.", companionSource)],
        guidedItems: [
          guidedItem("universal-prayer-intro", "listen", "The intentions of the Church are announced.", {
            posture: "stand"
          }),
          guidedItem("universal-prayer-response", "you_say", "Lord, hear our prayer.", {
            posture: "stand",
            fullPrayerKey: "response_lord_hear_our_prayer"
          }),
          guidedItem("universal-prayer-repeat", "you_say", "Repeat the response after each intention.", {
            posture: "stand",
            fullPrayerKey: "response_lord_hear_our_prayer"
          }),
          guidedItem("universal-prayer-closing", "listen", "The celebrant concludes the prayer.", {
            posture: "stand"
          })
        ],
        guidance: "Join your needs to the Church's prayer.",
        listenAnchors: anchors("Let us pray to the Lord")
      }
    ]
  },
  {
    id: "liturgy-eucharist",
    title: "Liturgy of the Eucharist",
    summary: "The gifts are offered and Christ gives Himself sacramentally.",
    steps: [
      {
        id: "presentation",
        title: "Presentation",
        subtitle: "Presentation",
        summary: "The gifts are brought to the altar.",
        posture: "sit",
        textBlocks: [],
        guidedItems: [
          guidedItem("presentation-sit", "you_do", "Sit as the altar is prepared.", {
            posture: "sit"
          }),
          guidedItem("presentation-gifts", "ambient", "Bread and wine are brought to the altar.", {
            posture: "sit"
          }),
          guidedItem("presentation-bread-prayer", "listen", "Blessed are you, Lord God of all creation.", {
            posture: "sit"
          }),
          guidedItem("presentation-bread-response", "you_say", "Blessed be God forever.", {
            posture: "sit",
            fullPrayerKey: "response_blessed_be_god_forever"
          }),
          guidedItem("presentation-wine-prayer", "listen", "The celebrant prays over the wine.", {
            posture: "sit"
          }),
          guidedItem("presentation-wine-response", "you_say", "Blessed be God forever.", {
            posture: "sit",
            fullPrayerKey: "response_blessed_be_god_forever"
          })
        ],
        guidance: "Bread and wine are prepared for the Eucharistic sacrifice. Offer your life with the bread and wine.",
        listenAnchors: anchors("Blessed are you Lord God")
      },
      {
        id: "prayer-over-offerings",
        title: "Prayer over Offerings",
        subtitle: "Prayer over Offerings",
        summary: "The celebrant prays over the gifts.",
        posture: "stand",
        textBlocks: [textBlock("offerings-celebrant", "celebrant", "The celebrant prays over the offerings.")],
        guidedItems: [
          guidedItem("offerings-stand", "you_do", "Stand when invited.", {
            posture: "stand"
          }),
          guidedItem("offerings-invitation", "listen", "Pray, brothers and sisters, that my sacrifice and yours may be acceptable to God.", {
            posture: "stand"
          }),
          guidedItem("offerings-response", "you_say", "May the Lord accept the sacrifice at your hands.", {
            posture: "stand",
            fullPrayerKey: "response_may_the_lord_accept"
          }),
          guidedItem("offerings-prayer", "listen", "The celebrant prays the Prayer over the Offerings.", {
            posture: "stand"
          }),
          guidedItem("offerings-amen", "you_say", "Amen.", {
            posture: "stand",
            fullPrayerKey: "response_amen"
          })
        ],
        guidance: "Let your intention be placed on the altar.",
        listenAnchors: anchors("Pray brothers and sisters")
      },
      {
        id: "preface",
        title: "Preface",
        subtitle: "Eucharistic Prayer",
        summary: "The Church lifts up her heart in thanksgiving.",
        posture: "stand",
        textBlocks: [textBlock("preface-celebrant", "celebrant", "The celebrant begins the Eucharistic Prayer.")],
        guidedItems: [
          guidedItem("preface-lord-listen", "listen", "The Lord be with you.", {
            posture: "stand"
          }),
          guidedItem("preface-lord-response", "you_say", "And with your spirit.", {
            posture: "stand",
            fullPrayerKey: "response_and_with_your_spirit"
          }),
          guidedItem("preface-hearts-listen", "listen", "Lift up your hearts.", {
            posture: "stand"
          }),
          guidedItem("preface-hearts-response", "you_say", "We lift them up to the Lord.", {
            posture: "stand",
            fullPrayerKey: "response_we_lift_them_up"
          }),
          guidedItem("preface-thanks-listen", "listen", "Let us give thanks to the Lord our God.", {
            posture: "stand"
          }),
          guidedItem("preface-thanks-response", "you_say", "It is right and just.", {
            posture: "stand",
            fullPrayerKey: "response_right_and_just"
          }),
          guidedItem("preface-prayer", "listen", "Listen as the celebrant gives thanks.", {
            posture: "stand"
          })
        ],
        guidance: "Give thanks with the whole Church.",
        listenAnchors: anchors("Lift up your hearts", "Let us give thanks")
      },
      {
        id: "holy",
        title: "Holy",
        subtitle: "Eucharistic Prayer",
        summary: "Heaven and earth praise the Lord.",
        posture: "stand",
        textBlocks: [
          textBlock("holy-all", "all", "Holy, Holy, Holy Lord God of hosts.\nHeaven and earth are full of your glory.\nHosanna in the highest.\nBlessed is he who comes in the name of the Lord.\nHosanna in the highest.")
        ],
        guidedItems: [
          guidedItem("holy-you-say", "you_say", "Holy, Holy, Holy Lord God of hosts.", {
            posture: "stand",
            fullPrayerKey: "holy"
          }),
          guidedItem("holy-kneel-transition", "you_do", "Kneel after the Holy where customary.", {
            posture: "kneel"
          })
        ],
        guidance: "Join the worship of heaven.",
        listenAnchors: anchors("Holy Holy Holy")
      },
      {
        id: "consecration",
        title: "Consecration",
        subtitle: "Eucharistic Prayer",
        summary: "Christ becomes present sacramentally.",
        posture: "kneel",
        textBlocks: [],
        guidedItems: [
          guidedItem("consecration-kneel", "you_do", "Kneel in adoration.", {
            posture: "kneel"
          }),
          guidedItem("consecration-epiclesis", "listen", "The celebrant asks the Father to sanctify the gifts.", {
            posture: "kneel"
          }),
          guidedItem("consecration-body", "listen", "This is my Body.", {
            posture: "kneel"
          }),
          guidedItem("consecration-host-elevation", "ambient", "Adore Christ present under the appearance of bread.", {
            posture: "kneel",
            durationHint: "Look with faith."
          }),
          guidedItem("consecration-chalice", "listen", "This is the chalice of my Blood.", {
            posture: "kneel"
          }),
          guidedItem("consecration-chalice-elevation", "ambient", "Adore Christ present under the appearance of wine.", {
            posture: "kneel",
            durationHint: "Remain in prayer."
          })
        ],
        guidance: "Adore Christ present in the Eucharist. Adore quietly.",
        listenAnchors: anchors("This is my Body", "This is the chalice")
      },
      {
        id: "mystery-of-faith",
        title: "Mystery of Faith",
        subtitle: "Eucharistic Prayer",
        summary: "The Church proclaims the saving mystery.",
        posture: "kneel",
        textBlocks: [textBlock("mystery-you", "you", "We proclaim your Death, O Lord,\nand profess your Resurrection\nuntil you come again.")],
        guidedItems: [
          guidedItem("mystery-listen", "listen", "The mystery of faith.", {
            posture: "kneel"
          }),
          guidedItem("mystery-response", "you_say", "We proclaim your Death, O Lord.", {
            posture: "kneel",
            fullPrayerKey: "mystery_of_faith"
          })
        ],
        guidance: "Proclaim Christ's death and resurrection.",
        listenAnchors: anchors("The mystery of faith")
      },
      {
        id: "doxology",
        title: "Doxology",
        subtitle: "Eucharistic Prayer",
        summary: "All glory is offered to the Father through Christ.",
        posture: "kneel",
        textBlocks: [textBlock("doxology-you", "you", "Amen.")],
        guidedItems: [
          guidedItem("doxology-listen", "listen", "Through him, and with him, and in him.", {
            posture: "kneel"
          }),
          guidedItem("doxology-amen", "you_say", "Amen.", {
            posture: "kneel",
            fullPrayerKey: "response_great_amen"
          })
        ],
        guidance: "Answer Amen with faith.",
        listenAnchors: anchors("Through him and with him and in him")
      },
      {
        id: "lords-prayer",
        title: "Lord's Prayer",
        subtitle: "Lord's Prayer",
        summary: "The children of God pray as Jesus taught.",
        posture: "stand",
        textBlocks: [
          textBlock("lords-prayer-all", "all", "Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come;\nthy will be done\non earth as it is in heaven.\n\nGive us this day our daily bread,\nand forgive us our trespasses,\nas we forgive those who trespass against us;\nand lead us not into temptation,\nbut deliver us from evil.")
        ],
        guidedItems: [
          guidedItem("lords-prayer-stand", "you_do", "Stand for the Lord's Prayer.", {
            posture: "stand"
          }),
          guidedItem("lords-prayer-invitation", "listen", "At the Savior's command, the celebrant invites the prayer.", {
            posture: "stand"
          }),
          guidedItem("lords-prayer-all", "you_say", "Our Father, who art in heaven,", {
            posture: "stand",
            fullPrayerKey: "lords_prayer"
          }),
          guidedItem("lords-prayer-embolism", "listen", "Deliver us, Lord, we pray, from every evil.", {
            posture: "stand"
          }),
          guidedItem("lords-prayer-kingdom", "you_say", "For the kingdom, the power and the glory are yours.", {
            posture: "stand",
            fullPrayerKey: "response_for_the_kingdom"
          })
        ],
        guidance: "Pray as a son or daughter.",
        listenAnchors: anchors("Our Father")
      },
      {
        id: "sign-of-peace",
        title: "Sign of Peace",
        subtitle: "Sign of Peace",
        summary: "The peace of Christ prepares us for Communion.",
        posture: "stand",
        textBlocks: [textBlock("peace-you", "you", "Receive and offer peace reverently.", companionSource)],
        guidedItems: [
          guidedItem("peace-prayer", "listen", "The celebrant prays for peace and unity.", {
            posture: "stand"
          }),
          guidedItem("peace-amen", "you_say", "Amen.", {
            posture: "stand",
            fullPrayerKey: "response_amen"
          }),
          guidedItem("peace-dialogue-listen", "listen", "The peace of the Lord be with you always.", {
            posture: "stand"
          }),
          guidedItem("peace-dialogue-response", "you_say", "And with your spirit.", {
            posture: "stand",
            fullPrayerKey: "response_and_with_your_spirit"
          }),
          guidedItem("peace-offer", "you_do", "Offer a reverent sign of peace if invited.", {
            posture: "stand"
          })
        ],
        guidance: "Receive and offer peace reverently.",
        listenAnchors: anchors("Let us offer each other the sign of peace")
      },
      {
        id: "lamb-of-god",
        title: "Lamb of God",
        subtitle: "Lamb of God",
        summary: "We behold the Lamb who takes away sin.",
        posture: "stand_or_kneel",
        textBlocks: [
          textBlock("lamb-of-god-all", "all", "Lamb of God, you take away the sins of the world,\nhave mercy on us.\n\nLamb of God, you take away the sins of the world,\nhave mercy on us.\n\nLamb of God, you take away the sins of the world,\ngrant us peace.")
        ],
        guidedItems: [
          guidedItem("lamb-fraction", "ambient", "The Bread is broken for Communion.", {
            posture: "stand_or_kneel"
          }),
          guidedItem("lamb-first", "you_say", "Lamb of God, you take away the sins of the world, have mercy on us.", {
            posture: "stand_or_kneel",
            fullPrayerKey: "lamb_of_god"
          }),
          guidedItem("lamb-second", "you_say", "Lamb of God, you take away the sins of the world, have mercy on us.", {
            posture: "stand_or_kneel",
            fullPrayerKey: "lamb_of_god"
          }),
          guidedItem("lamb-final", "you_say", "Lamb of God, you take away the sins of the world, grant us peace.", {
            posture: "stand_or_kneel",
            fullPrayerKey: "lamb_of_god"
          })
        ],
        guidance: "Ask for mercy.",
        listenAnchors: anchors("Lamb of God")
      },
      {
        id: "communion",
        title: "Communion",
        subtitle: "Communion",
        summary: "The Lord gives Himself to His Church.",
        posture: "process",
        textBlocks: [
          textBlock("communion-you", "you", "Amen.")
        ],
        guidedItems: [
          guidedItem("communion-invitation", "listen", "Behold the Lamb of God.", {
            posture: "stand_or_kneel"
          }),
          guidedItem("communion-worthy-response", "you_say", "Lord, I am not worthy that you should enter under my roof.", {
            posture: "stand_or_kneel",
            fullPrayerKey: "response_lord_not_worthy"
          }),
          guidedItem("communion-process", "you_do", "Join the Communion procession reverently.", {
            posture: "process"
          }),
          guidedItem("communion-minister", "listen", "The Body of Christ.", {
            posture: "process"
          }),
          guidedItem("communion-amen", "you_say", "Amen.", {
            posture: "process",
            fullPrayerKey: "response_amen"
          }),
          guidedItem("communion-thanksgiving", "ambient", "Return to your place and pray quietly.", {
            posture: "sit",
            durationHint: "Give thanks after Communion."
          })
        ],
        guidance: "Communion antiphon varies by day. Receive with reverence and love.",
        listenAnchors: anchors("Behold the Lamb of God", "The Body of Christ")
      },
      {
        id: "prayer-after-communion",
        title: "Prayer after Communion",
        subtitle: "Prayer after Communion",
        summary: "The Church gives thanks for what she has received.",
        posture: "stand",
        textBlocks: [textBlock("post-communion-celebrant", "celebrant", "The celebrant prays after Communion.")],
        guidedItems: [
          guidedItem("post-communion-stand", "you_do", "Stand when the celebrant says, Let us pray.", {
            posture: "stand"
          }),
          guidedItem("post-communion-prayer", "listen", "The celebrant prays the Prayer after Communion.", {
            posture: "stand"
          }),
          guidedItem("post-communion-amen", "you_say", "Amen.", {
            posture: "stand",
            fullPrayerKey: "response_amen"
          })
        ],
        guidance: "Let gratitude become silence.",
        listenAnchors: anchors("Let us pray")
      }
    ]
  },
  {
    id: "concluding-rites",
    title: "Concluding Rites",
    summary: "The Church is blessed and sent to live what was received.",
    steps: [
      {
        id: "announcements",
        title: "Announcements",
        subtitle: "Announcements",
        summary: "The community shares what is needed for its life together.",
        posture: "sit_or_stand",
        optional: true,
        textBlocks: [],
        guidedItems: [
          guidedItem("announcements-listen", "listen", "Announcements may be given if needed.", {
            posture: "sit_or_stand"
          })
        ],
        guidance: "Stay recollected if announcements occur.",
        listenAnchors: anchors("Please be seated for announcements")
      },
      {
        id: "blessing",
        title: "Blessing",
        subtitle: "Blessing",
        summary: "The celebrant blesses the assembly.",
        posture: "stand",
        textBlocks: [textBlock("blessing-celebrant", "celebrant", "The celebrant blesses the assembly.")],
        guidedItems: [
          guidedItem("blessing-stand", "you_do", "Stand for the blessing.", {
            posture: "stand"
          }),
          guidedItem("blessing-dialogue-listen", "listen", "The Lord be with you.", {
            posture: "stand"
          }),
          guidedItem("blessing-dialogue-response", "you_say", "And with your spirit.", {
            posture: "stand",
            fullPrayerKey: "response_and_with_your_spirit"
          }),
          guidedItem("blessing-cross", "you_do", "Make the Sign of the Cross as the blessing is given.", {
            posture: "stand"
          }),
          guidedItem("blessing-amen", "you_say", "Amen.", {
            posture: "stand",
            fullPrayerKey: "response_amen"
          })
        ],
        guidance: "Receive the Lord's blessing.",
        listenAnchors: anchors("May almighty God bless you")
      },
      {
        id: "dismissal",
        title: "Dismissal",
        subtitle: "Dismissal",
        summary: "The Mass sends you to live what you received.",
        posture: "stand",
        textBlocks: [textBlock("dismissal-deacon-or-celebrant", "deacon", "Go in peace.", companionSource)],
        guidedItems: [
          guidedItem("dismissal-listen", "listen", "Go in peace.", {
            posture: "stand"
          }),
          guidedItem("dismissal-response", "you_say", "Thanks be to God.", {
            posture: "stand",
            fullPrayerKey: "response_thanks_be_to_god"
          })
        ],
        guidance: "Go in peace. Carry Sunday into the week.",
        listenAnchors: anchors("Go forth the Mass is ended", "Go in peace")
      }
    ]
  }
];

export const massFlowSections: MassFlowSection[] = sectionInputs.map((section) => ({
  id: section.id,
  title: section.title,
  summary: section.summary,
  source: reviewSource,
  steps: section.steps.map((step) => ({
    ...step,
    sectionId: section.id,
    sectionTitle: section.title,
    source: step.source ?? reviewSource,
    listenAnchors: step.listenAnchors ?? []
  }))
}));

export const massFlowSteps: MassFlowStep[] = massFlowSections.flatMap((section) => section.steps);

export function getMassFlowStep(id?: string) {
  return massFlowSteps.find((step) => step.id === id);
}

export function labelPosture(posture?: MassPosture) {
  switch (posture) {
    case "stand":
      return "Stand";
    case "sit":
      return "Sit";
    case "kneel":
      return "Kneel";
    case "stand_or_kneel":
      return "Stand or kneel";
    case "sit_or_stand":
      return "Sit or stand";
    case "process":
      return "Process reverently";
    default:
      return undefined;
  }
}
