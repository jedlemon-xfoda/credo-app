import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../constants/theme";

export function TrustFooter() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Simple. Sacred. Essential.</Text>
      <Text style={styles.copy}>Prayer Mode works offline. Reflections stay private on this device in the MVP.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.xs,
    paddingTop: spacing.lg
  },
  title: {
    color: colors.charcoal,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  copy: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20
  }
});
