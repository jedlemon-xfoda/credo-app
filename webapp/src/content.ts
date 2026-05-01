export { answers, comparisonPassages, findAnswer, intentions, prayers, sourceCollections, topics, tradQuestions };
export type { Answer, ComparisonPassage, Prayer, SourceCollection, Topic, TradQuestion };

type Citation = {
  type: string;
  title: string;
  note: string;
  authorityTier: 1 | 2 | 3;
};

type Answer = {
  key: string;
  match: string[];
  question: string;
  sourceType: string;
  title: string;
  answer: string;
  citations: Citation[];
  followUps: string[];
};

type Topic = {
  title: string;
  label: string;
  body: string;
  category: string;
};

type SourceCollection = {
  title: string;
  category: string;
  body: string;
  source: string;
  depth: "Core" | "Deep" | "Reference";
};

type ComparisonPassage = {
  reference: string;
  douay: string;
  modern: string;
  note: string;
  sources: string[];
};

type TradQuestion = {
  title: string;
  stance: string;
  body: string;
  sources: string[];
};

type Prayer = {
  title: string;
  category: string;
  body: string;
  text?: string;
  sourceNote?: string;
};

const answers: Answer[] = [
  {
    key: "confession",
    match: ["confess", "confession", "priest", "penance", "reconciliation"],
    question: "Why do Catholics confess sins to a priest?",
    sourceType: "Official teaching",
    title: "Confession is rooted in Christ giving the apostles authority to forgive sins.",
    answer:
      "Catholics confess to a priest because Christ entrusted the ministry of reconciliation to the apostles and their successors. The priest acts as a minister of Christ and the Church, and the sacrament includes contrition, confession, absolution, and satisfaction.",
    citations: tiered("John 20:21-23", "CCC 1422-1498", "New Advent: Penance"),
    followUps: ["What makes a confession valid?", "What is mortal sin?", "How often should Catholics confess?"]
  },
  {
    key: "purgatory",
    match: ["purgatory", "purification", "dead", "after death"],
    question: "What does the Church teach about purgatory?",
    sourceType: "Official teaching",
    title: "Purgatory is the final purification of those who die in God's grace.",
    answer:
      "The Church teaches that those who die in God's grace and friendship, but still need purification, undergo final purification before entering the joy of heaven. This is distinct from the punishment of the damned.",
    citations: tiered("CCC 1030-1032", "2 Maccabees 12:45", "St. Gregory the Great"),
    followUps: ["Why pray for the dead?", "Is purgatory in Scripture?", "What are indulgences?"]
  },
  {
    key: "eucharist",
    match: ["eucharist", "communion", "real presence", "mass", "host"],
    question: "What is the Eucharist?",
    sourceType: "Official teaching",
    title: "The Eucharist is the source and summit of the Christian life.",
    answer:
      "The Eucharist is the sacrament in which Christ is truly, really, and substantially present under the appearances of bread and wine. It is the memorial of Christ's sacrifice and the center of Catholic worship.",
    citations: tiered("CCC 1322-1419", "John 6; Luke 22; 1 Corinthians 11", "Lumen Gentium 11"),
    followUps: ["What is transubstantiation?", "Who may receive Communion?", "Why is Mass a sacrifice?"]
  },
  {
    key: "mary",
    match: ["mary", "marian", "mother of god", "theotokos"],
    question: "Why do Catholics call Mary the Mother of God?",
    sourceType: "Official teaching",
    title: "Mary is Mother of God because Jesus Christ is one divine Person.",
    answer:
      "Catholics call Mary Mother of God because the child she bore is truly God the Son incarnate. The title protects the truth about Christ: Jesus is one divine Person with a true human nature.",
    citations: tiered("Council of Ephesus", "CCC 495", "New Advent: Theotokos"),
    followUps: ["Do Catholics worship Mary?", "What is the Immaculate Conception?", "Why pray the Hail Mary?"]
  },
  {
    key: "saints",
    match: ["saints", "intercession", "pray to saints", "saint"],
    question: "Why do Catholics ask saints to pray for them?",
    sourceType: "Official teaching",
    title: "The saints are alive in Christ and remain united to the Church.",
    answer:
      "Catholics ask the saints for intercession because the faithful are united in the Body of Christ. Asking a saint to pray is not worship; worship belongs to God alone.",
    citations: tiered("Revelation 5:8", "CCC 956", "New Advent: Invocation of Saints"),
    followUps: ["Is this different from worship?", "Why have patron saints?", "What are relics?"]
  },
  {
    key: "scripture-tradition",
    match: ["scripture", "tradition", "bible alone", "sola scriptura"],
    question: "Why do Catholics speak of Scripture and Tradition?",
    sourceType: "Official teaching",
    title: "Scripture and Tradition form one sacred deposit of the Word of God.",
    answer:
      "The Church teaches that Sacred Scripture and Sacred Tradition are closely connected and flow from the same divine source. The Magisterium serves the Word of God by authentically interpreting it.",
    citations: tiered("Dei Verbum 9-10", "2 Thessalonians 2:15", "CCC 80-83"),
    followUps: ["What is the Magisterium?", "Who decided the Bible canon?", "What is apostolic succession?"]
  },
  {
    key: "pope",
    match: ["pope", "papacy", "peter", "infallibility"],
    question: "What does the Church teach about the pope?",
    sourceType: "Official teaching",
    title: "The pope is the successor of Peter and visible principle of unity.",
    answer:
      "Catholics believe Christ gave Peter a unique pastoral office, and the bishop of Rome succeeds to that office. Papal infallibility is limited and does not mean every papal statement is infallible.",
    citations: tiered("Matthew 16:18-19", "CCC 880-882", "Pastor Aeternus"),
    followUps: ["What is papal infallibility?", "What is apostolic succession?", "Can popes make mistakes?"]
  },
  {
    key: "mortal-sin",
    match: ["mortal sin", "venial", "grave sin"],
    question: "What is the difference between mortal and venial sin?",
    sourceType: "Official teaching",
    title: "Mortal sin destroys charity; venial sin wounds charity.",
    answer:
      "Mortal sin requires grave matter, full knowledge, and deliberate consent. Venial sin weakens charity but does not break covenant with God in the same way.",
    citations: tiered("CCC 1854-1864", "1 John 5:16-17", "New Advent: Sin"),
    followUps: ["What counts as grave matter?", "How should I examine conscience?", "When should I go to confession?"]
  },
  {
    key: "rosary",
    match: ["rosary", "mysteries", "hail mary"],
    question: "What is the Rosary?",
    sourceType: "Devotional practice",
    title: "The Rosary is a Christ-centered Marian prayer.",
    answer:
      "The Rosary meditates on the mysteries of Christ's life with Mary. Its repeated prayers create a rhythm of contemplation rather than empty repetition.",
    citations: tiered("Luke 1:28", "Rosarium Virginis Mariae", "CCC 971"),
    followUps: ["What mysteries are prayed today?", "Why repeat Hail Marys?", "How do I start a Rosary habit?"]
  },
  {
    key: "divine-mercy",
    match: ["divine mercy", "chaplet", "mercy"],
    question: "What is the Divine Mercy Chaplet?",
    sourceType: "Devotional practice",
    title: "The Divine Mercy Chaplet is a prayer of trust in Christ's mercy.",
    answer:
      "The chaplet asks the Father to have mercy on the world through the Passion of Christ. It is closely associated with St. Faustina and the devotion to Divine Mercy.",
    citations: tiered("Psalm 51", "St. Faustina", "Divine Mercy devotion"),
    followUps: ["How do I pray the chaplet?", "What is Divine Mercy Sunday?", "Who was St. Faustina?"]
  },
  {
    key: "mass",
    match: ["mass", "liturgy", "sacrifice"],
    question: "Why do Catholics call the Mass a sacrifice?",
    sourceType: "Official teaching",
    title: "The Mass makes present the one sacrifice of Christ.",
    answer:
      "The Mass is not a new sacrifice but the sacramental making-present of Christ's one sacrifice on Calvary. It is also a sacred banquet in which the faithful receive Christ.",
    citations: tiered("CCC 1362-1372", "Luke 22:19-20", "Council of Trent"),
    followUps: ["Why attend Mass every Sunday?", "What is the liturgy?", "What is the Eucharistic prayer?"]
  },
  {
    key: "baptism",
    match: ["baptism", "baptize", "infant baptism"],
    question: "What does Baptism do?",
    sourceType: "Official teaching",
    title: "Baptism forgives sin and makes the baptized a child of God.",
    answer:
      "Baptism is the first sacrament of initiation. It forgives sins, gives new birth in Christ, and incorporates the baptized into the Church.",
    citations: tiered("Matthew 28:19", "CCC 1213-1284", "Acts 2:38"),
    followUps: ["Why baptize infants?", "Can baptism be repeated?", "What is baptism by desire?"]
  },
  {
    key: "confirmation",
    match: ["confirmation", "holy spirit", "confirmed"],
    question: "What is Confirmation?",
    sourceType: "Official teaching",
    title: "Confirmation strengthens baptismal grace by the gift of the Holy Spirit.",
    answer:
      "Confirmation completes baptismal grace and gives a special strength of the Holy Spirit to witness to Christ and live the faith more fully.",
    citations: tiered("Acts 8:14-17", "CCC 1285-1321", "Lumen Gentium 11"),
    followUps: ["Why does a bishop usually confirm?", "What are the gifts of the Holy Spirit?", "Is Confirmation required?"]
  },
  {
    key: "marriage",
    match: ["marriage", "matrimony", "annulment"],
    question: "What is Catholic marriage?",
    sourceType: "Official teaching",
    title: "Marriage is a covenant ordered to the good of spouses and children.",
    answer:
      "Catholic marriage is a lifelong covenant between one man and one woman, ordered toward the good of the spouses and the procreation and education of children.",
    citations: tiered("Genesis 2:24", "CCC 1601-1666", "Gaudium et Spes 48"),
    followUps: ["What is an annulment?", "Why is marriage indissoluble?", "What makes a marriage sacramental?"]
  },
  {
    key: "fasting",
    match: ["fasting", "abstinence", "lent", "friday"],
    question: "Why do Catholics fast and abstain?",
    sourceType: "Discipline and devotion",
    title: "Fasting joins bodily discipline to repentance and prayer.",
    answer:
      "Catholics fast and abstain as acts of penance, self-mastery, and solidarity with Christ's sacrifice. Specific rules are disciplinary and can vary by place and circumstance.",
    citations: tiered("Matthew 6:16-18", "CCC 1434", "Code of Canon Law 1249-1253"),
    followUps: ["What are the Lenten rules?", "Why abstain from meat?", "What if I have a medical issue?"]
  },
  {
    key: "communion-tongue",
    match: ["tongue", "communion rail", "altar rail", "kneel", "kneeling", "receive communion", "hand"],
    question: "Why do traditional Catholics receive Communion kneeling and on the tongue?",
    sourceType: "Liturgy and discipline",
    title: "Kneeling and receiving on the tongue express Eucharistic reverence and have deep Latin tradition.",
    answer:
      "Traditional Catholics emphasize kneeling and reception on the tongue because the Eucharist is Christ himself, and bodily reverence teaches doctrine. The Church permits reception on the tongue, recognizes its long tradition, and older liturgical practice developed communion rails and cloths to protect the sacred species.",
    citations: tiered("Memoriale Domini", "GIRM 160", "New Advent: Altar Rail / Communion Bench"),
    followUps: ["Can a bishop forbid Communion on the tongue?", "What is a communion rail?", "How should I receive at the Latin Mass?"]
  },
  {
    key: "latin-mass",
    match: ["latin mass", "tlm", "tridentine", "extraordinary form", "1962", "missal"],
    question: "How do I learn the Traditional Latin Mass?",
    sourceType: "Traditional liturgy",
    title: "The Latin Mass is learned by repeated participation, missal structure, and reverent attention.",
    answer:
      "A newcomer should first learn the stable structure: prayers at the foot of the altar, Kyrie, Gloria, Collect, readings, Offertory, Canon, Communion, and Last Gospel. The app should teach the Ordo, Latin responses, gestures, and the theological meaning of ad orientem worship without turning the Mass into a performance to decode.",
    citations: tiered("1962 Roman Missal", "Quo Primum / Missale Romanum tradition", "New Advent: Mass / Altar"),
    followUps: ["What should I do at my first TLM?", "Why ad orientem?", "What are the priest's silent prayers?"]
  },
  {
    key: "douay-comparison",
    match: ["douay", "rheims", "vulgate", "consummated", "finished", "translation comparison", "john 19:30"],
    question: "Why compare Douay-Rheims with modern Catholic translations?",
    sourceType: "Scripture study",
    title: "Side-by-side comparison shows theological texture that can be flattened in modern phrasing.",
    answer:
      "A traditional Catholic study tool can compare Douay-Rheims, Vulgate, and modern Catholic translations to reveal how word choices affect meditation and doctrine. John 19:30 is a strong example: 'It is consummated' carries sacrificial and nuptial completion, while 'It is finished' is simpler modern English.",
    citations: tiered("John 19:30 Douay-Rheims", "John 19:30 NABRE", "Clementine Vulgate: consummatum est"),
    followUps: ["Show me John 19:30 side by side", "What is the Vulgate?", "Why did Catholics use the Douay-Rheims?"]
  },
  {
    key: "general",
    match: [],
    question: "I need stronger Catholic sources for this question.",
    sourceType: "Source check",
    title: "This question needs stronger reviewed sources before the app answers definitively.",
    answer:
      "The app should not pretend to answer Catholic doctrine when reviewed source chunks are missing. Add Vatican, Catechism, Scripture, or reviewed Catholic reference material first.",
    citations: [],
    followUps: ["Try asking about the Eucharist", "Try asking about Confession", "Try asking about Purgatory"]
  }
];

