import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { AuthScreenProps } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = AuthScreenProps<'DiagnosticResults'>;

function getPerformanceInfo(score: number, total: number): { label: string; color: string; emoji: string; message: string } {
  const pct = score / total;
  if (pct >= 0.8) return { label: 'Excellent', color: colors.success, emoji: '🏆', message: "Outstanding! You have strong foundational knowledge." };
  if (pct >= 0.6) return { label: 'Good', color: colors.primary, emoji: '⭐', message: "Good work! A few areas to strengthen." };
  if (pct >= 0.4) return { label: 'Fair', color: colors.warning, emoji: '📈', message: "Solid start! Your AI tutor will help you level up." };
  return { label: 'Needs Work', color: colors.secondary, emoji: '💪', message: "Don't worry! Everyone starts somewhere. Let's build your skills." };
}

export function DiagnosticResultsScreen({ navigation, route }: Props): React.JSX.Element {
  const { score, total } = route.params;
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete);
  const perf = getPerformanceInfo(score, total);
  const percentage = Math.round((score / total) * 100);

  function handleStartLearning(): void {
    setOnboardingComplete(true);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Diagnostic Complete!</Text>
        <Text style={styles.subheading}>Here's how you did</Text>

        <View style={styles.scoreCard}>
          <View style={[styles.scoreCircle, { borderColor: perf.color }]}>
            <Text style={styles.scoreEmoji}>{perf.emoji}</Text>
            <Text style={[styles.scoreNumber, { color: perf.color }]}>
              {score}/{total}
            </Text>
            <Text style={styles.scorePercent}>{percentage}%</Text>
          </View>

          <View style={[styles.perfBadge, { backgroundColor: perf.color + '20', borderColor: perf.color }]}>
            <Text style={[styles.perfLabel, { color: perf.color }]}>{perf.label}</Text>
          </View>

          <Text style={styles.perfMessage}>{perf.message}</Text>
        </View>

        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>What's next</Text>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownIcon}>
              <Text>🎯</Text>
            </View>
            <View style={styles.breakdownContent}>
              <Text style={styles.breakdownLabel}>Personalized Study Plan</Text>
              <Text style={styles.breakdownDesc}>
                We'll create a custom plan based on your exam date and subjects
              </Text>
            </View>
          </View>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownIcon}>
              <Text>🤖</Text>
            </View>
            <View style={styles.breakdownContent}>
              <Text style={styles.breakdownLabel}>AI Tutor Ready</Text>
              <Text style={styles.breakdownDesc}>
                Your Socratic tutor is ready to guide you through difficult concepts
              </Text>
            </View>
          </View>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownIcon}>
              <Text>🃏</Text>
            </View>
            <View style={styles.breakdownContent}>
              <Text style={styles.breakdownLabel}>Flashcard Decks</Text>
              <Text style={styles.breakdownDesc}>
                Smart spaced repetition to maximize what you remember
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartLearning}
          activeOpacity={0.85}
        >
          <Text style={styles.startButtonText}>Start Learning 🚀</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
  },
  heading: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightExtraBold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subheading: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  scoreCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreCircle: {
    width: 130,
    height: 130,
    borderRadius: borderRadius.full,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    backgroundColor: colors.surfaceElevated,
  },
  scoreEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  scoreNumber: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightExtraBold,
  },
  scorePercent: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
    fontWeight: typography.fontWeightMedium,
  },
  perfBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    marginBottom: spacing.lg,
  },
  perfLabel: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
  },
  perfMessage: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeightLg,
  },
  breakdownCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  breakdownIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownContent: {
    flex: 1,
  },
  breakdownLabel: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  breakdownDesc: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeightMd,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: colors.backgroundDark,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
});
