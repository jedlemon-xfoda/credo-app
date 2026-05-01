import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import PrepareScreen from "../app/(tabs)/home/prepare";
import { storageKeys } from "../constants/storage";
import { createDefaultJourneyState, getLocalDateKey } from "../services/journeyState";
import { router } from "../jest.setup";

describe("Prepare flow QA fixes", () => {
  it("Prepare Step 2 back returns to Step 1", async () => {
    render(<PrepareScreen />);

    fireEvent.press(screen.getByText("Continue"));
    await waitFor(() => {
      expect(screen.getByText("What to Notice")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Previous Prepare step"));

    await waitFor(() => {
      expect(screen.getByText("Today's Readings")).toBeTruthy();
    });
    expect(router.back).not.toHaveBeenCalled();
  });

  it("Prepare Step 3 back returns to Step 2", async () => {
    render(<PrepareScreen />);

    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByText("Continue"));
    await waitFor(() => {
      expect(screen.getByText("Bring Intention")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Previous Prepare step"));

    await waitFor(() => {
      expect(screen.getByText("What to Notice")).toBeTruthy();
    });
  });

  it("Prepare Step 3 I'll come back later routes Home without starting Attend", async () => {
    render(<PrepareScreen />);

    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByText("Continue"));
    await waitFor(() => {
      expect(screen.getByText("I'll come back later")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("I'll come back later"));

    expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
    const stored = await AsyncStorage.getItem(storageKeys.dailyJourneyState);
    expect(stored).toContain('"prepare":"in_progress"');
    expect(stored).toContain('"prepareStep":2');
    expect(stored).not.toContain('"attend":"in_progress"');
  });

  it("Prepare Step 3 ready for Mass replaces into Attend so Prepare is not under the stack", async () => {
    render(<PrepareScreen />);

    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByText("Continue"));
    await waitFor(() => {
      expect(screen.getByText("I'm ready for Mass")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("I'm ready for Mass"));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/(tabs)/home/attend");
    });
    expect(router.push).not.toHaveBeenCalledWith("/(tabs)/home/attend");
  });

  it("Attend entry from Prepare performs only the Attend replace navigation", async () => {
    render(<PrepareScreen />);

    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByText("I'm ready for Mass"));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledTimes(1);
    });
    expect(router.replace).toHaveBeenCalledWith("/(tabs)/home/attend");
  });

  it("Prepare resumes the last in-progress step", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "in_progress", attend: "not_started", reflect: "not_started" },
        currentStep: "prepare",
        prepareStep: 2
      })
    );

    render(<PrepareScreen />);

    await waitFor(() => {
      expect(screen.getByText("Bring Intention")).toBeTruthy();
    });
  });
});
