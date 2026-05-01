import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../../components/AppScreen";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { colors, spacing } from "../../../constants/theme";
import { reviewContentProvider } from "../../../data/reviewContentProvider";
import { useDailyJourney } from "../../../hooks/useDailyJourney";
import type { MassMeta } from "../../../services/liturgicalContentProvider";
import type { DailyJourneyState, JourneyStepId, JourneyStepStatus } from "../../../types";

const JOURNEY_STEPS: Array<{ id: JourneyStepId; label: string; subtitle: string; route: string; cta: string; icon: string }> = [
  {
    id: "prepare",
    label: "Prepare",
    subtitle: "Read and ready your heart.",
    route: "/(tabs)/home/prepare",
    cta: "Begin Prepare",
    icon: "+"
  },
  {
    id: "attend",
    label: "Attend",
    subtitle: "Walk through the Mass.",
    route: "/(tabs)/home/attend",
    cta: "Begin Attend",
    icon: "+"
  },
  {
    id: "reflect",
    label: "Reflect",
    subtitle: "Reflect after Mass.",
    route: "/(tabs)/home/reflect",
    cta: "Begin Reflection",
    icon: "o"
  }
];

const journeyStepById = Object.fromEntries(JOURNEY_STEPS.map((step) => [step.id, step])) as Record<JourneyStepId, (typeof JOURNEY_STEPS)[number]>;

export default function HomeScreen() {
  const { state, ready, refresh, markStepStarted } = useDailyJourney();
  const currentStep = state?.currentStep ?? "prepare";
  const allComplete = state ? JOURNEY_STEPS.every((step) => state.steps[step.id] === "complete") : false;
  const nextCard = getNextCard(state);
  const [massMeta, setMassMeta] = useState<MassMeta | null>(null);

  useEffect(() => {
    let mounted = true;
    reviewContentProvider.getTodayMassMeta(new Date()).then((meta) => {
      if (mounted) {
        setMassMeta(meta);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh({ ignoreTransientFields: true });
    }, [refresh])
  );

  async function openStep(stepId: JourneyStepId) {
    const meta = journeyStepById[stepId];
    if (state?.steps[stepId] !== "complete") {
      await markStepStarted(stepId);
    }
    router.push(meta.route);
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Today</Text>
          <Text style={styles.date}>{formatHomeDate(new Date())}</Text>
          <Text style={styles.liturgicalTitle}>{massMeta?.title ?? "Thursday of the Fourth Week of Easter"}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.context}>{massMeta?.season ?? "Easter Season"}</Text>
            <View style={styles.colorBadge}>
              <View style={styles.whiteDot} />
              <Text style={styles.badgeText}>{massMeta?.liturgicalColor ?? "White"}</Text>
            </View>
            <Text style={styles.massType}>{massMeta?.massType ?? "Daily Mass"}</Text>
          </View>
          <Text style={styles.reviewLabel}>Review copy</Text>
        </View>
        <View style={styles.addCircle}>
          <Text style={styles.addText}>+</Text>
        </View>
      </View>

      <View style={styles.nextCard}>
        <Text style={styles.cardKicker}>Next Step</Text>
        <Text style={styles.nextTitle}>{nextCard.header}</Text>
        <PrimaryButton accessibilityLabel={nextCard.cta} disabled={!ready} onPress={() => openStep(nextCard.step)}>
          {nextCard.cta}
        </PrimaryButton>
      </View>

      <Text style={styles.sectionTitle}>Today's Journey</Text>
      <View style={styles.list}>
        {JOURNEY_STEPS.map((step) => (
          <JourneyRow current={step.id === currentStep && !allComplete} key={`journey-${step.id}`} onPress={() => openStep(step.id)} status={state?.steps[step.id] ?? "not_started"} step={step} />
        ))}
      </View>
      <Text style={styles.note}>Open any step anytime. CREDO highlights what is most likely next.</Text>
    </AppScreen>
  );
}

function JourneyRow({ step, status, current, onPress }: { step: (typeof JOURNEY_STEPS)[number]; status: JourneyStepStatus; current: boolean; onPress: () => void }) {
  const complete = status === "complete";

  return (
    <Pressable accessibilityLabel={`${step.label} journey step`} accessibilityRole="button" onPress={onPress} style={[styles.row, current && styles.rowCurrent]}>
      <View style={[styles.icon, current && styles.iconCurrent, complete && styles.iconComplete]}>
        <Text style={[styles.iconText, (current || complete) && styles.iconTextActive]}>{complete ? "✓" : step.icon}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, (current || complete) && styles.rowTitleActive]}>{step.label}</Text>
        <Text style={styles.rowSub}>{step.subtitle}</Text>
      </View>
      <Text style={[styles.rowAction, complete && styles.rowActionComplete]}>{status === "complete" ? "Review" : status === "in_progress" ? "Continue" : "Start"}</Text>
    </Pressable>
  );
}

function formatHomeDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(date);
}

function getNextCard(state: DailyJourneyState | null): { header: string; cta: string; step: JourneyStepId } {
  if (!state) return { header: "Begin with Prepare", cta: "Begin Prepare", step: "prepare" };
  if (JOURNEY_STEPS.every((step) => state.steps[step.id] === "complete")) return { header: "You've completed today's journey", cta: "Revisit any step", step: "reflect" };
  if (state.steps.prepare === "complete" && state.steps.attend === "complete") return { header: "Reflect after Mass", cta: state.steps.reflect === "in_progress" ? "Continue Reflection" : "Begin Reflection", step: "reflect" };
  if (state.steps.prepare === "complete" && state.steps.attend === "in_progress") return { header: "Continue Attending Mass", cta: "Continue Attending", step: "attend" };
  if (state.steps.prepare === "complete") return { header: "Begin Attending Mass", cta: "Begin Attend", step: "attend" };
  if (state.steps.prepare === "in_progress") return { header: "Continue Preparing for Mass", cta: "Continue Preparing", step: "prepare" };
  return { header: "Begin with Prepare", cta: "Begin Prepare", step: "prepare" };
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: spacing.xl },
  headerText: { flex: 1, paddingRight: spacing.md },
  eyebrow: { color: colors.mutedText, fontSize: 14, fontWeight: "800" },
  date: { color: colors.charcoal, fontSize: 24, fontWeight: "900", lineHeight: 31, marginTop: spacing.sm },
  liturgicalTitle: { color: colors.burgundy, fontSize: 13, fontWeight: "800", lineHeight: 18, marginTop: spacing.xs },
  metaRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xs },
  context: { color: colors.mutedText, fontSize: 15 },
  colorBadge: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 999, borderWidth: 1, flexDirection: "row", gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  whiteDot: { backgroundColor: "#FFFFFF", borderColor: colors.border, borderRadius: 999, borderWidth: 1, height: 10, width: 10 },
  badgeText: { color: colors.mutedText, fontSize: 12, fontWeight: "700" },
  massType: { color: colors.mutedText, fontSize: 13 },
  reviewLabel: { color: colors.mutedText, fontSize: 11, fontWeight: "700", marginTop: spacing.xs },
  addCircle: { alignItems: "center", borderColor: colors.gold, borderRadius: 999, borderWidth: 1, height: 56, justifyContent: "center", width: 56 },
  addText: { color: colors.gold, fontSize: 30, fontWeight: "900", lineHeight: 34 },
  nextCard: { backgroundColor: colors.surface, borderColor: colors.gold, borderRadius: 18, borderWidth: 1, gap: spacing.md, padding: spacing.lg },
  cardKicker: { color: colors.mutedText, fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  nextTitle: { color: colors.charcoal, fontSize: 24, fontWeight: "900", lineHeight: 30 },
  sectionTitle: { color: colors.charcoal, fontSize: 20, fontWeight: "900" },
  list: { gap: spacing.md },
  row: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, flexDirection: "row", gap: spacing.md, minHeight: 73, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  rowCurrent: { borderColor: colors.gold },
  icon: { alignItems: "center", backgroundColor: colors.background, borderColor: colors.border, borderRadius: 999, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  iconCurrent: { backgroundColor: colors.burgundy, borderColor: colors.burgundy },
  iconComplete: { backgroundColor: colors.success, borderColor: colors.success },
  iconText: { color: colors.gold, fontSize: 18, fontWeight: "900" },
  iconTextActive: { color: colors.surface },
  rowText: { flex: 1 },
  rowTitle: { color: colors.charcoal, fontSize: 17, fontWeight: "900" },
  rowTitleActive: { color: colors.burgundy },
  rowSub: { color: colors.mutedText, fontSize: 12, marginTop: 3 },
  rowAction: { color: colors.burgundy, fontSize: 13, fontWeight: "900" },
  rowActionComplete: { color: colors.success },
  note: { color: colors.mutedText, fontSize: 12, marginTop: -spacing.md }
});