const topics: Topic[] = [
  { title: "The Eucharist", label: "Topic Path", category: "Sacraments", body: "Catechism, Scripture, councils, Aquinas, saints, and devotional practice." },
  { title: "Confession", label: "Sacrament", category: "Sacraments", body: "Christ's authority, repentance, absolution, and pastoral care." },
  { title: "Baptism", label: "Sacrament", category: "Sacraments", body: "New birth, forgiveness of sins, and incorporation into the Church." },
  { title: "Mary and the Saints", label: "Doctrine", category: "Doctrine", body: "Intercession, devotion, scriptural roots, and common objections." },
  { title: "Scripture and Tradition", label: "Doctrine", category: "Doctrine", body: "The one sacred deposit of the Word of God." },
  { title: "The Papacy", label: "Church", category: "Church", body: "Peter, apostolic succession, unity, and papal infallibility." },
  { title: "Purgatory", label: "Doctrine", category: "Doctrine", body: "Final purification, prayer for the dead, and Catholic hope." },
  { title: "The Mass", label: "Liturgy", category: "Liturgy", body: "Sacrifice, banquet, readings, Eucharistic prayer, and participation." },
  { title: "Catholic Moral Life", label: "Moral Theology", category: "Morals", body: "Conscience, virtue, sin, grace, and conversion." },
  { title: "Prayer Life", label: "Devotion", category: "Prayer", body: "Daily prayer, meditation, Rosary, chaplets, and novenas." }
];

