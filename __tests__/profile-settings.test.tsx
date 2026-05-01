import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import ProfileScreen from "../app/(tabs)/profile";
import ProfileSelectionScreen from "../app/(tabs)/profile/[field]";
import { storageKeys } from "../constants/storage";
import { createDefaultJourneyState, getLocalDateKey } from "../services/journeyState";
import { router, setMockSearchParams } from "../jest.setup";

describe("Profile settings", () => {
  it("routes profile rows to explicit selection instead of cycling", async () => {
    const journey = {
      ...createDefaultJourneyState(getLocalDateKey()),
      steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
      currentStep: "attend"
    };
    await AsyncStorage.setItem(storageKeys.dailyJourneyState, JSON.stringify(journey));

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByText("Guided")).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText("Experience Mode"));

    expect(router.push).toHaveBeenCalledWith("/profile/experienceMode");
    await expect(AsyncStorage.getItem(storageKeys.dailyJourneyState)).resolves.toContain('"currentStep":"attend"');
  });

  it("selection screen saves experienceMode without resetting DailyJourneyState", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend"
      })
    );

    render(<ProfileSelectionScreen />);

    await waitFor(() => {
      expect(screen.getByText("Quiet")).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText("Quiet. Simple and prayerful."));

    await waitFor(async () => {
      await expect(AsyncStorage.getItem(storageKeys.userMassProfile)).resolves.toContain('"experienceMode":"quiet"');
    });
    expect(router.back).toHaveBeenCalled();
    await expect(AsyncStorage.getItem(storageKeys.dailyJourneyState)).resolves.toContain('"currentStep":"attend"');
  });

  it("Reset Today's Journey restores initial daily state", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "complete", reflect: "complete" },
        currentStep: "reflect"
      })
    );

    render(<ProfileScreen />);
    fireEvent.press(screen.getByText("Reset Today's Journey"));

    await waitFor(async () => {
      await expect(AsyncStorage.getItem(storageKeys.dailyJourneyState)).resolves.toContain('"currentStep":"prepare"');
    });
    await expect(AsyncStorage.getItem(storageKeys.dailyJourneyState)).resolves.toContain('"prepare":"not_started"');
  });

  it("Reset App Dev clears journey/profile and returns to Welcome", async () => {
    await AsyncStorage.setItem(storageKeys.dailyJourneyState, JSON.stringify(createDefaultJourneyState(getLocalDateKey())));
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ experienceMode: "guided" }));
    await AsyncStorage.setItem(storageKeys.reflections, JSON.stringify([{ id: "1", text: "Saved", date: new Date().toISOString() }]));
    await AsyncStorage.setItem(storageKeys.savedMassItems, "[]");

    render(<ProfileScreen />);
    fireEvent.press(screen.getByText("Reset App (Dev)"));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/");
    });
    await expect(AsyncStorage.getItem(storageKeys.dailyJourneyState)).resolves.toBeNull();
    await expect(AsyncStorage.getItem(storageKeys.userMassProfile)).resolves.toBeNull();
    await expect(AsyncStorage.getItem(storageKeys.reflections)).resolves.toBeNull();
    await expect(AsyncStorage.getItem(storageKeys.savedMassItems)).resolves.toBeNull();
  });

  it("does not render dead Edit Preferences button", async () => {
    render(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByText("Profile")).toBeTruthy();
    });
    expect(screen.queryByText("Edit Preferences")).toBeNull();
  });

  it("uses compact profile values so Somewhat familiar does not wrap in the row", async () => {
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ familiarity: "somewhat" }));

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByText("Somewhat")).toBeTruthy();
    });
    expect(screen.queryByText("Somewhat familiar")).toBeNull();
  });

  it("Profile root refreshes persisted values when focused", async () => {
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ experienceMode: "quiet" }));

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByText("Quiet")).toBeTruthy();
    });
  });

  it("Profile Experience Mode shows Not sure", async () => {
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ experienceMode: "not_sure" }));

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByText("Not sure")).toBeTruthy();
    });
  });

  it("Profile Experience Mode Not sure saves correctly", async () => {
    setMockSearchParams({ field: "experienceMode" });
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ experienceMode: "quiet" }));

    render(<ProfileSelectionScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("Not sure. We'll guide you.")).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText("Not sure. We'll guide you."));

    await waitFor(async () => {
      await expect(AsyncStorage.getItem(storageKeys.userMassProfile)).resolves.toContain('"experienceMode":"not_sure"');
    });
  });

  it("Profile parish style selecting Balanced selects only Balanced", async () => {
    setMockSearchParams({ field: "parishStyle" });
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ parishStyle: "traditional" }));

    render(<ProfileSelectionScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("Balanced. A clear middle path.")).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText("Balanced. A clear middle path."));

    expect(screen.getByLabelText("Balanced. A clear middle path.")).toHaveAccessibilityState({ selected: true });
    expect(screen.getByLabelText("Not sure yet. Use a balanced default.")).toHaveAccessibilityState({ selected: false });
  });

  it("Profile parish style selecting Not sure selects only Not sure", async () => {
    setMockSearchParams({ field: "parishStyle" });
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ parishStyle: "traditional" }));

    render(<ProfileSelectionScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("Not sure yet. Use a balanced default.")).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText("Not sure yet. Use a balanced default."));

    expect(screen.getByLabelText("Not sure yet. Use a balanced default.")).toHaveAccessibilityState({ selected: true });
    expect(screen.getByLabelText("Balanced. A clear middle path.")).toHaveAccessibilityState({ selected: false });
  });

  it("Profile parish style Not sure yet saves and appears on Profile root", async () => {
    setMockSearchParams({ field: "parishStyle" });
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ parishStyle: "traditional" }));

    render(<ProfileSelectionScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("Not sure yet. Use a balanced default.")).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText("Not sure yet. Use a balanced default."));

    await waitFor(async () => {
      await expect(AsyncStorage.getItem(storageKeys.userMassProfile)).resolves.toContain('"parishStyle":"not_sure"');
    });

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByText("Not sure")).toBeTruthy();
    });
  });

  it.each([
    ["Traditional", "traditional", "Traditional. More solemn and classic."],
    ["Balanced", "balanced", "Balanced. A clear middle path."],
    ["Modern", "modern", "Modern. Simple and contemporary."],
    ["Not sure", "not_sure", "Not sure yet. Use a balanced default."]
  ])("Profile parish style %s saves uniquely", async (_label, value, accessibilityLabel) => {
    setMockSearchParams({ field: "parishStyle" });
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ parishStyle: "traditional" }));

    render(<ProfileSelectionScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText(accessibilityLabel)).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText(accessibilityLabel));

    await waitFor(async () => {
      await expect(AsyncStorage.getItem(storageKeys.userMassProfile)).resolves.toContain(`"parishStyle":"${value}"`);
    });
  });
});
