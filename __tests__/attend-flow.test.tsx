import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import AttendScreen from "../app/(tabs)/home/attend";
import { storageKeys } from "../constants/storage";
import { createDefaultJourneyState, getLocalDateKey } from "../services/journeyState";
import * as journeyStateService from "../services/journeyState";
import { router } from "../jest.setup";

describe("Attend flow", () => {
  it("resumes persisted attendPosition", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "not_started", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "gospel"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("Gospel").length).toBeGreaterThan(0);
    });
  });

  it("I'm lost can jump to Gospel and persist attendPosition", async () => {
    render(<AttendScreen />);

    fireEvent.press(screen.getByText("I'm lost"));
    fireEvent.press(screen.getByLabelText("Jump to Gospel"));

    expect(screen.getAllByText("Gospel").length).toBeGreaterThan(0);
    await waitFor(async () => {
      await expect(AsyncStorage.getItem(storageKeys.dailyJourneyState)).resolves.toContain('"attendPosition":"gospel"');
    });
  });

  it("Dismissal Continue to Reflection completes Attend and routes to Reflect without looping", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "dismissal"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("Dismissal").length).toBeGreaterThan(0);
    });
    expect(screen.getByText("Mass is ending")).toBeTruthy();
    expect(screen.getByText("Continue to Reflection")).toBeTruthy();
    fireEvent.press(screen.getByText("Continue to Reflection"));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/(tabs)/home/reflect");
    });
    const stored = await AsyncStorage.getItem(storageKeys.dailyJourneyState);
    expect(stored).toContain('"attend":"complete"');
    expect(stored).toContain('"reflect":"in_progress"');
    expect(stored).not.toContain('"attendPosition":"entrance"');
  });

  it("Restart Mass clears attendPosition, sets Attend not started, and returns to Entrance", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "gospel"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("Gospel").length).toBeGreaterThan(0);
    });
    fireEvent.press(screen.getByText("Restart"));

    await waitFor(() => {
      expect(screen.getAllByText("Entrance").length).toBeGreaterThan(0);
    });
    const stored = await AsyncStorage.getItem(storageKeys.dailyJourneyState);
    expect(stored).toContain('"attend":"in_progress"');
    expect(stored).toContain('"attendPosition":"entrance"');
  });

  it("Attend mode switch only contains Guided and Quiet", async () => {
    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Guided")).toBeTruthy();
    });
    expect(screen.getByText("Quiet")).toBeTruthy();
    expect(screen.queryByText("Learn")).toBeNull();
  });

  it("Attend defaults to Quiet when profile experienceMode is quiet", async () => {
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ experienceMode: "quiet" }));

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("quiet mode")).toHaveAccessibilityState({ selected: true });
    });
  });

  it("Attend defaults to Guided when profile experienceMode is not_sure", async () => {
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ experienceMode: "not_sure" }));

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("guided mode")).toHaveAccessibilityState({ selected: true });
    });
  });

  it("Attend Exit always routes Home", async () => {
    render(<AttendScreen />);

    fireEvent.press(screen.getByText("Exit"));

    expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalledWith("/(tabs)/home/reflect");
    expect(router.replace).not.toHaveBeenCalledWith("/");
    expect(router.replace).not.toHaveBeenCalledWith("/onboarding");
    expect(router.replace).not.toHaveBeenCalledWith("/home/prepare");
  });

  it("Attend Complete routes Reflect", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "dismissal"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Continue to Reflection")).toBeTruthy();
    });
    fireEvent.press(screen.getByText("Continue to Reflection"));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/(tabs)/home/reflect");
    });
  });

  it("Attend Exit does not mark Attend complete", async () => {
    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Exit")).toBeTruthy();
    });
    fireEvent.press(screen.getByText("Exit"));

    await waitFor(async () => {
      const stored = await AsyncStorage.getItem(storageKeys.dailyJourneyState);
      expect(stored).not.toContain('"attend":"complete"');
    });
  });

  it("Attend Exit does not write journey state during the exit action", async () => {
    const saveSpy = jest.spyOn(journeyStateService, "saveJourneyState");
    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Exit")).toBeTruthy();
    });
    saveSpy.mockClear();
    fireEvent.press(screen.getByText("Exit"));

    expect(saveSpy).not.toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
    saveSpy.mockRestore();
  });

  it("Attend Exit suppresses pending position persistence", async () => {
    const positionSpy = jest.spyOn(journeyStateService, "setAttendPositionInState");

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Exit")).toBeTruthy();
    });
    positionSpy.mockClear();
    fireEvent.press(screen.getByText("Exit"));

    expect(positionSpy).not.toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
    expect(router.replace).not.toHaveBeenCalledWith("/(tabs)/home/reflect");
    positionSpy.mockRestore();
  });

  it("Attend Exit does not route through root or onboarding", async () => {
    render(<AttendScreen />);

    fireEvent.press(screen.getByText("Exit"));

    expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
    expect(router.replace).not.toHaveBeenCalledWith("/");
    expect(router.replace).not.toHaveBeenCalledWith("/welcome");
    expect(router.replace).not.toHaveBeenCalledWith("/onboarding");
    expect(router.push).not.toHaveBeenCalledWith("/");
    expect(router.push).not.toHaveBeenCalledWith("/welcome");
    expect(router.push).not.toHaveBeenCalledWith("/onboarding");
  });
});
