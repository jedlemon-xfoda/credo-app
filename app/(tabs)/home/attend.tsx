import { MASS_CONTENT } from "../../../services/massContent";
import { resolveMassTextBlock } from "../../../utils/resolveMassText";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SourceBadge } from "../../../components/SourceBadge";
import { AttendDock, AttendSheet, GuidanceChip, PostureBadge, PostureGlyphIcon, ProgressDots, SacredDivider } from "../../../components/attend/AttendPrimitives";
import { attendColors as attendPalette, attendSpacing, attendTypography } from "../../../constants/attendTheme";
import { colors, spacing } from "../../../constants/theme";
import { getGuidedPagePolicy, type AmbientPolicy, type GestureMetadata, type VariantOption, type VariantRule } from "../../../data/attendRuntimePolicies";
import { labelPosture, massFlowBranchGroups, massFlowSections, massFlowSteps } from "../../../data/massFlow";
import { useDailyJourney } from "../../../hooks/useDailyJourney";
import type { MassFlowStep, MassGuidedItem, MassTextBlock } from "../../../types";

type AttendMode = "guided" | "quiet";

type GuidedPage = {
  artItem?: MassGuidedItem;
  description?: string;
  id: string;
  items: MassGuidedItem[];
};

export default function AttendScreen() {
  const { state, ready, markStepStarted, markStepComplete, restartAttend, setAttendPosition } = useDailyJourney();
  const [index, setIndex] = useState(0);
  const [guidedIndex, setGuidedIndex] = useState(0);
  const [lostOpen, setLostOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const mode = getDefaultAttendMode();
  const [paused, setPaused] = useState(false);
  const [fullPrayerNotice, setFullPrayerNotice] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [variantOpen, setVariantOpen] = useState(false);
  const [selectedGreetingText, setSelectedGreetingText] = useState("The Lord be with you.");
  const [selectedGreetingResponse, setSelectedGreetingResponse] = useState("And with your spirit.");
  const [selectedVariantValue, setSelectedVariantValue] = useState("And with your spirit.");
  const [selectedPenitentialBranchId, setSelectedPenitentialBranchId] = useState("penitential-confiteor");
  const [selectedStandaloneKyrieBranchId, setSelectedStandaloneKyrieBranchId] = useState("standalone-kyrie-english");
  const resumed = useRef(false);
  const isExitingRef = useRef(false);
  const suppressPositionPersist = useRef(false);
  const step = massFlowSteps[index];
  const effectiveStep = useMemo(
    () => getEffectiveAttendStep(step, selectedPenitentialBranchId, selectedStandaloneKyrieBranchId),
    [selectedPenitentialBranchId, selectedStandaloneKyrieBranchId, step]
  );
  const guidedItems = effectiveStep.guidedItems ?? [];
  const guidedPages = useMemo(() => buildGuidedPages(effectiveStep), [effectiveStep]);
  const hasGuidedItems = guidedPages.length > 0;
  const guidedPage = guidedPages[guidedIndex];
  const guidedPagePolicy = useMemo(() => (guidedPage ? getGuidedPagePolicy(effectiveStep, guidedPage) : undefined), [effectiveStep, guidedPage]);
  const finalStep = effectiveStep.id === "dismissal";

  useEffect(() => {
    setLearnOpen(false);
    setGuidedIndex(0);
    setPaused(false);
    setFullPrayerNotice(false);
    setMoreOpen(false);
    setVariantOpen(false);
  }, [step.id]);

  useEffect(() => {
    setVariantOpen(false);
  }, [guidedPage?.id]);

  useEffect(() => {
    if (guidedIndex >= guidedPages.length && guidedPages.length > 0) {
      setGuidedIndex(guidedPages.length - 1);
    }
  }, [guidedIndex, guidedPages.length]);

  useEffect(() => {
    if (ready && !isExitingRef.current) {
      markStepStarted("attend");
    }
  }, [markStepStarted, ready]);

  useEffect(() => {
    if (!ready || resumed.current) {
      return;
    }

    resumed.current = true;
    if (state?.steps.attend === "complete") {
      setIndex(0);
      return;
    }

    const savedIndex = massFlowSteps.findIndex((item) => item.id === state?.attendPosition);
    if (savedIndex >= 0) {
      setIndex(savedIndex);
    }
  }, [ready, state?.attendPosition, state?.steps.attend]);

  useEffect(() => {
    if (isExitingRef.current || suppressPositionPersist.current) {
      return;
    }

    if (ready && !state?.attendPosition && state?.steps.attend !== "complete") {
      setAttendPosition(step.id);
    }
  }, [ready, setAttendPosition, state?.attendPosition, state?.steps.attend, step.id]);

  const groupedSteps = useMemo(
    () =>
      massFlowSections.map((section) => ({
        section: section.title,
        steps: section.steps
      })),
    []
  );

  const previous = useCallback(() => {
    if (isExitingRef.current) {
      return;
    }
    setVariantOpen(false);
    if (hasGuidedItems && guidedIndex > 0) {
      setFullPrayerNotice(false);
      setGuidedIndex((current) => Math.max(0, current - 1));
      return;
    }
    suppressPositionPersist.current = false;
    setFullPrayerNotice(false);
    setGuidedIndex(0);
    setIndex((current) => {
      const nextIndex = Math.max(0, current - 1);
      setAttendPosition(massFlowSteps[nextIndex].id);
      return nextIndex;
    });
  }, [guidedIndex, hasGuidedItems, setAttendPosition]);

  const handleCompleteAttend = useCallback(async () => {
    if (isExitingRef.current) {
      return;
    }

    await markStepComplete("attend");
    await setAttendPosition(undefined);
    await markStepStarted("reflect");
    router.replace("/(tabs)/home/reflect");
  }, [markStepComplete, markStepStarted, setAttendPosition]);

  const next = useCallback(async () => {
    if (isExitingRef.current) {
      return;
    }
    setVariantOpen(false);
    if (finalStep) {
      await handleCompleteAttend();
      return;
    }
    if (hasGuidedItems && guidedIndex < guidedPages.length - 1) {
      setFullPrayerNotice(false);
      setGuidedIndex((current) => Math.min(guidedPages.length - 1, current + 1));
      return;
    }

    suppressPositionPersist.current = false;
    setFullPrayerNotice(false);
    setGuidedIndex(0);
    setIndex((current) => {
      const nextIndex = Math.min(massFlowSteps.length - 1, current + 1);
      setAttendPosition(massFlowSteps[nextIndex].id);
      return nextIndex;
    });
  }, [finalStep, guidedIndex, guidedPages.length, handleCompleteAttend, hasGuidedItems, setAttendPosition]);

  const tapToAdvance = useCallback(() => {
    if (paused || !hasGuidedItems) {
      return;
    }
    void next();
  }, [hasGuidedItems, next, paused]);

  const jumpTo = useCallback(
    (id: string) => {
      if (isExitingRef.current) {
        return;
      }
      const nextIndex = massFlowSteps.findIndex((item) => item.id === id);
      if (nextIndex >= 0) {
        suppressPositionPersist.current = false;
        setIndex(nextIndex);
        setGuidedIndex(0);
        setFullPrayerNotice(false);
        setAttendPosition(id);
      }
      setLostOpen(false);
      setMoreOpen(false);
      setVariantOpen(false);
    },
    [setAttendPosition]
  );

  async function restartMass() {
    if (isExitingRef.current) {
      return;
    }
    resumed.current = true;
    suppressPositionPersist.current = false;
    await restartAttend();
    await markStepStarted("attend");
    await setAttendPosition(massFlowSteps[0].id);
    setIndex(0);
    setGuidedIndex(0);
    setSelectedGreetingText("The Lord be with you.");
    setSelectedGreetingResponse("And with your spirit.");
    setSelectedPenitentialBranchId("penitential-confiteor");
    setSelectedStandaloneKyrieBranchId("standalone-kyrie-english");
    setFullPrayerNotice(false);
    setLostOpen(false);
    setMoreOpen(false);
    setVariantOpen(false);
  }

  function handleExitAttend() {
    isExitingRef.current = true;
    suppressPositionPersist.current = true;
    setLostOpen(false);
    setMoreOpen(false);
    setVariantOpen(false);
    router.replace("/(tabs)/home");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        {lostOpen ? (
          <View style={styles.lostPanel}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {groupedSteps.map((group) => (
                <View key={group.section} style={styles.jumpGroup}>
                  <Text style={styles.jumpSection}>{group.section}</Text>
                  {group.steps.map((item) => (
                    <Pressable accessibilityLabel={`Jump to ${item.title}`} accessibilityRole="button" key={item.id} onPress={() => jumpTo(item.id)} style={styles.jumpItem}>
                      <Text style={styles.jumpText}>{item.title}</Text>
                    </Pressable>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {hasGuidedItems && guidedPage ? (
          <GuidedMoment
            currentIndex={guidedIndex}
            onTap={tapToAdvance}
            page={guidedPage}
            paused={paused}
            greetingTextOverride={selectedGreetingText}
            responseOverride={selectedGreetingResponse}
            step={effectiveStep}
            total={guidedPages.length}
            finalStep={finalStep}
            canGoPrevious={index > 0 || guidedIndex > 0}
            onPrevious={previous}
            ambientPolicy={guidedPagePolicy?.ambientPolicy}
            gesture={guidedPagePolicy?.gesture}
            onOpenVariant={() => {
              setFullPrayerNotice(false);
              setMoreOpen(false);
              setVariantOpen(true);
            }}
            variantRule={guidedPagePolicy?.variantGroup}
          />
        ) : (
        <Pressable accessibilityLabel="Advance Mass step" accessibilityRole="button" onPress={() => void next()} style={styles.body}>
          <View style={styles.liveLayer} testID="attend-live-action">
            <Text style={styles.section}>{step.sectionTitle}</Text>
            <Text style={styles.subsection}>{step.subtitle}</Text>
            <Text style={styles.title}>{step.title}</Text>
            {labelPosture(step.posture) ? <Text style={styles.posture}>{labelPosture(step.posture)?.toUpperCase()}</Text> : null}
            {mode !== "quiet" ? <MassTextBlocks blocks={step.textBlocks} /> : null}
          </View>

          {mode === "guided" && step.guidance ? (
            <Text numberOfLines={2} style={styles.guidance} testID="attend-guidance">
              {firstSentence(step.guidance)}
            </Text>
          ) : null}

          {mode !== "quiet" && step.optional ? <Text style={styles.optional}>Optional where used.</Text> : null}
          {mode !== "quiet" ? <SourceBadge metadata={step.source} variant="quiet" /> : null}
          {finalStep ? <Text style={styles.endingContext}>Mass is ending</Text> : null}

          {mode !== "quiet" ? (
            <View style={styles.learnLayer}>
              <Pressable
                accessibilityLabel={learnOpen ? "Collapse learn more" : "Expand learn more"}
                accessibilityRole="button"
                onPress={() => setLearnOpen((value) => !value)}
                style={styles.learnToggle}
              >
                <Text style={styles.learnToggleText}>{learnOpen ? "▲ Learn more" : "▼ Learn more"}</Text>
              </Pressable>

              {learnOpen ? (
                <ScrollView contentContainerStyle={styles.learnContent} nestedScrollEnabled showsVerticalScrollIndicator style={styles.learnScroll} testID="attend-learn-scroll">
                  <LearnMoreBlock label="What is happening" text={learnWhat(step)} />
                  <LearnMoreBlock label="What to do" text={learnWhatToDo(step)} />
                  <LearnMoreBlock label="Why it matters" text={learnWhy(step)} />
                </ScrollView>
              ) : null}
            </View>
          ) : null}
        </Pressable>
        )}

        {lostOpen ? null : (
          <View style={styles.footerTools}>
          {hasGuidedItems ? (
            <>
              <Pressable accessibilityLabel={paused ? "Resume guided flow" : "Pause guided flow"} accessibilityRole="button" onPress={() => setPaused((value) => !value)} style={styles.footerTool}>
                <Text style={styles.footerToolText}>{paused ? "Resume" : "Pause"}</Text>
              </Pressable>
              {guidedPagePolicy?.showFullPrayer ? (
                <Pressable
                  accessibilityLabel="View full prayer"
                  accessibilityRole="button"
                  onPress={() => {
                    setVariantOpen(false);
                    setMoreOpen(false);
                    setFullPrayerNotice((value) => !value);
                  }}
                  style={styles.footerTool}
                >
                  <Text style={styles.footerToolText}>View full prayer</Text>
                </Pressable>
              ) : null}
            </>
          ) : null}
          <Pressable accessibilityLabel="I'm lost" accessibilityRole="button" onPress={() => setLostOpen(true)} style={styles.footerTool}>
            <Text style={styles.footerToolText}>I'm lost</Text>
          </Pressable>
          </View>
        )}

        {moreOpen ? <AttendReferencePanel onRestart={restartMass} /> : null}
        {variantOpen ? (
          <VariantOverlay
            onClose={() => setVariantOpen(false)}
            onSelect={(option) => {
              const value = option.responseText ?? option.label;
              setSelectedVariantValue(value);
              if (guidedPagePolicy?.variantGroup?.groupId === "greeting") {
                setSelectedGreetingText(value);
              } else if (guidedPagePolicy?.variantGroup?.groupId === "penitential-act" && option.branchId) {
                setSelectedPenitentialBranchId(option.branchId);
                setSelectedVariantValue(option.branchId);
              } else if (guidedPagePolicy?.variantGroup?.groupId === "standalone-kyrie" && option.branchId) {
                setSelectedStandaloneKyrieBranchId(option.branchId);
                setSelectedVariantValue(option.branchId);
              }
              setVariantOpen(false);
            }}
            rule={guidedPagePolicy?.variantGroup}
            selected={selectedVariantValue}
          />
        ) : null}
        {fullPrayerNotice ? (
          <FullPrayerSheet
            item={guidedPage?.items.find((item) => item.fullPrayerKey) ?? guidedPage?.items[0]}
            onClose={() => setFullPrayerNotice(false)}
            greetingTextOverride={selectedGreetingText}
            responseOverride={selectedGreetingResponse}
            step={effectiveStep}
          />
        ) : null}

        <AttendDock finalStep={finalStep} onAdvance={() => void next()} onHome={handleExitAttend} onMore={() => setMoreOpen((value) => !value)} />
      </View>
    </SafeAreaView>
  );
}

function getEffectiveAttendStep(step: MassFlowStep, penitentialBranchId: string, standaloneKyrieBranchId: string): MassFlowStep {
  if (step.id !== "penitential-act") {
    return step;
  }

  const penitentialBranch =
    massFlowBranchGroups.find((branch) => branch.id === penitentialBranchId && branch.kind === "penitential_act") ??
    massFlowBranchGroups.find((branch) => branch.id === "penitential-confiteor");
  const standaloneKyrieBranch =
    massFlowBranchGroups.find((branch) => branch.id === standaloneKyrieBranchId && branch.kind === "standalone_kyrie") ??
    massFlowBranchGroups.find((branch) => branch.id === "standalone-kyrie-english");

  const guidedItems = [
    ...(penitentialBranch?.guidedItems ?? step.guidedItems ?? []),
    ...(penitentialBranch?.id === "penitential-tropes" || penitentialBranch?.kind === "sprinkling_rite" ? [] : standaloneKyrieBranch?.guidedItems ?? [])
  ];

  return {
    ...step,
    guidedItems
  };
}

function buildGuidedPages(step: MassFlowStep): GuidedPage[] {
  const items = step.guidedItems ?? [];
  if (items.length === 0) {
    return [];
  }

  const pages: GuidedPage[] = [];
  const consumed = new Set<string>();

  for (const item of items) {
    if (consumed.has(item.id)) {
      continue;
    }

    if (step.id === "greeting" && item.id === "greeting-listen") {
      const response = items.find((candidate) => candidate.id === "greeting-response");
      const group = [item, response].filter((candidate): candidate is MassGuidedItem => Boolean(candidate));
      group.forEach((candidate) => consumed.add(candidate.id));
      pages.push({
        artItem: item,
        id: "greeting-response-group",
        items: group
      });
      continue;
    }

    if (step.id === "greeting" && item.id === "greeting-sign-cross") {
      const amen = items.find((candidate) => candidate.id === "greeting-amen");
      const action = items.find((candidate) => candidate.id === "greeting-sign-cross-action");
      const group = [item, action, amen].filter((candidate): candidate is MassGuidedItem => Boolean(candidate));
      group.forEach((candidate) => consumed.add(candidate.id));
      pages.push({
        artItem: item,
        id: "greeting-sign-cross-group",
        items: group
      });
      continue;
    }

    if (step.id === "penitential-act" && item.id === "kyrie-lord-1") {
      const group = ["kyrie-lord-1", "kyrie-christ", "kyrie-lord-2"]
        .map((id) => items.find((candidate) => candidate.id === id))
        .filter((candidate): candidate is MassGuidedItem => Boolean(candidate));
      group.forEach((candidate) => consumed.add(candidate.id));
      pages.push({
        artItem: item,
        id: "kyrie-group",
        items: group
      });
      continue;
    }

    if (step.id === "collect" && item.id === "collect-prayer") {
      const amen = items.find((candidate) => candidate.id === "collect-amen");
      const group = [item, amen].filter((candidate): candidate is MassGuidedItem => Boolean(candidate));
      group.forEach((candidate) => consumed.add(candidate.id));
      pages.push({
        artItem: item,
        id: "collect-group",
        items: group
      });
      continue;
    }

    const cadenceGroup = getCadenceGroup(step.id, item.id)
      .map((id) => items.find((candidate) => candidate.id === id))
      .filter((candidate): candidate is MassGuidedItem => Boolean(candidate));

    if (cadenceGroup.length > 1) {
      cadenceGroup.forEach((candidate) => consumed.add(candidate.id));
      pages.push({
        artItem: item,
        id: `${item.id}-group`,
        items: cadenceGroup
      });
      continue;
    }

    pages.push({
      artItem: item,
      id: item.id,
      items: [item]
    });
  }

  return pages;
}

function getCadenceGroup(stepId: string, itemId: string) {
  const groups: Record<string, string[][]> = {
    "penitential-act": [
      ["branch-confiteor-fault-1", "branch-confiteor-fault-1-gesture"],
      ["branch-confiteor-fault-2", "branch-confiteor-fault-2-gesture"],
      ["branch-confiteor-fault-3", "branch-confiteor-fault-3-gesture"],
      ["branch-confiteor-absolution", "branch-confiteor-amen"],
      ["branch-dialogue-have-mercy", "branch-dialogue-sinned"],
      ["branch-dialogue-show-mercy", "branch-dialogue-salvation"],
      ["branch-dialogue-absolution", "branch-dialogue-amen"],
      ["branch-tropes-contrite", "branch-tropes-lord"],
      ["branch-tropes-sinners", "branch-tropes-christ"],
      ["branch-tropes-intercede", "branch-tropes-lord-repeat"],
      ["branch-tropes-absolution", "branch-tropes-amen"],
      ["branch-kyrie-english-lord-1-listen", "branch-kyrie-english-lord-1-response"],
      ["branch-kyrie-english-christ-listen", "branch-kyrie-english-christ-response"],
      ["branch-kyrie-english-lord-2-listen", "branch-kyrie-english-lord-2-response"],
      ["branch-kyrie-greek-lord-1-listen", "branch-kyrie-greek-lord-1-response"],
      ["branch-kyrie-greek-christ-listen", "branch-kyrie-greek-christ-response"],
      ["branch-kyrie-greek-lord-2-listen", "branch-kyrie-greek-lord-2-response"],
      ["confiteor-fault-1", "confiteor-fault-1-gesture"],
      ["confiteor-fault-2", "confiteor-fault-2-gesture"],
      ["confiteor-fault-3", "confiteor-fault-3-gesture"],
      ["confiteor-absolution", "confiteor-amen"],
      ["kyrie-lord-1-listen", "kyrie-lord-1"],
      ["kyrie-christ-listen", "kyrie-christ"],
      ["kyrie-lord-2-listen", "kyrie-lord-2"]
    ],
    "first-reading": [["first-reading-ending", "first-reading-response"]],
    "second-reading": [["second-reading-ending", "second-reading-response"]],
    gospel: [
      ["gospel-dialogue-listen", "gospel-dialogue-response"],
      ["gospel-small-crosses", "gospel-announcement-response"],
      ["gospel-ending-listen", "gospel-ending-response"]
    ],
    presentation: [
      ["presentation-bread-prayer", "presentation-bread-response"],
      ["presentation-wine-prayer", "presentation-wine-response"]
    ],
    "prayer-over-offerings": [
      ["offerings-invitation", "offerings-response"],
      ["offerings-prayer", "offerings-amen"]
    ],
    preface: [
      ["preface-lord-listen", "preface-lord-response"],
      ["preface-hearts-listen", "preface-hearts-response"],
      ["preface-thanks-listen", "preface-thanks-response"]
    ],
    "mystery-of-faith": [["mystery-listen", "mystery-response"]],
    doxology: [["doxology-listen", "doxology-amen"]],
    "lords-prayer": [["lords-prayer-embolism", "lords-prayer-kingdom"]],
    "sign-of-peace": [
      ["peace-prayer", "peace-amen"],
      ["peace-dialogue-listen", "peace-dialogue-response"]
    ],
    communion: [
      ["communion-invitation", "communion-worthy-response"],
      ["communion-minister", "communion-amen"]
    ],
    "prayer-after-communion": [["post-communion-prayer", "post-communion-amen"]],
    blessing: [
      ["blessing-dialogue-listen", "blessing-dialogue-response"],
      ["blessing-cross", "blessing-amen"]
    ],
    dismissal: [["dismissal-listen", "dismissal-response"]]
  };

  return groups[stepId]?.find((group) => group[0] === itemId) ?? [];
}

function GuidedMoment({
  currentIndex,
  onTap,
  page,
  paused,
  greetingTextOverride,
  responseOverride,
  step,
  total,
  finalStep,
  canGoPrevious,
  onPrevious,
  onOpenVariant,
  variantRule,
  gesture,
  ambientPolicy
}: {
  currentIndex: number;
  onTap: () => void;
  page: GuidedPage;
  paused: boolean;
  greetingTextOverride: string;
  responseOverride: string;
  step: MassFlowStep;
  total: number;
  finalStep: boolean;
  canGoPrevious: boolean;
  onPrevious: () => void;
  onOpenVariant: () => void;
  variantRule?: VariantRule;
  gesture?: GestureMetadata;
  ambientPolicy?: AmbientPolicy;
}) {
  const primaryItem = page.items[0];
  const artItem = page.artItem ?? primaryItem;
  const artPresent = hasArtForPage(artItem, step);
  const posture = labelPosture(primaryItem.posture ?? step.posture);
  void gesture;
  void ambientPolicy;

  return (
    <Pressable accessibilityLabel="Advance guided Mass moment" accessibilityRole="button" onPress={onTap} style={styles.guidedBody} testID="attend-guided-moment">
      {canGoPrevious ? (
        <Pressable
          accessibilityLabel="Previous guided Mass moment"
          accessibilityRole="button"
          onPress={(event) => {
            event?.stopPropagation?.();
            onPrevious();
          }}
          style={styles.previousAffordance}
        >
          <Text style={styles.previousAffordanceText}>{"<"}</Text>
        </Pressable>
      ) : null}
      <View style={styles.guidedTop} testID="attend-live-action">
        {posture ? <PostureBadge label={posture} posture={primaryItem.posture ?? step.posture} /> : null}
        <Text style={styles.guidedSection}>{step.sectionTitle}</Text>
      </View>

      <Text style={[styles.guidedTitle, !artPresent && styles.guidedTitleCompact]}>{step.title}</Text>
      <View style={styles.guidedCenter}>
        <MomentArt item={artItem} step={step} />
        {shouldShowDivider(primaryItem, step) && page.items.length === 1 ? <SacredDivider /> : null}
        <View style={[styles.guidedBeatGroup, !artPresent && styles.guidedBeatGroupCompact]}>
          {page.items.map((item, itemIndex) => {
            const displayText = getGuidedDisplayText(item, greetingTextOverride, responseOverride);
            return (
              <View key={item.id} style={styles.guidedBeat}>
                {itemIndex > 0 ? <SacredDivider style={styles.groupDivider} /> : null}
                <GuidanceChip type={item.guidanceType} />
                <Text style={[styles.guidedPhrase, page.items.length > 1 && styles.guidedPhraseGrouped, getGuidedPhraseStyle(displayText)]}>{displayText}</Text>
                {item.cadenceCue && !page.items.some((candidate) => candidate.text === "Strike your breast.") ? <Text style={styles.cadenceCue}>({item.cadenceCue})</Text> : null}
                {page.description && itemIndex === 0 ? <Text style={styles.groupDescription}>{page.description}</Text> : null}
                {variantRule && itemIndex === page.items.length - 1 ? (
                  <Pressable
                    accessibilityLabel="Hearing something different"
                    accessibilityRole="button"
                    onPress={(event) => {
                      event?.stopPropagation?.();
                      onOpenVariant();
                    }}
                    style={styles.variantLink}
                  >
                    <Text style={styles.variantLinkText}>Hearing something different?</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
          {getPageDurationHint(page) ? <Text style={styles.durationHint}>{getPageDurationHint(page)}</Text> : null}
        </View>
      </View>

      <View style={styles.guidedLower}>
        <ProgressDots currentIndex={currentIndex} total={total} />
        {paused ? <Text style={styles.tapHint}>Paused</Text> : null}
        {finalStep ? <Text style={styles.endingContext}>Mass is ending</Text> : null}
      </View>
    </Pressable>
  );
}

function AttendReferencePanel({ onRestart }: { onRestart: () => void }) {
  return (
    <View style={styles.referencePanel}>
      <Text style={styles.referenceTitle}>Guide</Text>
      <ReferenceRow label="YOU SAY" text="Verbal response by the people." type="you_say" />
      <ReferenceRow label="YOU DO" text="Action or gesture." type="you_do" />
      <ReferenceRow label="LISTEN" text="Listen to the priest or ministers." type="listen" />
      <ReferenceRow label="AMBIENT" text="Ambient or transitional moment." type="ambient" />
      <View style={styles.referenceRule} />
      <View style={styles.postureGrid}>
        {(["stand", "sit", "kneel", "process"] as const).map((posture) => (
          <View key={posture} style={styles.postureRefItem}>
            <PostureGlyphIcon posture={posture} size={19} />
            <Text style={styles.postureRefLabel}>{posture.toUpperCase()}</Text>
          </View>
        ))}
      </View>
      <View style={styles.seasonRow}>
        <SeasonSwatch label="Advent" color="#6F5A8C" />
        <SeasonSwatch label="Lent" color="#6B5588" />
        <SeasonSwatch label="Easter" color="#F7E8C7" />
        <SeasonSwatch label="Ordinary" color="#8A9A6A" />
      </View>
      <Pressable accessibilityLabel="Restart Mass" accessibilityRole="button" onPress={onRestart} style={styles.referenceAction}>
        <Text style={styles.referenceActionText}>Restart Mass</Text>
      </Pressable>
    </View>
  );
}

function ReferenceRow({ label, text, type }: { label: string; text: string; type: MassGuidedItem["guidanceType"] }) {
  return (
    <View style={styles.referenceRow}>
      <Text style={[styles.referenceLabel, getGuidanceTypeStyle(type)]}>{label}</Text>
      <Text style={styles.referenceText}>{text}</Text>
    </View>
  );
}

function getGuidedDisplayText(item: MassGuidedItem, greetingTextOverride: string, responseOverride: string) {
  if (item.id === "greeting-listen") {
    return greetingTextOverride;
  }

  if (item.id === "greeting-response") {
    return responseOverride;
  }

  return item.text;
}

function SeasonSwatch({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.seasonItem}>
      <View style={[styles.seasonSwatch, { backgroundColor: color }]} />
      <Text style={styles.seasonLabel}>{label}</Text>
    </View>
  );
}

function VariantOverlay({
  onClose,
  onSelect,
  rule,
  selected
}: {
  onClose: () => void;
  onSelect: (option: VariantOption) => void;
  rule?: VariantRule;
  selected: string;
}) {
  const options = rule?.options ?? [{ id: "greeting-english", label: "And with your spirit.", responseText: "And with your spirit." }];

  return (
    <AttendSheet>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>{rule?.title ?? "Which response are you hearing?"}</Text>
        <Pressable accessibilityLabel="Close response options" accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
          <CloseIcon />
        </Pressable>
      </View>
      <View style={styles.variantOptions}>
        {options.map((option) => (
          <Pressable accessibilityLabel={`Select ${option.label}`} accessibilityRole="button" key={option.id} onPress={() => onSelect(option)} style={styles.variantOption}>
            <SpeakerIcon />
            <Text style={styles.variantOptionText}>{option.label}</Text>
            {selected === (option.responseText ?? option.label) ? <CheckIcon /> : null}
          </Pressable>
        ))}
      </View>
      <Pressable accessibilityLabel="I'm not sure" accessibilityRole="button" onPress={onClose} style={styles.notSureAction}>
        <Text style={styles.notSureText}>I'm not sure</Text>
      </Pressable>
    </AttendSheet>
  );
}

function FullPrayerSheet({
  greetingTextOverride,
  item,
  onClose,
  responseOverride,
  step
}: {
  item?: MassGuidedItem;
  onClose: () => void;
  greetingTextOverride: string;
  responseOverride: string;
  step: MassFlowStep;
}) {
  const fullPrayer = getFullPrayerContent(step, item, greetingTextOverride, responseOverride);

  return (
    <AttendSheet>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>{fullPrayer.title}</Text>
        <Pressable accessibilityLabel="Close full prayer" accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
          <CloseIcon />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.fullPrayerContent} showsVerticalScrollIndicator={false} style={styles.fullPrayerScroll}>
        {fullPrayer.lines.map((line, index) => (
          <Text key={`${fullPrayer.title}-${index}-${line}`} style={styles.fullPrayerLine}>
            {line}
          </Text>
        ))}
      </ScrollView>
    </AttendSheet>
  );
}

function HomeIcon() {
  return (
    <View style={styles.homeIcon}>
      <View style={styles.homeRoof} />
      <View style={styles.homeBase} />
    </View>
  );
}

function CrossIcon() {
  return (
    <View style={styles.crossIcon}>
      <View style={styles.crossVertical} />
      <View style={styles.crossHorizontal} />
    </View>
  );
}

function MoreIcon() {
  return (
    <View style={styles.moreIcon}>
      <View style={styles.moreDot} />
      <View style={styles.moreDot} />
      <View style={styles.moreDot} />
    </View>
  );
}

function SpeakerIcon() {
  return (
    <View style={styles.speakerIcon}>
      <View style={styles.speakerBox} />
      <View style={styles.speakerCone} />
      <View style={styles.speakerWave} />
    </View>
  );
}

function CloseIcon() {
  return (
    <View style={styles.closeIcon}>
      <View style={[styles.closeStroke, styles.closeOne]} />
      <View style={[styles.closeStroke, styles.closeTwo]} />
    </View>
  );
}

function CheckIcon() {
  return <View style={styles.checkIcon} />;
}

function PostureIcon({ posture }: { posture?: MassFlowStep["posture"] | MassGuidedItem["posture"] }) {
  const isSit = posture === "sit" || posture === "sit_or_stand";
  const isKneel = posture === "kneel" || posture === "stand_or_kneel";
  const isProcess = posture === "process";

  return (
    <View style={styles.postureIcon}>
      <View style={styles.postureHead} />
      <View style={[styles.postureBody, isSit && styles.postureBodySit, isKneel && styles.postureBodyKneel]} />
      <View style={[styles.postureLeg, isSit && styles.postureLegSit, isKneel && styles.postureLegKneel]} />
      {isProcess ? <View style={styles.postureSecondPerson} /> : null}
    </View>
  );
}

function MomentArt({ item, step }: { item: MassGuidedItem; step: MassFlowStep }) {
  if (item.id === "greeting-sign-cross") {
    return null;
  }

  if (item.id.includes("sign-cross")) {
    return <GestureArt variant="sign" />;
  }

  if (item.cadenceCue) {
    return <GestureArt variant="breast" />;
  }

  if (step.id === "entrance") {
    return <LyreArt />;
  }

  if (item.id.includes("gloria")) {
    return <SunburstArt />;
  }

  if (step.id === "collect") {
    return <ChaliceArt />;
  }

  if (step.id === "penitential-act" && item.guidanceType === "ambient") {
    return <SmallCrossArt />;
  }

  return null;
}

function hasArtForPage(item: MassGuidedItem, step: MassFlowStep): boolean {
  if (item.id === "greeting-sign-cross") return false;
  if (item.id.includes("sign-cross")) return true;
  if (item.cadenceCue) return true;
  if (step.id === "entrance") return true;
  if (item.id.includes("gloria")) return true;
  if (step.id === "collect") return true;
  if (step.id === "penitential-act" && item.guidanceType === "ambient") return true;
  return false;
}

function LyreArt() {
  return (
    <View style={styles.lyreRow}>
      <View style={styles.lyreLineLeft} />
      <View style={styles.artWrap}>
        <View style={styles.lyreArc} />
        <View style={styles.lyreStringOne} />
        <View style={styles.lyreStringTwo} />
        <View style={styles.lyreStringThree} />
      </View>
      <View style={styles.lyreLineRight} />
    </View>
  );
}

function GestureArt({ variant }: { variant: "sign" | "breast" }) {
  return (
    <View style={styles.gestureArt}>
      <View style={styles.gestureHead} />
      <View style={styles.gestureBody} />
      <View style={[styles.gestureArm, variant === "sign" ? styles.gestureArmSign : styles.gestureArmBreast]} />
      <View style={styles.gestureHand} />
    </View>
  );
}

function SmallCrossArt() {
  return (
    <View style={styles.smallCrossArt}>
      <CrossIcon />
    </View>
  );
}

function SunburstArt() {
  return (
    <View style={styles.sunburstArt}>
      <View style={styles.sunCircle} />
      {Array.from({ length: 8 }).map((_, index) => (
        <View key={`sun-ray-${index}`} style={[styles.sunRay, { transform: [{ rotate: `${index * 45}deg` }] }]} />
      ))}
    </View>
  );
}

function ChaliceArt() {
  return (
    <View style={styles.chaliceArt}>
      <View style={styles.chaliceCup} />
      <View style={styles.chaliceStem} />
      <View style={styles.chaliceBase} />
    </View>
  );
}

function MassTextBlocks({ blocks }: { blocks: MassTextBlock[] }) {

  const resolvedBlocks = blocks.map((block) =>
    resolveMassTextBlock(block, MASS_CONTENT)
  );

  const visibleBlocks = resolvedBlocks.filter((block) => block.text.trim().length > 0);

  if (visibleBlocks.length === 0) {
    return null;
  }

  return (
    <View style={styles.prayerBox} testID="attend-prayer-card">
      {visibleBlocks.map((block) => (
        <View key={block.id} style={styles.textBlock}>
          <Text style={[styles.roleLabel, block.role === "you" ? styles.youRole : block.role === "all" ? styles.allRole : null]}>{labelRole(block.role)}</Text>
          {splitTextLines(block.text).map((line, lineIndex) => (
            <Text key={`${block.id}-${lineIndex}`} style={[styles.prayer, block.role === "you" ? styles.youText : block.role === "all" ? styles.allText : null]}>
              {line}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function LearnMoreBlock({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.learnBlock}>
      <Text style={styles.learnLabel}>{label}</Text>
      <Text style={styles.learnCopy}>{text}</Text>
    </View>
  );
}

function splitTextLines(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^[^.!?]+[.!?]/);
  return match?.[0] ?? trimmed;
}

function learnWhat(step: MassFlowStep) {
  return firstSentence(step.summary);
}

function learnWhatToDo(step: MassFlowStep) {
  if (step.guidance) {
    return firstSentence(step.guidance);
  }

  const posture = labelPosture(step.posture);
  return posture ? `Remain ${posture.toLowerCase()} and attentive.` : "Stay attentive to this moment of the Mass.";
}

function learnWhy(step: MassFlowStep) {
  switch (step.sectionId) {
    case "introductory-rites":
      return "The Church gathers so the people can be made ready to worship God.";
    case "liturgy-word":
      return "God speaks to His people through Scripture and the Church listens in faith.";
    case "liturgy-eucharist":
      return "The sacrifice of Christ becomes present and the Church is drawn into His offering.";
    case "concluding-rites":
      return "The Church is blessed and sent to live what she has received.";
    default:
      return "This moment helps you enter the prayer of the Mass more deeply.";
  }
}

function labelRole(role: MassTextBlock["role"]) {
  switch (role) {
    case "celebrant":
      return "CELEBRANT";
    case "deacon":
      return "DEACON";
    case "reader":
      return "READER";
    case "cantor":
      return "CANTOR";
    case "you":
      return "YOU (SAY NOW)";
    case "all":
      return "ALL";
  }
}

function getDefaultAttendMode(): AttendMode {
  return "guided";
}

function labelGuidanceType(type: MassGuidedItem["guidanceType"]) {
  switch (type) {
    case "you_say":
      return "YOU SAY";
    case "you_do":
      return "YOU DO";
    case "listen":
      return "LISTEN";
    case "ambient":
      return "AMBIENT";
  }
}

function getGuidanceTypeStyle(type: MassGuidedItem["guidanceType"]) {
  switch (type) {
    case "you_say":
      return styles.youSayType;
    case "you_do":
      return styles.youDoType;
    case "ambient":
      return styles.ambientType;
    case "listen":
      return styles.listenType;
  }
}

function shouldShowDivider(item: MassGuidedItem, step: MassFlowStep) {
  return (
    (step.id === "collect" && item.id !== "collect-silence") ||
    item.id === "greeting-listen" ||
    item.id === "greeting-amen" ||
    item.id === "penitential-intro" ||
    item.id.startsWith("kyrie") ||
    item.id === "mystery-listen" ||
    item.id === "doxology-listen" ||
    item.id === "dismissal-listen"
  );
}

function getVisibleProgressDots(total: number, currentIndex: number) {
  if (total <= 6) {
    return Array.from({ length: total }, (_, index) => index);
  }

  const start = Math.max(0, Math.min(currentIndex - 2, total - 5));
  return Array.from({ length: 5 }, (_, index) => start + index);
}

function getPageDurationHint(page: GuidedPage) {
  return page.items.find((item) => item.durationHint)?.durationHint;
}

function getFullPrayerContent(step: MassFlowStep, item: MassGuidedItem | undefined, greetingTextOverride: string, responseOverride: string) {
  const currentKey = item?.fullPrayerKey;
  const keyContent = currentKey ? MASS_CONTENT[currentKey] : undefined;
  const resolvedBlocks = step.textBlocks
    .map((block) => resolveMassTextBlock(block, MASS_CONTENT))
    .map((block) => block.text.trim())
    .filter(Boolean);

  if (currentKey === "penitential_dialogue" || currentKey === "penitential_tropes") {
    const groupedLines = getGuidedFullPrayerLines(step, currentKey, greetingTextOverride, responseOverride);

    if (groupedLines.length > 0) {
      return {
        title: step.title,
        lines: groupedLines
      };
    }
  }

  if (currentKey === "kyrie" && step.guidedItems?.some((guidedItem) => guidedItem.id.startsWith("branch-kyrie-"))) {
    const groupedLines = getGuidedFullPrayerLines(step, currentKey, greetingTextOverride, responseOverride);

    if (groupedLines.length > 0) {
      return {
        title: step.title,
        lines: groupedLines
      };
    }
  }

  if (step.id === "greeting" && currentKey === "response_and_with_your_spirit") {
    return {
      title: step.title,
      lines: ["Celebrant:", greetingTextOverride, "People:", responseOverride]
    };
  }

  if (keyContent) {
    return {
      title: step.title,
      lines: splitTextLines(keyContent)
    };
  }

  if (currentKey && step.guidedItems) {
    const groupedLines = getGuidedFullPrayerLines(step, currentKey, greetingTextOverride, responseOverride);

    if (groupedLines.length > 0) {
      return {
        title: step.title,
        lines: groupedLines
      };
    }
  }

  if (resolvedBlocks.length > 0) {
    return {
      title: step.title,
      lines: resolvedBlocks.flatMap(splitTextLines)
    };
  }

  if (step.guidedItems && step.guidedItems.length > 0) {
    return {
      title: step.title,
      lines: step.guidedItems.map((guidedItem) => getGuidedDisplayText(guidedItem, greetingTextOverride, responseOverride))
    };
  }

  return {
    title: step.title,
    lines: [step.summary, step.guidance].filter((line): line is string => Boolean(line))
  };
}

function getGuidedFullPrayerLines(step: MassFlowStep, currentKey: string, greetingTextOverride: string, responseOverride: string) {
  if (currentKey === "penitential_dialogue") {
    const lines = getCallAndResponseFullPrayerLines(step, [
      ["branch-dialogue-have-mercy", "branch-dialogue-sinned"],
      ["branch-dialogue-show-mercy", "branch-dialogue-salvation"]
    ]);
    if (lines.length > 0) {
      return lines;
    }
  }

  if (currentKey === "penitential_tropes") {
    const lines = getCallAndResponseFullPrayerLines(step, [
      ["branch-tropes-contrite", "branch-tropes-lord"],
      ["branch-tropes-sinners", "branch-tropes-christ"],
      ["branch-tropes-intercede", "branch-tropes-lord-repeat"]
    ]);
    if (lines.length > 0) {
      return lines;
    }
  }

  return (
    step.guidedItems
      ?.filter((guidedItem) => guidedItem.fullPrayerKey === currentKey)
      .map((guidedItem) => getGuidedDisplayText(guidedItem, greetingTextOverride, responseOverride))
      .filter(Boolean) ?? []
  );
}

function getCallAndResponseFullPrayerLines(step: MassFlowStep, pairs: string[][]) {
  const items = step.guidedItems ?? [];

  return pairs.flatMap(([listenId, responseId]) => {
    const listen = items.find((item) => item.id === listenId);
    const response = items.find((item) => item.id === responseId);

    if (!listen || !response) {
      return [];
    }

    return ["Celebrant:", listen.text, "People:", response.text];
  });
}

function getGuidedPhraseStyle(text: string) {
  const length = text.trim().length;

  if (length <= 8) {
    return styles.guidedPhraseShort;
  }

  if (length >= 34) {
    return styles.guidedPhraseLong;
  }

  return null;
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: attendPalette.parchment,
    flex: 1
  },
  wrap: {
    flex: 1,
    gap: 7,
    paddingHorizontal: attendSpacing.screenX,
    paddingBottom: attendSpacing.screenBottom,
    paddingTop: attendSpacing.screenTop
  },
  top: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md
  },
  topButton: {
    justifyContent: "center",
    minHeight: 44
  },
  exit: {
    color: "rgba(29, 46, 68, 0.62)",
    fontSize: 15
  },
  lostButton: {
    alignItems: "center",
    borderColor: "rgba(137, 100, 45, 0.18)",
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 36,
    minWidth: 78,
    paddingHorizontal: spacing.md
  },
  lostText: {
    color: "rgba(29, 46, 68, 0.58)",
    fontSize: 14,
    fontWeight: "500"
  },
  restartButton: {
    justifyContent: "center",
    minHeight: 42,
    paddingLeft: spacing.sm
  },
  restartText: {
    color: "rgba(29, 46, 68, 0.38)",
    fontSize: 13
  },
  modeSwitch: {
    alignSelf: "center",
    backgroundColor: "rgba(251, 247, 238, 0.16)",
    borderColor: "rgba(137, 100, 45, 0.05)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: spacing.xs,
    padding: 2,
    width: 188
  },
  modeButton: {
    alignItems: "center",
    borderRadius: 999,
    flex: 1,
    justifyContent: "center",
    minHeight: 28
  },
  modeActive: {
    backgroundColor: "rgba(200, 160, 74, 0.28)"
  },
  modeText: {
    color: "rgba(29, 46, 68, 0.44)",
    fontSize: 13
  },
  modeTextActive: {
    color: "rgba(29, 46, 68, 0.72)",
    fontWeight: "600"
  },
  lostPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: 238,
    padding: spacing.md
  },
  jumpGroup: {
    marginBottom: spacing.md
  },
  jumpSection: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: spacing.sm
  },
  jumpItem: {
    minHeight: 36,
    justifyContent: "center"
  },
  jumpText: {
    color: colors.navyBlack,
    fontSize: 15
  },
  guidedBody: {
    alignItems: "center",
    backgroundColor: "rgba(251, 247, 238, 0.04)",
    borderRadius: 18,
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingBottom: 6,
    paddingTop: 10,
    position: "relative"
  },
  previousAffordance: {
    alignItems: "center",
    height: 46,
    justifyContent: "center",
    left: -spacing.md,
    position: "absolute",
    top: "49%",
    width: 30,
    zIndex: 2
  },
  previousAffordanceText: {
    color: "rgba(184, 137, 69, 0.42)",
    fontFamily: "Georgia",
    fontSize: 28,
    lineHeight: 32
  },
  guidedTop: {
    alignItems: "center",
    gap: 4
  },
  posturePill: {
    alignItems: "center",
    backgroundColor: "rgba(255, 253, 248, 0.32)",
    borderColor: "rgba(137, 100, 45, 0.16)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  posturePillText: {
    color: "rgba(137, 100, 45, 0.76)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0
  },
  guidedSection: {
    color: "rgba(29, 46, 68, 0.14)",
    fontSize: 11,
    fontWeight: "500"
  },
  guidedTitle: {
    color: "rgba(29, 46, 68, 0.84)",
    fontFamily: attendTypography.display,
    fontSize: attendTypography.titleSize,
    lineHeight: attendTypography.titleLineHeight,
    marginBottom: 44,
    marginTop: attendSpacing.guidedClusterTop,
    textAlign: "center",
    width: "100%"
  },
  guidedCenter: {
    alignItems: "center",
    gap: attendSpacing.guidedClusterGap,
    justifyContent: "flex-start",
    maxWidth: attendSpacing.phraseMeasure,
    paddingBottom: 6,
    width: "100%"
  },
  guidedBeatGroup: {
    alignItems: "center",
    gap: 13,
    marginTop: 22,
    maxWidth: attendSpacing.phraseMeasure,
    width: "100%"
  },
  guidedTitleCompact: {
    marginBottom: 24
  },
  guidedBeatGroupCompact: {
    marginTop: 0
  },
  guidedBeat: {
    alignItems: "center",
    gap: 8,
    width: "100%"
  },
  groupDivider: {
    marginVertical: 2
  },
  groupDescription: {
    color: "rgba(29, 46, 68, 0.68)",
    fontFamily: "Georgia",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 28,
    maxWidth: 220,
    textAlign: "center"
  },
  guidanceType: {
    backgroundColor: attendPalette.chipListen,
    borderRadius: 5,
    color: colors.surface,
    fontSize: attendTypography.chipSize,
    fontWeight: "600",
    letterSpacing: 0.3,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  youSayType: {
    backgroundColor: attendPalette.chipYouSay
  },
  youDoType: {
    backgroundColor: attendPalette.chipYouDo
  },
  listenType: {
    backgroundColor: attendPalette.chipListen
  },
  ambientType: {
    backgroundColor: attendPalette.chipAmbient
  },
  guidedPhrase: {
    color: attendPalette.deepNavy,
    fontFamily: attendTypography.display,
    fontSize: attendTypography.phraseSize,
    lineHeight: attendTypography.phraseLineHeight,
    maxWidth: attendSpacing.phraseMeasure,
    textAlign: "center",
    width: "100%"
  },
  guidedPhraseGrouped: {
    fontSize: 26,
    lineHeight: 33,
    maxWidth: 240
  },
  guidedPhraseShort: {
    fontSize: attendTypography.phraseShortSize,
    lineHeight: attendTypography.phraseShortLineHeight,
    marginBottom: 2,
    marginTop: 4
  },
  guidedPhraseLong: {
    fontSize: attendTypography.phraseLongSize,
    lineHeight: attendTypography.phraseLongLineHeight,
    maxWidth: attendSpacing.phraseMeasureLong
  },
  cadenceCue: {
    color: "rgba(29, 46, 68, 0.58)",
    fontFamily: "Georgia",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
    marginTop: -5,
    textAlign: "center"
  },
  variantLink: {
    minHeight: 28,
    justifyContent: "center",
    marginTop: -4
  },
  variantLinkText: {
    color: "rgba(137, 100, 45, 0.94)",
    fontSize: 13,
    textDecorationLine: "underline"
  },
  durationHint: {
    color: "rgba(29, 46, 68, 0.40)",
    fontFamily: "Georgia",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
    marginTop: 64,
    textAlign: "center"
  },
  guidedLower: {
    alignItems: "center",
    gap: 3,
    marginTop: "auto",
    minHeight: 18,
    paddingBottom: 0,
    width: "100%"
  },
  progressDots: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center"
  },
  progressDot: {
    backgroundColor: attendPalette.progress,
    borderRadius: 999,
    height: 3.4,
    width: 3.4
  },
  progressDotActive: {
    backgroundColor: attendPalette.progressActive
  },
  fullPrayerNotice: {
    backgroundColor: "rgba(239, 231, 218, 0.34)",
    borderColor: "rgba(137, 100, 45, 0.08)",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  fullPrayerNoticeText: {
    color: "rgba(29, 46, 68, 0.46)",
    fontSize: 13,
    textAlign: "center"
  },
  tapHint: {
    color: "rgba(29, 46, 68, 0.44)",
    fontSize: 12
  },
  body: {
    flex: 1,
    gap: spacing.sm,
    justifyContent: "flex-start"
  },
  liveLayer: {
    gap: spacing.xs
  },
  section: {
    color: colors.gold,
    fontSize: 14
  },
  subsection: {
    color: colors.navyBlack,
    fontSize: 18
  },
  title: {
    color: colors.navyBlack,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36
  },
  posture: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "900",
    marginTop: spacing.md,
    textTransform: "uppercase"
  },
  prayerBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.xs,
    padding: spacing.md
  },
  textBlock: {
    gap: 2
  },
  roleLabel: {
    color: colors.stone,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  youRole: {
    color: colors.gold
  },
  allRole: {
    color: colors.goldMuted
  },
  prayer: {
    color: colors.navyBlack,
    fontSize: 15,
    lineHeight: 20
  },
  youText: {
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 22
  },
  allText: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21
  },
  optional: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "900",
    marginTop: -spacing.xs
  },
  guidance: {
    color: colors.stone,
    fontSize: 15,
    lineHeight: 21
  },
  endingContext: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "900",
    marginTop: spacing.sm
  },
  learnLayer: {
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden"
  },
  learnToggle: {
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: spacing.md
  },
  learnToggleText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "900"
  },
  learnScroll: {
    maxHeight: 166
  },
  learnContent: {
    gap: spacing.md,
    padding: spacing.md,
    paddingTop: 0
  },
  learnBlock: {
    gap: spacing.xs
  },
  learnLabel: {
    color: colors.navyBlack,
    fontSize: 13,
    fontWeight: "900"
  },
  learnCopy: {
    color: colors.stone,
    fontSize: 14,
    lineHeight: 20
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl
  },
  navButton: {
    alignItems: "center",
    borderColor: "rgba(137, 100, 45, 0.18)",
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 42,
    minWidth: 92,
    paddingHorizontal: spacing.md
  },
  disabled: {
    opacity: 0.45
  },
  navText: {
    color: "rgba(29, 46, 68, 0.58)",
    fontSize: 14,
    fontWeight: "600"
  },
  footerTools: {
    flexDirection: "row",
    gap: attendSpacing.footerGap,
    justifyContent: "center",
    minHeight: 26
  },
  footerTool: {
    justifyContent: "center",
    minHeight: 26,
    paddingHorizontal: 6
  },
  footerToolText: {
    color: "rgba(29, 46, 68, 0.42)",
    fontSize: 10,
    fontWeight: "500"
  },
  attendDock: {
    alignItems: "center",
    backgroundColor: "rgba(251, 247, 238, 0.42)",
    borderColor: "rgba(137, 100, 45, 0.08)",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 54,
    paddingHorizontal: spacing.md,
    paddingVertical: 3
  },
  dockItem: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    minWidth: 62
  },
  dockIcon: {
    color: "rgba(29, 46, 68, 0.52)",
    fontSize: 18,
    lineHeight: 20
  },
  dockLabel: {
    color: "rgba(29, 46, 68, 0.42)",
    fontSize: 9,
    fontWeight: "500",
    marginTop: 2
  },
  crossButton: {
    alignItems: "center",
    backgroundColor: "rgba(251, 247, 238, 0.56)",
    borderColor: "rgba(184, 137, 69, 0.36)",
    borderRadius: 999,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  crossText: {
    color: attendPalette.mutedGold,
    fontSize: 25,
    lineHeight: 29
  },
  referencePanel: {
    backgroundColor: "rgba(251, 247, 238, 0.86)",
    borderColor: attendPalette.softBorder,
    borderRadius: 18,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md
  },
  referenceTitle: {
    color: attendPalette.deepNavy,
    fontFamily: "Georgia",
    fontSize: 18,
    marginBottom: spacing.xs,
    textAlign: "center"
  },
  referenceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 26
  },
  referenceLabel: {
    color: attendPalette.deepNavySoft,
    fontSize: 10,
    fontWeight: "700",
    width: 72
  },
  referenceText: {
    color: attendPalette.warmGray,
    flex: 1,
    fontSize: 12,
    lineHeight: 16
  },
  referenceRule: {
    backgroundColor: "rgba(137, 100, 45, 0.12)",
    height: 1,
    marginVertical: spacing.xs
  },
  referenceSmall: {
    color: attendPalette.warmGray,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center"
  },
  referenceAction: {
    alignSelf: "center",
    justifyContent: "center",
    minHeight: 32,
    paddingHorizontal: spacing.md
  },
  referenceActionText: {
    color: "rgba(29, 46, 68, 0.46)",
    fontSize: 12,
    fontWeight: "600"
  },
  sheet: {
    backgroundColor: "rgba(251, 247, 238, 0.96)",
    borderColor: attendPalette.softBorder,
    borderRadius: 18,
    borderWidth: 1,
    bottom: 92,
    left: spacing.xl,
    padding: spacing.lg,
    position: "absolute",
    right: spacing.xl,
    zIndex: 10
  },
  fullPrayerScroll: {
    maxHeight: 260
  },
  fullPrayerContent: {
    gap: spacing.sm,
    paddingBottom: spacing.sm
  },
  fullPrayerLine: {
    color: attendPalette.deepNavy,
    fontFamily: "Georgia",
    fontSize: 18,
    lineHeight: 27
  },
  sheetHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  sheetTitle: {
    color: attendPalette.deepNavy,
    flex: 1,
    fontFamily: "Georgia",
    fontSize: 18,
    lineHeight: 24
  },
  sheetCopy: {
    color: attendPalette.warmGray,
    fontSize: 14,
    lineHeight: 20
  },
  closeButton: {
    alignItems: "center",
    borderColor: "rgba(29, 46, 68, 0.16)",
    borderRadius: 999,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    marginLeft: spacing.md,
    width: 34
  },
  variantOptions: {
    borderColor: "rgba(137, 100, 45, 0.12)",
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden"
  },
  variantOption: {
    alignItems: "center",
    borderBottomColor: "rgba(137, 100, 45, 0.12)",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.md
  },
  variantOptionText: {
    color: attendPalette.deepNavy,
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  },
  notSureAction: {
    alignSelf: "flex-start",
    justifyContent: "center",
    marginTop: spacing.lg,
    minHeight: 36
  },
  notSureText: {
    color: "rgba(137, 100, 45, 0.86)",
    fontSize: 12,
    textDecorationLine: "underline"
  },
  postureGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs
  },
  postureRefItem: {
    alignItems: "center",
    gap: 4,
    width: "24%"
  },
  postureRefLabel: {
    color: attendPalette.deepNavySoft,
    fontSize: 9,
    fontWeight: "700"
  },
  seasonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm
  },
  seasonItem: {
    alignItems: "center",
    gap: 3,
    width: "24%"
  },
  seasonSwatch: {
    borderColor: "rgba(137, 100, 45, 0.12)",
    borderRadius: 8,
    borderWidth: 1,
    height: 22,
    width: 34
  },
  seasonLabel: {
    color: attendPalette.warmGray,
    fontSize: 9
  },
  homeIcon: {
    height: 20,
    position: "relative",
    width: 22
  },
  homeRoof: {
    borderColor: "rgba(29, 46, 68, 0.54)",
    borderRightWidth: 2,
    borderTopWidth: 2,
    height: 12,
    left: 4,
    position: "absolute",
    top: 2,
    transform: [{ rotate: "-45deg" }],
    width: 12
  },
  homeBase: {
    borderColor: "rgba(29, 46, 68, 0.54)",
    borderWidth: 2,
    borderTopWidth: 0,
    bottom: 1,
    height: 10,
    left: 5,
    position: "absolute",
    width: 12
  },
  crossIcon: {
    height: 26,
    position: "relative",
    width: 26
  },
  crossVertical: {
    backgroundColor: attendPalette.mutedGold,
    borderRadius: 2,
    height: 24,
    left: 12,
    position: "absolute",
    top: 1,
    width: 2
  },
  crossHorizontal: {
    backgroundColor: attendPalette.mutedGold,
    borderRadius: 2,
    height: 2,
    left: 5,
    position: "absolute",
    top: 9,
    width: 16
  },
  moreIcon: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    height: 20,
    justifyContent: "center",
    width: 24
  },
  moreDot: {
    backgroundColor: "rgba(29, 46, 68, 0.54)",
    borderRadius: 999,
    height: 4,
    width: 4
  },
  speakerIcon: {
    height: 24,
    position: "relative",
    width: 28
  },
  speakerBox: {
    backgroundColor: "rgba(29, 46, 68, 0.54)",
    height: 10,
    left: 1,
    position: "absolute",
    top: 7,
    width: 7
  },
  speakerCone: {
    borderBottomColor: "transparent",
    borderBottomWidth: 7,
    borderRightColor: "rgba(29, 46, 68, 0.54)",
    borderRightWidth: 10,
    borderTopColor: "transparent",
    borderTopWidth: 7,
    height: 0,
    left: 7,
    position: "absolute",
    top: 4,
    width: 0
  },
  speakerWave: {
    borderColor: "rgba(29, 46, 68, 0.38)",
    borderLeftWidth: 0,
    borderRadius: 10,
    borderWidth: 1.1,
    height: 18,
    left: 16,
    position: "absolute",
    top: 3,
    width: 10
  },
  closeIcon: {
    height: 18,
    position: "relative",
    width: 18
  },
  closeStroke: {
    backgroundColor: "rgba(29, 46, 68, 0.56)",
    height: 1,
    left: 2,
    position: "absolute",
    top: 8,
    width: 14
  },
  closeOne: {
    transform: [{ rotate: "45deg" }]
  },
  closeTwo: {
    transform: [{ rotate: "-45deg" }]
  },
  checkIcon: {
    borderBottomColor: attendPalette.deepNavy,
    borderBottomWidth: 2,
    borderRightColor: attendPalette.deepNavy,
    borderRightWidth: 2,
    height: 12,
    marginRight: spacing.xs,
    transform: [{ rotate: "45deg" }],
    width: 7
  },
  postureIcon: {
    height: 17,
    position: "relative",
    width: 14
  },
  postureHead: {
    borderColor: attendPalette.mutedGold,
    borderRadius: 999,
    borderWidth: 1,
    height: 5,
    left: 5,
    position: "absolute",
    top: 0,
    width: 5
  },
  postureBody: {
    backgroundColor: attendPalette.mutedGold,
    borderRadius: 2,
    height: 8,
    left: 6,
    position: "absolute",
    top: 5,
    width: 2
  },
  postureBodySit: {
    transform: [{ rotate: "12deg" }]
  },
  postureBodyKneel: {
    top: 6,
    transform: [{ rotate: "28deg" }]
  },
  postureLeg: {
    backgroundColor: attendPalette.mutedGold,
    borderRadius: 2,
    height: 5,
    left: 6,
    position: "absolute",
    top: 12,
    width: 2
  },
  postureLegSit: {
    height: 7,
    top: 10,
    transform: [{ rotate: "84deg" }]
  },
  postureLegKneel: {
    height: 8,
    top: 10,
    transform: [{ rotate: "72deg" }]
  },
  postureSecondPerson: {
    backgroundColor: "rgba(184, 137, 69, 0.56)",
    borderRadius: 2,
    height: 11,
    left: 10,
    position: "absolute",
    top: 5,
    width: 2
  },
  lyreRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    width: "100%"
  },
  lyreLineLeft: {
    backgroundColor: "rgba(184, 137, 69, 0.28)",
    flex: 1,
    height: 1
  },
  lyreLineRight: {
    backgroundColor: "rgba(184, 137, 69, 0.28)",
    flex: 1,
    height: 1
  },
  artWrap: {
    height: 48,
    marginBottom: -1,
    marginTop: 4,
    position: "relative",
    width: 72
  },
  lyreArc: {
    borderBottomColor: attendPalette.mutedGold,
    borderBottomWidth: 2,
    borderLeftColor: attendPalette.mutedGold,
    borderLeftWidth: 2,
    borderRadius: 18,
    borderRightColor: attendPalette.mutedGold,
    borderRightWidth: 2,
    bottom: 2,
    height: 40,
    left: 15,
    position: "absolute",
    width: 42
  },
  lyreStringOne: {
    backgroundColor: "rgba(184, 137, 69, 0.7)",
    height: 30,
    left: 30,
    position: "absolute",
    top: 11,
    width: 1
  },
  lyreStringTwo: {
    backgroundColor: "rgba(184, 137, 69, 0.7)",
    height: 31,
    left: 35,
    position: "absolute",
    top: 8,
    width: 1
  },
  lyreStringThree: {
    backgroundColor: "rgba(184, 137, 69, 0.7)",
    height: 30,
    left: 41,
    position: "absolute",
    top: 9,
    width: 1
  },
  gestureArt: {
    height: 96,
    marginTop: 4,
    position: "relative",
    width: 96
  },
  gestureHead: {
    borderColor: attendPalette.mutedGold,
    borderRadius: 999,
    borderWidth: 1,
    height: 30,
    left: 34,
    position: "absolute",
    top: 5,
    width: 30
  },
  gestureBody: {
    borderColor: attendPalette.mutedGold,
    borderRadius: 42,
    borderTopWidth: 1,
    height: 52,
    left: 23,
    position: "absolute",
    top: 41,
    width: 52
  },
  gestureArm: {
    backgroundColor: attendPalette.mutedGold,
    borderRadius: 2,
    height: 2,
    position: "absolute",
    width: 46
  },
  gestureArmSign: {
    left: 27,
    top: 30,
    transform: [{ rotate: "-56deg" }]
  },
  gestureArmBreast: {
    left: 30,
    top: 57,
    transform: [{ rotate: "-28deg" }]
  },
  gestureHand: {
    borderColor: attendPalette.mutedGold,
    borderRadius: 999,
    borderWidth: 1,
    height: 12,
    left: 46,
    position: "absolute",
    top: 52,
    width: 12
  },
  smallCrossArt: {
    alignItems: "center",
    height: 62,
    justifyContent: "center",
    opacity: 0.68,
    width: 62
  },
  sunburstArt: {
    height: 78,
    marginTop: 4,
    position: "relative",
    width: 78
  },
  sunCircle: {
    borderColor: "rgba(184, 137, 69, 0.34)",
    borderRadius: 999,
    borderWidth: 1,
    height: 30,
    left: 24,
    position: "absolute",
    top: 24,
    width: 30
  },
  sunRay: {
    backgroundColor: "rgba(184, 137, 69, 0.3)",
    height: 28,
    left: 38,
    position: "absolute",
    top: 3,
    width: 1
  },
  chaliceArt: {
    height: 60,
    marginTop: 4,
    position: "relative",
    width: 60
  },
  chaliceCup: {
    borderBottomColor: attendPalette.mutedGold,
    borderBottomWidth: 2,
    borderColor: attendPalette.mutedGold,
    borderRadius: 16,
    borderWidth: 1,
    height: 22,
    left: 16,
    position: "absolute",
    top: 6,
    width: 28
  },
  chaliceStem: {
    backgroundColor: attendPalette.mutedGold,
    height: 20,
    left: 29,
    position: "absolute",
    top: 28,
    width: 2
  },
  chaliceBase: {
    backgroundColor: attendPalette.mutedGold,
    height: 2,
    left: 16,
    position: "absolute",
    top: 48,
    width: 26
  },
  sacredDivider: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginVertical: 3,
    width: 214
  },
  dividerLine: {
    backgroundColor: "rgba(184, 137, 69, 0.28)",
    flex: 1,
    height: 1
  },
  dividerOrnament: {
    backgroundColor: "rgba(184, 137, 69, 0.85)",
    height: 6.5,
    transform: [{ rotate: "45deg" }],
    width: 6.5
  }
});