const sourceCollections: SourceCollection[] = [
  { title: "Douay-Rheims + Clementine Vulgate", category: "Scripture", depth: "Core", source: "Douay-Rheims / Vulgate tradition", body: "Parallel Catholic Bible study with Latin and English, notes on translation choices, and theological word study." },
  { title: "Baltimore Catechism I-III", category: "Catechism", depth: "Core", source: "Baltimore Catechism", body: "Memorizable question-and-answer doctrine for families, converts, homeschoolers, and parish formation." },
  { title: "Roman Catechism", category: "Catechism", depth: "Deep", source: "Catechism of the Council of Trent", body: "Tridentine catechesis organized around Creed, Sacraments, Commandments, and Prayer." },
  { title: "Traditional Latin Mass Ordo", category: "Liturgy", depth: "Core", source: "1962 Roman Missal", body: "Step-by-step Mass formation with Latin responses, gestures, Canon notes, and first-time visitor guidance." },
  { title: "The Church Fathers", category: "Patristics", depth: "Deep", source: "New Advent Fathers", body: "Apostolic and patristic witnesses for doctrine, Scripture, sacraments, and moral life." },
  { title: "Summa and Catena Aurea", category: "Scholastic", depth: "Deep", source: "St. Thomas Aquinas / New Advent", body: "Aquinas for doctrine and Catena Aurea for Gospel commentary from the Fathers." },
  { title: "Papal Encyclicals Before Vatican II", category: "Magisterium", depth: "Reference", source: "Vatican archive", body: "Primary-source papal teaching on liturgy, modern errors, social doctrine, Scripture, and the Church." },
  { title: "Communion Rail and Sacred Species", category: "Liturgy", depth: "Reference", source: "New Advent Catholic Encyclopedia", body: "Historical and theological reference for rails, cloths, patens, kneeling, and reverence toward the Eucharist." },
  { title: "Roman Martyrology", category: "Saints", depth: "Reference", source: "Traditional Roman Martyrology", body: "Daily saints and martyrs with a traditional calendar orientation." },
  { title: "Traditional Devotions Treasury", category: "Prayer", depth: "Core", source: "Approved Catholic prayer books", body: "Latin-English prayers, litanies, Stations, Holy Face, Precious Blood, Sacred Heart, and St. Bridget devotions." },
  { title: "Current Traditional Questions", category: "Apologetics", depth: "Reference", source: "Vatican / New Advent / Catholic Answers", body: "Charitable, sourced explainers on altar rails, receiving on the tongue, ad orientem, veiling, chant, and liturgical continuity." },
  { title: "Latin Learning for Catholics", category: "Language", depth: "Core", source: "Ecclesiastical Latin tradition", body: "Mass responses, pronunciation, prayer vocabulary, and side-by-side translation drills." }
];

