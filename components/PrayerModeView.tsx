import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../constants/theme";
import type { MassSection } from "../types";

type PrayerModeKind = "guide" | "quiet";

type PrayerModeViewProps = {
  section: MassSection;
  sections: MassSection[];
  currentIndex: number;
  total: number;
  mode: PrayerModeKind;
  jumpOpen: boolean;
  onChangeMode: (mode: PrayerModeKind) => void;
  onExit?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  onToggleJump: () => void;
  onJumpToSection: (id: string) => void;
  saved?: boolean;
};

export function PrayerModeView({
  section,
  sections,
  currentIndex,
  total,
  mode,
  jumpOpen,
  onChangeMode,
  onExit,
  onPrevious,
  onNext,
  onSave,
  onToggleJump,
  onJumpToSection,
  saved = false
}: PrayerModeViewProps) {
  const guideMode = mode === "guide";

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Pressable accessibilityLabel="Exit prayer mode" accessibilityRole="button" hitSlop={8} onPress={onExit} style={styles.topButton}>
          <Text style={styles.exitText}>Exit</Text>
        </Pressable>
        <Pressable accessibilityLabel="Jump to section" accessibilityRole="button" hitSlop={8} onPress={onToggleJump} style={styles.jumpButton}>
          <Text style={styles.jumpText}>{jumpOpen ? "Close" : "Jump"}</Text>
        </Pressable>
      </View>

      <View accessibilityLabel="Prayer Mode display style" style={styles.segment}>
        <Pressable accessibilityLabel="Guide Me mode" accessibilityRole="button" accessibilityState={{ selected: guideMode }} onPress={() => onChangeMode("guide")} style={[styles.segmentButton, guideMode && styles.segmentActive]}>
          <Text style={[styles.segmentText, guideMode && styles.segmentTextActive]}>Guide Me</Text>
        </Pressable>
        <Pressable accessibilityLabel="Pray Quietly mode" accessibilityRole="button" accessibilityState={{ selected: !guideMode }} onPress={() => onChangeMode("quiet")} style={[styles.segmentButton, !guideMode && styles.segmentActive]}>
          <Text style={[styles.segmentText, !guideMode && styles.segmentTextActive]}>Pray Quietly</Text>
        </Pressable>
      </View>

      {jumpOpen ? (
        <View style={styles.jumpPanel}>
          <Text style={styles.jumpTitle}>Jump to section</Text>
          <ScrollView contentContainerStyle={styles.jumpList}>
            {sections.map((item) => (
              <Pressable accessibilityLabel={`Jump to ${item.jumpLabel ?? item.title}`} accessibilityRole="button" key={item.id} onPress={() => onJumpToSection(item.id)} style={[styles.jumpItem, item.id === section.id && styles.jumpItemActive]}>
                <Text style={[styles.jumpItemText, item.id === section.id && styles.jumpItemTextActive]}>{item.jumpLabel ?? item.title}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      <View style={styles.center}>
        <Text style={styles.progress}>
          Mass moment {currentIndex + 1} of {total}
        </Text>
        <Text style={styles.section}>{section.title.toUpperCase()}</Text>
        <View style={styles.ruleRow}>
          <View style={styles.rule} />
          <Text style={styles.cross}>+</Text>
          <View style={styles.rule} />
        </View>
        <Text style={styles.main}>{guideMode ? section.main : section.quietText ?? section.main}</Text>
        {guideMode && section.responseText ? <Text style={styles.response}>{section.responseText}</Text> : null}
        {guideMode && section.postureCue ? <Text style={styles.posture}>{section.postureCue}</Text> : null}
        <Text style={styles.detail}>{guideMode ? section.shortMeaning ?? section.detail : section.shortMeaning ?? section.detail}</Text>
      </View>

      <View style={styles.controls}>
        <Pressable accessibilityLabel="Previous Mass moment" accessibilityRole="button" hitSlop={8} onPress={onPrevious} style={styles.controlButton}>
          <Text style={styles.control}>Prev</Text>
        </Pressable>
        <View style={styles.candle}>
          <Text style={styles.candleText}>I</Text>
        </View>
        <Pressable accessibilityLabel="Next Mass moment" accessibilityRole="button" hitSlop={8} onPress={onNext} style={styles.controlButton}>
          <Text style={styles.control}>Next</Text>
        </Pressable>
      </View>
      <Pressable accessibilityLabel="Save for after Mass" accessibilityRole="button" accessibilityState={{ selected: saved }} hitSlop={8} onPress={onSave} style={[styles.saveButton, saved && styles.savedButton]}>
        <Text style={styles.saveButtonText}>{saved ? "Saved for after Mass" : "Save for after Mass"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.navyBlack,
    flex: 1,
    gap: spacing.md,
    justifyContent: "space-between",
    padding: spacing.xl
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  topButton: {
    justifyContent: "center",
    minHeight: 44
  },
  exitText: {
    color: colors.surface,
    fontSize: 16
  },
  jumpButton: {
    alignItems: "center",
    borderColor: colors.gold,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 82,
    paddingHorizontal: spacing.md
  },
  jumpText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "800"
  },
  segment: {
    backgroundColor: "rgba(255, 253, 248, 0.08)",
    borderColor: "rgba(185, 144, 61, 0.28)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    padding: 4
  },
  segmentButton: {
    alignItems: "center",
    borderRadius: 999,
    flex: 1,
    minHeight: 40,
    justifyContent: "center"
  },
  segmentActive: {
    backgroundColor: colors.gold
  },
  segmentText: {
    color: colors.stone,
    fontSize: 13,
    fontWeight: "800"
  },
  segmentTextActive: {
    color: colors.navyBlack
  },
  jumpPanel: {
    borderColor: "rgba(185, 144, 61, 0.35)",
    borderRadius: radius.md,
    borderWidth: 1,
    maxHeight: 220,
    padding: spacing.md
  },
  jumpTitle: {
    color: colors.surface,
    fontFamily: typography.display,
    fontSize: 18,
    marginBottom: spacing.sm
  },
  jumpList: {
    gap: spacing.sm
  },
  jumpItem: {
    borderColor: "rgba(255, 253, 248, 0.14)",
    borderRadius: radius.sm,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  jumpItemActive: {
    backgroundColor: "rgba(185, 144, 61, 0.18)",
    borderColor: colors.gold
  },
  jumpItemText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "700"
  },
  jumpItemTextActive: {
    color: colors.gold
  },
  center: {
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  progress: {
    color: colors.goldMuted,
    fontSize: 13
  },
  section: {
    color: colors.surface,
    fontFamily: typography.display,
    fontSize: 16,
    letterSpacing: 1,
    textAlign: "center"
  },
  ruleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  rule: {
    backgroundColor: colors.gold,
    height: 1,
    width: 72
  },
  cross: {
    color: colors.gold,
    fontFamily: typography.display,
    fontSize: 24,
    lineHeight: 28
  },
  main: {
    color: colors.surface,
    fontFamily: typography.display,
    fontSize: 28,
    lineHeight: 38,
    textAlign: "center"
  },
  response: {
    color: colors.surface,
    fontSize: 17,
    lineHeight: 25,
    textAlign: "center"
  },
  posture: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  detail: {
    color: colors.stone,
    fontSize: 17,
    lineHeight: 26,
    textAlign: "center"
  },
  controls: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  controlButton: {
    alignItems: "center",
    borderColor: "rgba(185, 144, 61, 0.45)",
    borderRadius: 999,
    borderWidth: 1,
    height: 58,
    justifyContent: "center",
    minWidth: 76,
    paddingHorizontal: spacing.md
  },
  control: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 20
  },
  candle: {
    alignItems: "center",
    borderColor: colors.gold,
    borderRadius: 999,
    borderWidth: 1,
    height: 72,
    justifyContent: "center",
    width: 72
  },
  candleText: {
    color: colors.gold,
    fontFamily: typography.display,
    fontSize: 30,
    lineHeight: 34,
    textAlign: "center"
  },
  saveButton: {
    alignItems: "center",
    borderColor: colors.gold,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: spacing.lg
  },
  savedButton: {
    backgroundColor: "rgba(185, 144, 61, 0.16)"
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "700"
  }
});
