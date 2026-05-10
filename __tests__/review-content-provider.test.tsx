import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import AttendScreen from "../app/(tabs)/home/attend";
import PrepareScreen from "../app/(tabs)/home/prepare";
import LearnDetailScreen from "../app/(tabs)/learn/[section]";
import { SourceBadge } from "../components/SourceBadge";
import { storageKeys } from "../constants/storage";
import { attendMassSteps } from "../data/attendMassHierarchy";
import { massFlowSections, massFlowSteps } from "../data/massFlow";
import { reviewContentProvider } from "../data/reviewContentProvider";
import { createDefaultJourneyState, getLocalDateKey } from "../services/journeyState";

describe("review content provider", () => {
  it("provider returns Home mass metadata", async () => {
    const meta = await reviewContentProvider.getTodayMassMeta(new Date());

    expect(meta.title).toBe("Thursday of the Fourth Week of Easter");
    expect(meta.season).toBe("Easter Season");
    expect(meta.liturgicalColor).toBe("White");
    expect(meta.massType).toBe("Daily Mass");
    expect(meta.metadata.textStatus).toBe("review_only");
  });

  it("provider returns Prepare readings with metadata", async () => {
    const readings = await reviewContentProvider.getReadingsForDate(new Date());

    expect(readings.items.length).toBeGreaterThan(0);
    readings.items.forEach((item) => {
      expect(item.title).toBeTruthy();
      expect(item.citation).toBeTruthy();
      expect(item.text).toBeTruthy();
      expect(item.metadata.sourceProvider).toBeTruthy();
      expect(item.metadata.textStatus).toBeTruthy();
      expect(item.metadata.licensingNote).toBeTruthy();
    });
  });

  it("every provider content item has metadata and none is licensed by default", async () => {
    const readings = await reviewContentProvider.getReadingsForDate(new Date());
    const attend = await reviewContentProvider.getAttendContent(new Date());
    const learn = await reviewContentProvider.getLearnContent();
    const allMetadata = [
      readings.metadata,
      ...readings.items.map((item) => item.metadata),
      attend.metadata,
      ...Object.values(attend.steps).map((step) => step.metadata),
      learn.metadata,
      ...learn.sections.map((section) => section.metadata)
    ];

    allMetadata.forEach((metadata) => {
      expect(metadata.sourceProvider).toBeTruthy();
      expect(metadata.textStatus).toBeTruthy();
      expect(metadata.textStatus).not.toBe("licensed");
      expect(metadata.licensingNote).toBeTruthy();
    });
  });

  it("Prepare renders provider readings and source badge", async () => {
    render(<PrepareScreen />);

    await waitFor(() => {
      expect(screen.getByText("Acts 13:13-25")).toBeTruthy();
    });
    expect(screen.getAllByText(/Source: USCCB/)).toHaveLength(1);
    expect(screen.getByText(/Paul recalls the Lord/)).toBeTruthy();
  });

  it("Attend renders MassFlow-backed content", async () => {
    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByTestId("attend-guided-moment")).toBeTruthy();
    });
    expect(screen.getByText("Entrance hymn begins")).toBeTruthy();
    expect(screen.getByText("LISTEN")).toBeTruthy();
  });

  it("Attend steps come from MassFlow", async () => {
    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getAllByText(massFlowSteps[0].title).length).toBeGreaterThan(0);
    });
    expect(massFlowSteps[0].id).toBe("entrance");
    expect(massFlowSteps.at(-1)?.id).toBe("dismissal");
  });

  it("Attend renders live action and guidance layers without opening Learn more", async () => {
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
    expect(screen.getAllByText("Gospel").length).toBeGreaterThan(0);
    expect(screen.getByText("STAND")).toBeTruthy();
    expect(screen.getByTestId("attend-guidance")).toBeTruthy();
    expect(screen.queryByText("What is happening")).toBeNull();
  });

  it("Attend Learn more expands and collapses the third layer", async () => {
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
      expect(screen.getByLabelText("Expand learn more")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Expand learn more"));

    expect(screen.getByLabelText("Collapse learn more")).toBeTruthy();
    expect(screen.getByTestId("attend-learn-scroll")).toBeTruthy();
    expect(screen.getByText("What is happening")).toBeTruthy();
    expect(screen.getByText("What to do")).toBeTruthy();
    expect(screen.getByText("Why it matters")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Collapse learn more"));

    expect(screen.queryByText("What is happening")).toBeNull();
  });

  it("Attend renders guided greeting as phrase-based content", async () => {
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
    expect(screen.getByText("YOU DO")).toBeTruthy();
  });

  it("Attend highlights you responses from MassFlow", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "mystery-of-faith"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("YOU (SAY NOW)")).toBeTruthy();
    });
    expect(screen.getByText(/We proclaim your Death, O Lord/)).toBeTruthy();
  });

  it("Gospel supports both deacon and celebrant roles", async () => {
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
      expect(screen.getByText("DEACON")).toBeTruthy();
    });
    expect(screen.getByText("CELEBRANT")).toBeTruthy();
    expect(screen.getByText("The deacon proclaims the Gospel when present.")).toBeTruthy();
    expect(screen.getByText("If no deacon is present, the celebrant proclaims the Gospel.")).toBeTruthy();
  });

  it("no user-facing Attend content contains placeholder language", async () => {
    const attend = await reviewContentProvider.getAttendContent(new Date());
    const visibleProviderText = Object.values(attend.steps)
      .flatMap((step) => [step.mainLine, step.prayerText, step.guidanceText, step.optionalNote])
      .filter(Boolean)
      .join(" ");
    const visibleFallbackText = attendMassSteps
      .flatMap((step) => [step.mainLine, step.prayerText, step.guidanceText, step.conditionalRule])
      .filter(Boolean)
      .join(" ");

    expect(visibleProviderText).not.toMatch(/placeholder/i);
    expect(visibleFallbackText).not.toMatch(/placeholder/i);
    expect(visibleProviderText).not.toMatch(/appears here/i);
    expect(visibleFallbackText).not.toMatch(/appears here/i);
  });

  it.each([
    ["holy", /Holy, Holy, Holy Lord God of hosts/],
    ["mystery-of-faith", /We proclaim your Death, O Lord/],
    ["lords-prayer", /Our Father, who art in heaven/],
    ["lamb-of-god", /Lamb of God, you take away the sins of the world/]
  ])("Attend renders review prayer text for %s", async (attendPosition, expectedText) => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getAllByText(expectedText).length).toBeGreaterThan(0);
    });
  });

  it("long MassFlow text keeps navigation controls available", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "lords-prayer"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Our Father, who art in heaven/)).toBeTruthy();
    });
    expect(screen.getByLabelText("Return Home")).toBeTruthy();
    expect(screen.getByLabelText("Advance Attend moment")).toBeTruthy();
    expect(screen.getByLabelText("Open Attend guide")).toBeTruthy();
  });

  it.each([
    ["gospel", "DEACON", /The deacon proclaims the Gospel/],
    ["penitential-act", "AMBIENT", "Penitential Act"],
    ["holy", "ALL", /Holy, Holy, Holy Lord God of hosts/],
    ["communion", "YOU (SAY NOW)", "Amen."]
  ])("Attend three-layer UI works for %s", async (attendPosition, roleLabel, expectedText) => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText(roleLabel)).toBeTruthy();
    });
    expect(screen.getByText(roleLabel)).toBeTruthy();
    expect(screen.getAllByText(expectedText).length).toBeGreaterThan(0);
  });

  it("Learn detail renders provider-backed What Why How and references", async () => {
    render(<LearnDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("What")).toBeTruthy();
    });
    expect(screen.getByText("Why")).toBeTruthy();
    expect(screen.getByText("How")).toBeTruthy();
    expect(screen.getByText(/Scripture:/)).toBeTruthy();
    expect(screen.getByText(/Catechism:/)).toBeTruthy();
  });

  it("missing Attend provider content does not crash UI", async () => {
    const spy = jest.spyOn(reviewContentProvider, "getAttendContent").mockResolvedValueOnce({
      metadata: {
        sourceProvider: "mock",
        textStatus: "placeholder",
        licensingNote: "Test fallback metadata."
      },
      steps: {}
    });

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("Entrance Chant").length).toBeGreaterThan(0);
    });
    expect(screen.getByText("Entrance hymn begins")).toBeTruthy();
    spy.mockRestore();
  });

  it("SourceBadge renders source and status", () => {
    render(
      <SourceBadge
        metadata={{
          sourceProvider: "usccb",
          textStatus: "review_only",
          licensingNote: "Review copy only."
        }}
      />
    );

    expect(screen.getByText(/Source: USCCB/)).toBeTruthy();
    expect(screen.getAllByText(/Review copy/).length).toBeGreaterThan(0);
    expect(screen.getByText("Review copy only.")).toBeTruthy();
  });

  it("SourceBadge quiet variant renders a short label only", () => {
    render(
      <SourceBadge
        metadata={{
          sourceProvider: "usccb",
          textStatus: "review_only",
          licensingNote: "Review copy - pending permission."
        }}
        variant="quiet"
      />
    );

    expect(screen.getByText("Review copy")).toBeTruthy();
    expect(screen.queryByText(/Source:/)).toBeNull();
    expect(screen.queryByText(/pending permission/i)).toBeNull();
  });

  it("metadata keeps licensing notes for review-only content", async () => {
    const attend = await reviewContentProvider.getAttendContent(new Date());
    const officialSteps = ["holy", "mystery-of-faith", "lords-prayer", "lamb-of-god"];

    officialSteps.forEach((id) => {
      expect(attend.steps[id].metadata.textStatus).toBe("review_only");
      expect(attend.steps[id].metadata.licensingNote).toMatch(/pending permission/i);
    });
  });

  it("Attend hides prayer card when a step only has guidance copy", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "entrance"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("Entrance Chant").length).toBeGreaterThan(0);
    });
    expect(screen.queryByTestId("attend-prayer-card")).toBeNull();
  });

  it("Learn Dive Deeper copy avoids raw pending-review wording", async () => {
    render(<LearnDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Dive Deeper")).toBeTruthy();
    });
    expect(screen.queryByText(/pending review/i)).toBeNull();
    expect(screen.getByText(/Fathers \/ Councils: To be added in content review/)).toBeTruthy();
  });

  it("Learn subsections correspond to MassFlow steps", async () => {
    render(<LearnDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Subsections")).toBeTruthy();
    });
    massFlowSections[0].steps.forEach((step) => {
      expect(screen.getAllByText(step.title).length).toBeGreaterThan(0);
    });
  });
});

function firstSentenceForTest(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^[^.!?]+[.!?]/);
  return match?.[0] ?? trimmed;
}
