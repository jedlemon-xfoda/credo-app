import type { RetrievedChunk } from "./retrieval";

export type ComposedAnswer = {
  title: string;
  body: string;
  citationLabels: string[];
  caution?: string;
  confidence: "Strong" | "Moderate" | "Limited";
};

export function composeAnswer(question: string, chunks: RetrievedChunk[]): ComposedAnswer {
  if (!chunks.length) {
    return {
      title: "I need stronger Catholic sources before answering definitively.",
      body:
        "No local reviewed source chunks matched this question yet. In the finished app, this would trigger a broader search across Vatican, Catechism, Scripture, and reviewed Catholic references.",
      citationLabels: [],
      caution: "For personal pastoral situations, speak with a priest or qualified Catholic advisor.",
      confidence: "Limited"
    };
  }

  const primary = chunks[0];
  const citationLabels = chunks.map((chunk) => chunk.citationLabel);
  const topic = inferTopic(question, chunks);
  const caution = inferCaution(question);
  const confidence = chunks.length >= 3 ? "Strong" : chunks.length === 2 ? "Moderate" : "Limited";

  return {
    title: buildTitle(topic),
    body: buildBody(topic, primary, chunks),
    citationLabels,
    caution,
    confidence
  };
}

function inferTopic(question: string, chunks: RetrievedChunk[]) {
  const combined = `${question} ${chunks.map((chunk) => chunk.keywords.join(" ")).join(" ")}`.toLowerCase();

  if (combined.includes("eucharist") || combined.includes("communion") || combined.includes("mass")) {
    return "eucharist";
  }
  if (combined.includes("confession") || combined.includes("penance") || combined.includes("reconciliation")) {
    return "confession";
  }
  if (combined.includes("purgatory") || combined.includes("purification")) {
    return "purgatory";
  }
  if (combined.includes("saints") || combined.includes("intercession")) {
    return "saints";
  }

  return "general";
}

function buildTitle(topic: string) {
  const titles: Record<string, string> = {
    eucharist: "The Eucharist is central because Christ gives himself to the Church.",
    confession: "Confession is the sacrament of reconciliation and mercy.",
    purgatory: "Purgatory is the final purification of those who die in God's grace.",
    saints: "The saints intercede because the Church remains united in Christ.",
    general: "Here is the strongest answer from the available Catholic sources."
  };

  return titles[topic];
}

function buildBody(topic: string, primary: RetrievedChunk, chunks: RetrievedChunk[]) {
  const support = chunks
    .slice(1)
    .map((chunk) => chunk.citationLabel)
    .join(", ");

  const lead: Record<string, string> = {
    eucharist:
      "The retrieved sources present the Eucharist as the source and summit of Christian life, the sacrament toward which the Church's life is ordered.",
    confession:
      "The retrieved sources connect confession with Christ's mercy, reconciliation with the Church, and the apostolic ministry of forgiving sins.",
    purgatory:
      "The retrieved sources describe purgatory as purification after death for those who die in God's grace but are not yet perfectly purified.",
    saints:
      "The retrieved sources describe the saints as alive in Christ and able to intercede for the Church as members of the one Body of Christ.",
      general:
      "The retrieved sources provide a Catholic answer grounded in the reviewed source chunks currently available in the app."
  };

  const supportSentence = support
    ? ` Supporting citations include ${support}.`
    : " More sources should be added before treating this as a complete answer.";

  return `${lead[topic]} The strongest matched source is ${primary.citationLabel}: ${primary.chunkText}${supportSentence}`;
}

function inferCaution(question: string) {
  const normalized = question.toLowerCase();

  if (
    normalized.includes("mortal") ||
    normalized.includes("grave sin") ||
    normalized.includes("confession") ||
    normalized.includes("annulment") ||
    normalized.includes("scrupulosity")
  ) {
    return "This is a reference answer, not personal spiritual direction. For confession, grave sin, annulment, or scrupulosity, speak with a priest or qualified Catholic advisor.";
  }

  return undefined;
}
