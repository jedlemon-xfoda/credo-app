import { liturgicalDayToMassFlowContext, resolveLiturgicalDay } from "../data/liturgicalCalendar";
import { resolveGloriaStatus, resolveMassFlowConfiguration, resolveSecondReadingPresence } from "../data/massFlow";
import { getReviewMassContentDates } from "../data/reviewMassContent";
import { isValidReviewDateOverride, resolveAttendDateKey } from "../hooks/useLiturgicalDay";
import { reviewMassProperResolver, getProperText, isProperAvailableForRuntime, properKeys, shouldAllowReviewOnlyMassContent } from "../services/massProperResolver";

describe("dynamic Mass content resolver", () => {
  it("resolves the review liturgical day context for May 9, 2026", () => {
    const day = resolveLiturgicalDay("2026-05-09");
    const context = liturgicalDayToMassFlowContext(day);

    expect(day.massTitle).toBe("Saturday of the Fifth Week of Easter");
    expect(day.season).toBe("easter");
    expect(context.includeGloria).toBe(false);
    expect(context.includeCreed).toBe(false);
    expect(context.hasSecondReading).toBe(false);
    expect(resolveGloriaStatus(context)).toBe("omitted");
    expect(resolveSecondReadingPresence(context)).toBe("omitted");
  });

  it("keeps solemnity and Lenten resolver scaffolding available", () => {
    const allSaints = liturgicalDayToMassFlowContext(resolveLiturgicalDay("2026-11-01"));
    const easterSunday = liturgicalDayToMassFlowContext(resolveLiturgicalDay("2026-05-10"));
    const lentenWeekday = liturgicalDayToMassFlowContext(resolveLiturgicalDay("2027-03-14"));

    expect(easterSunday.includeGloria).toBe(true);
    expect(easterSunday.includeCreed).toBe(true);
    expect(easterSunday.hasSecondReading).toBe(true);
    expect(allSaints.includeGloria).toBe(true);
    expect(allSaints.includeCreed).toBe(true);
    expect(allSaints.hasSecondReading).toBe(true);
    expect(lentenWeekday.gospelAcclamation).toBe("lent");
    expect(lentenWeekday.includeGloria).toBe(false);
  });

  it("resolves omitted ordinary section branch and presence configuration", () => {
    const weekdayConfig = resolveMassFlowConfiguration(liturgicalDayToMassFlowContext(resolveLiturgicalDay("2026-05-09")));
    const solemnityConfig = resolveMassFlowConfiguration(liturgicalDayToMassFlowContext(resolveLiturgicalDay("2026-11-01")));

    expect(weekdayConfig.branchIds).toContain("gloria-omitted");
    expect(weekdayConfig.branchIds).not.toContain("creed-nicene");
    expect(weekdayConfig.hasSecondReading).toBe(false);
    expect(solemnityConfig.branchIds).toContain("gloria-prescribed");
    expect(solemnityConfig.branchIds).toContain("creed-nicene");
    expect(solemnityConfig.hasSecondReading).toBe(true);
  });

  it("lists usable review content dates across Sunday, weekday, and solemnity contexts", () => {
    expect(getReviewMassContentDates()).toEqual(["2026-05-09", "2026-05-10", "2026-05-11", "2026-11-01"]);
    expect(resolveLiturgicalDay("2026-05-10").massTitle).toBe("Sixth Sunday of Easter");
    expect(resolveLiturgicalDay("2026-05-11").massTitle).toBe("Monday of the Sixth Week of Easter");
    expect(resolveLiturgicalDay("2026-11-01").massTitle).toBe("All Saints");
  });

  it("provides all required dynamic content fields for review days", () => {
    for (const date of getReviewMassContentDates()) {
      const propers = reviewMassProperResolver.resolve(resolveLiturgicalDay(date));

      for (const key of properKeys) {
        const proper = getProperText(propers, key);
        const secondReadingIsOmitted = key === "secondReading" && !liturgicalDayToMassFlowContext(resolveLiturgicalDay(date)).hasSecondReading;

        if (secondReadingIsOmitted) {
          expect(isProperAvailableForRuntime(proper, true)).toBe(false);
        } else {
          expect(isProperAvailableForRuntime(proper, true)).toBe(true);
          expect(proper?.metadata.liturgicalDate).toBe(date);
          expect(proper?.metadata.reviewOnly).toBe(true);
          expect(proper?.metadata.approvalStatus).toBe("pending_review");
        }
      }
    }
  });

  it("preserves fallback behavior for dates without review content", () => {
    const missingDay = resolveLiturgicalDay("2026-06-17");
    const missingPropers = reviewMassProperResolver.resolve(missingDay);

    expect(missingDay.massTitle).toBe("Weekday Mass");
    expect(resolveGloriaStatus(liturgicalDayToMassFlowContext(missingDay))).toBe("omitted");
    expect(isProperAvailableForRuntime(getProperText(missingPropers, "firstReading"), true)).toBe(false);
    expect(isProperAvailableForRuntime(getProperText(missingPropers, "collect"), true)).toBe(false);
  });

  it("returns real review-only propers with approval metadata", () => {
    const day = resolveLiturgicalDay("2026-05-09");
    const propers = reviewMassProperResolver.resolve(day);
    const firstReading = getProperText(propers, "firstReading");
    const gospel = getProperText(propers, "gospel");
    const collect = getProperText(propers, "collect");

    expect(firstReading?.text).toContain("Paul reached also Derbe and Lystra");
    expect(gospel?.text).toContain("Jesus said to his disciples");
    expect(collect?.text).toContain("Almighty and eternal God");
    for (const proper of [firstReading, gospel, collect]) {
      expect(proper?.metadata.approvalStatus).toBe("pending_review");
      expect(proper?.metadata.reviewOnly).toBe(true);
      expect(proper?.metadata.liturgicalDate).toBe("2026-05-09");
      expect(proper?.metadata.contentType).toBeTruthy();
    }
  });

  it("resolves Sunday and solemnity propers including second readings", () => {
    const sundayPropers = reviewMassProperResolver.resolve(resolveLiturgicalDay("2026-05-10"));
    const solemnityPropers = reviewMassProperResolver.resolve(resolveLiturgicalDay("2026-11-01"));

    expect(getProperText(sundayPropers, "firstReading")?.text).toContain("Philip went down to the city of Samaria");
    expect(getProperText(sundayPropers, "secondReading")?.text).toContain("Sanctify Christ as Lord in your hearts");
    expect(getProperText(sundayPropers, "gospel")?.text).toContain("If you love me, you will keep my commandments");
    expect(getProperText(solemnityPropers, "firstReading")?.text).toContain("a great multitude");
    expect(getProperText(solemnityPropers, "secondReading")?.text).toContain("See what love the Father has bestowed on us");
    expect(getProperText(solemnityPropers, "gospel")?.text).toContain("Blessed are the poor in spirit");
  });

  it("blocks review-only content from public runtime availability", () => {
    const day = resolveLiturgicalDay("2026-05-09");
    const propers = reviewMassProperResolver.resolve(day);
    const firstReading = getProperText(propers, "firstReading");
    const unavailableSecondReading = getProperText(propers, "secondReading");

    expect(isProperAvailableForRuntime(firstReading, true)).toBe(true);
    expect(isProperAvailableForRuntime(firstReading, false)).toBe(false);
    expect(isProperAvailableForRuntime(unavailableSecondReading, true)).toBe(false);
  });

  it("allows review-only content only in dev or explicit internal review builds", () => {
    expect(shouldAllowReviewOnlyMassContent(undefined, false)).toBe(false);
    expect(shouldAllowReviewOnlyMassContent("enabled", false)).toBe(true);
    expect(shouldAllowReviewOnlyMassContent(undefined, true)).toBe(true);
  });

  it("supports an internal review date override without changing the device date", () => {
    const actualDate = new Date("2026-05-09T12:00:00");

    expect(resolveAttendDateKey(actualDate)).toBe("2026-05-09");
    expect(resolveAttendDateKey(actualDate, "2026-05-10")).toBe("2026-05-10");
    expect(resolveAttendDateKey(actualDate, "2026-05-11")).toBe("2026-05-11");
    expect(resolveAttendDateKey(actualDate, "2026-11-01")).toBe("2026-11-01");
    expect(resolveAttendDateKey(actualDate, "not-a-date")).toBe("2026-05-09");
  });

  it("accepts only yyyy-mm-dd review date overrides", () => {
    expect(isValidReviewDateOverride("2026-05-10")).toBe(true);
    expect(isValidReviewDateOverride("2026-5-10")).toBe(false);
    expect(isValidReviewDateOverride("")).toBe(false);
    expect(isValidReviewDateOverride(undefined)).toBe(false);
  });
});
