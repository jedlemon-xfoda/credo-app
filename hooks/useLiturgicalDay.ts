import { useMemo } from "react";
import { resolveLiturgicalDay } from "../data/liturgicalCalendar";

export function useLiturgicalDay(date = new Date()) {
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return useMemo(() => resolveLiturgicalDay(dateKey), [dateKey]);
}
