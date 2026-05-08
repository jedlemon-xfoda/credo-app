import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import AttendScreen from "../app/(tabs)/home/attend";
import { storageKeys } from "../constants/storage";
import { getAmbientPolicy, getGestureForPage, getVariantRuleForPage, shouldShowFullPrayerAction } from "../data/attendRuntimePolicies";
import { eucharisticPrayerSharedCadence, massFlowBranchGroups, massFlowSteps, massResponseLanguageOptions, resolveMassFlowConfiguration } from "../data/massFlow";
import { MASS_CONTENT } from "../services/massContent";
import { createDefaultJourneyState, getLocalDateKey } from "../services/journeyState";
import * as journeyStateService from "../services/journeyState";
import { router } from "../jest.setup";

const p0StepIds = [
  "first-reading",
  "psalm",
  "second-reading",
  "gospel-acclamation",
  "gospel",
  "homily",
  "profession-of-faith",
  "universal-prayer",
  "presentation",
  "prayer-over-offerings",
  "preface",
  "holy",
  "consecration",
  "mystery-of-faith",
  "doxology",
  "lords-prayer",
  "sign-of-peace",
  "lamb-of-god",
  "communion",
  "prayer-after-communion",
  "announcements",
  "blessing",
  "dismissal"
];

function guidedIdsFor(stepId: string) {
  return massFlowSteps.find((step) => step.id === stepId)?.guidedItems?.map((item) => item.id) ?? [];
}

function stepFor(stepId: string) {
  const step = massFlowSteps.find((candidate) => candidate.id === stepId);
  if (!step) {
    throw new Error(`Missing MassFlow step ${stepId}`);
  }
  return step;
}

function pageFor(stepId: string, itemIds: string[]) {
  const step = stepFor(stepId);
  const items = itemIds.map((id) => {
    const item = step.guidedItems?.find((candidate) => candidate.id === id);
    if (!item) {
      throw new Error(`Missing guided item ${id}`);
    }
    return item;
  });

  return {
    artItem: items[0],
    id: itemIds.join("-page"),
    items
  };
}

