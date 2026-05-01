import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../constants/theme";
import type { ContentMetadata } from "../types";

type SourceBadgeProps = {
  metadata?: ContentMetadata;
  compact?: boolean;
  variant?: "default" | "compact" | "quiet";
};

export function SourceBadge({ metadata, compact = false, variant = "default" }: SourceBadgeProps) {
  if (!metadata) {
    return null;
  }

  const resolvedVariant = compact ? "compact" : variant;

  if (resolvedVariant === "quiet") {
    return (
      <View accessibilityLabel={`Review content status ${metadata.textStatus}`} style={styles.quietBadge}>
        <Text style={styles.quietText}>Review copy</Text>
      </View>
    );
  }

  return (
    <View accessibilityLabel={`Source ${metadata.sourceProvider}, ${metadata.textStatus}`} style={[styles.badge, resolvedVariant === "compact" && styles.compact]}>
      <Text style={styles.text}>
        Source: {labelProvider(metadata.sourceProvider)} - {labelStatus(metadata.textStatus)}
      </Text>
      {resolvedVariant === "default" && metadata.licensingNote ? <Text style={styles.note}>{metadata.licensingNote}</Text> : null}
    </View>
  );
}

function labelProvider(provider: ContentMetadata["sourceProvider"]) {
  switch (provider) {
    case "usccb":
      return "USCCB";
    case "evangelizo":
      return "Evangelizo";
    case "universalis":
      return "Universalis";
    case "manual_review":
      return "Manual review";
    default:
      return "Mock";
  }
}

function labelStatus(status: ContentMetadata["textStatus"]) {
  switch (status) {
    case "review_only":
      return "Review copy";
    case "public_domain":
      return "Public domain";
    case "user_configured":
      return "User configured";
    case "licensed":
      return "Licensed";
    default:
      return "Draft copy";
  }
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.sm
  },
  compact: {
    alignSelf: "flex-start"
  },
  text: {
    color: colors.burgundy,
    fontSize: 11,
    fontWeight: "900"
  },
  quietBadge: {
    alignSelf: "flex-start",
    borderColor: "rgba(200, 160, 74, 0.28)",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3
  },
  quietText: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: "800"
  },
  note: {
    color: colors.mutedText,
    fontSize: 11,
    lineHeight: 15
  }
});
