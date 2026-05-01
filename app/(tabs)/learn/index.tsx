import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../../components/AppScreen";
import { colors, spacing } from "../../../constants/theme";
import { massFlowSections } from "../../../data/massFlow";
import { reviewContentProvider } from "../../../data/reviewContentProvider";
import type { LearnContent } from "../../../services/liturgicalContentProvider";

export const learnSections = massFlowSections.map((section) => ({
  id: section.id,
  title: section.title,
  subtitle: section.steps.slice(0, 3).map((step) => step.title).join(", "),
  section: section.title
}));

export default function LearnScreen() {
  const [learnContent, setLearnContent] = useState<LearnContent | null>(null);

  useEffect(() => {
    let mounted = true;
    reviewContentProvider.getLearnContent().then((content) => {
      if (mounted) {
        setLearnContent(content);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={styles.title}>Learn</Text>
        <Text style={styles.copy}>Understand the Mass.</Text>
      </View>
      <View style={styles.list}>
        {learnSections.map((item) => {
          const providerSection = learnContent?.sections.find((section) => section.section === item.section);
          const preview =
            providerSection?.parts.slice(0, 4).join(", ") ??
            massFlowSections
              .find((section) => section.title === item.section)
              ?.steps
              .slice(0, 4)
              .map((step) => step.title)
              .join(", ");

          return (
            <Pressable accessibilityLabel={`Open ${item.title}`} accessibilityRole="button" key={`learn-${item.id}`} onPress={() => router.push(`/learn/${item.id}`)} style={styles.row}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>+</Text>
              </View>
              <View style={styles.textCol}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSub}>{providerSection?.summary ?? item.subtitle}</Text>
                <Text numberOfLines={2} style={styles.preview}>
                  {preview}
                </Text>
              </View>
              <Text style={styles.chevron}>{">"}</Text>
            </Pressable>
          );
        })}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginTop: spacing.xxl
  },
  title: {
    color: colors.charcoal,
    fontSize: 34,
    fontWeight: "900"
  },
  copy: {
    color: colors.mutedText,
    fontSize: 17
  },
  list: {
    gap: spacing.lg,
    marginTop: spacing.lg
  },
  row: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 104,
    padding: spacing.lg
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  iconText: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: "900"
  },
  textCol: {
    flex: 1
  },
  rowTitle: {
    color: colors.charcoal,
    fontSize: 18,
    fontWeight: "900"
  },
  rowSub: {
    color: colors.mutedText,
    fontSize: 13,
    marginTop: 4
  },
  preview: {
    color: colors.burgundy,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: spacing.sm
  },
  chevron: {
    color: colors.burgundy,
    fontSize: 28,
    fontWeight: "900"
  }
});
