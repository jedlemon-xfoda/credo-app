import { liturgicalDayToMassFlowContext, resolveLiturgicalDay } from "../data/liturgicalCalendar";
import { resolveGloriaStatus, resolveMassFlowConfiguration, resolveSecondReadingPresence } from "../data/massFlow";
import { reviewMassProperResolver, getProperText, isProperAvailableForRuntime, shouldAllowReviewOnlyMassContent } from "../services/massProperResolver";

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
    const lentenWeekday = liturgicalDayToMassFlowContext(resolveLiturgicalDay("2027-03-14"));

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
});
