import type { MassSection } from "../types";

// TODO licensing: verify exact liturgical text permissions before production.
// Where rights are uncertain, these MVP entries use review copy or brief public-domain/common devotional wording.
const sharedContentRights = {
  sourceProvider: "mock",
  textStatus: "placeholder-license-pending",
  licensingNote: "MVP local review/paraphrase copy. Verify permission for exact liturgical text before production release."
} as const;

export const prayersAndResponses: MassSection[] = [
  {
    ...sharedContentRights,
    id: "beginning",
    jumpLabel: "Beginning",
    title: "Beginning",
    category: "beginning",
    main: "The Church gathers and turns toward the Lord.",
    detail: "We acknowledge God, ask mercy, and prepare to hear His word.",
    whatIsHappening: "The celebrant greets the assembly and the assembly prepares for worship.",
    responseText: "We ask the Lord for mercy.",
    quietText: "Lord, have mercy.",
    postureCue: "Stand.",
    shortMeaning: "We come honestly before God and ask for mercy.",
    nextSectionIds: ["kyrie-gloria"]
  },
  {
    ...sharedContentRights,
    id: "kyrie-gloria",
    jumpLabel: "Kyrie / Gloria",
    title: "Kyrie and Gloria",
    category: "beginning",
    main: "The Church cries for mercy and gives glory to God.",
    detail: "The Kyrie is simple; the Gloria is praise.",
    whatIsHappening: "The assembly asks mercy and, when appointed, sings the Gloria.",
    responseText: "Kyrie eleison. Christe eleison. Kyrie eleison. The Gloria is sung or said when appointed.",
    quietText: "Have mercy on us, Lord.",
    postureCue: "Stand.",
    shortMeaning: "Mercy opens the heart to praise.",
    nextSectionIds: ["readings"]
  },
  {
    ...sharedContentRights,
    id: "readings",
    jumpLabel: "Readings",
    title: "Readings",
    category: "readings",
    main: "God speaks to His assembly.",
    detail: "Listen with the heart of the Church.",
    whatIsHappening: "The readings are proclaimed and the assembly responds.",
    responseText: "The psalm response and Gospel acclamation become your prayer.",
    quietText: "Speak, Lord. Your servant is listening.",
    postureCue: "Sit for readings. Stand for the Gospel.",
    shortMeaning: "The Word of God prepares the Church to receive Christ.",
    source: {
      label: "General Instruction of the Roman Missal",
      citation: "Liturgy of the Word",
      licensingNote: "Reference metadata only; verify exact citation before production."
    },
    nextSectionIds: ["homily"]
  },
  {
    ...sharedContentRights,
    id: "homily",
    jumpLabel: "Homily",
    title: "Homily",
    category: "homily",
    main: "The Word is opened for the assembly.",
    detail: "Listen for one truth to carry.",
    whatIsHappening: "The celebrant or deacon preaches on the readings and the mystery being celebrated.",
    quietText: "Lord, show me what You want me to receive.",
    postureCue: "Sit.",
    shortMeaning: "The homily helps the Word take root in ordinary life.",
    nextSectionIds: ["creed"]
  },
  {
    ...sharedContentRights,
    id: "creed",
    jumpLabel: "Creed",
    title: "Creed",
    category: "creed",
    main: "The Church professes the faith.",
    detail: "We answer God's Word with the faith handed down to us.",
    whatIsHappening: "The assembly professes the Nicene Creed on Sundays and solemnities.",
    responseText: "Nicene Creed text pending final review.",
    quietText: "I believe, Lord. Help my unbelief.",
    postureCue: "Stand.",
    shortMeaning: "We do not invent the faith; we receive and profess it.",
    nextSectionIds: ["offertory"]
  },
  {
    ...sharedContentRights,
    id: "offertory",
    jumpLabel: "Offertory",
    title: "Offertory",
    category: "offertory",
    main: "With these gifts, we offer ourselves with Christ.",
    detail: "We unite our offering to the sacrifice of Jesus on the cross.",
    whatIsHappening: "Bread and wine are brought to the altar. They will become the Body and Blood of Christ.",
    quietText: "Receive my life with these gifts.",
    postureCue: "Sit, then stand when invited.",
    shortMeaning: "Our gifts are joined to Christ's self-offering.",
    source: {
      label: "General Instruction of the Roman Missal",
      citation: "GIRM 73",
      url: "https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_en.html"
    },
    nextSectionIds: ["eucharistic-prayer"]
  },
  {
    ...sharedContentRights,
    id: "eucharistic-prayer",
    jumpLabel: "Eucharistic Prayer",
    title: "Eucharistic Prayer",
    category: "eucharisticPrayer",
    main: "The Church offers praise and thanksgiving.",
    detail: "We are drawn into Christ's offering to the Father.",
    whatIsHappening: "The celebrant prays the great prayer of thanksgiving and consecration.",
    responseText: "Holy, Holy, Holy Lord God of hosts.\nHeaven and earth are full of your glory.\nHosanna in the highest.\nBlessed is he who comes in the name of the Lord.\nHosanna in the highest.\n\nWe proclaim your Death, O Lord,\nand profess your Resurrection\nuntil you come again.",
    quietText: "My Lord and my God.",
    postureCue: "Kneel where customary.",
    shortMeaning: "Christ's sacrifice is made sacramentally present.",
    nextSectionIds: ["communion"]
  },
  {
    ...sharedContentRights,
    id: "communion",
    jumpLabel: "Communion",
    title: "Communion",
    category: "communion",
    main: "The Lord gives Himself to His Church.",
    detail: "Receive with reverence, gratitude, and faith.",
    whatIsHappening: "The Church prays the Our Father, exchanges peace, and receives Holy Communion.",
    responseText: "Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come;\nthy will be done\non earth as it is in heaven.\n\nGive us this day our daily bread,\nand forgive us our trespasses,\nas we forgive those who trespass against us;\nand lead us not into temptation,\nbut deliver us from evil.\n\nLamb of God, you take away the sins of the world,\nhave mercy on us.\n\nLamb of God, you take away the sins of the world,\nhave mercy on us.\n\nLamb of God, you take away the sins of the world,\ngrant us peace.\n\nCommunion response: Amen.",
    quietText: "Lord Jesus, come to me.",
    postureCue: "Stand, kneel, or process according to local custom.",
    shortMeaning: "Communion is gift before it is action.",
    nextSectionIds: ["ending"]
  },
  {
    ...sharedContentRights,
    id: "ending",
    jumpLabel: "Ending",
    title: "Ending",
    category: "ending",
    main: "We are sent to live what we have received.",
    detail: "The Mass bears fruit in charity.",
    whatIsHappening: "The celebrant blesses and dismisses the assembly.",
    quietText: "Let Sunday become charity this week.",
    postureCue: "Stand.",
    shortMeaning: "The dismissal sends the Church into the world.",
    nextSectionIds: ["beginning"]
  }
];
