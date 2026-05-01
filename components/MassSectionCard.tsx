import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";
import type { MassSection } from "../types";

type MassSectionCardProps = {
  section: MassSection;
  index: number;
};

export function MassSectionCard({ section, index }: MassSectionCardProps) {
  return (
    <Pressable
      accessibilityLabel={`Open ${section.title}`}
      accessibilityRole="button"
      onPress={() => router.push(`/mass/section/${section.id}`)}
      style={({ pressed }) => [styles.link, pressed && styles.pressed]}
    >
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{index + 1}</Text>
          </View>
          <View style={styles.copy}>
            <Text style={styles.partLabel}>Mass part</Text>
            <Text style={styles.title}>{section.title}</Text>
            <Text style={styles.detail}>{section.detail}</Text>
          </View>
          <Text style={styles.chevron}>{">"}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    width: "100%"
  },
  pressed: {
    opacity: 0.75
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  copy: {
    flex: 1
  },
  badge: {
    alignItems: "center",
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.gold,
    borderRadius: 999,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  badgeText: {
    color: colors.burgundy,
    fontSize: 13,
    fontWeight: "800"
  },
  partLabel: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 2,
    textTransform: "uppercase"
  },
  title: {
    color: colors.charcoal,
    fontSize: 16,
    fontWeight: "700"
  },
  detail: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  chevron: {
    color: colors.burgundy,
    fontSize: 20,
    fontWeight: "700"
  }
});
