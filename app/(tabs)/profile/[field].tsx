import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../../components/AppScreen";
import { RhythmAction } from "../../../components/RhythmAction";
import { colors, spacing } from "../../../constants/theme";
import { profileOptionGroups, type ProfileField, type ProfileOption } from "../../../data/profileOptions";
import { useUserMassProfile } from "../../../hooks/useUserMassProfile";
import type { UserMassProfile } from "../../../types";

const fields: ProfileField[] = ["experienceMode", "familiarity", "massTypePreference", "parishStyle"];

export default function ProfileSelectionScreen() {
  const params = useLocalSearchParams<{ field?: string }>();
  const field = fields.includes(params.field as ProfileField) ? (params.field as ProfileField) : "experienceMode";
  const group = profileOptionGroups[field];
  const { profile, ready, updateProfile } = useUserMassProfile();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const fieldRef = useRef(field);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const fieldChanged = fieldRef.current !== field;
    if (fieldChanged) {
      fieldRef.current = field;
    }
    setSelectedOptionId((current) => (fieldChanged || current === null ? getSelectedOptionId(field, profile) : current));
  }, [field, profile, ready]);

  async function choose(option: ProfileOption) {
    setSelectedOptionId(option.id);
    const next: UserMassProfile = { ...profile };

    if (field === "experienceMode") {
      next.experienceMode = option.value as UserMassProfile["experienceMode"];
    }
    if (field === "familiarity") {
      next.familiarity = option.value as UserMassProfile["familiarity"];
    }
    if (field === "massTypePreference") {
      next.massTypePreference = option.value as UserMassProfile["massTypePreference"];
    }
    if (field === "parishStyle") {
      next.parishStyle = option.value as UserMassProfile["parishStyle"];
    }

    await updateProfile(next);
    router.back();
  }

  function isSelected(option: ProfileOption) {
    return selectedOptionId === option.id;
  }

  return (
    <AppScreen>
      <View style={styles.top}>
        <Pressable accessibilityLabel="Back to Profile" accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>{"<"}</Text>
        </Pressable>
      </View>
      <View style={styles.header}>
        <Text style={styles.kicker}>Profile</Text>
        <Text style={styles.title}>{group.title}</Text>
      </View>
      <View style={styles.choices}>
        {group.options.map((option) => (
          <RhythmAction
            icon={option.icon}
            key={`profile-${field}-${option.id}`}
            onPress={() => choose(option)}
            recommended={field === "experienceMode" && option.id === "guided"}
            selected={isSelected(option)}
            subtitle={option.subtitle}
            title={option.title}
          />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  top: { marginTop: spacing.xl },
  back: { height: 44, justifyContent: "center", width: 44 },
  backText: { color: colors.charcoal, fontSize: 26, fontWeight: "900" },
  header: { gap: spacing.xs },
  kicker: { color: colors.burgundy, fontSize: 13, fontWeight: "900", textTransform: "uppercase" },
  title: { color: colors.charcoal, fontSize: 32, fontWeight: "900", lineHeight: 39 },
  choices: { gap: spacing.md }
});

function getSelectedOptionId(field: ProfileField, profile: UserMassProfile) {
  const group = profileOptionGroups[field];
  const value = profile[field];
  return group.options.find((option) => option.value === value)?.id ?? group.options[0]?.id ?? null;
}
