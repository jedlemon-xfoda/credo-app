import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import fs from "fs";
import path from "path";
import TabLayout from "../app/(tabs)/_layout";
import HomeScreen from "../app/(tabs)/home";
import { storageKeys } from "../constants/storage";
import { createDefaultJourneyState, getLocalDateKey } from "../services/journeyState";
import { mockTabPreventDefault, router, setMockPathname } from "../jest.setup";

describe("v2 navigation and Home", () => {
  it("bottom nav is Home Learn Journal Profile", () => {
    render(<TabLayout />);

    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Learn")).toBeTruthy();
    expect(screen.getByText("Journal")).toBeTruthy();
    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.queryByText("Sunday")).toBeNull();
    expect(screen.queryByText("Mass")).toBeNull();
    expect(screen.queryByText("Way")).toBeNull();
  });

  it("pressing the already-focused root tab does not refresh it", () => {
    setMockPathname("/home");
    render(<TabLayout />);

    fireEvent.press(screen.getByLabelText("Home tab"));

    expect(mockTabPreventDefault).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it.each([
    ["/learn", "Learn tab"],
    ["/journal", "Journal tab"],
    ["/profile", "Profile tab"]
  ])("pressing %s root tab does not refresh it", (pathname, label) => {
    setMockPathname(pathname);
    render(<TabLayout />);

    fireEvent.press(screen.getByLabelText(label));

    expect(mockTabPreventDefault).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("switching tabs still routes to each tab root", () => {
    setMockPathname("/journal");
    render(<TabLayout />);

    fireEvent.press(screen.getByLabelText("Home tab"));

    expect(mockTabPreventDefault).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
  });

  it.each(["/home/prepare", "/home/attend", "/home/reflect"])("pressing Home from %s returns to Home root", (pathname) => {
    setMockPathname(pathname);
    render(<TabLayout />);

    fireEvent.press(screen.getByLabelText("Home tab"));

    expect(mockTabPreventDefault).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
  });

  it("pressing Learn from a Learn detail returns to Learn root", () => {
    setMockPathname("/learn/liturgy-word");
    render(<TabLayout />);

    fireEvent.press(screen.getByLabelText("Learn tab"));

    expect(mockTabPreventDefault).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/(tabs)/learn");
  });

  it("Home starts with Prepare as the suggested next step and keeps journey labels", async () => {
    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText("Begin with Prepare")).toBeTruthy();
    });
    expect(screen.getByText("Begin Prepare")).toBeTruthy();
    expect(screen.getByText("Prepare")).toBeTruthy();
    expect(screen.getByText("Attend")).toBeTruthy();
    expect(screen.getByText("Reflect")).toBeTruthy();
    expect(screen.queryByText("Receive")).toBeNull();
    expect(screen.queryByText("Live")).toBeNull();
    expect(screen.getByText("Easter Season")).toBeTruthy();
    expect(screen.getByText("White")).toBeTruthy();
    expect(screen.getByText("Daily Mass")).toBeTruthy();
  });

  it("Home next-step copy reflects Prepare in progress", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "in_progress", attend: "not_started", reflect: "not_started" },
        currentStep: "prepare"
      })
    );

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText("Continue Preparing for Mass")).toBeTruthy();
    });
    expect(screen.getByText("Continue Preparing")).toBeTruthy();
  });

  it("Home next-step copy reflects Attend in progress", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend"
      })
    );

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText("Continue Attending Mass")).toBeTruthy();
    });
    expect(screen.getByText("Continue Attending")).toBeTruthy();
  });

  it("Home next-step copy reflects pending Reflect", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "complete", reflect: "not_started" },
        currentStep: "reflect"
      })
    );

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText("Reflect after Mass")).toBeTruthy();
    });
    expect(screen.getByText("Begin Reflection")).toBeTruthy();
  });

  it("Home can start Attend while Prepare is not started", async () => {
    render(<HomeScreen />);

    await waitFor(() => screen.getByText("Attend"));
    fireEvent.press(screen.getByLabelText("Attend journey step"));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/(tabs)/home/attend");
    });
    await waitFor(async () => {
      const stored = await AsyncStorage.getItem(storageKeys.dailyJourneyState);
      expect(stored).toContain('"attend":"in_progress"');
      expect(stored).toContain('"prepare":"not_started"');
    });
  });

  it("Home Reflect journey row routes to Reflect, not Journal", async () => {
    render(<HomeScreen />);

    await waitFor(() => screen.getByText("Reflect"));
    fireEvent.press(screen.getByLabelText("Reflect journey step"));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/(tabs)/home/reflect");
    });
  });

  it("Home journey routes each current step to the correct current route", async () => {
    render(<HomeScreen />);

    await waitFor(() => screen.getByText("Prepare"));
    fireEvent.press(screen.getByLabelText("Prepare journey step"));
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/(tabs)/home/prepare");
    });

    fireEvent.press(screen.getByLabelText("Attend journey step"));
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/(tabs)/home/attend");
    });

    fireEvent.press(screen.getByLabelText("Reflect journey step"));
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/(tabs)/home/reflect");
    });
  });

  it("app source does not link to stale Home Live, Home Receive, or root Attend routes", () => {
    const appRoot = path.join(process.cwd(), "app");
    const files = listSourceFiles(appRoot);
    const source = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");

    expect(source).not.toContain("/home/live");
    expect(source).not.toContain("/home/receive");
    expect(source).not.toContain("/(tabs)/live");
    expect(source).not.toContain("/prayer-mode");
  });

  it("Home root does not auto-route into Reflect when Reflect is current", async () => {
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
    expect(router.push).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("Home shows completed rows as Review and next current step", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "not_started", reflect: "not_started" },
        currentStep: "attend"
      })
    );

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText("Begin Attending Mass")).toBeTruthy();
    });
    expect(screen.getByText("Review")).toBeTruthy();
    expect(screen.queryByText("Done")).toBeNull();
  });

  it("Home all-complete copy matches the journey completion state", async () => {
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
    expect(screen.getByText("Revisit any step")).toBeTruthy();
    expect(screen.queryByText("Done")).toBeNull();
  });
});

function listSourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listSourceFiles(fullPath);
    }
    return /\.(tsx?|jsx?)$/.test(entry.name) ? [fullPath] : [];
  });
}
