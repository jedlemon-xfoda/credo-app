import { attendMassSteps, attendSections } from "./attendMassHierarchy";
import type { AttendContent, DailyReadings, LearnContent, LiturgicalContentProvider, MassMeta } from "../services/liturgicalContentProvider";
import type { ContentMetadata } from "../types";

export const reviewOnlyMetadata: ContentMetadata = {
  sourceProvider: "manual_review",
  textStatus: "review_only",
  licensingNote: "Review copy - pending permission for official liturgical texts where applicable. Do not distribute publicly.",
  lastUpdated: "2026-04-30"
};

export const usccbReviewMetadata: ContentMetadata = {
  sourceProvider: "usccb",
  textStatus: "review_only",
  licensingNote: "Review copy - pending permission. USCCB text rights must be verified before production distribution.",
  canonicalSourceUrl: "https://bible.usccb.org/",
  lastUpdated: "2026-04-30"
};

export const placeholderMetadata: ContentMetadata = {
  sourceProvider: "mock",
  textStatus: "placeholder",
  licensingNote: "Draft companion copy. Replace with licensed or public-domain text before production.",
  lastUpdated: "2026-04-30"
};

const officialReviewStepIds = new Set([
  "holy",
  "mystery-of-faith",
  "doxology",
  "lords-prayer",
  "lamb-of-god"
]);

const reviewCompanionStepIds = new Set([
  "entrance",
  "penitential-act",
  "psalm",
  "profession-of-faith",
  "communion"
]);

const massMeta: MassMeta = {
  title: "Thursday of the Fourth Week of Easter",
  season: "Easter Season",
  liturgicalColor: "White",
  massType: "Daily Mass",
  metadata: reviewOnlyMetadata
};

const readings: DailyReadings = {
  date: "2026-04-30",
  metadata: usccbReviewMetadata,
  items: [
    {
      id: "first-reading",
      title: "First Reading",
      citation: "Acts 13:13-25",
      text: "Review excerpt for Acts 13:13-25. Paul recalls the Lord's faithful preparation of Israel and points toward the coming of Christ.",
      excerpt: "Paul recalls the Lord's faithful preparation of Israel and points toward the coming of Christ.",
      metadata: usccbReviewMetadata
    },
    {
      id: "responsorial-psalm",
      title: "Responsorial Psalm",
      citation: "Ps 89",
      text: "Review excerpt for Psalm 89. The Church responds by blessing the mercy and faithfulness of the Lord.",
      excerpt: "The Church responds by blessing the mercy and faithfulness of the Lord.",
      metadata: usccbReviewMetadata
    },
    {
      id: "gospel",
      title: "Gospel",
      citation: "Jn 13:16-20",
      text: "Review excerpt for John 13:16-20. Jesus teaches that receiving the one He sends is bound to receiving Him.",
      excerpt: "Jesus teaches that receiving the one He sends is bound to receiving Him.",
      metadata: usccbReviewMetadata
    }
  ]
};

const attendContent: AttendContent = {
  metadata: reviewOnlyMetadata,
  steps: Object.fromEntries(
    attendMassSteps.map((step) => [
      step.id,
      {
        id: step.id,
        mainLine: step.mainLine,
        posture: step.posture,
        prayerText: step.prayerText,
        guidanceText: step.guidanceText,
        optionalNote: step.conditionalRule,
        metadata: officialReviewStepIds.has(step.id) || reviewCompanionStepIds.has(step.id) ? reviewOnlyMetadata : placeholderMetadata
      }
    ])
  )
};

const learnContent: LearnContent = {
  metadata: reviewOnlyMetadata,
  sections: attendSections.map((section) => {
    const parts = attendMassSteps.filter((step) => step.section === section).map((step) => step.stepTitle);
    return {
      id: section.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      section,
      title: section,
      summary: getSectionSummary(section),
      what: getWhat(section),
      why: getWhy(section),
      how: getHow(section),
      parts,
      diveDeeper: {
        scripture: getScriptureRefs(section),
        catechism: getCatechismRefs(section),
        fathersAndCouncils: ["To be added in content review"]
      },
      metadata: reviewOnlyMetadata
    };
  })
};

export const reviewContentProvider: LiturgicalContentProvider = {
  async getTodayMassMeta() {
    return massMeta;
  },
  async getReadingsForDate() {
    return readings;
  },
  async getAttendContent() {
    return attendContent;
  },
  async getLearnContent() {
    return learnContent;
  },
  async getContentMetadata() {
    return reviewOnlyMetadata;
  }
};

function getSectionSummary(section: string) {
  switch (section) {
    case "Introductory Rites":
      return "The Church gathers, asks mercy, and prepares to hear the Word.";
    case "Liturgy of the Word":
      return "Scripture is proclaimed and opened for the assembly.";
    case "Liturgy of the Eucharist":
      return "The gifts are offered and Christ gives Himself sacramentally.";
    default:
      return "The Church is blessed and sent to live what was received.";
  }
}

function getWhat(section: string) {
  return getSectionSummary(section);
}

function getWhy(section: string) {
  switch (section) {
    case "Introductory Rites":
      return "These rites gather the faithful into one praying body.";
    case "Liturgy of the Word":
      return "God speaks to His Church before the Eucharistic sacrifice.";
    case "Liturgy of the Eucharist":
      return "This is the heart of the Mass, ordered toward the sacrifice and the banquet.";
    default:
      return "The Mass bears fruit in Christian life and charity.";
  }
}

function getHow(section: string) {
  switch (section) {
    case "Introductory Rites":
      return "Stand, listen, and bring your intention quietly.";
    case "Liturgy of the Word":
      return "Listen for one word or phrase to carry.";
    case "Liturgy of the Eucharist":
      return "Offer yourself with the bread and wine.";
    default:
      return "Go in peace and live what you received.";
  }
}

function getScriptureRefs(section: string) {
  switch (section) {
    case "Liturgy of the Word":
      return ["Luke 24:27", "Romans 10:17"];
    case "Liturgy of the Eucharist":
      return ["Luke 22:19-20", "1 Corinthians 11:23-26"];
    default:
      return ["John 20:21"];
  }
}

function getCatechismRefs(section: string) {
  switch (section) {
    case "Introductory Rites":
      return ["CCC 1348"];
    case "Liturgy of the Word":
      return ["CCC 1349"];
    case "Liturgy of the Eucharist":
      return ["CCC 1350-1355"];
    default:
      return ["CCC 1332"];
  }
}