const comparisonPassages: ComparisonPassage[] = [
  {
    reference: "John 19:30",
    douay: "It is consummated.",
    modern: "It is finished.",
    note:
      "The Douay wording foregrounds completion, sacrifice, and fulfillment. Modern wording is clear, but a trad study mode should show what contemplative weight may be lost or gained.",
    sources: ["Douay-Rheims John 19:30", "NABRE John 19:30", "Vulgate: consummatum est"]
  },
  {
    reference: "Luke 1:28",
    douay: "Hail, full of grace, the Lord is with thee.",
    modern: "Hail, favored one! The Lord is with you.",
    note:
      "Marian doctrine and devotion often turn on the density of grace language. The app should show translation, Greek/Latin notes, and magisterial references.",
    sources: ["Douay-Rheims Luke 1:28", "NABRE Luke 1:28", "Ineffabilis Deus / CCC 490-493"]
  },
  {
    reference: "Matthew 16:18",
    douay: "Thou art Peter; and upon this rock I will build my church.",
    modern: "You are Peter, and upon this rock I will build my church.",
    note:
      "This passage anchors papal primacy. A comparison view should connect Scripture, Fathers, councils, and Catholic Encyclopedia entries.",
    sources: ["Douay-Rheims Matthew 16:18", "NABRE Matthew 16:18", "Pastor Aeternus"]
  }
];

