import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../../components/AppScreen";
import { colors, spacing } from "../../../constants/theme";
import { weeklyTruths } from "../../../data/weeklyTruths";
import { useReflections } from "../../../hooks/useReflections";

export default function JournalScreen() {
  const { reflections, refresh } = useReflections();
  const current = weeklyTruths[0];

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
        <Text style={styles.copy}>Review what you received and carry it into the week.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>This Week's Truth</Text>
        <Text style={styles.truth}>{current.truth}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Practice</Text>
        <Text style={styles.practice}>Offer one hidden act of charity.</Text>
      </View>
      {reflections.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.label}>Reflections</Text>
          {reflections.slice(0, 3).map((item) => (
            <View key={`journal-reflection-${item.id}`} style={styles.reflectionItem}>
              <Text style={styles.reflection}>{item.text}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginTop: spacing.xxl
  },
  title: {
    color: colors.charcoal,
    fontSize: 36,
    fontWeight: "900"
  },
  copy: {
    color: colors.mutedText,
    fontSize: 17,
    lineHeight: 24
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.xl
  },
  label: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "900"
  },
  truth: {
    color: colors.charcoal,
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 32
  },
  practice: {
    color: colors.charcoal,
    fontSize: 18,
    lineHeight: 25
  },
  reflection: {
    color: colors.charcoal,
    fontSize: 15,
    lineHeight: 22
  },
  reflectionItem: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: spacing.md
  }
});
