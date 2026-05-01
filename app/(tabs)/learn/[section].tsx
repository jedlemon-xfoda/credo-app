import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../../components/AppScreen";
import { SourceBadge } from "../../../components/SourceBadge";
import { colors, spacing } from "../../../constants/theme";
import { massFlowSections } from "../../../data/massFlow";
import { reviewContentProvider } from "../../../data/reviewContentProvider";
import type { LearnContent, LearnSectionContent } from "../../../services/liturgicalContentProvider";
import { learnSections } from "./index";

const explanations: Record<string, { what: string; why: string; how: string }> = {
  "Introductory Rites": {
    what: "The Church gathers, asks mercy, and prepares to hear the Word.",
    why: "These rites gather the faithful into one praying body.",
    how: "Stand, listen, and bring your intention quietly."
  },
  "Liturgy of the Word": {
    what: "Scripture is proclaimed and opened for the assembly.",
    why: "God speaks to His Church before the Eucharistic sacrifice.",
    how: "Listen for one word or phrase to carry."
  },
  "Liturgy of the Eucharist": {
    what: "The gifts are offered and Christ gives Himself sacramentally.",
    why: "This is the heart of the Mass.",
    how: "Offer yourself with the bread and wine."
  },
  "Concluding Rites": {
    what: "The Church is blessed and sent.",
    why: "The Mass bears fruit in life and charity.",
    how: "Go in peace and live what you received."
  }
};

export default function LearnDetailScreen() {
  const params = useLocalSearchParams<{ section?: string }>();
  const config = learnSections.find((item) => item.id === params.section) ?? learnSections[0];
  const flowSection = massFlowSections.find((section) => section.id === config.id) ?? massFlowSections[0];
  const parts = flowSection.steps;
  const [selectedPartId, setSelectedPartId] = useState(parts[0]?.id);
  const [learnContent, setLearnContent] = useState<LearnContent | null>(null);
  const selectedPart = useMemo(() => parts.find((part) => part.id === selectedPartId) ?? parts[0], [parts, selectedPartId]);
  const providerSection = learnContent?.sections.find((item) => item.section === config.section);
  const explanation = getLearnExplanation(config.section, providerSection);

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
      <View style={styles.top}>
        <Pressable accessibilityLabel="Back to Learn" accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>{"<"}</Text>
        </Pressable>
      </View>
      <View style={styles.header}>
        <Text style={styles.kicker}>Learn the Mass</Text>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.copy}>{providerSection?.summary ?? explanation.what}</Text>
        {providerSection?.metadata ? <SourceBadge compact metadata={providerSection.metadata} /> : null}
      </View>
      <View style={styles.deepDive}>
        <DeepDiveBlock label="What" text={explanation.what} />
        <DeepDiveBlock label="Why" text={explanation.why} />
        <DeepDiveBlock label="How" text={explanation.how} />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Subsections</Text>
        <View style={styles.selector}>
          {parts.map((part) => (
            <Pressable
              accessibilityLabel={`Show ${part.title}`}
              accessibilityRole="button"
              key={`learn-selector-${config.id}-${part.id}`}
              onPress={() => setSelectedPartId(part.id)}
              style={[styles.chip, selectedPart?.id === part.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, selectedPart?.id === part.id && styles.chipTextActive]}>{part.title}</Text>
            </Pressable>
          ))}
        </View>
        {selectedPart ? (
          <View style={styles.selectedPart}>
            <Text style={styles.selectedTitle}>{selectedPart.title}</Text>
            <Text style={styles.body}>{selectedPart.summary}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Parts</Text>
        <View style={styles.parts}>
          {parts.map((part) => (
            <View key={`learn-part-${part.id}`} style={styles.partRow}>
              <View style={styles.partDot} />
              <Text style={styles.part}>{part.title}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.goDeeper}>
        <Text style={styles.goDeeperText}>Dive Deeper</Text>
        <Text style={styles.goDeeperSub}>Scripture: {providerSection?.diveDeeper.scripture.join(", ") ?? "To be added in content review"}</Text>
        <Text style={styles.goDeeperSub}>Catechism: {providerSection?.diveDeeper.catechism.join(", ") ?? "To be added in content review"}</Text>
        <Text style={styles.goDeeperSub}>Fathers / Councils: {providerSection?.diveDeeper.fathersAndCouncils.join(", ") ?? "To be added in content review"}</Text>
      </View>
    </AppScreen>
  );
}

function getLearnExplanation(section: string, providerSection?: LearnSectionContent) {
  if (providerSection) {
    return {
      what: providerSection.what,
      why: providerSection.why,
      how: providerSection.how
    };
  }

  return explanations[section];
}

function DeepDiveBlock({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.deepBlock}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.body}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    marginTop: spacing.xl
  },
  back: {
    height: 44,
    justifyContent: "center",
    width: 44
  },
  backText: {
    color: colors.charcoal,
    fontSize: 26,
    fontWeight: "900"
  },
  header: {
    gap: spacing.sm
  },
  kicker: {
    color: colors.burgundy,
    fontSize: 13,
    fontWeight: "900"
  },
  title: {
    color: colors.charcoal,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 39
  },
  copy: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 23
  },
  deepDive: {
    gap: spacing.md
  },
  deepBlock: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  label: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  parts: {
    gap: spacing.sm
  },
  selector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  chip: {
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  chipActive: {
    backgroundColor: colors.burgundy,
    borderColor: colors.burgundy
  },
  chipText: {
    color: colors.charcoal,
    fontSize: 13,
    fontWeight: "800"
  },
  chipTextActive: {
    color: colors.surface
  },
  selectedPart: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.sm,
    paddingTop: spacing.md
  },
  selectedTitle: {
    color: colors.charcoal,
    fontSize: 18,
    fontWeight: "900"
  },
  partRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  partDot: {
    backgroundColor: colors.gold,
    borderRadius: 999,
    height: 7,
    width: 7
  },
  part: {
    color: colors.charcoal,
    fontSize: 16,
    lineHeight: 23
  },
  body: {
    color: colors.charcoal,
    fontSize: 15,
    lineHeight: 22
  },
  goDeeper: {
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.lg
  },
  goDeeperText: {
    color: colors.burgundy,
    fontSize: 15,
    fontWeight: "900"
  },
  goDeeperSub: {
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 19
  }
});