const tradQuestions: TradQuestion[] = [
  {
    title: "Communion rails are not nostalgia.",
    stance: "A rail teaches sanctuary, sacrifice, and Eucharistic reverence through architecture.",
    body:
      "New Advent describes the altar rail as guarding the sanctuary and serving as the communion rail. The rail, cloth, and paten all signal that the Eucharist is not ordinary food.",
    sources: ["New Advent: Altar Rail", "New Advent: Communion Bench", "Memoriale Domini"]
  },
  {
    title: "Receiving on the tongue is a lawful traditional practice.",
    stance: "Reception on the tongue remains a right of the faithful in the Latin rite where Communion is distributed.",
    body:
      "A traditional app should explain the law and the reverence without encouraging contempt for Catholics who lawfully receive differently.",
    sources: ["GIRM 160", "Catholic Answers: Can I receive on the tongue?", "Memoriale Domini"]
  },
  {
    title: "Latin is a formation tool, not a museum piece.",
    stance: "Latin stabilizes prayer, protects continuity, and lets Catholics pray across time and place.",
    body:
      "The differentiator is not merely displaying Latin, but training users to understand the Mass, prayers, roots, and recurring theological vocabulary.",
    sources: ["Veterum Sapientia", "Sacrosanctum Concilium 36", "1962 Roman Missal"]
  },
  {
    title: "Traditional study should be primary-source first.",
    stance: "The app should privilege Scripture, Vulgate/Douay, councils, Roman Catechism, Fathers, Aquinas, and papal documents.",
    body:
      "Modern commentary can help, but the product identity is authentic Catholic doctrine from those before us, with clear authority tiers.",
    sources: ["Vatican archive", "New Advent Fathers", "Roman Catechism"]
  }
];

