export type Citation = {
  type: string;
  title: string;
  note: string;
  authorityTier: 1 | 2 | 3;
};

export type Answer = {
  key: string;
  match: string[];
  question: string;
  sourceType: string;
  title: string;
  answer: string;
  citations: Citation[];
};

export const answers: Answer[] = [
  {
    key: "confession",
    match: ["confess", "confession", "priest", "penance", "reconciliation"],
    question: "Why do Catholics confess sins to a priest?",
    sourceType: "Official teaching",
    title: "Confession is rooted in Christ giving the apostles authority to forgive sins.",
    answer:
      "Catholics confess to a priest because Christ entrusted the ministry of reconciliation to the apostles and their successors. The priest acts as a minister of Christ and the Church, and the sacrament includes contrition, confession, absolution, and satisfaction.",
    citations: [
      {
        type: "Scripture",
        title: "John 20:21-23",
        note: "Christ sends the apostles and speaks of forgiving and retaining sins.",
        authorityTier: 1
      },
      {
        type: "Catechism",
        title: "CCC 1422-1498",
        note: "The Catechism summarizes the sacrament of Penance and Reconciliation.",
        authorityTier: 1
      },
      {
        type: "Reference",
        title: "New Advent: Penance",
        note: "Historical and theological context appears below official sources.",
        authorityTier: 3
      }
    ]
  },
  {
    key: "purgatory",
    match: ["purgatory", "purification", "dead", "after death"],
    question: "What does the Church teach about purgatory?",
    sourceType: "Official teaching",
    title: "Purgatory is the final purification of those who die in God's grace.",
    answer:
      "The Church teaches that those who die in God's grace and friendship, but still need purification, undergo final purification before entering the joy of heaven. This is distinct from the punishment of the damned.",
    citations: [
      {
        type: "Catechism",
        title: "CCC 1030-1032",
        note: "Defines purgatory and connects it to prayer for the dead.",
        authorityTier: 1
      },
      {
        type: "Scripture",
        title: "2 Maccabees 12:45",
        note: "Shows prayer for the dead as a holy and pious practice.",
        authorityTier: 1
      },
      {
        type: "Tradition",
        title: "St. Gregory the Great",
        note: "A patristic witness used as theological and historical support.",
        authorityTier: 2
      }
    ]
  },
  {
    key: "eucharist",
    match: ["eucharist", "communion", "real presence", "mass", "host"],
    question: "What is the Eucharist?",
    sourceType: "Official teaching",
    title: "The Eucharist is the source and summit of the Christian life.",
    answer:
      "The Eucharist is the sacrament in which Christ is truly, really, and substantially present under the appearances of bread and wine. It is the memorial of Christ's sacrifice and the center of Catholic worship.",
    citations: [
      {
        type: "Catechism",
        title: "CCC 1322-1419",
        note: "The Catechism's main section on the sacrament of the Eucharist.",
        authorityTier: 1
      },
      {
        type: "Scripture",
        title: "John 6; Luke 22; 1 Corinthians 11",
        note: "Biblical foundations for Eucharistic doctrine and practice.",
        authorityTier: 1
      },
      {
        type: "Council",
        title: "Lumen Gentium 11",
        note: "Vatican II describes the Eucharistic sacrifice as source and summit.",
        authorityTier: 1
      }
    ]
  }
];

export const topics = [
  {
    title: "The Eucharist",
    label: "Topic Path",
    body: "Catechism, Scripture, councils, Aquinas, saints, and devotional practice."
  },
  {
    title: "Mary and the Saints",
    label: "Doctrine",
    body: "Intercession, devotion, scriptural roots, and common objections."
  },
  {
    title: "Confession",
    label: "Sacrament",
    body: "Christ's authority, repentance, absolution, and pastoral care."
  }
];

export const prayers = [
  "Rosary",
  "Divine Mercy Chaplet",
  "Angelus",
  "Regina Caeli",
  "St. Michael Prayer",
  "Anima Christi"
];

export const intentions = [
  { body: "For my family to return to the sacraments.", prayed: 42 },
  { body: "For a friend discerning conversion.", prayed: 18 },
  { body: "For priests, seminarians, and religious vocations.", prayed: 97 }
];

export function findAnswer(question: string) {
  const normalized = question.toLowerCase();
  return (
    answers.find((item) => item.match.some((token) => normalized.includes(token))) ||
    answers[0]
  );
}
