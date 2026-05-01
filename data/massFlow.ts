import type { ListenAnchor, MassFlowSection, MassFlowStep, MassPosture, MassSourceMetadata, MassTextBlock } from "../types";

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
        title: "Entrance",
        subtitle: "Entrance",
        summary: "The Church gathers as one body.",
        posture: "stand",
        optional: true,
        textBlocks: [],
        guidance: "Entrance chant or antiphon begins the Mass. Some parishes sing a hymn instead.",
        listenAnchors: anchors("In the name of the Father", "Entrance chant")
      },
      {
        id: "greeting",
        title: "Greeting",
        subtitle: "Greeting",
        summary: "The celebrant greets the assembly in the name of the Lord.",
        posture: "stand",
        textBlocks: [textBlock("greeting-celebrant", "celebrant", "The celebrant greets the assembly.")],
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
        guidance: "Ask for mercy.",
        listenAnchors: anchors("Lamb of God")
      },
      {
        id: "communion",
        title: "Communion",
        subtitle: "Communion",
        summary: "The Lord gives Himself to His Church.",
        posture: "process",
        optional: true,
        textBlocks: [
          textBlock("communion-you", "you", "Amen.")
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