describe("Attend flow", () => {
  it("P0 MassFlow steps from First Reading through Dismissal have guided moments", () => {
    for (const stepId of p0StepIds) {
      expect(guidedIdsFor(stepId).length).toBeGreaterThan(0);
    }
  });

  it("P0 guided moments have unique IDs and resolvable full prayer keys", () => {
    const guidedItems = massFlowSteps.flatMap((step) => step.guidedItems ?? []);
    const guidedIds = guidedItems.map((item) => item.id);
    expect(new Set(guidedIds).size).toBe(guidedIds.length);

    const missingKeys = guidedItems
      .map((item) => item.fullPrayerKey)
      .filter((key): key is string => Boolean(key))
      .filter((key) => !MASS_CONTENT[key]);

    expect(missingKeys).toEqual([]);
  });

  it("P0 required response moments are present", () => {
    const requiredResponseIds = [
      "first-reading-response",
      "second-reading-response",
      "gospel-dialogue-response",
      "gospel-announcement-response",
      "gospel-ending-response",
      "universal-prayer-response",
      "presentation-bread-response",
      "presentation-wine-response",
      "offerings-response",
      "offerings-amen",
      "preface-lord-response",
      "preface-hearts-response",
      "preface-thanks-response",
      "mystery-response",
      "doxology-amen",
      "lords-prayer-kingdom",
      "peace-amen",
      "peace-dialogue-response",
      "communion-worthy-response",
      "communion-amen",
      "post-communion-amen",
      "blessing-dialogue-response",
      "blessing-amen",
      "dismissal-response"
    ];
    const guidedIds = new Set(massFlowSteps.flatMap((step) => step.guidedItems?.map((item) => item.id) ?? []));

    expect(requiredResponseIds.filter((id) => !guidedIds.has(id))).toEqual([]);
  });

  it("P0 cadence pairs are sequenced prompt before response", () => {
    const expectedCadences: Record<string, string[]> = {
      "first-reading": ["first-reading-ending", "first-reading-response"],
      "second-reading": ["second-reading-ending", "second-reading-response"],
      gospel: ["gospel-dialogue-listen", "gospel-dialogue-response", "gospel-announcement-listen", "gospel-small-crosses", "gospel-announcement-response", "gospel-ending-listen", "gospel-ending-response"],
      presentation: ["presentation-bread-prayer", "presentation-bread-response", "presentation-wine-prayer", "presentation-wine-response"],
      "prayer-over-offerings": ["offerings-invitation", "offerings-response", "offerings-prayer", "offerings-amen"],
      preface: ["preface-lord-listen", "preface-lord-response", "preface-hearts-listen", "preface-hearts-response", "preface-thanks-listen", "preface-thanks-response"],
      "mystery-of-faith": ["mystery-listen", "mystery-response"],
      doxology: ["doxology-listen", "doxology-amen"],
      "lords-prayer": ["lords-prayer-embolism", "lords-prayer-kingdom"],
      "sign-of-peace": ["peace-prayer", "peace-amen", "peace-dialogue-listen", "peace-dialogue-response"],
      communion: ["communion-invitation", "communion-worthy-response", "communion-minister", "communion-amen"],
      "prayer-after-communion": ["post-communion-prayer", "post-communion-amen"],
      blessing: ["blessing-dialogue-listen", "blessing-dialogue-response", "blessing-cross", "blessing-amen"],
      dismissal: ["dismissal-listen", "dismissal-response"]
    };

    for (const [stepId, expectedIds] of Object.entries(expectedCadences)) {
      const ids = guidedIdsFor(stepId);
      const indexes = expectedIds.map((id) => ids.indexOf(id));
      expect(indexes.every((index) => index >= 0)).toBe(true);
      expect([...indexes].sort((a, b) => a - b)).toEqual(indexes);
    }
  });

  it("Communion Rite and Dismissal are not incorrectly marked optional", () => {
    expect(massFlowSteps.find((step) => step.id === "communion")?.optional).toBeUndefined();
    expect(massFlowSteps.find((step) => step.id === "dismissal")?.optional).toBeUndefined();
  });

  it("branch guided moments have unique IDs and resolvable full prayer keys", () => {
    const guidedItems = massFlowBranchGroups.flatMap((branch) => branch.guidedItems);
    const guidedIds = guidedItems.map((item) => item.id);
    expect(new Set(guidedIds).size).toBe(guidedIds.length);

    const itemKeys = guidedItems
      .map((item) => item.fullPrayerKey)
      .filter((key): key is string => Boolean(key));
    const branchKeys = massFlowBranchGroups.flatMap((branch) => branch.fullPrayerKeys ?? []);
    const missingKeys = [...itemKeys, ...branchKeys].filter((key) => !MASS_CONTENT[key]);

    expect(missingKeys).toEqual([]);
  });

  it("defines Penitential Act variants and Sprinkling Rite replacement branch", () => {
    const branchIds = massFlowBranchGroups.map((branch) => branch.id);

    expect(branchIds).toEqual(expect.arrayContaining(["penitential-confiteor", "penitential-dialogue", "penitential-tropes", "sprinkling-rite"]));
    for (const branchId of ["penitential-confiteor", "penitential-dialogue", "penitential-tropes", "sprinkling-rite"]) {
      const branch = massFlowBranchGroups.find((candidate) => candidate.id === branchId);
      expect(branch?.replacesStepId).toBe("penitential-act");
      expect(branch?.guidedItems.length).toBeGreaterThan(0);
    }
  });

  it("defines Gospel Acclamation branches for ordinary time and Lent", () => {
    const ordinary = massFlowBranchGroups.find((branch) => branch.id === "gospel-acclamation-ordinary");
    const lent = massFlowBranchGroups.find((branch) => branch.id === "gospel-acclamation-lent");

    expect(ordinary?.replacesStepId).toBe("gospel-acclamation");
    expect(lent?.replacesStepId).toBe("gospel-acclamation");
    expect(ordinary?.fullPrayerKeys).toContain("response_alleluia");
    expect(lent?.fullPrayerKeys).toContain("response_lent_gospel_acclamation");
  });

  it("defines Nicene and Apostles Creed branches", () => {
    const nicene = massFlowBranchGroups.find((branch) => branch.id === "creed-nicene");
    const apostles = massFlowBranchGroups.find((branch) => branch.id === "creed-apostles");

    expect(nicene?.replacesStepId).toBe("profession-of-faith");
    expect(apostles?.replacesStepId).toBe("profession-of-faith");
    expect(nicene?.fullPrayerKeys).toContain("nicene_creed");
    expect(apostles?.fullPrayerKeys).toContain("apostles_creed");
  });

  it("defines Eucharistic Prayer I-IV branches using the shared cadence scaffold", () => {
    const epBranches = massFlowBranchGroups.filter((branch) => branch.kind === "eucharistic_prayer");

    expect(epBranches.map((branch) => branch.id).sort()).toEqual(["eucharistic-prayer-i", "eucharistic-prayer-ii", "eucharistic-prayer-iii", "eucharistic-prayer-iv"]);
    expect(eucharisticPrayerSharedCadence.requiredMomentIds).toEqual(
      expect.arrayContaining(["ep-shared-epiclesis", "ep-shared-institution-body", "ep-shared-memorial-acclamation", "ep-shared-great-amen"])
    );

    for (const branch of epBranches) {
      expect(branch.insertsAfterStepId).toBe("preface");
      expect(branch.guidedItems.map((item) => item.id)).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/epiclesis/),
          expect.stringMatching(/body/),
          expect.stringMatching(/host-elevation/),
          expect.stringMatching(/chalice/),
          expect.stringMatching(/memorial/),
          expect.stringMatching(/amen/)
        ])
      );
    }
  });

  it("defines Easter dismissal and solemn blessing branches", () => {
    const easterDismissal = massFlowBranchGroups.find((branch) => branch.id === "dismissal-easter");
    const solemnBlessing = massFlowBranchGroups.find((branch) => branch.id === "blessing-solemn");

    expect(easterDismissal?.replacesStepId).toBe("dismissal");
    expect(easterDismissal?.preferredSeason).toContain("easter");
    expect(easterDismissal?.fullPrayerKeys).toContain("response_easter_dismissal_alleluia");
    expect(solemnBlessing?.replacesStepId).toBe("blessing");
    expect(solemnBlessing?.fullPrayerKeys).toContain("solemn_blessing");
  });

  it("resolves date-aware branch defaults without a hardcoded calendar engine", () => {
    expect(resolveMassFlowConfiguration().branchIds).toEqual(
      expect.arrayContaining(["penitential-confiteor", "eucharistic-prayer-ii", "gospel-acclamation-ordinary", "creed-nicene", "dismissal-ordinary", "blessing-simple"])
    );
    expect(resolveMassFlowConfiguration({ season: "lent" }).branchIds).toContain("gospel-acclamation-lent");
    expect(resolveMassFlowConfiguration({ season: "easter", useSprinklingRite: true }).branchIds).toEqual(
      expect.arrayContaining(["sprinkling-rite", "dismissal-easter"])
    );
    expect(resolveMassFlowConfiguration({ eucharisticPrayer: "ep-iv", creed: "apostles", blessing: "solemn" }).branchIds).toEqual(
      expect.arrayContaining(["eucharistic-prayer-iv", "creed-apostles", "blessing-solemn"])
    );
  });

  it("supports Latin and Greek response scaffolding in the data layer", () => {
    expect(massResponseLanguageOptions.response_and_with_your_spirit.latin).toBe("Et cum spiritu tuo.");
    expect(massResponseLanguageOptions.kyrie.greek).toContain("Kyrie");
    expect(massResponseLanguageOptions.holy.latin).toContain("Sanctus");
    expect(resolveMassFlowConfiguration({ responseLanguage: "greek" }).branchIds).toContain("penitential-tropes");
  });

  it("shows full-prayer actions only for substantial prayer pages", () => {
    expect(shouldShowFullPrayerAction(stepFor("penitential-act"), pageFor("penitential-act", ["confiteor-1"]))).toBe(true);
    expect(shouldShowFullPrayerAction(stepFor("glory-to-god"), pageFor("glory-to-god", ["gloria-you-say"]))).toBe(true);
    expect(shouldShowFullPrayerAction(stepFor("profession-of-faith"), pageFor("profession-of-faith", ["creed-begin"]))).toBe(true);
    expect(shouldShowFullPrayerAction(stepFor("lords-prayer"), pageFor("lords-prayer", ["lords-prayer-all"]))).toBe(true);
    expect(shouldShowFullPrayerAction(stepFor("lamb-of-god"), pageFor("lamb-of-god", ["lamb-first"]))).toBe(true);

    expect(shouldShowFullPrayerAction(stepFor("first-reading"), pageFor("first-reading", ["first-reading-sit"]))).toBe(false);
    expect(shouldShowFullPrayerAction(stepFor("entrance"), pageFor("entrance", ["entrance-ambient"]))).toBe(false);
    expect(shouldShowFullPrayerAction(stepFor("gospel"), pageFor("gospel", ["gospel-dialogue-response"]))).toBe(false);
    expect(shouldShowFullPrayerAction(stepFor("dismissal"), pageFor("dismissal", ["dismissal-response"]))).toBe(false);
  });

  it("marks variant eligibility only at branch decision screens", () => {
    expect(getVariantRuleForPage(stepFor("greeting"), pageFor("greeting", ["greeting-listen", "greeting-response"]))?.groupId).toBe("greeting");
    expect(getVariantRuleForPage(stepFor("penitential-act"), pageFor("penitential-act", ["penitential-intro"]))?.options.map((option) => option.branchId)).toEqual(
      expect.arrayContaining(["penitential-confiteor", "penitential-dialogue", "penitential-tropes", "sprinkling-rite"])
    );
    expect(getVariantRuleForPage(stepFor("gospel-acclamation"), pageFor("gospel-acclamation", ["gospel-acclamation-alleluia"]))?.groupId).toBe("gospel-acclamation");
    expect(getVariantRuleForPage(stepFor("profession-of-faith"), pageFor("profession-of-faith", ["creed-begin"]))?.groupId).toBe("creed");
    expect(getVariantRuleForPage(stepFor("preface"), pageFor("preface", ["preface-prayer"]))?.groupId).toBe("eucharistic-prayer");
    expect(getVariantRuleForPage(stepFor("blessing"), pageFor("blessing", ["blessing-dialogue-listen", "blessing-dialogue-response"]))?.groupId).toBe("blessing");
    expect(getVariantRuleForPage(stepFor("dismissal"), pageFor("dismissal", ["dismissal-listen", "dismissal-response"]))?.groupId).toBe("dismissal");

    expect(getVariantRuleForPage(stepFor("gospel"), pageFor("gospel", ["gospel-announcement-listen", "gospel-small-crosses", "gospel-announcement-response"]))).toBeUndefined();
    expect(getVariantRuleForPage(stepFor("communion"), pageFor("communion", ["communion-minister", "communion-amen"]))).toBeUndefined();
  });

  it("provides gesture metadata for major gesture moments", () => {
    expect(getGestureForPage(stepFor("greeting"), pageFor("greeting", ["greeting-sign-cross"]))?.kind).toBe("sign_of_cross");
    expect(getGestureForPage(stepFor("penitential-act"), pageFor("penitential-act", ["confiteor-fault-1"]))?.kind).toBe("breast_strike");
    expect(getGestureForPage(stepFor("gospel"), pageFor("gospel", ["gospel-announcement-listen", "gospel-small-crosses", "gospel-announcement-response"]))?.kind).toBe("triple_gospel_cross");
    expect(getGestureForPage(stepFor("profession-of-faith"), pageFor("profession-of-faith", ["creed-incarnation-bow"]))?.kind).toBe("bow");
    expect(getGestureForPage(stepFor("consecration"), pageFor("consecration", ["consecration-host-elevation"]))?.kind).toBe("elevation_host");
    expect(getGestureForPage(stepFor("consecration"), pageFor("consecration", ["consecration-chalice-elevation"]))?.kind).toBe("elevation_chalice");
    expect(getGestureForPage(stepFor("communion"), pageFor("communion", ["communion-process"]))?.kind).toBe("procession");
  });

  it("classifies ambient pages without suppressing required liturgical quiet moments", () => {
    expect(getAmbientPolicy(stepFor("entrance"), pageFor("entrance", ["entrance-ambient"]))).toBe("required");
    expect(getAmbientPolicy(stepFor("consecration"), pageFor("consecration", ["consecration-host-elevation"]))).toBe("required");
    expect(getAmbientPolicy(stepFor("communion"), pageFor("communion", ["communion-thanksgiving"]))).toBe("optional");
    expect(getAmbientPolicy(stepFor("penitential-act"), pageFor("penitential-act", ["penitential-intro"]))).toBe("suppress_by_default");
  });

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

  it("shows View full prayer in runtime only on appropriate guided pages", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "profession-of-faith"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Stand for the Profession of Faith.")).toBeTruthy();
    });
    expect(screen.queryByLabelText("View full prayer")).toBeNull();

    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    expect(screen.getByText("I believe in one God,")).toBeTruthy();
    expect(screen.getByLabelText("View full prayer")).toBeTruthy();
  });

  it("hides View full prayer on posture-only and short response pages in runtime", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "first-reading"
      })
    );

    render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Sit for the First Reading.")).toBeTruthy();
    });
    expect(screen.queryByLabelText("View full prayer")).toBeNull();

    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    expect(screen.getByText("Thanks be to God.")).toBeTruthy();
    expect(screen.queryByLabelText("View full prayer")).toBeNull();
  });

  it("opens variant and full-prayer overlays without advancing the guided index", async () => {
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "greeting"
      })
    );

    const greetingRender = render(<AttendScreen />);

    await waitFor(() => {
      expect(screen.getByText("Make the Sign of the Cross")).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    expect(screen.getByText("The Lord be with you.")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Hearing something different"));
    expect(screen.getByText("Which response are you hearing?")).toBeTruthy();
    expect(screen.getByText("The Lord be with you.")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Close response options"));
    expect(screen.getByText("The Lord be with you.")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Previous guided Mass moment"));
    expect(screen.getByText("Amen.")).toBeTruthy();
    expect(screen.queryByLabelText("View full prayer")).toBeNull();

    greetingRender.unmount();
    await AsyncStorage.setItem(
      storageKeys.dailyJourneyState,
      JSON.stringify({
        ...createDefaultJourneyState(getLocalDateKey()),
        steps: { prepare: "complete", attend: "in_progress", reflect: "not_started" },
        currentStep: "attend",
        attendPosition: "profession-of-faith"
      })
    );

    render(<AttendScreen />);
    await waitFor(() => {
      expect(screen.getByText("Stand for the Profession of Faith.")).toBeTruthy();
    });
    fireEvent.press(screen.getByLabelText("Advance guided Mass moment"));
    expect(screen.getByText("I believe in one God,")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("View full prayer"));
    expect(screen.getByLabelText("Close full prayer")).toBeTruthy();
    expect(screen.getAllByText("I believe in one God,").length).toBeGreaterThan(1);
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
