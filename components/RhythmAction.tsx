import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../constants/theme";

type RhythmActionProps = {
  title: string;
  subtitle: string;
  icon: string;
  onPress?: () => void;
  selected?: boolean;
  recommended?: boolean;
};

export function RhythmAction({ title, subtitle, icon, onPress, selected = false, recommended = false }: RhythmActionProps) {
  return (
    <Pressable
      accessibilityLabel={`${title}. ${subtitle}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [styles.row, recommended && styles.recommended, selected && styles.selected, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, selected && styles.selectedIconWrap]}>
        <Text style={[styles.icon, selected && styles.selectedIcon]}>{icon}</Text>
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {recommended ? <Text style={styles.badge}>Recommended</Text> : null}
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.chevron}>{">"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 72,
    padding: spacing.md
  },
  selected: {
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.gold,
    borderWidth: 2
  },
  recommended: {
    borderColor: colors.gold
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.995 }]
  },
  iconWrap: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  selectedIconWrap: {
    backgroundColor: colors.burgundy,
    borderColor: colors.burgundy
  },
  icon: {
    color: colors.gold,
    fontFamily: typography.display,
    fontSize: 18,
    textAlign: "center"
  },
  selectedIcon: {
    color: colors.surface
  },
  copy: {
    flex: 1,
    gap: 2
  },
  title: {
    color: colors.charcoal,
    fontSize: 16,
    fontWeight: "700"
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  badge: {
    backgroundColor: colors.burgundy,
    borderRadius: 999,
    color: colors.surface,
    fontSize: 10,
    fontWeight: "900",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    textTransform: "uppercase"
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 18
  },
  chevron: {
    color: colors.burgundy,
    fontSize: 22
  }
});
