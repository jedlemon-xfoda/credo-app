import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Answer, answers, findAnswer, intentions, prayers, topics } from "./src/data/content";
import { colors, radius, spacing } from "./src/theme";

type TabKey = "today" | "ask" | "library" | "pray" | "community";

const logo = require("./public/ordinary-catholic-logo.jpg");
const disputa = require("./public/disputa.jpg");
const lastSupper = require("./public/last-supper.jpg");

const tabs: { key: TabKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "ask", label: "Ask" },
  { key: "library", label: "Library" },
  { key: "pray", label: "Pray" },
  { key: "community", label: "Community" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [question, setQuestion] = useState(answers[0].question);
  const [answer, setAnswer] = useState<Answer>(answers[0]);
  const [saved, setSaved] = useState(false);

  const screen = useMemo(() => {
    if (activeTab === "today") return <TodayScreen />;
    if (activeTab === "ask") {
      return (
        <AskScreen
          answer={answer}
          question={question}
          saved={saved}
          onQuestionChange={setQuestion}
          onSearch={() => {
            setAnswer(findAnswer(question));
            setSaved(false);
          }}
          onSuggested={(nextQuestion) => {
            const nextAnswer = findAnswer(nextQuestion);
            setQuestion(nextAnswer.question);
            setAnswer(nextAnswer);
            setSaved(false);
          }}
          onSave={() => setSaved(true)}
        />
      );
    }
    if (activeTab === "library") return <LibraryScreen />;
    if (activeTab === "pray") return <PrayScreen />;
    return <CommunityScreen />;
  }, [activeTab, answer, question, saved]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.app}>
        <View style={styles.brandRow}>
          <Image source={logo} style={styles.logo} />
          <View>
            <Text style={styles.brandOverline}>The Ordinary</Text>
            <Text style={styles.brandName}>Catholic</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.content}>{screen}</ScrollView>
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function SectionHeader({
  eyebrow,
  title,
  badge
}: {
  eyebrow: string;
  title: string;
  badge: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleGroup}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.screenTitle}>{title}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    </View>
  );
}

function TodayScreen() {
  return (
    <View>
      <SectionHeader eyebrow="Today" title="Ancient faith for ordinary days." badge="Source-grounded" />
      <ImageBackground source={disputa} imageStyle={styles.imageRadius} style={styles.heroCard}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroLabel}>Saint & Feast</Text>
          <Text style={styles.heroTitle}>St. Catherine of Siena</Text>
          <Text style={styles.heroBody}>
            Doctor of the Church and witness to reform, prayer, and courageous charity.
          </Text>
        </View>
      </ImageBackground>
      <View style={styles.cardGrid}>
        <InfoCard title="Daily Teaching" label="Catechism" body="The Eucharist is the source and summit." />
        <InfoCard title="Regina Caeli" label="Prayer" body="Seasonal Marian prayer with Latin and English." />
      </View>
    </View>
  );
}

