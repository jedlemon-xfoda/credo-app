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
    fireEvent.press(screen.getByLabelText("Continue to Reflection"));

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
    fireEvent.press(screen.getByLabelText("Open Attend guide"));
    fireEvent.press(screen.getByText("Restart Mass"));

    await waitFor(() => {
      expect(screen.getAllByText("Entrance Chant").length).toBeGreaterThan(0);
    });
    const stored = await AsyncStorage.getItem(storageKeys.dailyJourneyState);
    expect(stored).toContain('"attend":"in_progress"');
    expect(stored).toContain('"attendPosition":"entrance"');
  });

  it("Attend live screen does not render the old mode switch", async () => {
    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Entrance Chant")).toBeTruthy();
    });
    expect(screen.queryByText("Guided")).toBeNull();
    expect(screen.queryByText("Quiet")).toBeNull();
    expect(screen.queryByText("Learn")).toBeNull();
  });

  it("Attend live screen remains guided internally while profile experienceMode is quiet", async () => {
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ experienceMode: "quiet" }));

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Entrance hymn begins")).toBeTruthy();
    });
    expect(screen.queryByLabelText("quiet mode")).toBeNull();
  });

  it("Attend live screen remains guided internally when profile experienceMode is not_sure", async () => {
    await AsyncStorage.setItem(storageKeys.userMassProfile, JSON.stringify({ experienceMode: "not_sure" }));

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Entrance hymn begins")).toBeTruthy();
    });
    expect(screen.queryByLabelText("guided mode")).toBeNull();
  });

  it("groups the Greeting listen and response on one guided screen", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "greeting"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Make the Sign of the Cross")).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));

    await waitFor(() => {
      expect(screen.getByText("The Lord be with you.")).toBeTruthy();
    });
    expect(screen.getByText("And with your spirit.")).toBeTruthy();
    expect(screen.getByText("Hearing something different?")).toBeTruthy();
  });

  it("groups the three Kyrie invocations on one guided screen", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "penitential-act"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("Penitential Act").length).toBeGreaterThan(0);
    });

    for (let count = 0; count < 6; count += 1) {
      fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    }

    expect(screen.getAllByText("Lord, have mercy.").length).toBe(2);
    expect(screen.getByText("Christ, have mercy.")).toBeTruthy();
  });

  it("groups Collect listen, description, and Amen on one guided screen", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "collect"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Opening Prayer")).toBeTruthy();
    });
    expect(screen.getByText("The priest prays on behalf of the Church.")).toBeTruthy();
    expect(screen.getByText("Bring your intention quietly.")).toBeTruthy();
    expect(screen.getByText("Amen.")).toBeTruthy();
  });

  it("shows canonical Gospel dialogue, gesture, and ending responses", async () => {
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
      expect(screen.getByText("The Lord be with you.")).toBeTruthy();
    });
    expect(screen.getByText("And with your spirit.")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    expect(screen.getByText("Make a small cross on your forehead, lips, and heart.")).toBeTruthy();
    expect(screen.getByText("Glory to you, O Lord.")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    expect(screen.getByText("The Gospel of the Lord.")).toBeTruthy();
    expect(screen.getByText("Praise to you, Lord Jesus Christ.")).toBeTruthy();
  });

  it("shows the Preface dialogue as guided response cadence", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "preface"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("The Lord be with you.")).toBeTruthy();
    });
    expect(screen.getByText("And with your spirit.")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    expect(screen.getByText("Lift up your hearts.")).toBeTruthy();
    expect(screen.getByText("We lift them up to the Lord.")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    expect(screen.getByText("Let us give thanks to the Lord our God.")).toBeTruthy();
    expect(screen.getByText("It is right and just.")).toBeTruthy();
  });

  it("shows Communion invitation, response, and reception Amen", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "communion"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Behold the Lamb of God.")).toBeTruthy();
    });
    expect(screen.getByText("Lord, I am not worthy that you should enter under my roof.")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    expect(screen.getByText("The Body of Christ.")).toBeTruthy();
    expect(screen.getByText("Amen.")).toBeTruthy();
  });

  it("shows Dismissal response before completing Attend", async () => {
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
      expect(screen.getByText("Go in peace.")).toBeTruthy();
    });
    expect(screen.getByText("Thanks be to God.")).toBeTruthy();
    expect(screen.getByText("Mass is ending")).toBeTruthy();
  });

  it("Attend Exit always routes Home", async () => {
    render(<AttendScreen />);

    fireEvent.press(screen.getByLabelText("Return Home"));

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
      expect(screen.getByLabelText("Continue to Reflection")).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText("Continue to Reflection"));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/(tabs)/home/reflect");
    });
  });

  it("Attend Exit does not mark Attend complete", async () => {
    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("Return Home")).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText("Return Home"));

    await waitFor(async () => {
      const stored = await AsyncStorage.getItem(storageKeys.dailyJourneyState);
      expect(stored).not.toContain('"attend":"complete"');
    });
  });

  it("Attend Exit does not write journey state during the exit action", async () => {
    const saveSpy = jest.spyOn(journeyStateService, "saveJourneyState");
    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("Return Home")).toBeTruthy();
    });
    saveSpy.mockClear();
    fireEvent.press(screen.getByLabelText("Return Home"));

    expect(saveSpy).not.toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
    saveSpy.mockRestore();
  });

  it("Attend Exit suppresses pending position persistence", async () => {
    const positionSpy = jest.spyOn(journeyStateService, "setAttendPositionInState");

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("Return Home")).toBeTruthy();
    });
    positionSpy.mockClear();
    fireEvent.press(screen.getByLabelText("Return Home"));

    expect(positionSpy).not.toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
    expect(router.replace).not.toHaveBeenCalledWith("/(tabs)/home/reflect");
    positionSpy.mockRestore();
  });

  it("Attend Exit does not route through root or onboarding", async () => {
    render(<AttendScreen />);

    fireEvent.press(screen.getByLabelText("Return Home"));

    expect(router.replace).toHaveBeenCalledWith("/(tabs)/home");
    expect(router.replace).not.toHaveBeenCalledWith("/");
    expect(router.replace).not.toHaveBeenCalledWith("/welcome");
    expect(router.replace).not.toHaveBeenCalledWith("/onboarding");
    expect(router.push).not.toHaveBeenCalledWith("/");
    expect(router.push).not.toHaveBeenCalledWith("/welcome");
    expect(router.push).not.toHaveBeenCalledWith("/onboarding");
  });
});
