import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

type SecondaryButtonProps = PropsWithChildren<{
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
}>;

export function SecondaryButton({ children, onPress, accessibilityLabel, disabled = false }: SecondaryButtonProps) {
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
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  label: {
    color: colors.charcoal,
    fontSize: 16,
    fontWeight: "600"
  },
  pressed: {
    backgroundColor: colors.surfaceWarm,
    transform: [{ scale: 0.99 }]
  },
  disabled: {
    opacity: 0.55
  }
});
