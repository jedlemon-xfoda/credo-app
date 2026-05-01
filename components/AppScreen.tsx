import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../constants/theme";

type AppScreenProps = PropsWithChildren<{
  scroll?: boolean;
  dark?: boolean;
}>;

export function AppScreen({ children, scroll = true, dark = false }: AppScreenProps) {
  const { width } = useWindowDimensions();
  const compact = width < 380;
  const content = <View style={[styles.content, compact && styles.compactContent]}>{children}</View>;

  return (
    <SafeAreaView style={[styles.safeArea, dark && styles.dark]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  dark: {
    backgroundColor: colors.navyBlack
  },
  scroll: {
    flexGrow: 1
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    padding: spacing.xl
  },
  compactContent: {
    gap: spacing.md,
    padding: spacing.lg
  }
});
