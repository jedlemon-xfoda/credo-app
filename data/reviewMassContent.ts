import type { ContentMetadata, DynamicMassContentType } from "../types";

export type ProperTextStatus = "available" | "unavailable";

export type ProperText = {
  citation?: string;
  metadata: ContentMetadata;
  status: ProperTextStatus;
  text: string;
  title: string;
};

export type ReviewDayMassContent = {
  collect: ProperText;
  communionAntiphon: ProperText;
  date: string;
  gospel: ProperText;
  gospelAcclamationVerse: ProperText;
  prayerAfterCommunion: ProperText;
  prayerOverOfferings: ProperText;
  psalmResponse: ProperText;
  psalmVerses: ProperText;
  firstReading: ProperText;
  secondReading: ProperText;
};

const REVIEW_SOURCE = "USCCB review dataset";
const REVIEW_LICENSE_NOTE = "Review-only liturgical text for internal approver experience. Pending final approval; blocked from public production builds.";

export const unavailableProper: ProperText = {
  metadata: {
    approvalStatus: "draft",
    licensingNote: "No approved or review text is available for this proper.",
    reviewOnly: false,
    sourceProvider: "manual_review",
    textStatus: "placeholder"
  },
  status: "unavailable",
  text: "",
  title: "Unavailable"
};

function proper(date: string, contentType: DynamicMassContentType, title: string, text: string, citation?: string): ProperText {
  return {
    citation,
    metadata: {
      approvalStatus: "pending_review",
      canonicalSourceUrl: "local-review-dataset",
      contentType,
      lastUpdated: "2026-05-09",
      licensingNote: REVIEW_LICENSE_NOTE,
      liturgicalDate: date,
      reviewOnly: true,
      sourceProvider: "manual_review",
      textStatus: "review_only"
    },
    status: "available",
    text,
    title
  };
}

const MAY_9_2026 = "2026-05-09";

export const REVIEW_MASS_CONTENT: Record<string, ReviewDayMassContent> = {
  [MAY_9_2026]: {
    collect: proper(
      MAY_9_2026,
      "collect",
      "Collect",
      "Almighty and eternal God,\nwho through the regenerating power of Baptism\nhave been pleased to confer on us heavenly life,\ngrant, we pray,\nthat those you render capable of immortality\nmay by your guidance attain the fullness of glory.",
      REVIEW_SOURCE
    ),
    communionAntiphon: proper(
      MAY_9_2026,
      "communion_antiphon",
      "Communion Antiphon",
      "Father, I pray for them,\nthat they may be one in us,\nso that the world may believe it was you who sent me.",
      "John 17:20-21"
    ),
    date: MAY_9_2026,
    firstReading: proper(
      MAY_9_2026,
      "first_reading",
      "First Reading",
      "Paul reached also Derbe and Lystra\nwhere there was a disciple named Timothy.\nThe brothers in Lystra and Iconium spoke highly of him,\nand Paul wanted him to come along with him.\nThey traveled through the cities,\nhanding on the decisions reached by the Apostles and presbyters in Jerusalem.\nDay after day the churches grew stronger in faith and increased in number.",
      "Acts 16:1-5"
    ),
    gospel: proper(
      MAY_9_2026,
      "gospel",
      "Gospel",
      "Jesus said to his disciples:\nIf the world hates you,\nrealize that it hated me first.\nIf you belonged to the world,\nthe world would love its own;\nbut because you do not belong to the world,\nand I have chosen you out of the world,\nthe world hates you.\nRemember the word I spoke to you:\nNo slave is greater than his master.",
      "John 15:18-21"
    ),
    gospelAcclamationVerse: proper(
      MAY_9_2026,
      "gospel_acclamation_verse",
      "Gospel Acclamation Verse",
      "If then you were raised with Christ,\nseek what is above,\nwhere Christ is seated at the right hand of God.",
      "Colossians 3:1"
    ),
    prayerAfterCommunion: proper(
      MAY_9_2026,
      "prayer_after_communion",
      "Prayer after Communion",
      "May the mysteries we have received,\nO Lord, we pray,\nenlighten us by the instruction they bring\nand restore us through our participation in them,\nthat we may merit the gifts of the Spirit.",
      REVIEW_SOURCE
    ),
    prayerOverOfferings: proper(
      MAY_9_2026,
      "prayer_over_offerings",
      "Prayer over the Offerings",
      "Accept in compassion, Lord, we pray,\nthe offerings of your family,\nthat under your protective care\nthey may never lose what they have received,\nbut attain the gifts that are eternal.",
      REVIEW_SOURCE
    ),
    psalmResponse: proper(MAY_9_2026, "psalm_response", "Responsorial Psalm", "Let all the earth cry out to God with joy.", "Psalm 100"),
    psalmVerses: proper(
      MAY_9_2026,
      "psalm_verses",
      "Psalm Verses",
      "Sing joyfully to the Lord, all you lands;\nserve the Lord with gladness;\ncome before him with joyful song.\nKnow that the Lord is God;\nhe made us, his we are;\nhis people, the flock he tends.",
      "Psalm 100:1-3"
    ),
    secondReading: unavailableProper
  }
};
