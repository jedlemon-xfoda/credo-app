import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../../components/AppScreen";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { SourceBadge } from "../../../components/SourceBadge";
import { colors, spacing } from "../../../constants/theme";
import { reviewContentProvider } from "../../../data/reviewContentProvider";
import { sundayContent } from "../../../data/sunday";
import { useDailyJourney } from "../../../hooks/useDailyJourney";
import type { DailyReadings } from "../../../services/liturgicalContentProvider";

export default function PrepareScreen() {
  const [step, setStep] = useState(0);
  const { markStepStarted, markStepComplete, ready, setPrepareStep, state } = useDailyJourney();
  const resumed = useRef(false);

  useEffect(() => {
    markStepStarted("prepare");
  }, [markStepStarted]);

  useEffect(() => {
    if (!ready || resumed.current) {
      return;
    }
    resumed.current = true;
    if (state?.steps.prepare === "in_progress" && typeof state.prepareStep === "number") {
      setStep(Math.min(2, Math.max(0, state.prepareStep)));
    }
  }, [ready, state?.prepareStep, state?.steps.prepare]);

  function goBack() {
    if (step === 0) {
      router.back();
      return;
    }
    resumed.current = true;
    const next = step - 1;
    setStep(next);
    setPrepareStep(next);
  }

  async function continueFlow() {
    if (step < 2) {
      resumed.current = true;
      const next = step + 1;
      setStep(next);
      setPrepareStep(next);
      return;
    }

    await markStepComplete("prepare");
    await markStepStarted("attend");
    router.replace("/(tabs)/home/attend");
  }

  return (
    <AppScreen>
      <View style={styles.top}>
        <Pressable accessibilityLabel={step === 0 ? "Return Home" : "Previous Prepare step"} accessibilityRole="button" onPress={goBack} style={styles.back}>
          <Text style={styles.backText}>{"<"}</Text>
        </Pressable>
        <View style={styles.centerTitle}>
          <Text style={styles.title}>Prepare</Text>
          <Text style={styles.sub}>Step {step + 1} of 3</Text>
          <View style={styles.dots}>
            {[0, 1, 2].map((item) => (
              <View key={`prepare-dot-${item}`} style={[styles.dot, item === step && styles.dotActive]}>
                <Text style={[styles.dotText, item === step && styles.dotTextActive]}>{item + 1}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.back} />
      </View>

      {step === 0 ? <ReadingsStep /> : null}
      {step === 1 ? <NoticeStep /> : null}
      {step === 2 ? <IntentionStep /> : null}

      <View style={styles.footer}>
        <PrimaryButton accessibilityLabel={step === 2 ? "I'm ready for Mass" : state?.steps.prepare === "complete" ? "Review" : "Continue"} onPress={continueFlow}>
          {step === 2 ? "I'm ready for Mass" : state?.steps.prepare === "complete" ? "Review" : "Continue"}
        </PrimaryButton>
        {step === 2 ? (
          <Pressable accessibilityLabel="I'll come back later" accessibilityRole="button" onPress={() => router.replace("/(tabs)/home")} style={styles.textAction}>
            <Text style={styles.textActionLabel}>I'll come back later</Text>
          </Pressable>
        ) : null}
      </View>
    </AppScreen>
  );
}

function ReadingsStep() {
  const [readings, setReadings] = useState<DailyReadings | null>(null);

  useEffect(() => {
    let mounted = true;
    reviewContentProvider.getReadingsForDate(new Date()).then((content) => {
      if (mounted) {
        setReadings(content);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const readingItems =
    readings?.items ??
    sundayContent.readings.map((reading) => ({
      id: reading.label,
      title: reading.label,
      citation: reading.citation,
      excerpt: reading.summary,
      text: reading.summary,
      metadata: undefined
    }));

  return (
    <>
      <Text style={styles.heading}>Today's Readings</Text>
      <View style={styles.card}>
        {readings?.metadata ? <SourceBadge compact metadata={readings.metadata} /> : null}
        {readingItems.map((reading) => (
          <View key={`reading-${reading.id}`} style={styles.reading}>
            <Text style={styles.readingLabel}>{reading.title}</Text>
            <Text style={styles.readingText}>{reading.citation}</Text>
            <Text numberOfLines={3} style={styles.excerpt}>{reading.excerpt || "Content unavailable"}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

function NoticeStep() {
  return (
    <>
      <Text style={styles.heading}>What to Notice</Text>
      <View style={styles.card}>
        {sundayContent.notice.map((item) => (
          <View key={`notice-${item.title}`} style={styles.reading}>
            <Text style={styles.readingLabel}>{item.title}</Text>
            <Text style={styles.copy}>{item.body}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

function IntentionStep() {
  return (
    <>
      <Text style={styles.heading}>Bring Intention</Text>
      <View style={styles.card}>
        <Text style={styles.readingLabel}>Bring this to Mass</Text>
        <Text style={styles.copy}>Choose one word, need, or person to place before the Lord.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  top: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl
  },
  back: {
    height: 44,
    justifyContent: "center",
    width: 44
  },
  backText: {
    color: colors.charcoal,
    fontSize: 36,
    fontWeight: "900"
  },
  centerTitle: {
    alignItems: "center",
    gap: spacing.sm
  },
  title: {
    color: colors.charcoal,
    fontSize: 24,
    fontWeight: "900"
  },
  sub: {
    color: colors.mutedText,
    fontSize: 14
  },
  dots: {
    flexDirection: "row",
    gap: spacing.md
  },
  dot: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 24,
    justifyContent: "center",
    width: 24
  },
  dotActive: {
    backgroundColor: colors.burgundy,
    borderColor: colors.burgundy
  },
  dotText: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "800"
  },
  dotTextActive: {
    color: colors.surface
  },
  heading: {
    color: colors.charcoal,
    fontSize: 29,
    fontWeight: "900",
    lineHeight: 36,
    marginTop: spacing.lg
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 308,
    padding: spacing.xl
  },
  reading: {
    marginBottom: spacing.lg
  },
  readingLabel: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: spacing.sm
  },
  readingText: {
    color: colors.charcoal,
    fontSize: 16
  },
  excerpt: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  copy: {
    color: colors.charcoal,
    fontSize: 16,
    lineHeight: 24
  },
  footer: {
    gap: spacing.md,
    marginTop: "auto",
    paddingBottom: spacing.xl
  },
  textAction: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44
  },
  textActionLabel: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: "700"
  }
});
