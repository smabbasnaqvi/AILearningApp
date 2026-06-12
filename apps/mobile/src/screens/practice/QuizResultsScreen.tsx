import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { StackScreenProps } from '@react-navigation/stack';
import type { PracticeStackParamList } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = StackScreenProps<PracticeStackParamList, 'QuizResults'>;

export function QuizResultsScreen({ navigation, route }: Props): React.JSX.Element {
  const { score, total, xpEarned } = route.params;
  const accuracy = Math.round((score / total) * 100);

  const grade =
    accuracy >= 90 ? { label: 'Excellent!', emoji: '🏆', color: colors.success } :
    accuracy >= 70 ? { label: 'Good Job!', emoji: '🎉', color: colors.primary } :
    accuracy >= 50 ? { label: 'Keep Going!', emoji: '💪', color: colors.warning } :
    { label: 'Need Practice', emoji: '📚', color: colors.error };

  // TODO: replace with real per-topic breakdown from quiz data
  const topicBreakdown = [
    { topic: 'Math', correct: Math.floor(score * 0.4), total: Math.ceil(total * 0.4) },
    { topic: 'Reading', correct: Math.floor(score * 0.3), total: Math.ceil(total * 0.3) },
    { topic: 'Writing', correct: Math.floor(score * 0.3), total: Math.floor(total * 0.3) },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Score hero */}
        <LinearGradient
          colors={[colors.surface, colors.backgroundDark]}
          style={styles.hero}
        >
          <Text style={styles.gradeEmoji}>{grade.emoji}</Text>
          <Text style={[styles.gradeLabel, { color: grade.color }]}>{grade.label}</Text>

          <View style={styles.scoreCircle}>
            <Text style={[styles.scorePct, { color: grade.color }]}>{accuracy}%</Text>
            <Text style={styles.scoreSubtitle}>Accuracy</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{total - score}</Text>
              <Text style={styles.statLabel}>Wrong</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, styles.xpValue]}>+{xpEarned}</Text>
              <Text style={styles.statLabel}>XP earned</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Topic breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topic Breakdown</Text>
          {topicBreakdown.map((t) => {
            const pct = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
            const barColor = pct >= 70 ? colors.success : pct >= 40 ? colors.warning : colors.error;
            return (
              <View key={t.topic} style={styles.topicRow}>
                <Text style={styles.topicName}>{t.topic}</Text>
                <View style={styles.topicBarTrack}>
                  <View style={[styles.topicBarFill, { width: `${pct}%`, backgroundColor: barColor }]} />
                </View>
                <Text style={[styles.topicPct, { color: barColor }]}>
                  {t.correct}/{t.total}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.reviewBtn}
            onPress={() => navigation.navigate('Quiz', { title: 'Review Wrong Answers' })}
            activeOpacity={0.85}
          >
            <Text style={styles.reviewBtnText}>Review Wrong Answers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.navigate('PracticeHub')}
            activeOpacity={0.85}
          >
            <Text style={styles.doneBtnText}>Done</Text>
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
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  gradeEmoji: {
    fontSize: 56,
    marginBottom: spacing.sm,
  },
  gradeLabel: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    marginBottom: spacing.xxl,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  scorePct: {
    fontSize: typography.fontSize4xl,
    fontWeight: typography.fontWeightExtraBold,
  },
  scoreSubtitle: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    gap: spacing.xxl,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  xpValue: {
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  topicName: {
    width: 70,
    fontSize: typography.fontSizeMd,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightMedium,
  },
  topicBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
  },
  topicBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  topicPct: {
    width: 40,
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    textAlign: 'right',
  },
  actions: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
    gap: spacing.md,
  },
  reviewBtn: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  reviewBtnText: {
    color: colors.primary,
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
  },
  doneBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  doneBtnText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
  },
});
