import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SourceBadge } from "../../../components/SourceBadge";
import { colors, spacing } from "../../../constants/theme";
import { labelPosture, massFlowSections, massFlowSteps } from "../../../data/massFlow";
import { useDailyJourney } from "../../../hooks/useDailyJourney";
import { useUserMassProfile } from "../../../hooks/useUserMassProfile";
import type { MassFlowStep, MassTextBlock } from "../../../types";

type AttendMode = "guided" | "quiet";

export default function AttendScreen() {
  const { state, ready, markStepStarted, markStepComplete, restartAttend, setAttendPosition } = useDailyJourney();
  const { profile } = useUserMassProfile();
  const [index, setIndex] = useState(0);
  const [lostOpen, setLostOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [mode, setMode] = useState<AttendMode>("guided");
  const resumed = useRef(false);
  const isExitingRef = useRef(false);
  const suppressPositionPersist = useRef(false);
  const step = massFlowSteps[index];
  const finalStep = step.id === "dismissal";

  useEffect(() => {
    setMode(profile.experienceMode === "quiet" ? "quiet" : "guided");
  }, [profile.experienceMode]);

  useEffect(() => {
    setLearnOpen(false);
  }, [step.id]);

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
    suppressPositionPersist.current = false;
    setIndex((current) => {
      const nextIndex = Math.max(0, current - 1);
      setAttendPosition(massFlowSteps[nextIndex].id);
      return nextIndex;
    });
  }, [setAttendPosition]);

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
    if (finalStep) {
      await handleCompleteAttend();
      return;
    }

    suppressPositionPersist.current = false;
    setIndex((current) => {
      const nextIndex = Math.min(massFlowSteps.length - 1, current + 1);
      setAttendPosition(massFlowSteps[nextIndex].id);
      return nextIndex;
    });
  }, [finalStep, handleCompleteAttend, setAttendPosition]);

  const jumpTo = useCallback(
    (id: string) => {
      if (isExitingRef.current) {
        return;
      }
      const nextIndex = massFlowSteps.findIndex((item) => item.id === id);
      if (nextIndex >= 0) {
        suppressPositionPersist.current = false;
        setIndex(nextIndex);
        setAttendPosition(id);
      }
      setLostOpen(false);
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
    setLostOpen(false);
  }

  function handleExitAttend() {
    isExitingRef.current = true;
    suppressPositionPersist.current = true;
    setLostOpen(false);
    router.replace("/(tabs)/home");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <View style={styles.top}>
          <Pressable accessibilityLabel="Exit Attend" accessibilityRole="button" onPress={handleExitAttend} style={styles.topButton}>
            <Text style={styles.exit}>Exit</Text>
          </Pressable>
          <Pressable accessibilityLabel="I'm lost" accessibilityRole="button" onPress={() => setLostOpen((value) => !value)} style={styles.lostButton}>
            <Text style={styles.lostText}>I'm lost</Text>
          </Pressable>
          <Pressable accessibilityLabel="Restart Mass" accessibilityRole="button" onPress={restartMass} style={styles.restartButton}>
            <Text style={styles.restartText}>Restart</Text>
          </Pressable>
        </View>

        <View style={styles.modeSwitch}>
          {(["guided", "quiet"] as AttendMode[]).map((item) => (
            <Pressable
              accessibilityLabel={`${item} mode`}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === item }}
              key={item}
              onPress={() => setMode(item)}
              style={[styles.modeButton, mode === item && styles.modeActive]}
            >
              <Text style={[styles.modeText, mode === item && styles.modeTextActive]}>{item === "guided" ? "Guided" : "Quiet"}</Text>
            </Pressable>
          ))}
        </View>

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

        <View style={styles.body}>
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
        </View>

        <View style={styles.nav}>
          <Pressable accessibilityLabel="Previous Mass step" accessibilityRole="button" disabled={index === 0} onPress={previous} style={[styles.navButton, index === 0 && styles.disabled]}>
            <Text style={styles.navText}>Prev</Text>
          </Pressable>
          <Pressable accessibilityLabel={finalStep ? "Continue to Reflection" : "Next Mass step"} accessibilityRole="button" onPress={next} style={styles.navButton}>
            <Text style={styles.navText}>{finalStep ? "Continue to Reflection" : "Next"}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function MassTextBlocks({ blocks }: { blocks: MassTextBlock[] }) {
  const visibleBlocks = blocks.filter((block) => block.text.trim().length > 0);

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
    case "liturgy-of-the-word":
      return "God speaks to His people through Scripture and the Church listens in faith.";
    case "liturgy-of-the-eucharist":
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

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.navyBlack,
    flex: 1
  },
  wrap: {
    flex: 1,
    gap: spacing.lg,
    padding: spacing.xl,
    paddingTop: spacing.xxl
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
    color: colors.surface,
    fontSize: 16
  },
  lostButton: {
    alignItems: "center",
    borderColor: "rgba(200, 160, 74, 0.55)",
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 42,
    minWidth: 88,
    paddingHorizontal: spacing.md
  },
  lostText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "700"
  },
  restartButton: {
    justifyContent: "center",
    minHeight: 42,
    paddingLeft: spacing.sm
  },
  restartText: {
    color: colors.stone,
    fontSize: 13
  },
  modeSwitch: {
    backgroundColor: "#131417",
    borderColor: "#2B2C2F",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    padding: 4
  },
  modeButton: {
    alignItems: "center",
    borderRadius: 999,
    flex: 1,
    justifyContent: "center",
    minHeight: 38
  },
  modeActive: {
    backgroundColor: colors.gold
  },
  modeText: {
    color: colors.surface,
    fontSize: 14
  },
  modeTextActive: {
    color: colors.navyBlack,
    fontWeight: "900"
  },
  lostPanel: {
    borderColor: "#2B2C2F",
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
    color: colors.surface,
    fontSize: 15
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
    color: colors.surface,
    fontSize: 18
  },
  title: {
    color: colors.surface,
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
    backgroundColor: "#15161A",
    borderColor: "#302A1E",
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
    color: colors.surface,
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
    borderColor: "#2B2C2F",
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
    color: colors.surface,
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
    paddingHorizontal: spacing.md
  },
  navButton: {
    alignItems: "center",
    borderColor: colors.gold,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 54,
    minWidth: 110,
    paddingHorizontal: spacing.md
  },
  disabled: {
    opacity: 0.45
  },
  navText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "900"
  }
});
