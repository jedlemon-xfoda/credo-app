import { useMemo } from "react";
import { getLocalDateKey, resolveLiturgicalDay } from "../data/liturgicalCalendar";

const REVIEW_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function useLiturgicalDay(date = new Date()) {
  const dateKey = resolveAttendDateKey(date);
  return useMemo(() => resolveLiturgicalDay(dateKey), [dateKey]);
}

export function resolveAttendDateKey(date = new Date(), reviewDate = getReviewDateOverride()) {
  return isValidReviewDateOverride(reviewDate) ? reviewDate : getLocalDateKey(date);
}

export function isValidReviewDateOverride(reviewDate: string | undefined): reviewDate is string {
  return Boolean(reviewDate && REVIEW_DATE_PATTERN.test(reviewDate));
}

function getReviewDateOverride() {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.EXPO_PUBLIC_ATTEND_REVIEW_DATE;
}
