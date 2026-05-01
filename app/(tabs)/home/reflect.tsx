import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { storageKeys } from "../../../constants/storage";
import { colors, spacing } from "../../../constants/theme";
import { sundayContent } from "../../../data/sunday";
import { useDailyJourney } from "../../../hooks/useDailyJourney";
import type { Reflection } from "../../../types";

const chips = ["A word", "Silence", "The Eucharist", "Someone to pray for"];

export default function ReflectScreen() {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState("");
  const { markStepStarted, markStepComplete } = useDailyJourney();

  useEffect(() => {
    markStepStarted("reflect");
  }, [markStepStarted]);

  async function saveReflection() {
    const text = value.trim() || selected;
    if (text) {
      const stored = await AsyncStorage.getItem(storageKeys.reflections);
      let reflections: Reflection[] = [];
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          reflections = Array.isArray(parsed) ? (parsed as Reflection[]) : [];
        } catch {
          reflections = [];
        }
      }
      reflections.unshift({
        id: `${Date.now()}`,
        date: new Date().toISOString(),
        sundayTitle: sundayContent.title,
        text,
        tags: selected ? [selected] : [],
        source: selected && !value.trim() ? "promptChip" : "reflect"
      });
      await AsyncStorage.setItem(storageKeys.reflections, JSON.stringify(reflections));
    }
    await completeReflect("/(tabs)/journal");
  }

  async function completeReflect(destination: "/(tabs)/home" | "/(tabs)/journal") {
    Keyboard.dismiss();
    if (destination === "/(tabs)/journal") {
      await markStepComplete("reflect");
    } else {
      await markStepStarted("reflect");
    }
    router.replace(destination);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.avoiding}>
        <Pressable accessible={false} onPress={Keyboard.dismiss} style={styles.dismissLayer}>
          <ScrollView contentContainerStyle={styles.content} keyboardDismissMode="interactive" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={styles.eyebrow}>After Mass</Text>
                <Pressable accessibilityLabel="Skip for now" accessibilityRole="button" onPress={() => completeReflect("/(tabs)/home")} style={styles.skip}>
                  <Text style={styles.skipText}>Skip for now</Text>
                </Pressable>
              </View>
              <Text style={styles.title}>What stayed{"\n"}with you?</Text>
              <Text style={styles.copy}>A word, a silence, a grace.</Text>
            </View>
            <TextInput
              accessibilityLabel="Reflection"
              blurOnSubmit
              multiline
              onChangeText={setValue}
              onSubmitEditing={Keyboard.dismiss}
              placeholder="Write here..."
              placeholderTextColor={colors.mutedText}
              returnKeyType="done"
              style={styles.input}
              textAlignVertical="top"
              value={value}
            />
            <Text style={styles.promptLabel}>Or choose one prompt:</Text>
            <View style={styles.chips}>
              {chips.map((chip) => (
                <Pressable accessibilityRole="button" key={`reflect-chip-${chip}`} onPress={() => setSelected(chip)} style={[styles.chip, selected === chip && styles.chipSelected]}>
                  <Text style={styles.chipText}>{chip}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </Pressable>
        <View style={styles.footer}>
          <PrimaryButton accessibilityLabel="Save Reflection" onPress={saveReflection}>
            Save Reflection
          </PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  avoiding: { flex: 1 },
  dismissLayer: { flex: 1 },
  content: {
    flexGrow: 1,
    gap: spacing.lg,
    padding: spacing.xl,
    paddingBottom: spacing.xxl
  },
  header: {
    gap: spacing.md,
    marginTop: spacing.xxl
  },
  headerTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  eyebrow: {
    color: colors.burgundy,
    fontSize: 14,
    fontWeight: "900"
  },
  title: {
    color: colors.charcoal,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 43
  },
  copy: {
    color: colors.mutedText,
    fontSize: 18
  },
  skip: {
    justifyContent: "center",
    minHeight: 44,
    paddingLeft: spacing.md
  },
  skipText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "700"
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.charcoal,
    fontSize: 18,
    minHeight: 190,
    padding: spacing.lg
  },
  promptLabel: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "700"
  },
  chips: { gap: spacing.sm },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 38,
    paddingHorizontal: spacing.lg
  },
  chipSelected: {
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.gold
  },
  chipText: {
    color: colors.charcoal,
    fontSize: 15
  },
  footer: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    padding: spacing.lg,
    paddingTop: spacing.md
  }
});
