import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, screen, waitFor } from "@testing-library/react-native";
import RootGate from "../app/index";
import WelcomeScreen from "../app/welcome";
import { storageKeys } from "../constants/storage";
import { router } from "../jest.setup";

describe("root onboarding gate", () => {
  it("does not render Welcome while profile hydration is pending", async () => {
    render(<RootGate />);

    expect(screen.queryByText("CREDO")).toBeNull();
    expect(screen.queryByText("Begin")).toBeNull();
  });

  it("routes existing profile to Home without rendering Welcome", async () => {
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ experienceMode: "guided" }));

    render(<RootGate />);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
    });
    expect(screen.queryByText("CREDO")).toBeNull();
    expect(screen.queryByText("Begin")).toBeNull();
  });

  it("routes missing profile to the dedicated Welcome route", async () => {
    render(<RootGate />);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/welcome");
    });
    expect(screen.queryByText("CREDO")).toBeNull();
    expect(router.replace).not.toHaveBeenCalledWith("/(tabs)/home");
  });

  it("cold launch without profile still has a Welcome screen", async () => {
    render(<WelcomeScreen />);

    expect(screen.getByText("CREDO")).toBeTruthy();
    expect(screen.getByText("Begin")).toBeTruthy();
  });
});
