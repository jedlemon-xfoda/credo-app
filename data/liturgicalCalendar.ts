import type { ContentMetadata } from "../types";
import type { LiturgicalSeason, MassFlowResolverContext } from "./massFlow";

export type LiturgicalRank = "sunday" | "solemnity" | "feast" | "memorial" | "feria";
export type LiturgicalColor = "White" | "Red" | "Green" | "Violet" | "Rose" | "Black" | "Gold";

export type LiturgicalDay = {
  date: string;
  gospelAcclamation: "ordinary" | "lent";
  gloriaMandated: boolean;
  creedRequired: boolean;
  hasSecondReading: boolean;
  liturgicalColor: LiturgicalColor;
  liturgicalYear: "A" | "B" | "C";
  massDayKind: MassFlowResolverContext["massDayKind"];
  massTitle: string;
  rank: LiturgicalRank;
  season: LiturgicalSeason;
  sequenceRequired?: boolean;
  metadata: ContentMetadata;
};

const calendarMetadata: ContentMetadata = {
  approvalStatus: "pending_review",
  lastUpdated: "2026-05-09",
  licensingNote: "Calendar resolver for review builds. Verify against approved liturgical calendar before public release.",
  reviewOnly: true,
  sourceProvider: "manual_review",
  textStatus: "review_only"
};

const explicitDays: Record<string, Partial<LiturgicalDay>> = {
  "2026-05-09": {
    gospelAcclamation: "ordinary",
    gloriaMandated: false,
    creedRequired: false,
    hasSecondReading: false,
    liturgicalColor: "White",
    massDayKind: "weekday",
    massTitle: "Saturday of the Fifth Week of Easter",
    rank: "feria",
    season: "easter"
  },
  "2026-11-01": {
    gloriaMandated: true,
    creedRequired: true,
    hasSecondReading: true,
    liturgicalColor: "White",
    massDayKind: "solemnity",
    massTitle: "All Saints",
    rank: "solemnity",
    season: "ordinary"
  },
  "2026-12-25": {
    gloriaMandated: true,
    creedRequired: false,
    hasSecondReading: false,
    liturgicalColor: "White",
    massDayKind: "solemnity",
    massTitle: "The Nativity of the Lord",
    rank: "solemnity",
    season: "christmas"
  },
  "2027-03-14": {
    gospelAcclamation: "lent",
    gloriaMandated: false,
    creedRequired: false,
    hasSecondReading: false,
    liturgicalColor: "Violet",
    massDayKind: "weekday",
    massTitle: "Lenten Weekday",
    rank: "feria",
    season: "lent"
  }
};

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function resolveLiturgicalDay(input: Date | string = new Date()): LiturgicalDay {
  const date = typeof input === "string" ? input : getLocalDateKey(input);
  const explicit = explicitDays[date] ?? {};
  const fallback = fallbackDayForDate(date);

  return {
    ...fallback,
    ...explicit,
    date,
    gospelAcclamation: explicit.gospelAcclamation ?? fallback.gospelAcclamation,
    liturgicalYear: explicit.liturgicalYear ?? fallback.liturgicalYear,
    metadata: {
      ...calendarMetadata,
      liturgicalDate: date
    }
  };
}

export function liturgicalDayToMassFlowContext(day: LiturgicalDay): MassFlowResolverContext {
  return {
    gospelAcclamation: day.gospelAcclamation,
    gloria: day.gloriaMandated ? "prescribed" : "omitted",
    hasSecondReading: day.hasSecondReading,
    includeCreed: day.creedRequired,
    includeGloria: day.gloriaMandated,
    massDayKind: day.massDayKind,
    season: day.season
  };
}

function fallbackDayForDate(date: string): LiturgicalDay {
  const parsed = new Date(`${date}T12:00:00`);
  const sunday = parsed.getDay() === 0;
  const season = inferSeason(date);

  return {
    date,
    gospelAcclamation: season === "lent" ? "lent" : "ordinary",
    gloriaMandated: sunday && season !== "advent" && season !== "lent",
    creedRequired: sunday,
    hasSecondReading: sunday,
    liturgicalColor: season === "lent" || season === "advent" ? "Violet" : season === "easter" || season === "christmas" ? "White" : "Green",
    liturgicalYear: inferLiturgicalYear(date),
    massDayKind: sunday ? "sunday" : "weekday",
    massTitle: sunday ? "Sunday Mass" : "Weekday Mass",
    metadata: calendarMetadata,
    rank: sunday ? "sunday" : "feria",
    season
  };
}

function inferSeason(date: string): LiturgicalSeason {
  const monthDay = date.slice(5);
  if (monthDay >= "12-25" || monthDay <= "01-12") return "christmas";
  if (monthDay >= "02-18" && monthDay <= "04-04") return "lent";
  if (monthDay >= "04-05" && monthDay <= "05-24") return "easter";
  if (monthDay >= "11-29" && monthDay <= "12-24") return "advent";
  return "ordinary";
}

function inferLiturgicalYear(date: string): "A" | "B" | "C" {
  const year = Number(date.slice(0, 4));
  const cycle = year % 3;
  if (cycle === 0) return "A";
  if (cycle === 1) return "B";
  return "C";
}
