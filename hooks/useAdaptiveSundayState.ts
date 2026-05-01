import { useMemo } from "react";
import type { MassWindow } from "../types";
import { getSundayState } from "../utils/sacredTime";

export function useAdaptiveSundayState(now = new Date(), massWindow?: MassWindow) {
  return useMemo(() => getSundayState(now, massWindow), [massWindow, now]);
}
