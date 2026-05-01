import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

type SacredCardProps = PropsWithChildren<{
  warm?: boolean;
  accent?: boolean;
}>;

export function SacredCard({ children, warm = false, accent = false }: SacredCardProps) {
  return <View style={[styles.card, warm && styles.warm, accent && styles.accent]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg
  },
  warm: {
    backgroundColor: colors.surfaceWarm
  },
  accent: {
    borderColor: colors.gold,
    borderWidth: 1.5
  }
});
