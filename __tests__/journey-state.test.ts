import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageKeys } from "../constants/storage";
import {
  createDefaultJourneyState,
  getLocalDateKey,
  getNextIncompleteStep,
  loadJourneyState,
  markStepCompleteInState,
  markStepStartedInState
} from "../services/journeyState";

describe("daily journey state", () => {
  it("stored yesterday state resets to default today", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState("1999-01-01"),
        steps: { prepare: "complete", attend: "complete", reflect: "complete" },
        currentStep: "reflect"
      })
    );

    const loaded = await loadJourneyState();

    expect(loaded.date).toBe(getLocalDateKey());
    expect(loaded.currentStep).toBe("prepare");
    expect(loaded.steps.prepare).toBe("not_started");
  });

  it("same date loads existing state", async () => {
    const today = getLocalDateKey();
    const state = { ...createDefaultJourneyState(today), currentStep: "attend" as const };
    await AsyncStorage.setItem(storageKeys.dailyJourneyState, JSON.stringify(state));

    await expect(loadJourneyState()).resolves.toMatchObject({ date: today, currentStep: "attend" });
  });

  it("migrates old stored receive state to reflect", async () => {
    const today = getLocalDateKey();
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(today),
        steps: { prepare: "complete", attend: "complete", receive: "in_progress" },
        currentStep: "receive",
        completedAt: { receive: "2026-04-30T10:00:00.000Z" }
      })
    );

    const loaded = await loadJourneyState();

    expect(loaded.currentStep).toBe("reflect");
    expect(loaded.steps).toEqual({ prepare: "complete", attend: "complete", reflect: "in_progress" });
    expect(loaded.completedAt?.reflect).toBe("2026-04-30T10:00:00.000Z");
    expect(JSON.stringify(loaded)).not.toContain("receive");
  });

  it("drops old stored live state and resets invalid current step", async () => {
    const today = getLocalDateKey();
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(today),
        steps: { prepare: "complete", attend: "complete", live: "in_progress" },
        currentStep: "live",
        completedAt: { live: "2026-04-30T10:00:00.000Z" }
      })
    );

    const loaded = await loadJourneyState();

    expect(loaded.currentStep).toBe("reflect");
    expect(loaded.steps).toEqual({ prepare: "complete", attend: "complete", reflect: "not_started" });
    expect(JSON.stringify(loaded)).not.toContain("live");
  });

  it("moves currentStep through the locked journey order", () => {
    let state = createDefaultJourneyState("2026-04-30");
    expect(state.currentStep).toBe("prepare");

    state = markStepCompleteInState(state, "prepare");
    expect(state.currentStep).toBe("attend");

    state = markStepCompleteInState(state, "attend");
    expect(state.currentStep).toBe("reflect");

    state = markStepCompleteInState(state, "reflect");
    expect(getNextIncompleteStep(state)).toBe("reflect");
    expect(Object.values(state.steps).every((value) => value === "complete")).toBe(true);
  });

  it("allows Attend before Prepare without changing Prepare status", () => {
    const state = markStepStartedInState(createDefaultJourneyState("2026-04-30"), "attend");

    expect(state.currentStep).toBe("attend");
    expect(state.steps.attend).toBe("in_progress");
    expect(state.steps.prepare).toBe("not_started");
  });

  it("revisiting completed Prepare keeps it complete", () => {
    let state = markStepCompleteInState(createDefaultJourneyState("2026-04-30"), "prepare");
    state = markStepStartedInState(state, "prepare");

    expect(state.steps.prepare).toBe("complete");
  });
});
