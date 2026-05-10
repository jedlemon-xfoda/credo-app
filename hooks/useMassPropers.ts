import { useMemo } from "react";
import type { LiturgicalDay } from "../data/liturgicalCalendar";
import { reviewMassProperResolver } from "../services/massProperResolver";

export function useMassPropers(liturgicalDay: LiturgicalDay) {
  return useMemo(() => reviewMassProperResolver.resolve(liturgicalDay), [liturgicalDay.date]);
}
