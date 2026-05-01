import type { MassWindow, SundayState } from "../types";

const defaultMassWindow: MassWindow = {
  day: 0,
  startHour: 12,
  endHour: 14
};

let sundayStateOverride: SundayState | null = null;

export function setSundayStateOverride(state: SundayState | null) {
  sundayStateOverride = state;
}

export function clearSundayStateOverride() {
  sundayStateOverride = null;
}

export function getSundayState(date: Date, massWindow: MassWindow = defaultMassWindow): SundayState {
  if (sundayStateOverride) {
    return sundayStateOverride;
  }

  const massDay = massWindow.day ?? 0;
  const day = date.getDay();
  const hour = date.getHours();

  if (day === 6 && massDay === 0) {
    return "beforeMass";
  }

  if (day !== massDay) {
    return "weekday";
  }

  if (hour < massWindow.startHour) {
    return "beforeMass";
  }

  if (hour >= massWindow.startHour && hour < massWindow.endHour) {
    return "duringMass";
  }

  return "afterMass";
}

export function getSundayMode(date: Date): "prepare" | "attend" | "reflect" {
  const state = getSundayState(date);

  const modeByState = {
    beforeMass: "prepare",
    duringMass: "attend",
    afterMass: "reflect",
    weekday: "reflect"
  } as const;

  return modeByState[state];
}
