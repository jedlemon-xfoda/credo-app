import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../components/PrimaryButton";
import { brand } from "../constants/brand";
import { colors, spacing, typography } from "../constants/theme";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.hero}>
        <View pointerEvents="none" style={styles.arch}>
          {[0, 1, 2, 3, 4, 5].map((line) => (
            <View key={line} style={styles.archLine} />
          ))}
        </View>
        <View style={styles.identity}>
          <CredoMark />
          <Text accessibilityRole="header" style={styles.wordmark}>
            {brand.appName}
          </Text>
          <View style={styles.divider}>
            <Text style={styles.dividerCross}>+</Text>
          </View>
          <Text style={styles.tagline}>{brand.tagline}</Text>
          <Text style={styles.category}>The Quiet Companion{"\n"}for the Holy Mass</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <PrimaryButton accessibilityLabel="Begin CREDO onboarding" onPress={() => router.push("/onboarding")}>
          Begin
        </PrimaryButton>
        <Text style={styles.signInLine}>
          Already have an account? <Text style={styles.signInText}>Sign in</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

function CredoMark() {
  return (
    <View accessibilityLabel="CREDO logo" style={styles.mark}>
      <View style={styles.markDiamond} />
      <View style={styles.markVertical} />
      <View style={styles.markHorizontal} />
      <View style={styles.markTop} />
      <View style={styles.markBottom} />
      <View style={styles.markLeft} />
      <View style={styles.markRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
    padding: spacing.xl
  },
  hero: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 96,
    position: "relative"
  },
  arch: {
    alignItems: "center",
    backgroundColor: "rgba(255, 253, 248, 0.58)",
    borderRadius: 999,
    flexDirection: "row",
    gap: 24,
    height: 570,
    justifyContent: "center",
    opacity: 0.9,
    position: "absolute",
    width: 280
  },
  archLine: {
    backgroundColor: colors.border,
    height: 430,
    width: 1
  },
  identity: {
    alignItems: "center",
    gap: spacing.lg,
    position: "relative",
    width: "100%"
  },
  mark: {
    alignItems: "center",
    height: 64,
    justifyContent: "center",
    width: 64
  },
  markDiamond: {
    borderColor: colors.burgundy,
    borderRadius: 8,
    borderWidth: 2,
    height: 42,
    transform: [{ rotate: "45deg" }],
    width: 42
  },
  markVertical: {
    backgroundColor: colors.burgundy,
    height: 46,
    position: "absolute",
    width: 6
  },
  markHorizontal: {
    backgroundColor: colors.burgundy,
    height: 6,
    position: "absolute",
    width: 38
  },
  markTop: {
    backgroundColor: colors.burgundy,
    borderRadius: 999,
    height: 8,
    position: "absolute",
    top: 6,
    width: 8
  },
  markBottom: {
    backgroundColor: colors.burgundy,
    borderRadius: 999,
    bottom: 6,
    height: 8,
    position: "absolute",
    width: 8
  },
  markLeft: {
    backgroundColor: colors.burgundy,
    borderRadius: 999,
    height: 8,
    left: 6,
    position: "absolute",
    width: 8
  },
  markRight: {
    backgroundColor: colors.burgundy,
    borderRadius: 999,
    height: 8,
    position: "absolute",
    right: 6,
    width: 8
  },
  wordmark: {
    color: colors.burgundy,
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 9,
    lineHeight: 52,
    textAlign: "center"
  },
  divider: {
    alignItems: "center",
    backgroundColor: colors.gold,
    height: 1,
    justifyContent: "center",
    marginTop: -spacing.sm,
    width: 96
  },
  dividerCross: {
    backgroundColor: colors.background,
    color: colors.gold,
    fontFamily: typography.display,
    fontSize: 20,
    lineHeight: 22,
    paddingHorizontal: spacing.sm
  },
  tagline: {
    color: colors.charcoal,
    fontSize: 24,
    fontWeight: "500",
    lineHeight: 30,
    maxWidth: 300,
    textAlign: "center"
  },
  category: {
    color: colors.burgundy,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    lineHeight: 24,
    textAlign: "center",
    textTransform: "uppercase"
  },
  actions: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
    width: "100%"
  },
  signInLine: {
    color: colors.charcoal,
    fontFamily: typography.display,
    fontSize: 16,
    textAlign: "center"
  },
  signInText: {
    color: colors.burgundy
  }
});
