import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import ReflectScreen from "../app/(tabs)/home/reflect";
import HomeScreen from "../app/(tabs)/home";
import LearnScreen from "../app/(tabs)/learn";
import LearnDetailScreen from "../app/(tabs)/learn/[section]";
import JournalScreen from "../app/(tabs)/journal";
import { storageKeys } from "../constants/storage";
import { createDefaultJourneyState, getLocalDateKey } from "../services/journeyState";
import { router } from "../jest.setup";

describe("Journal, Learn, and Reflect QA fixes", () => {
  it("Journal is review-only and does not expose journey completion CTA", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "complete", reflect: "in_progress" },
        currentStep: "reflect"
      })
    );

    render(<JournalScreen />);

    await waitFor(() => {
      expect(screen.getByText("Journal")).toBeTruthy();
    });
    expect(screen.queryByText("I'm ready")).toBeNull();
    await expect(AsyncStorage.getItem(storageKeys.dailyJourneyState)).resolves.toContain('"reflect":"in_progress"');
  });

  it("Learn cards navigate to detail screens", () => {
    render(<LearnScreen />);

    fireEvent.press(screen.getByLabelText("Open Liturgy of the Word"));

    expect(router.push).toHaveBeenCalledWith("/learn/liturgy-word");
  });

  it("Learn detail shows subsections, explanation, and section parts", () => {
    render(<LearnDetailScreen />);

    expect(screen.getByText("Introductory Rites")).toBeTruthy();
    expect(screen.getByText("Subsections")).toBeTruthy();
    expect(screen.getByText("Dive Deeper")).toBeTruthy();
    expect(screen.getByText("Parts")).toBeTruthy();
    expect(screen.getAllByText("Entrance Chant").length).toBeGreaterThan(0);
    expect(screen.getByText("What")).toBeTruthy();
    expect(screen.getByText("Why")).toBeTruthy();
    expect(screen.getByText("How")).toBeTruthy();
  });

  it("Reflect keeps Save Reflection button accessible", () => {
    render(<ReflectScreen />);

    return waitFor(() => {
      expect(screen.getByLabelText("Save Reflection")).toBeTruthy();
    });
  });

  it("Reflect Skip for now keeps Reflect in progress and routes Home with replace", async () => {
    render(<ReflectScreen />);

    fireEvent.press(screen.getByText("Skip for now"));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
    });
    expect(router.push).not.toHaveBeenCalledWith("/(tabs)/journal");
    await expect(AsyncStorage.getItem(storageKeys.dailyJourneyState)).resolves.toContain('"reflect":"in_progress"');
  });

  it("Reflect Save Reflection saves and routes Journal with replace", async () => {
    render(<ReflectScreen />);

    fireEvent.changeText(screen.getByLabelText("Reflection"), "A quiet grace.");
    fireEvent.press(screen.getByText("Save Reflection"));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/(tabs)/journal");
    });
    expect(router.push).not.toHaveBeenCalledWith("/(tabs)/journal");
    await expect(AsyncStorage.getItem(storageKeys.reflections)).resolves.toContain("A quiet grace.");
    await expect(AsyncStorage.getItem(storageKeys.dailyJourneyState)).resolves.toContain('"reflect":"complete"');
  });

  it("Home Reflect row shows Continue after Reflect skip", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "complete", reflect: "in_progress" },
        currentStep: "reflect"
      })
    );

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText("Continue Reflection")).toBeTruthy();
    });
    expect(screen.getByText("Continue")).toBeTruthy();
  });

  it("Home Reflect row shows Review after Reflect save", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "complete", reflect: "complete" },
        currentStep: "reflect"
      })
    );

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText("You've completed today's journey")).toBeTruthy();
    });
    expect(screen.getAllByText("Review").length).toBeGreaterThanOrEqual(3);
  });
});
