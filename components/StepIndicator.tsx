import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../constants/theme";

type StepIndicatorProps = {
  current: number;
  total: number;
};

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <View accessibilityLabel={`Step ${current} of ${total}`} accessibilityRole="text" style={styles.wrap}>
      {Array.from({ length: total }, (_, index) => {
        const step = index + 1;
        const active = step === current;

        return (
          <View key={step} style={[styles.dot, active && styles.active]}>
            <Text style={[styles.label, active && styles.activeLabel]}>{step}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center"
  },
  dot: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    width: 28
  },
  active: {
    backgroundColor: colors.burgundy,
    borderColor: colors.burgundy
  },
  label: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "700"
  },
  activeLabel: {
    color: colors.surface
  }
});
