import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../components/AppScreen";
import { PrimaryButton } from "../components/PrimaryButton";
import { RhythmAction } from "../components/RhythmAction";
import { storageKeys } from "../constants/storage";
import { colors, spacing } from "../constants/theme";
import { defaultProfile, saveUserMassProfile } from "../services/journeyState";
import type { ExperienceMode, FamiliarityLevel, MassTypePreference, ParishStyle, UserMassProfile } from "../types";

type OnboardingStepId = "experienceMode" | "familiarity" | "massTypePreference" | "parishStyle";

type Option<T> = {
  id: string;
  value: T;
  title: string;
  subtitle: string;
  icon: string;
};

const steps: Array<{
  id: OnboardingStepId;
  title: string;
  feedback: string;
  options: Option<ExperienceMode | FamiliarityLevel | MassTypePreference | ParishStyle>[];
}> = [
  {
    id: "experienceMode",
    title: "How would you like to experience Mass?",
    feedback: "Guided is recommended for most people.",
    options: [
      { id: "guided", value: "guided", title: "Guided", subtitle: "Gentle guidance.", icon: "+" },
      { id: "quiet", value: "quiet", title: "Quiet", subtitle: "Simple and prayerful.", icon: "*" },
      { id: "not_sure", value: "not_sure", title: "Not sure", subtitle: "We'll guide you.", icon: "?" }
    ]
  },
  {
    id: "familiarity",
    title: "How familiar are you with Mass?",
    feedback: "This helps CREDO keep explanations at the right level.",
    options: [
      { id: "new", value: "new", title: "New to Mass", subtitle: "I need the basics.", icon: "+" },
      { id: "somewhat", value: "somewhat", title: "Somewhat familiar", subtitle: "I know some parts.", icon: "o" },
      { id: "very", value: "very", title: "Very familiar", subtitle: "Keep it concise.", icon: "*" },
      { id: "not-sure", value: "not_sure", title: "Not sure yet", subtitle: "Help me find my footing.", icon: "?" }
    ]
  },
  {
    id: "massTypePreference",
    title: "Which Mass are you preparing for?",
    feedback: "For now, CREDO uses local review Mass content.",
    options: [
      { id: "sunday", value: "sunday", title: "Sunday Mass", subtitle: "The Lord's Day.", icon: "+" },
      { id: "daily", value: "daily", title: "Daily Mass", subtitle: "A quieter rhythm.", icon: "o" },
      { id: "both", value: "both", title: "Both", subtitle: "Sunday and weekday.", icon: "*" },
      { id: "not-sure", value: "not_sure", title: "Not sure yet", subtitle: "I'll decide later.", icon: "?" }
    ]
  },
  {
    id: "parishStyle",
    title: "What parish style feels most familiar?",
    feedback: "You can change this later in Profile.",
    options: [
      { id: "traditional", value: "traditional", title: "Traditional", subtitle: "More solemn and classic.", icon: "+" },
      { id: "balanced", value: "balanced", title: "Balanced", subtitle: "A clear middle path.", icon: "o" },
      { id: "modern", value: "modern", title: "Modern", subtitle: "Simple and contemporary.", icon: "*" },
      { id: "not-sure", value: "not_sure", title: "Not sure yet", subtitle: "Use a balanced default.", icon: "?" }
    ]
  }
];

export default function OnboardingScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserMassProfile>(defaultProfile);
  const [selectedIds, setSelectedIds] = useState<Record<OnboardingStepId, string>>({
    experienceMode: "guided",
    familiarity: "new",
    massTypePreference: "sunday",
    parishStyle: "traditional"
  });

  const step = steps[stepIndex];
  const selectedId = selectedIds[step.id];

  function selectOption(option: Option<ExperienceMode | FamiliarityLevel | MassTypePreference | ParishStyle>) {
    setSelectedIds((current) => ({ ...current, [step.id]: option.id }));
    setProfile((current) => ({ ...current, [step.id]: option.value }));
  }

  async function continueFlow() {
    if (stepIndex < steps.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }

    setSaving(true);
    await saveUserMassProfile(profile);
    await AsyncStorage.multiSet([
      [storageKeys.onboardingChoice, profile.experienceMode],
      [storageKeys.onboardingComplete, "true"]
    ]);
    router.replace("/(tabs)/home");
  }

  function goBack() {
    if (stepIndex > 0) {
      setStepIndex((current) => current - 1);
    }
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {stepIndex > 0 ? (
            <Text accessibilityLabel="Previous onboarding step" accessibilityRole="button" onPress={goBack} style={styles.back}>
              {"<"}
            </Text>
          ) : (
            <View style={styles.backPlaceholder} />
          )}
          <Text style={styles.eyebrow}>{stepIndex + 1} of 4</Text>
        </View>
        <Text style={styles.title}>{step.title}</Text>
      </View>
      <View style={styles.choices}>
        {step.options.map((option) => (
          <RhythmAction
            key={`${step.id}-${option.id}`}
            icon={option.icon}
            onPress={() => selectOption(option)}
            recommended={step.id === "experienceMode" && option.id === "guided"}
            selected={selectedId === option.id}
            subtitle={option.subtitle}
            title={option.title}
          />
        ))}
      </View>
      <View style={styles.feedback}>
        <Text style={styles.feedbackText}>{step.feedback}</Text>
      </View>
      <PrimaryButton accessibilityLabel={stepIndex === steps.length - 1 ? "Finish onboarding" : "Continue onboarding"} disabled={saving} onPress={continueFlow}>
        {saving ? "Saving..." : "Continue"}
      </PrimaryButton>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    gap: spacing.lg,
    marginTop: spacing.xxl
  },
  headerTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  back: {
    color: colors.charcoal,
    fontSize: 20,
    fontWeight: "900",
    minWidth: 24
  },
  backPlaceholder: {
    width: 24
  },
  eyebrow: {
    color: colors.burgundy,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  title: {
    color: colors.navyBlack,
    fontSize: 29,
    fontWeight: "800",
    lineHeight: 38
  },
  choices: {
    gap: spacing.md
  },
  feedback: {
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.lg
  },
  feedbackText: {
    color: colors.burgundy,
    fontSize: 14,
    lineHeight: 21
  }
});