function AskScreen({
  answer,
  question,
  saved,
  onQuestionChange,
  onSearch,
  onSuggested,
  onSave
}: {
  answer: Answer;
  question: string;
  saved: boolean;
  onQuestionChange: (question: string) => void;
  onSearch: () => void;
  onSuggested: (question: string) => void;
  onSave: () => void;
}) {
  return (
    <View>
      <SectionHeader eyebrow="Ask" title="Search Catholic teaching." badge="Citations required" />
      <Text style={styles.inputLabel}>Ask from trusted Catholic sources</Text>
      <View style={styles.askRow}>
        <TextInput
          value={question}
          onChangeText={onQuestionChange}
          style={styles.input}
          placeholder="Ask a Catholic question"
          placeholderTextColor={colors.muted}
        />
        <Pressable onPress={onSearch} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Search</Text>
        </Pressable>
      </View>
      <View style={styles.chipRow}>
        {answers.map((item) => (
          <Pressable key={item.key} onPress={() => onSuggested(item.question)} style={styles.lightChip}>
            <Text style={styles.lightChipText}>{item.key}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.answerCard}>
        <Text style={styles.eyebrow}>{answer.sourceType}</Text>
        <Text style={styles.answerTitle}>{answer.title}</Text>
        <Text style={styles.bodyText}>{answer.answer}</Text>
        <View style={styles.citationStack}>
          {answer.citations.map((citation) => (
            <View key={citation.title} style={styles.citationCard}>
              <Text style={styles.citationType}>Tier {citation.authorityTier} / {citation.type}</Text>
              <Text style={styles.citationTitle}>{citation.title}</Text>
              <Text style={styles.citationNote}>{citation.note}</Text>
            </View>
          ))}
        </View>
        <Pressable onPress={onSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>{saved ? "Saved to library" : "Save topic"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function LibraryScreen() {
  return (
    <View>
      <SectionHeader eyebrow="Library" title="Curated Catholic sources." badge="Tiered sources" />
      {topics.map((topic) => (
        <InfoCard key={topic.title} title={topic.title} label={topic.label} body={topic.body} />
      ))}
      <ImageBackground source={lastSupper} imageStyle={styles.imageRadius} style={styles.topicImage}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroLabel}>Topic Detail</Text>
          <Text style={styles.heroTitle}>The Eucharist</Text>
          <Text style={styles.heroBody}>Catechism, Scripture, councils, saints, and devotion.</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

function PrayScreen() {
  return (
    <View>
      <SectionHeader eyebrow="Pray" title="Traditional prayer companion." badge="Latin + English" />
      <View style={styles.rosaryCard}>
        <Text style={styles.eyebrow}>Joyful Mysteries</Text>
        <Text style={styles.rosaryTitle}>The Annunciation</Text>
        <Text style={styles.bodyText}>
          Fruit of the mystery: humility. Pray the decade while meditating on Mary's fiat.
        </Text>
        <View style={styles.beadRow}>
          {Array.from({ length: 10 }).map((_, index) => (
            <View key={index} style={[styles.bead, index < 4 && styles.beadActive]} />
          ))}
        </View>
      </View>
      {prayers.map((prayer) => (
        <InfoCard key={prayer} title={prayer} label="Prayer" body="Guide, reminder, and source note." />
      ))}
    </View>
  );
}

function CommunityScreen() {
  return (
    <View>
      <SectionHeader eyebrow="Community" title="Prayer-first participation." badge="Moderated" />
      {intentions.map((intention) => (
        <View key={intention.body} style={styles.intentionCard}>
          <Text style={styles.intentionText}>{intention.body}</Text>
          <Text style={styles.citationNote}>{intention.prayed} people prayed</Text>
          <Pressable style={styles.saveButton}>
            <Text style={styles.saveButtonText}>I prayed</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

function InfoCard({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.eyebrow}>{label}</Text>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.bodyText}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper
  },
  app: {
    flex: 1,
    backgroundColor: colors.paper
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.cream
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 23
  },
  brandOverline: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  brandName: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "700"
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 110
  },
  sectionHeader: {
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  sectionTitleGroup: {
    gap: spacing.xs
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  screenTitle: {
    color: colors.ink,
    fontSize: 44,
    fontWeight: "700",
    lineHeight: 46
  },
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.cream
  },
  badgeText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900"
  },
  imageRadius: {
    borderRadius: radius.sm
  },
  heroCard: {
    minHeight: 340,
    overflow: "hidden",
    borderRadius: radius.sm,
    marginBottom: spacing.md
  },
  topicImage: {
    minHeight: 280,
    overflow: "hidden",
    borderRadius: radius.sm,
    marginTop: spacing.md
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.lg,
    backgroundColor: "rgba(20, 18, 16, 0.58)"
  },
  heroLabel: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.white,
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 42,
    marginTop: spacing.xs
  },
  heroBody: {
    color: "rgba(255,253,248,0.88)",
    fontSize: 15,
    lineHeight: 23,
    marginTop: spacing.sm
  },
  cardGrid: {
    gap: spacing.md
  },
  infoCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    backgroundColor: colors.cream,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  infoTitle: {
    color: colors.ink,
    fontSize: 25,
    fontWeight: "700",
    marginTop: spacing.xs
  },
  bodyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: spacing.sm
  },
  inputLabel: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: spacing.sm,
    textTransform: "uppercase"
  },
  askRow: {
    gap: spacing.sm
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    color: colors.ink,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    fontWeight: "700"
  },
  primaryButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
    backgroundColor: colors.ink
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: "900"
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginVertical: spacing.md
  },
  lightChip: {
    borderRadius: radius.pill,
    backgroundColor: "#eee5d5",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  lightChipText: {
    color: colors.green,
    fontWeight: "900",
    textTransform: "capitalize"
  },
  answerCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    backgroundColor: colors.cream,
    padding: spacing.lg
  },
  answerTitle: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 33,
    marginTop: spacing.xs
  },
  citationStack: {
    gap: spacing.sm,
    marginTop: spacing.lg
  },
  citationCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    padding: spacing.md
  },
  citationType: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  citationTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900",
    marginTop: spacing.xs
  },
  citationNote: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  saveButton: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    backgroundColor: colors.red,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: "900"
  },
  rosaryCard: {
    borderRadius: radius.sm,
    backgroundColor: "#f5ece8",
    padding: spacing.lg,
    marginBottom: spacing.md
  },
  rosaryTitle: {
    color: colors.ink,
    fontSize: 38,
    fontWeight: "700",
    lineHeight: 40,
    marginTop: spacing.xs
  },
  beadRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.lg
  },
  bead: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.line
  },
  beadActive: {
    backgroundColor: colors.red
  },
  intentionCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    backgroundColor: colors.cream,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  intentionText: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 25
  },
  tabBar: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: "row",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    backgroundColor: colors.cream,
    padding: spacing.xs
  },
  tabButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm
  },
  tabButtonActive: {
    backgroundColor: colors.ink
  },
  tabText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900"
  },
  tabTextActive: {
    color: colors.white
  }
});
