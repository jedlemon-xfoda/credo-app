import { StyleSheet, Text, View } from "react-native";
import { brand } from "../constants/brand";
import { colors, spacing, typography } from "../constants/theme";

export function BrandMark() {
  return (
    <View style={styles.wrap}>
      <View accessibilityLabel={brand.appName} style={styles.mark}>
        <View style={styles.markInner}>
          <View style={styles.vertical} />
          <View style={styles.horizontal} />
        </View>
      </View>
      <Text style={styles.name}>{brand.appName}</Text>
      <Text style={styles.tagline}>{brand.tagline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: spacing.sm
  },
  mark: {
    alignItems: "center",
    borderColor: colors.burgundy,
    borderRadius: 999,
    borderWidth: 2,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  markInner: {
    alignItems: "center",
    borderColor: colors.gold,
    borderRadius: 999,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    width: 28
  },
  vertical: {
    backgroundColor: colors.burgundy,
    height: 30,
    position: "absolute",
    width: 3
  },
  horizontal: {
    backgroundColor: colors.burgundy,
    height: 3,
    position: "absolute",
    width: 30
  },
  name: {
    color: colors.navyBlack,
    fontFamily: typography.display,
    fontSize: 42,
    letterSpacing: 8
  },
  tagline: {
    color: colors.charcoal,
    fontSize: 16
  }
});
