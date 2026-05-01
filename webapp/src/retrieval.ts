export type SourceChunk = {
  citationLabel: string;
  sourceTitle: string;
  sourceType: string;
  authorityTier: 1 | 2 | 3;
  chunkText: string;
  keywords: string[];
};

export type RetrievedChunk = SourceChunk & {
  score: number;
};

export const sourceChunks: SourceChunk[] = [
  {
    citationLabel: "CCC 1324",
    sourceTitle: "Catechism of the Catholic Church",
    sourceType: "catechism",
    authorityTier: 1,
    chunkText:
      "The Eucharist is the source and summit of the Christian life. The other sacraments, and indeed all ecclesiastical ministries and works of the apostolate, are bound up with the Eucharist and are oriented toward it.",
    keywords: ["eucharist", "mass", "communion", "sacrament", "source", "summit"]
  },
  {
    citationLabel: "CCC 1325",
    sourceTitle: "Catechism of the Catholic Church",
    sourceType: "catechism",
    authorityTier: 1,
    chunkText:
      "The Eucharist is the efficacious sign and sublime cause of that communion in the divine life and that unity of the People of God by which the Church is kept in being.",
    keywords: ["eucharist", "communion", "church", "unity", "divine life"]
  },
  {
    citationLabel: "CCC 1327",
    sourceTitle: "Catechism of the Catholic Church",
    sourceType: "catechism",
    authorityTier: 1,
    chunkText:
      "In brief, the Eucharist is the sum and summary of our faith. Our way of thinking is attuned to the Eucharist, and the Eucharist in turn confirms our way of thinking.",
    keywords: ["eucharist", "faith", "summary", "belief"]
  },
  {
    citationLabel: "CCC 1422",
    sourceTitle: "Catechism of the Catholic Church",
    sourceType: "catechism",
    authorityTier: 1,
    chunkText:
      "Those who approach the sacrament of Penance obtain pardon from God's mercy for the offense committed against him and are reconciled with the Church.",
    keywords: ["confession", "penance", "reconciliation", "mercy", "sin", "priest"]
  },
  {
    citationLabel: "John 20:21-23",
    sourceTitle: "Sacred Scripture",
    sourceType: "scripture",
    authorityTier: 1,
    chunkText:
      "Christ sends the apostles and speaks of forgiving and retaining sins, forming a biblical foundation for the ministry of reconciliation.",
    keywords: ["confession", "apostles", "forgive", "sins", "priest", "reconciliation"]
  },
  {
    citationLabel: "CCC 1030",
    sourceTitle: "Catechism of the Catholic Church",
    sourceType: "catechism",
    authorityTier: 1,
    chunkText:
      "All who die in God's grace and friendship, but still imperfectly purified, are assured of eternal salvation but undergo purification after death.",
    keywords: ["purgatory", "purification", "death", "salvation", "grace"]
  },
  {
    citationLabel: "CCC 956",
    sourceTitle: "Catechism of the Catholic Church",
    sourceType: "catechism",
    authorityTier: 1,
    chunkText:
      "The intercession of the saints is their most exalted service to God's plan, and the Church asks them to intercede for us and for the whole world.",
    keywords: ["saints", "intercession", "pray", "church", "communion"]
  }
];

export function retrieveChunks(query: string, limit = 3): RetrievedChunk[] {
  const terms = tokenize(query);

  return sourceChunks
    .map((chunk) => ({
      ...chunk,
      score: scoreChunk(chunk, terms)
    }))
    .filter((chunk) => chunk.score > 0)
    .sort((left, right) => right.score - left.score || left.authorityTier - right.authorityTier)
    .slice(0, limit);
}

function scoreChunk(chunk: SourceChunk, terms: string[]) {
  const haystack = `${chunk.citationLabel} ${chunk.sourceTitle} ${chunk.sourceType} ${chunk.chunkText} ${chunk.keywords.join(" ")}`.toLowerCase();

  return terms.reduce((score, term) => {
    if (chunk.keywords.includes(term)) return score + 5;
    if (haystack.includes(term)) return score + 2;
    return score;
  }, 0);
}

function tokenize(query: string) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2);
}
