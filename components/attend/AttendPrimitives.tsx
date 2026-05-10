import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import type { ReactNode } from "react";
import { AttendIcon } from "../AttendIcon";
import type { AttendIconName } from "../../assets/icons/attend";
import { attendColors, attendIconColors, attendRadii, attendSpacing, attendTypography } from "../../constants/attendTheme";
import type { MassGuidedItem, MassPosture } from "../../types";

type GuidanceType = MassGuidedItem["guidanceType"];

export function PostureBadge({ label, posture }: { label: string; posture?: MassPosture }) {
  return (
    <View style={styles.posturePill}>
      <PostureGlyphIcon posture={posture} size={18} />
      <Text style={styles.posturePillText}>{label.toUpperCase()}</Text>
    </View>
  );
}

export function PostureGlyphIcon({ posture, size = 15 }: { posture?: MassPosture; size?: number }) {
  return <AttendIcon color={attendIconColors.postureGold} name={postureToIcon(posture)} size={size} />;
}

export function GuidanceChip({ type }: { type: GuidanceType }) {
  return <Text style={[styles.guidanceType, guidanceTypeStyle(type)]}>{labelGuidanceType(type)}</Text>;
}

export function SacredDivider({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.sacredDivider, style]}>
      <View style={styles.dividerLine} />
      <View style={styles.dividerOrnament} />
      <View style={styles.dividerLine} />
    </View>
  );
}

export function ProgressDots({ currentIndex, total }: { currentIndex: number; total: number }) {
  return (
    <View style={styles.progressDots}>
      {getVisibleProgressDots(total, currentIndex).map((dotIndex) => (
        <View key={`guided-dot-${dotIndex}`} style={[styles.progressDot, dotIndex === currentIndex && styles.progressDotActive]} />
      ))}
    </View>
  );
}

export function AttendDock({
  finalStep,
  onAdvance,
  onHome,
  onMore
}: {
  finalStep: boolean;
  onAdvance: () => void;
  onHome: () => void;
  onMore: () => void;
}) {
  return (
    <View style={styles.dockShell}>
      <View style={styles.attendDock}>
        <Pressable accessibilityLabel="Return Home" accessibilityRole="button" onPress={onHome} style={styles.dockItem}>
          <AttendIcon color={attendIconColors.navyMedium} name="home" size={18} />
          <Text style={styles.dockLabel}>Home</Text>
        </Pressable>
        <Pressable accessibilityLabel="Open Attend guide" accessibilityRole="button" onPress={onMore} style={styles.dockItem}>
          <AttendIcon color={attendIconColors.navyMedium} name="more" size={18} />
          <Text style={styles.dockLabel}>More</Text>
        </Pressable>
      </View>
      <View style={styles.dockTopEdge}>
        <View style={styles.dockEdgeLine} />
        <Pressable accessibilityLabel={finalStep ? "Continue to Reflection" : "Advance Attend moment"} accessibilityRole="button" onPress={onAdvance} style={styles.crossButton}>
          <AttendIcon color={attendColors.mutedGold} name="cross" size={26} />
        </Pressable>
        <View style={styles.dockEdgeLine} />
      </View>
    </View>
  );
}

export function AttendSheet({ children }: { children: ReactNode }) {
  return <View style={styles.sheet}>{children}</View>;
}

export function guidanceTypeStyle(type: GuidanceType) {
  switch (type) {
    case "you_say":
      return styles.youSayType;
    case "you_do":
      return styles.youDoType;
    case "ambient":
      return styles.ambientType;
    case "listen":
      return styles.listenType;
  }
}

export function labelGuidanceType(type: GuidanceType) {
  switch (type) {
    case "you_say":
      return "YOU SAY";
    case "you_do":
      return "YOU DO";
    case "listen":
      return "LISTEN";
    case "ambient":
      return "AMBIENT";
  }
}

export function postureToIcon(posture?: MassPosture): AttendIconName {
  if (posture === "sit" || posture === "sit_or_stand") return "sit";
  if (posture === "kneel" || posture === "stand_or_kneel") return "kneel";
  if (posture === "process") return "process";
  return "stand";
}

function getVisibleProgressDots(total: number, currentIndex: number) {
  if (total <= 6) {
    return Array.from({ length: total }, (_, index) => index);
  }

  const start = Math.max(0, Math.min(currentIndex - 2, total - 5));
  return Array.from({ length: 5 }, (_, index) => start + index);
}

const styles = StyleSheet.create({
  posturePill: {
    alignItems: "center",
    backgroundColor: "rgba(255, 253, 248, 0.40)",
    borderColor: "rgba(184, 148, 90, 0.48)",
    borderRadius: attendRadii.pill,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 5
  },
  posturePillText: {
    color: "#B8945A",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0
  },
  guidanceType: {
    backgroundColor: attendColors.chipListen,
    borderRadius: attendRadii.chip,
    color: "#FFFDF8",
    fontSize: attendTypography.chipSize,
    fontWeight: "600",
    letterSpacing: 0.3,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  youSayType: {
    backgroundColor: attendColors.chipYouSay
  },
  youDoType: {
    backgroundColor: attendColors.chipYouDo
  },
  listenType: {
    backgroundColor: attendColors.chipListen
  },
  ambientType: {
    backgroundColor: attendColors.chipAmbient,
    color: "rgba(29, 46, 68, 0.70)"
  },
  sacredDivider: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginVertical: 3,
    width: 214
  },
  dividerLine: {
    backgroundColor: "rgba(184, 137, 69, 0.28)",
    flex: 1,
    height: 1
  },
  dividerOrnament: {
    backgroundColor: "rgba(184, 137, 69, 0.85)",
    height: 6.5,
    transform: [{ rotate: "45deg" }],
    width: 6.5
  },
  progressDots: {
    flexDirection: "row",
    gap: 7,
    justifyContent: "center"
  },
  progressDot: {
    backgroundColor: attendColors.progress,
    borderRadius: 999,
    height: 5.5,
    width: 5.5
  },
  progressDotActive: {
    backgroundColor: attendColors.progressActive
  },
  dockShell: {
    paddingTop: 20,
    position: "relative",
    width: "100%"
  },
  dockTopEdge: {
    alignItems: "flex-start",
    flexDirection: "row",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  dockEdgeLine: {
    backgroundColor: "rgba(137, 100, 45, 0.11)",
    flex: 1,
    height: 0.5,
    marginTop: 20
  },
  attendDock: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 38,
    paddingHorizontal: 24,
    paddingVertical: 3,
    width: "100%"
  },
  dockItem: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
    minWidth: 60
  },
  dockLabel: {
    color: "rgba(29, 46, 68, 0.38)",
    fontSize: 9,
    fontWeight: "500",
    marginTop: 2
  },
  crossButton: {
    alignItems: "center",
    backgroundColor: "#F6EFE3",
    borderColor: "rgba(184, 137, 69, 0.30)",
    borderRadius: 999,
    borderWidth: 1,
    height: 53,
    justifyContent: "center",
    width: 52
  },
  sheet: {
    backgroundColor: "rgba(251, 247, 238, 0.97)",
    borderColor: attendColors.softBorder,
    borderRadius: attendRadii.sheet,
    borderWidth: 1,
    bottom: 92,
    left: attendSpacing.screenX,
    padding: 20,
    position: "absolute",
    right: attendSpacing.screenX,
    zIndex: 10
  }
});
