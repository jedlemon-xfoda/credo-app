import { StyleSheet, TextInput } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

type ReflectionInputProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function ReflectionInput({ value, onChangeText }: ReflectionInputProps) {
  return (
    <TextInput
      accessibilityLabel="Reflection"
      accessibilityHint="Write the moment, word, or grace you want to remember."
      multiline
      onChangeText={onChangeText}
      placeholder="Write here..."
      placeholderTextColor={colors.mutedText}
      returnKeyType="default"
      style={styles.input}
      textAlignVertical="top"
      value={value}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.charcoal,
    fontSize: 16,
    lineHeight: 23,
    minHeight: 136,
    padding: spacing.md
  }
});
