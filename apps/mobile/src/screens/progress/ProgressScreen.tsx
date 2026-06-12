import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useStudyStore } from '../../store/studyStore';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

function getMasteryLevel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: 'Mastered', color: colors.success };
  if (score >= 65) return { label: 'Proficient', color: colors.primary };
  if (score >= 40) return { label: 'Developing', color: colors.warning };
  return { label: 'Novice', color: colors.textMuted };
}

export function ProgressScreen(): React.JSX.Element {
  const { subjects, streak, xp } = useStudyStore();

  // Mock data for display
  const subjectMastery = subjects.map((subject, i) => ({
    subject,
    score: [72, 45, 88, 33, 61, 79, 52][i % 7] ?? 50,
  }));

  const overallMastery =
    subjectMastery.length > 0
      ? Math.round(subjectMastery.reduce((sum, s) => sum + s.score, 0) / subjectMastery.length)
      : 0;

  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;
  const freezesAvailable = streak?.freezesAvailable ?? 2;

  // Last 7 days activity mock
  const last7Days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activityData = [1, 1, 0, 1, 1, 1, 0];

  // Weekly bar heights mock (0-1)
  const weeklyActivity = [0.6, 0.4, 0, 0.9, 0.7, 0.5, 0];

  const xpEvents = [
    { id: '1', type: 'session_complete', description: 'Completed Math session', amount: 35, icon: '📚' },
    { id: '2', type: 'streak_bonus', description: '5 day streak bonus!', amount: 20, icon: '🔥' },
    { id: '3', type: 'mastery_unlock', description: 'Proficient in Algebra', amount: 50, icon: '⭐' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>My Progress</Text>

        {/* Overall Mastery */}
        <View style={styles.masteryCard}>
          <Text style={styles.cardTitle}>Overall Mastery</Text>
          <View style={styles.masteryCircleRow}>
            <View style={styles.masteryCircleOuter}>
              <View style={styles.masteryCircleInner}>
                <Text style={styles.masteryCircleNumber}>{overallMastery}%</Text>
                <Text style={styles.masteryCircleLabel}>mastery</Text>
              </View>
            </View>
            <View style={styles.masteryLegend}>
              {[
                { label: 'Mastered', color: colors.success, pct: 25 },
                { label: 'Proficient', color: colors.primary, pct: 35 },
                { label: 'Developing', color: colors.warning, pct: 30 },
                { label: 'Novice', color: colors.textMuted, pct: 10 },
              ].map((item) => (
                <View key={item.label} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>{item.label}</Text>
                  <Text style={styles.legendPct}>{item.pct}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Subject Mastery */}
        {subjectMastery.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subjects</Text>
            {subjectMastery.map(({ subject, score }) => {
              const level = getMasteryLevel(score);
              return (
                <View key={subject} style={styles.subjectRow}>
                  <View style={styles.subjectHeader}>
                    <Text style={styles.subjectName}>{subject}</Text>
                    <View style={[styles.levelBadge, { backgroundColor: level.color + '20', borderColor: level.color }]}>
                      <Text style={[styles.levelBadgeText, { color: level.color }]}>{level.label}</Text>
                    </View>
                  </View>
                  <View style={styles.subjectBarBg}>
                    <View
                      style={[
                        styles.subjectBarFill,
                        { width: `${score}%`, backgroundColor: level.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.subjectScore}>{score}%</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <Text style={styles.cardTitle}>Streak</Text>
          <View style={styles.streakNumbers}>
            <View style={styles.streakStat}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakStatLabel}>Current</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakStat}>
              <Text style={styles.streakEmoji}>🏆</Text>
              <Text style={styles.streakNumber}>{longestStreak}</Text>
              <Text style={styles.streakStatLabel}>Best</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakStat}>
              <Text style={styles.streakEmoji}>🛡️</Text>
              <Text style={styles.streakNumber}>{freezesAvailable}</Text>
              <Text style={styles.streakStatLabel}>Freezes</Text>
            </View>
          </View>

          <View style={styles.weekDots}>
            {last7Days.map((day, i) => (
              <View key={day} style={styles.weekDayItem}>
                <View
                  style={[
                    styles.weekDot,
                    activityData[i] ? styles.weekDotActive : styles.weekDotInactive,
                  ]}
                />
                <Text style={styles.weekDayLabel}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.weeklyBarsCard}>
            <View style={styles.weeklyBars}>
              {last7Days.map((day, i) => (
                <View key={day} style={styles.barColumn}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${weeklyActivity[i] * 100}%` },
                        weeklyActivity[i] > 0 ? styles.barFillActive : styles.barFillEmpty,
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* XP Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent XP</Text>
          <Text style={styles.totalXP}>Total: {xp.toLocaleString()} XP ⚡</Text>
          {xpEvents.map((event) => (
            <View key={event.id} style={styles.xpEventRow}>
              <View style={styles.xpEventIcon}>
                <Text style={styles.xpEventEmoji}>{event.icon}</Text>
              </View>
              <Text style={styles.xpEventDesc}>{event.description}</Text>
              <Text style={styles.xpEventAmount}>+{event.amount}</Text>
            </View>
          ))}
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
    paddingBottom: spacing.xxxl,
  },
  pageTitle: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  masteryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  masteryCircleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  masteryCircleOuter: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    borderWidth: 6,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  masteryCircleInner: {
    alignItems: 'center',
  },
  masteryCircleNumber: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightExtraBold,
    color: colors.primary,
  },
  masteryCircleLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
  },
  masteryLegend: {
    flex: 1,
    gap: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
  },
  legendLabel: {
    flex: 1,
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  legendPct: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
    fontWeight: typography.fontWeightMedium,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subjectRow: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subjectName: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  levelBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
  },
  levelBadgeText: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightSemiBold,
  },
  subjectBarBg: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  subjectBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  subjectScore: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    alignSelf: 'flex-end',
  },
  streakCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  streakStat: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  streakEmoji: {
    fontSize: 22,
  },
  streakNumber: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightExtraBold,
    color: colors.textPrimary,
  },
  streakStatLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  weekDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDayItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  weekDot: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
  },
  weekDotActive: {
    backgroundColor: colors.primary,
  },
  weekDotInactive: {
    backgroundColor: colors.border,
  },
  weekDayLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
  },
  weeklyBarsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weeklyBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  barTrack: {
    width: 20,
    flex: 1,
    backgroundColor: colors.border,
    borderRadius: borderRadius.xs,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: borderRadius.xs,
  },
  barFillActive: {
    backgroundColor: colors.primary,
  },
  barFillEmpty: {
    backgroundColor: 'transparent',
  },
  barLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
  },
  totalXP: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  xpEventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  xpEventIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpEventEmoji: {
    fontSize: 16,
  },
  xpEventDesc: {
    flex: 1,
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  xpEventAmount: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.success,
  },
});
