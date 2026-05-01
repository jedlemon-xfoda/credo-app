import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

type PrimaryButtonProps = PropsWithChildren<{
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
}>;

export function PrimaryButton({ children, onPress, accessibilityLabel, disabled = false }: PrimaryButtonProps) {
  const label = accessibilityLabel ?? (typeof children === "string" ? children : undefined);

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.burgundy,
    borderRadius: radius.md,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm
  },
  label: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center"
  },
  pressed: {
    backgroundColor: colors.burgundyDark,
    transform: [{ scale: 0.99 }]
  },
  disabled: {
    opacity: 0.55
  }
});
