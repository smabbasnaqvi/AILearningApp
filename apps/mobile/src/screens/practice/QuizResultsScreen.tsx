import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { PracticeStackScreenProps } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = PracticeStackScreenProps<'QuizResults'>;

function getPerformance(score: number, total: number): { label: string; emoji: string; color: string; message: string } {
  const pct = score / total;
  if (pct >= 0.8) return { label: 'Excellent!', emoji: '🏆', color: colors.success, message: 'Outstanding performance! Keep up the great work.' };
  if (pct >= 0.6) return { label: 'Good Job!', emoji: '⭐', color: colors.primary, message: 'Solid effort! Review the questions you missed.' };
  if (pct >= 0.4) return { label: 'Keep Going!', emoji: '📈', color: colors.warning, message: 'You\'re making progress. More practice will help.' };
  return { label: 'Keep Practicing', emoji: '💪', color: colors.secondary, message: 'Don\'t give up! Review the material and try again.' };
}

export function QuizResultsScreen({ navigation, route }: Props): React.JSX.Element {
  const { score, total, xpEarned } = route.params;
  const incorrect = total - score;
  const percentage = Math.round((score / total) * 100);
  const correctPct = (score / total) * 100;
  const perf = getPerformance(score, total);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Quiz Results</Text>

        {/* Score Circle */}
        <View style={styles.scoreSection}>
          <View style={[styles.scoreCircle, { borderColor: perf.color }]}>
            <Text style={styles.scoreEmoji}>{perf.emoji}</Text>
            <Text style={[styles.scoreNumber, { color: perf.color }]}>{score}/{total}</Text>
            <Text style={styles.scorePct}>{percentage}%</Text>
          </View>

          <View style={[styles.perfBadge, { backgroundColor: perf.color + '20', borderColor: perf.color }]}>
            <Text style={[styles.perfLabel, { color: perf.color }]}>{perf.label}</Text>
          </View>

          <Text style={styles.perfMessage}>{perf.message}</Text>
        </View>

        {/* XP Earned */}
        <View style={styles.xpCard}>
          <Text style={styles.xpAmount}>+{xpEarned} XP ⚡</Text>
          <Text style={styles.xpLabel}>Experience Points Earned</Text>
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Breakdown</Text>

          <View style={styles.breakdownBar}>
            <View
              style={[
                styles.breakdownBarCorrect,
                { flex: score > 0 ? score : 0.01 },
              ]}
            />
            <View
              style={[
                styles.breakdownBarIncorrect,
                { flex: incorrect > 0 ? incorrect : 0.01 },
              ]}
            />
          </View>

          <View style={styles.breakdownLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
              <Text style={styles.legendText}>Correct: {score}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
              <Text style={styles.legendText}>Incorrect: {incorrect}</Text>
            </View>
          </View>

          <View style={styles.accuracySection}>
            <Text style={styles.accuracyLabel}>Accuracy</Text>
            <Text style={[styles.accuracyValue, { color: perf.color }]}>{percentage}%</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.replace('Quiz', { title: 'Practice Quiz' })}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Practice Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.popToTop()}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>Back to Practice Hub</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.massive,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.xxl,
    alignSelf: 'flex-start',
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    width: '100%',
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.full,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginBottom: spacing.xl,
  },
  scoreEmoji: {
    fontSize: 30,
    marginBottom: spacing.xs,
  },
  scoreNumber: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightExtraBold,
  },
  scorePct: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
  },
  perfBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    marginBottom: spacing.md,
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
    paddingHorizontal: spacing.md,
  },
  xpCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    width: '100%',
  },
  xpAmount: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightExtraBold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  xpLabel: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  breakdownTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  breakdownBar: {
    flexDirection: 'row',
    height: 16,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  breakdownBarCorrect: {
    backgroundColor: colors.success,
  },
  breakdownBarIncorrect: {
    backgroundColor: colors.error,
  },
  breakdownLegend: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.xl,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
  },
  legendText: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  accuracySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  accuracyLabel: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  accuracyValue: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightExtraBold,
  },
  actionsSection: {
    width: '100%',
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textSecondary,
  },
});
