import { useCallback, useEffect, useRef, useState } from "react";
import type { DailyJourneyState, JourneyStepId } from "../types";
import { loadJourneyState, markStepCompleteInState, markStepStartedInState, restartAttendInState, saveJourneyState, setAttendPositionInState, setPrepareStepInState } from "../services/journeyState";

export function useDailyJourney() {
  const [state, setState] = useState<DailyJourneyState | null>(null);
  const [ready, setReady] = useState(false);
  const stateRef = useRef<DailyJourneyState | null>(null);

  const refresh = useCallback(async (options?: { ignoreTransientFields?: boolean }) => {
    const next = await loadJourneyState();
    const previous = stateRef.current;
    stateRef.current = next;
    if (!journeyStatesEqual(previous, next, options?.ignoreTransientFields)) {
      setState(next);
    }
    setReady((current) => current || true);
    return next;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const persist = useCallback(async (next: DailyJourneyState) => {
    if (stateRef.current === next) {
      return next;
    }

    stateRef.current = next;
    setState(next);
    await saveJourneyState(next);
    return next;
  }, []);

  const markStepStarted = useCallback(
    async (stepId: JourneyStepId) => {
      const current = stateRef.current ?? (await loadJourneyState());
      stateRef.current = current;
      return persist(markStepStartedInState(current, stepId));
    },
    [persist]
  );

  const markStepComplete = useCallback(
    async (stepId: JourneyStepId) => {
      const current = stateRef.current ?? (await loadJourneyState());
      stateRef.current = current;
      return persist(markStepCompleteInState(current, stepId));
    },
    [persist]
  );

  const setAttendPosition = useCallback(
    async (attendPosition?: string) => {
      const current = stateRef.current ?? (await loadJourneyState());
      stateRef.current = current;
      return persist(setAttendPositionInState(current, attendPosition));
    },
    [persist]
  );

  const restartAttend = useCallback(async () => {
    const current = stateRef.current ?? (await loadJourneyState());
    stateRef.current = current;
    return persist(restartAttendInState(current));
  }, [persist]);

  const setPrepareStep = useCallback(
    async (prepareStep: number) => {
      const current = stateRef.current ?? (await loadJourneyState());
      stateRef.current = current;
      return persist(setPrepareStepInState(current, prepareStep));
    },
    [persist]
  );

  return {
    state,
    ready,
    refresh,
    markStepStarted,
    markStepComplete,
    setAttendPosition,
    setPrepareStep,
    restartAttend
  };
}

function journeyStatesEqual(previous: DailyJourneyState | null, next: DailyJourneyState, ignoreTransientFields = false) {
  if (!previous) {
    return false;
  }

  if (!ignoreTransientFields) {
    return JSON.stringify(previous) === JSON.stringify(next);
  }

  return JSON.stringify(toStableJourneyView(previous)) === JSON.stringify(toStableJourneyView(next));
}

function toStableJourneyView(state: DailyJourneyState) {
  return {
    date: state.date,
    steps: state.steps,
    currentStep: state.currentStep,
    completedAt: state.completedAt
  };
}
