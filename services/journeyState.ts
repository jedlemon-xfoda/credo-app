import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageKeys } from "../constants/storage";
import type { DailyJourneyState, JourneyStepId, UserMassProfile } from "../types";

export const journeyOrder: JourneyStepId[] = ["prepare", "attend", "reflect"];

export const defaultProfile: UserMassProfile = {
  experienceMode: "guided",
  familiarity: "not_sure",
  massTypePreference: "sunday",
  parishStyle: "balanced"
};

export function getLocalDateKey(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createDefaultJourneyState(date = getLocalDateKey()): DailyJourneyState {
  return {
    date,
    steps: {
      prepare: "not_started",
      attend: "not_started",
      reflect: "not_started"
    },
    currentStep: "prepare"
  };
}

export function sanitizeJourneyStepId(step: unknown): JourneyStepId | null {
  if (step === "prepare" || step === "attend" || step === "reflect") {
    return step;
  }
  if (step === "receive") {
    return "reflect";
  }
  return null;
}

export function getNextIncompleteStep(state: DailyJourneyState): JourneyStepId {
  return journeyOrder.find((step) => state.steps[step] !== "complete") ?? "reflect";
}

export function resetIfNewDay(state: DailyJourneyState | null | undefined, today = getLocalDateKey()) {
  if (!state || state.date !== today) {
    return createDefaultJourneyState(today);
  }
  return state;
}

export function markStepStartedInState(state: DailyJourneyState, stepId: JourneyStepId): DailyJourneyState {
  if (state.currentStep === stepId && state.steps[stepId] !== "not_started") {
    return state;
  }

  return {
    ...state,
    currentStep: stepId,
    steps: {
      ...state.steps,
      [stepId]: state.steps[stepId] === "not_started" ? "in_progress" : state.steps[stepId]
    }
  };
}

export function markStepCompleteInState(state: DailyJourneyState, stepId: JourneyStepId, timestamp = new Date().toISOString()): DailyJourneyState {
  const nextState: DailyJourneyState = {
    ...state,
    steps: {
      ...state.steps,
      [stepId]: "complete"
    },
    completedAt: {
      ...state.completedAt,
      [stepId]: timestamp
    }
  };
  if (stepId === "prepare") {
    nextState.prepareStep = undefined;
  }
  return {
    ...nextState,
    currentStep: getNextIncompleteStep(nextState)
  };
}

export function setAttendPositionInState(state: DailyJourneyState, attendPosition?: string): DailyJourneyState {
  if (state.attendPosition === attendPosition) {
    return state;
  }

  return {
    ...state,
    attendPosition
  };
}

export function setPrepareStepInState(state: DailyJourneyState, prepareStep: number): DailyJourneyState {
  return {
    ...state,
    currentStep: state.steps.prepare === "complete" ? state.currentStep : "prepare",
    prepareStep,
    steps: {
      ...state.steps,
      prepare: state.steps.prepare === "not_started" ? "in_progress" : state.steps.prepare
    }
  };
}

export function restartAttendInState(state: DailyJourneyState): DailyJourneyState {
  const { attendPosition: _attendPosition, completedAt, ...rest } = state;
  const { attend: _attendCompletedAt, ...nextCompletedAt } = completedAt ?? {};

  return {
    ...rest,
    currentStep: "attend",
    steps: {
      ...state.steps,
      attend: "not_started"
    },
    completedAt: nextCompletedAt
  };
}

export async function loadJourneyState() {
  const today = getLocalDateKey();
  const stored = await AsyncStorage.getItem(storageKeys.dailyJourneyState);
  let parsed: DailyJourneyState | null = null;

  if (stored) {
    try {
      parsed = JSON.parse(stored) as DailyJourneyState;
    } catch {
      parsed = null;
    }
  }

  const state = normalizeJourneyState(resetIfNewDay(parsed, today));
  const serialized = JSON.stringify(state);
  if (stored !== serialized) {
    await AsyncStorage.setItem(storageKeys.dailyJourneyState, serialized);
  }
  return state;
}

function normalizeJourneyState(state: DailyJourneyState): DailyJourneyState {
  const legacySteps = state.steps as Partial<Record<JourneyStepId | "receive" | "live", "not_started" | "in_progress" | "complete">>;
  const legacyCompletedAt = state.completedAt as Partial<Record<JourneyStepId | "receive" | "live", string>> | undefined;
  const steps: DailyJourneyState["steps"] = {
    prepare: isJourneyStepStatus(legacySteps.prepare) ? legacySteps.prepare : "not_started",
    attend: isJourneyStepStatus(legacySteps.attend) ? legacySteps.attend : "not_started",
    reflect: isJourneyStepStatus(legacySteps.reflect) ? legacySteps.reflect : isJourneyStepStatus(legacySteps.receive) ? legacySteps.receive : "not_started"
  };
  const sanitizedCurrent = sanitizeJourneyStepId(state.currentStep);
  const currentStep = sanitizedCurrent ?? getNextIncompleteStep({ ...state, steps, currentStep: "prepare" });

  return {
    ...state,
    currentStep,
    steps,
    completedAt: legacyCompletedAt
      ? {
          prepare: legacyCompletedAt.prepare,
          attend: legacyCompletedAt.attend,
          reflect: legacyCompletedAt.reflect ?? legacyCompletedAt.receive
        }
      : undefined
  };
}

function isJourneyStepStatus(value: unknown): value is DailyJourneyState["steps"][JourneyStepId] {
  return value === "not_started" || value === "in_progress" || value === "complete";
}

export async function saveJourneyState(state: DailyJourneyState) {
  await AsyncStorage.setItem(storageKeys.dailyJourneyState, JSON.stringify(state));
}

export async function loadUserMassProfile() {
  const stored = await AsyncStorage.getItem(storageKeys.userMassProfile);
  if (!stored) {
    await saveUserMassProfile(defaultProfile);
    return defaultProfile;
  }

  try {
    return { ...defaultProfile, ...(JSON.parse(stored) as Partial<UserMassProfile>) };
  } catch {
    await saveUserMassProfile(defaultProfile);
    return defaultProfile;
  }
}

export async function saveUserMassProfile(profile: UserMassProfile) {
  await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify(profile));
}