const prayers: Prayer[] = [
  {
    title: "Sign of the Cross",
    category: "Basic",
    body: "The foundational Trinitarian prayer.",
    text: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
    sourceNote: "Traditional Catholic prayer."
  },
  {
    title: "Our Father",
    category: "Basic",
    body: "The prayer taught by Christ.",
    text: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven.\n\nGive us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
    sourceNote: "Matthew 6:9-13; Luke 11:2-4; traditional liturgical form."
  },
  {
    title: "Hail Mary",
    category: "Marian",
    body: "Biblical greeting and intercession.",
    text: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus.\n\nHoly Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
    sourceNote: "Luke 1:28, Luke 1:42, and traditional Catholic intercession."
  },
  {
    title: "Glory Be",
    category: "Basic",
    body: "Doxology to the Trinity.",
    text: "Glory be to the Father, and to the Son, and to the Holy Spirit.\n\nAs it was in the beginning, is now, and ever shall be, world without end. Amen.",
    sourceNote: "Traditional minor doxology."
  },
  {
    title: "Apostles' Creed",
    category: "Creed",
    body: "Summary of apostolic faith.",
    text: "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord,\n\nwho was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried;\n\nhe descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty;\n\nfrom there he will come to judge the living and the dead.\n\nI believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
    sourceNote: "Apostles' Creed, traditional English form."
  },
  {
    title: "Nicene Creed",
    category: "Creed",
    body: "Creed professed at Sunday Mass.",
    text: "I believe in one God, the Father almighty, maker of heaven and earth, of all things visible and invisible.\n\nI believe in one Lord Jesus Christ, the Only Begotten Son of God, born of the Father before all ages.\n\nGod from God, Light from Light, true God from true God, begotten, not made, consubstantial with the Father; through him all things were made.\n\nFor us men and for our salvation he came down from heaven, and by the Holy Spirit was incarnate of the Virgin Mary, and became man.\n\nFor our sake he was crucified under Pontius Pilate, he suffered death and was buried, and rose again on the third day in accordance with the Scriptures.\n\nHe ascended into heaven and is seated at the right hand of the Father.\n\nHe will come again in glory to judge the living and the dead and his kingdom will have no end.\n\nI believe in the Holy Spirit, the Lord, the giver of life, who proceeds from the Father and the Son,\n\nwho with the Father and the Son is adored and glorified, who has spoken through the prophets.\n\nI believe in one, holy, catholic and apostolic Church.\n\nI confess one Baptism for the forgiveness of sins and I look forward to the resurrection of the dead and the life of the world to come. Amen.",
    sourceNote: "Niceno-Constantinopolitan Creed, Roman Missal English text."
  },
  {
    title: "Act of Contrition",
    category: "Repentance",
    body: "Prayer of sorrow for sin.",
    text: "O my God, I am heartily sorry for having offended thee, and I detest all my sins because I dread the loss of heaven and the pains of hell;\n\nbut most of all because they offend thee, my God, who art all good and deserving of all my love.\n\nI firmly resolve, with the help of thy grace, to confess my sins, to do penance, and to amend my life. Amen.",
    sourceNote: "Traditional Act of Contrition."
  },
  {
    title: "Morning Offering",
    category: "Daily",
    body: "Offering the day to God.",
    text: "O Jesus, through the Immaculate Heart of Mary, I offer thee my prayers, works, joys, and sufferings of this day\n\nfor all the intentions of thy Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world,\n\nin reparation for my sins, for the intentions of all my relatives and friends, and in particular for the intentions of the Holy Father. Amen.",
    sourceNote: "Traditional Morning Offering."
  },
  {
    title: "Angelus",
    category: "Marian",
    body: "Meditation on the Incarnation.",
    text: "The Angel of the Lord declared unto Mary. And she conceived of the Holy Spirit.\n\nHail Mary...\n\nBehold the handmaid of the Lord. Be it done unto me according to thy word.\n\nHail Mary...\n\nAnd the Word was made flesh. And dwelt among us.\n\nHail Mary...\n\nPray for us, O holy Mother of God, that we may be made worthy of the promises of Christ.\n\nLet us pray: Pour forth, we beseech thee, O Lord, thy grace into our hearts; that we, to whom the Incarnation of Christ thy Son was made known by the message of an angel, may by his Passion and Cross be brought to the glory of his Resurrection. Through the same Christ our Lord. Amen.",
    sourceNote: "Traditional Angelus."
  },
  {
    title: "Regina Caeli",
    category: "Marian",
    body: "Easter season Marian prayer.",
    text: "Queen of heaven, rejoice, alleluia.\n\nFor he whom thou didst merit to bear, alleluia.\n\nHas risen, as he said, alleluia.\n\nPray for us to God, alleluia.\n\nRejoice and be glad, O Virgin Mary, alleluia. For the Lord has truly risen, alleluia.\n\nLet us pray: O God, who gave joy to the world through the resurrection of thy Son, our Lord Jesus Christ, grant we beseech thee, that through the intercession of the Virgin Mary, his Mother, we may obtain the joys of everlasting life. Through the same Christ our Lord. Amen.",
    sourceNote: "Traditional Regina Caeli."
  },
  {
    title: "Memorare",
    category: "Marian",
    body: "Appeal to Mary's intercession.",
    text: "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided.\n\nInspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother.\n\nTo thee do I come, before thee I stand, sinful and sorrowful.\n\nO Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.",
    sourceNote: "Traditional Memorare."
  },
  {
    title: "St. Michael Prayer",
    category: "Protection",
    body: "Prayer for protection against evil.",
    text: "Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil.\n\nMay God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God,\n\ncast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.",
    sourceNote: "Prayer composed by Pope Leo XIII."
  },
  {
    title: "Anima Christi",
    category: "Eucharistic",
    body: "Prayer after Communion.",
    text: "Soul of Christ, sanctify me. Body of Christ, save me. Blood of Christ, inebriate me.\n\nWater from the side of Christ, wash me. Passion of Christ, strengthen me.\n\nO good Jesus, hear me. Within thy wounds hide me. Permit me not to be separated from thee.\n\nFrom the wicked foe defend me. At the hour of my death call me and bid me come unto thee,\n\nthat with thy saints I may praise thee forever and ever. Amen.",
    sourceNote: "Traditional Anima Christi."
  },
  {
    title: "Hail Holy Queen",
    category: "Marian",
    body: "Salve Regina in English.",
    text: "Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope.\n\nTo thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears.\n\nTurn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile show unto us the blessed fruit of thy womb, Jesus.\n\nO clement, O loving, O sweet Virgin Mary.\n\nPray for us, O holy Mother of God, that we may be made worthy of the promises of Christ. Amen.",
    sourceNote: "Traditional Salve Regina."
  },
  { title: "Rosary", category: "Marian", body: "Meditation on mysteries of Christ.", sourceNote: "Traditional Dominican Rosary structure." },
  { title: "Divine Mercy Chaplet", category: "Mercy", body: "Chaplet centered on Christ's Passion.", text: "On the Our Father beads: Eternal Father, I offer thee the Body and Blood, Soul and Divinity of thy dearly beloved Son, our Lord Jesus Christ, in atonement for our sins and those of the whole world.\n\nOn the Hail Mary beads: For the sake of his sorrowful Passion, have mercy on us and on the whole world.\n\nConcluding prayer: Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.", sourceNote: "Divine Mercy Chaplet devotion." },
  { title: "Litany of Loreto", category: "Litany", body: "Traditional Marian litany.", text: "Lord, have mercy. Christ, have mercy. Lord, have mercy.\n\nHoly Mary, pray for us. Holy Mother of God, pray for us. Holy Virgin of virgins, pray for us.\n\nMother of Christ, pray for us. Mother of the Church, pray for us. Mother of divine grace, pray for us.\n\nQueen of angels, pray for us. Queen of patriarchs, pray for us. Queen of apostles, pray for us. Queen of all saints, pray for us.\n\nLamb of God, who takes away the sins of the world, spare us, O Lord.", sourceNote: "Traditional Marian litany excerpt." },
  { title: "Litany of the Sacred Heart", category: "Litany", body: "Devotion to the Heart of Jesus.", text: "Heart of Jesus, Son of the Eternal Father, have mercy on us.\n\nHeart of Jesus, formed by the Holy Spirit in the womb of the Virgin Mother, have mercy on us.\n\nHeart of Jesus, substantially united to the Word of God, have mercy on us.\n\nHeart of Jesus, burning furnace of charity, have mercy on us.\n\nHeart of Jesus, patient and rich in mercy, have mercy on us.\n\nJesus, meek and humble of heart, make our hearts like unto thine.", sourceNote: "Traditional Litany of the Sacred Heart excerpt." },
  { title: "Prayer Before Meals", category: "Daily", body: "Blessing before eating.", text: "Bless us, O Lord, and these thy gifts, which we are about to receive from thy bounty, through Christ our Lord. Amen.", sourceNote: "Traditional meal blessing." },
  { title: "Prayer After Meals", category: "Daily", body: "Thanksgiving after eating.", text: "We give thee thanks, almighty God, for all thy benefits, who livest and reignest, world without end. Amen.\n\nMay the souls of the faithful departed, through the mercy of God, rest in peace. Amen.", sourceNote: "Traditional thanksgiving after meals." },
  { title: "Guardian Angel Prayer", category: "Protection", body: "Prayer for angelic guidance.", text: "Angel of God, my guardian dear, to whom God's love commits me here,\n\never this day be at my side, to light and guard, to rule and guide. Amen.", sourceNote: "Traditional Guardian Angel prayer." },
  { title: "Prayer to St. Joseph", category: "Saints", body: "Intercession of St. Joseph.", text: "O glorious St. Joseph, faithful guardian and protector, intercede for us before thy foster Son, Jesus Christ.\n\nObtain for us purity of heart, steadfast faith, and courage in our duties, that we may serve God faithfully in ordinary life. Amen.", sourceNote: "Traditional devotional prayer, adapted for app use." },
  { title: "Come Holy Spirit", category: "Holy Spirit", body: "Invocation of the Holy Spirit.", text: "Come, Holy Spirit, fill the hearts of thy faithful and kindle in them the fire of thy love.\n\nSend forth thy Spirit, and they shall be created. And thou shalt renew the face of the earth.\n\nLet us pray: O God, who by the light of the Holy Spirit did instruct the hearts of the faithful, grant that by the same Holy Spirit we may be truly wise and ever rejoice in his consolation. Through Christ our Lord. Amen.", sourceNote: "Traditional invocation of the Holy Spirit." },
  { title: "Prayer for the Faithful Departed", category: "Departed", body: "Prayer for the dead.", text: "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them.\n\nMay they rest in peace. Amen.\n\nMay the souls of all the faithful departed, through the mercy of God, rest in peace. Amen.", sourceNote: "Traditional prayer for the faithful departed." },
  { title: "Prayer for Vocations", category: "Church", body: "Prayer for priests and religious.", text: "Lord Jesus, raise up holy priests, religious, and faithful families for thy Church.\n\nGive courage to those discerning a vocation, perseverance to those already called, and generous hearts to all who serve thy people. Amen.", sourceNote: "Devotional prayer for vocations, app-reviewed text." },
  { title: "Divine Mercy Novena", category: "Novena", body: "Nine-day Divine Mercy devotion.", text: "Day by day, bring souls to the mercy of Jesus and pray the Divine Mercy Chaplet for them.\n\nBegin with trust: Jesus, I trust in thee.\n\nContinue for nine days with the chaplet, offering each day for the intentions of mercy, conversion, perseverance, and the whole world.", sourceNote: "Novena guide summary; full reviewed text should be imported before public release." },
  { title: "St. Joseph Novena", category: "Novena", body: "Nine days asking St. Joseph's intercession.", text: "O St. Joseph, foster father of Jesus and spouse of the Blessed Virgin Mary, pray for us.\n\nFor nine days, ask his intercession for purity, work, family life, protection, and a holy death.\n\nSt. Joseph, terror of demons and patron of the universal Church, pray for us.", sourceNote: "Novena guide summary; full reviewed text should be imported before public release." },
  { title: "Sacred Heart Novena", category: "Novena", body: "Nine-day devotion to the Sacred Heart.", text: "O Sacred Heart of Jesus, I place all my trust in thee.\n\nFor nine days, bring your intentions to Christ's merciful Heart, praying for conversion, reparation, and deeper charity.\n\nSacred Heart of Jesus, have mercy on us.", sourceNote: "Novena guide summary; full reviewed text should be imported before public release." },
  { title: "Holy Spirit Novena", category: "Novena", body: "Traditional novena before Pentecost.", text: "Come, Holy Spirit, enlighten my mind, strengthen my will, and inflame my heart with love for God.\n\nFor nine days, pray for the gifts of wisdom, understanding, counsel, fortitude, knowledge, piety, and fear of the Lord.\n\nCome, Holy Spirit, renew the face of the earth.", sourceNote: "Novena guide summary; full reviewed text should be imported before public release." },
  { title: "Our Lady Undoer of Knots Novena", category: "Novena", body: "Marian novena for difficult situations.", text: "Mary, Undoer of Knots, pray for me.\n\nFor nine days, entrust a specific difficulty to the Blessed Mother and ask her to lead it to Jesus with patience, humility, and trust.\n\nMother of fair love, untie the knots that burden my heart.", sourceNote: "Novena guide summary; full reviewed text should be imported before public release." }
];

const intentions = [
  { body: "For my family to return to the sacraments.", prayed: 42 },
  { body: "For a friend discerning conversion.", prayed: 18 },
  { body: "For priests, seminarians, and religious vocations.", prayed: 97 }
];

function findAnswer(question: string) {
  const normalized = question.toLowerCase();
  return (
    answers.find((item) => item.match.some((token) => normalized.includes(token))) ||
    answers.find((item) => item.key !== "general" && normalized.includes(item.key)) ||
    answers.find((item) => item.key === "general") ||
    answers[0]
  );
}

function tiered(first: string, second: string, third: string): Citation[] {
  return [
    {
      type: "Primary",
      title: first,
      note: "Used as a primary source for the answer.",
      authorityTier: 1
    },
    {
      type: "Supporting",
      title: second,
      note: "Supports the doctrine, practice, or biblical foundation.",
      authorityTier: 1
    },
    {
      type: "Context",
      title: third,
      note: "Provides traditional, historical, or explanatory context.",
      authorityTier: 2
    }
  ];
}
