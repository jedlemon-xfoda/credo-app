import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../../components/AppScreen";
import { SecondaryButton } from "../../../components/SecondaryButton";
import { storageKeys } from "../../../constants/storage";
import { colors, spacing } from "../../../constants/theme";
import { useUserMassProfile } from "../../../hooks/useUserMassProfile";
import { createDefaultJourneyState, saveJourneyState } from "../../../services/journeyState";
import type { ExperienceMode, FamiliarityLevel, MassTypePreference, ParishStyle } from "../../../types";

export default function ProfileScreen() {
  const { profile, refresh } = useUserMassProfile();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  async function resetTodaysJourney() {
    await saveJourneyState(createDefaultJourneyState());
    const stored = await AsyncStorage.getItem(storageKeys.reflections);
    if (stored) {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const reflections = JSON.parse(stored);
        if (Array.isArray(reflections)) {
          await AsyncStorage.setItem(storageKeys.reflections, JSON.stringify(reflections.filter((item) => typeof item?.date !== "string" || !item.date.startsWith(today))));
        }
      } catch {
        await AsyncStorage.removeItem(storageKeys.reflections);
      }
    }
    await AsyncStorage.multiRemove([storageKeys.savedMassMoment, storageKeys.savedMassItems, storageKeys.weeklyPracticeComplete]);
  }

  async function resetApp() {
    await AsyncStorage.multiRemove([
      storageKeys.dailyJourneyState,
      storageKeys.userMassProfile,
      storageKeys.onboardingComplete,
      storageKeys.onboardingChoice,
      storageKeys.reflections,
      storageKeys.savedMassMoment,
      storageKeys.savedMassItems,
      storageKeys.weeklyPracticeComplete,
      storageKeys.settings
    ]);
    router.replace("/");
  }

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.kicker}>Default Mass Profile</Text>
      </View>
      <View style={styles.list}>
        <ProfileRow label="Experience Mode" onPress={() => router.push("/profile/experienceMode")} value={labelExperience(profile.experienceMode)} />
        <ProfileRow label="Familiarity" onPress={() => router.push("/profile/familiarity")} value={labelFamiliarity(profile.familiarity)} />
        <ProfileRow label="Mass Type" onPress={() => router.push("/profile/massTypePreference")} value={labelMassType(profile.massTypePreference)} />
        <ProfileRow label="Parish Style" onPress={() => router.push("/profile/parishStyle")} value={labelParish(profile.parishStyle)} />
      </View>
      <View style={styles.footer}>
        <SecondaryButton accessibilityLabel="Reset Today's Journey" onPress={resetTodaysJourney}>
          Reset Today's Journey
        </SecondaryButton>
        <Pressable accessibilityLabel="Reset App Dev" accessibilityRole="button" onPress={resetApp} style={styles.devReset}>
          <Text style={styles.devResetText}>Reset App (Dev)</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

function ProfileRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.valueWrap}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.value}>
          {value}
        </Text>
        <Text style={styles.chevron}>{">"}</Text>
      </View>
    </Pressable>
  );
}

function labelExperience(value: ExperienceMode) {
  return value === "guided" ? "Guided" : value === "quiet" ? "Quiet" : "Not sure";
}

function labelFamiliarity(value: FamiliarityLevel) {
  return value === "somewhat" ? "Somewhat" : value === "new" ? "New" : value === "very" ? "Very familiar" : "Not sure";
}

function labelMassType(value: MassTypePreference) {
  return value === "sunday" ? "Sunday Mass" : value === "daily" ? "Daily Mass" : value === "both" ? "Both" : "Not sure";
}

function labelParish(value: ParishStyle) {
  return value === "balanced" ? "Balanced" : value === "traditional" ? "Traditional" : value === "modern" ? "Modern" : "Not sure";
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, marginTop: spacing.xxl },
  title: { color: colors.charcoal, fontSize: 36, fontWeight: "900" },
  kicker: { color: colors.burgundy, fontSize: 14, fontWeight: "900" },
  list: { gap: spacing.lg },
  row: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 62,
    paddingHorizontal: spacing.lg
  },
  rowLabel: { color: colors.charcoal, flexShrink: 0, fontSize: 16, fontWeight: "900", marginRight: spacing.md },
  valueWrap: { alignItems: "center", flex: 1, flexDirection: "row", gap: spacing.sm, justifyContent: "flex-end", minWidth: 0 },
  value: { color: colors.mutedText, flexShrink: 1, fontSize: 15, maxWidth: 168, minWidth: 0, textAlign: "right" },
  chevron: { color: colors.burgundy, fontSize: 22, fontWeight: "900" },
  footer: { gap: spacing.md, marginTop: "auto" },
  devReset: { alignItems: "center", justifyContent: "center", minHeight: 44 },
  devResetText: { color: colors.mutedText, fontSize: 13, textDecorationLine: "underline" }
});
