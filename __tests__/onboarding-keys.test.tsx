import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import OnboardingScreen from "../app/onboarding";
import ProfileScreen from "../app/(tabs)/profile";
import { storageKeys } from "../constants/storage";
import { router } from "../jest.setup";

describe("onboarding flow", () => {
  it("renders experience options without duplicate key warnings and without Learn", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    render(<OnboardingScreen />);

    expect(screen.getByText("1 of 4")).toBeTruthy();
    expect(screen.getByText("Quiet")).toBeTruthy();
    expect(screen.getByText("Guided")).toBeTruthy();
    expect(screen.getByText("Not sure")).toBeTruthy();
    expect(screen.queryByText("Learn")).toBeNull();
    expect(errorSpy.mock.calls.flat().join(" ")).not.toContain("same key");

    errorSpy.mockRestore();
  });

  it("keeps only the tapped onboarding option selected", () => {
    render(<OnboardingScreen />);

    fireEvent.press(screen.getByLabelText("Not sure. We'll guide you."));

    expect(screen.getByLabelText("Guided. Gentle guidance.")).toHaveAccessibilityState({ selected: false });
    expect(screen.getByLabelText("Not sure. We'll guide you.")).toHaveAccessibilityState({ selected: true });
  });

  it("onboarding Experience Mode Not sure persists to profile", async () => {
    render(<OnboardingScreen />);

    fireEvent.press(screen.getByLabelText("Not sure. We'll guide you."));
    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByText("Continue"));

    await waitFor(async () => {
      await expect(AsyncStorage.getItem(storageKeys.userMassProfile)).resolves.toContain('"experienceMode":"not_sure"');
    });
  });

  it("does not route Home until all four onboarding steps are completed", async () => {
    render(<OnboardingScreen />);

    fireEvent.press(screen.getByText("Continue"));
    expect(screen.getByText("2 of 4")).toBeTruthy();
    expect(router.replace).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText("Continue"));
    expect(screen.getByText("3 of 4")).toBeTruthy();
    expect(router.replace).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText("Continue"));
    expect(screen.getByText("4 of 4")).toBeTruthy();
    expect(router.replace).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText("Continue"));
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
    });
  });

  it("saves all selected Mass profile fields", async () => {
    render(<OnboardingScreen />);

    fireEvent.press(screen.getByLabelText("Quiet. Simple and prayerful."));
    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByLabelText("Very familiar. Keep it concise."));
    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByLabelText("Both. Sunday and weekday."));
    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByLabelText("Traditional. More solemn and classic."));
    fireEvent.press(screen.getByText("Continue"));

    await waitFor(async () => {
      const stored = await AsyncStorage.getItem(storageKeys.userMassProfile);
      expect(stored).toContain('"experienceMode":"quiet"');
      expect(stored).toContain('"familiarity":"very"');
      expect(stored).toContain('"massTypePreference":"both"');
      expect(stored).toContain('"parishStyle":"traditional"');
    });
  });

  it("onboarding Step 4 Not sure yet persists Parish Style as not_sure", async () => {
    render(<OnboardingScreen />);

    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByLabelText("Not sure yet. Use a balanced default."));
    fireEvent.press(screen.getByText("Continue"));

    await waitFor(async () => {
      await expect(AsyncStorage.getItem(storageKeys.userMassProfile)).resolves.toContain('"parishStyle":"not_sure"');
    });
  });

  it("Profile displays Parish Style saved from onboarding", async () => {
    render(<OnboardingScreen />);

    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByText("Continue"));
    fireEvent.press(screen.getByLabelText("Not sure yet. Use a balanced default."));
    fireEvent.press(screen.getByText("Continue"));

    await waitFor(async () => {
      await expect(AsyncStorage.getItem(storageKeys.userMassProfile)).resolves.toContain('"parishStyle":"not_sure"');
    });

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(screen.getByText("Not sure")).toBeTruthy();
    });
  });
});
