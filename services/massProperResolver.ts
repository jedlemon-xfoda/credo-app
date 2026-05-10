import { REVIEW_MASS_CONTENT, unavailableProper, type ProperText, type ReviewDayMassContent } from "../data/reviewMassContent";
import type { LiturgicalDay } from "../data/liturgicalCalendar";

export type DynamicProperKey =
  | "collect"
  | "communionAntiphon"
  | "firstReading"
  | "gospel"
  | "gospelAcclamationVerse"
  | "prayerAfterCommunion"
  | "prayerOverOfferings"
  | "psalmResponse"
  | "psalmVerses"
  | "secondReading";

export type DayMassPropers = Record<DynamicProperKey, ProperText> & {
  date: string;
};

export type MassProperResolver = {
  resolve(day: LiturgicalDay): DayMassPropers;
};

export const properKeys: DynamicProperKey[] = [
  "collect",
  "communionAntiphon",
  "firstReading",
  "gospel",
  "gospelAcclamationVerse",
  "prayerAfterCommunion",
  "prayerOverOfferings",
  "psalmResponse",
  "psalmVerses",
  "secondReading"
];

export class ReviewMassProperResolver implements MassProperResolver {
  resolve(day: LiturgicalDay): DayMassPropers {
    return normalizePropers(day.date, REVIEW_MASS_CONTENT[day.date]);
  }
}

export const reviewMassProperResolver = new ReviewMassProperResolver();

export function normalizePropers(date: string, content?: ReviewDayMassContent): DayMassPropers {
  return {
    collect: content?.collect ?? unavailableProper,
    communionAntiphon: content?.communionAntiphon ?? unavailableProper,
    date,
    firstReading: content?.firstReading ?? unavailableProper,
    gospel: content?.gospel ?? unavailableProper,
    gospelAcclamationVerse: content?.gospelAcclamationVerse ?? unavailableProper,
    prayerAfterCommunion: content?.prayerAfterCommunion ?? unavailableProper,
    prayerOverOfferings: content?.prayerOverOfferings ?? unavailableProper,
    psalmResponse: content?.psalmResponse ?? unavailableProper,
    psalmVerses: content?.psalmVerses ?? unavailableProper,
    secondReading: content?.secondReading ?? unavailableProper
  };
}

export function getProperText(propers: DayMassPropers | undefined, key?: string): ProperText | undefined {
  if (!propers || !key || !isDynamicProperKey(key)) {
    return undefined;
  }
  return propers[key];
}

export function isDynamicProperKey(key: string): key is DynamicProperKey {
  return properKeys.includes(key as DynamicProperKey);
}

export function isProperAvailableForRuntime(proper: ProperText | undefined, allowReviewOnly: boolean): proper is ProperText {
  if (!proper || proper.status !== "available" || proper.text.trim().length === 0) {
    return false;
  }

  if (proper.metadata.reviewOnly && !allowReviewOnly) {
    return false;
  }

  return true;
}

export function shouldAllowReviewOnlyMassContent(
  reviewBuildFlag = getReviewBuildFlag(),
  devOverride = typeof __DEV__ !== "undefined" && __DEV__
) {
  return devOverride || reviewBuildFlag === "enabled";
}

function getReviewBuildFlag() {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.EXPO_PUBLIC_ATTEND_REVIEW_CONTENT;
}
