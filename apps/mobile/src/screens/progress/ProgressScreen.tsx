import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useStudyStore } from '../../store/studyStore';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

// TODO: replace with real data from GET /progress/:userId
const MOCK_MASTERY = [
  { subject: 'Math', mastery: 72, color: '#6C63FF' },
  { subject: 'Reading', mastery: 58, color: '#FF6584' },
  { subject: 'Writing', mastery: 85, color: '#4CAF50' },
  { subject: 'Science', mastery: 40, color: '#FF9800' },
];

const MOCK_SESSIONS = [
  { id: 's1', type: 'Quiz', subject: 'Math', score: '8/10', xp: 80, date: 'Today, 2:00 PM' },
  { id: 's2', type: 'Flashcards', subject: 'Reading', score: '15 cards', xp: 30, date: 'Today, 10:00 AM' },
  { id: 's3', type: 'Quiz', subject: 'Writing', score: '9/10', xp: 90, date: 'Yesterday, 7:00 PM' },
  { id: 's4', type: 'Flashcards', subject: 'Math', score: '20 cards', xp: 40, date: 'Yesterday, 4:00 PM' },
];

function StreakCalendar({ currentStreak }: { currentStreak: number }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  return (
    <View style={calStyles.container}>
      {days.map((day, idx) => {
        const isActive = idx <= adjustedToday && idx > adjustedToday - Math.min(currentStreak, 7);
        const isToday = idx === adjustedToday;
        return (
          <View key={idx} style={calStyles.dayCol}>
            <Text style={calStyles.dayLabel}>{day}</Text>
            <View
              style={[
                calStyles.dayCircle,
                isActive && calStyles.dayCircleActive,
                isToday && calStyles.dayCircleToday,
              ]}
            >
              {isActive && <Text style={calStyles.flame}>🔥</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const calStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  dayCol: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  dayLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    fontWeight: typography.fontWeightMedium,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayCircleActive: {
    backgroundColor: colors.primary + '30',
    borderColor: colors.primary,
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  flame: {
    fontSize: 16,
  },
});

export function ProgressScreen(): React.JSX.Element {
  const streak = useStudyStore((s) => s.streak);
  const xp = useStudyStore((s) => s.xp);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>⚡ {xp} XP</Text>
          </View>
        </View>

        {/* Streak section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>🔥 Streak</Text>
            <Text style={styles.streakNumber}>{streak?.currentStreak ?? 0} days</Text>
          </View>
          <View style={styles.card}>
            <StreakCalendar currentStreak={streak?.currentStreak ?? 0} />
            <View style={styles.streakStatsRow}>
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>{streak?.currentStreak ?? 0}</Text>
                <Text style={styles.streakStatLabel}>Current</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>{streak?.longestStreak ?? 0}</Text>
                <Text style={styles.streakStatLabel}>Best</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>{streak?.freezesRemaining ?? 0}</Text>
                <Text style={styles.streakStatLabel}>Freezes left</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mastery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Mastery by Subject</Text>
          <View style={styles.card}>
            {MOCK_MASTERY.map((s) => (
              <View key={s.subject} style={styles.masteryRow}>
                <Text style={styles.masterySubject}>{s.subject}</Text>
                <View style={styles.masteryTrack}>
                  <View
                    style={[
                      styles.masteryFill,
                      { width: `${s.mastery}%`, backgroundColor: s.color },
                    ]}
                  />
                </View>
                <Text style={[styles.masteryPct, { color: s.color }]}>{s.mastery}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Session History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Recent Sessions</Text>
          {MOCK_SESSIONS.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionLeft}>
                <Text style={styles.sessionType}>{session.type}</Text>
                <Text style={styles.sessionSubject}>{session.subject}</Text>
                <Text style={styles.sessionDate}>{session.date}</Text>
              </View>
              <View style={styles.sessionRight}>
                <Text style={styles.sessionScore}>{session.score}</Text>
                <Text style={styles.sessionXP}>+{session.xp} XP</Text>
              </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize3xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  xpBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  xpText: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightBold,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  streakNumber: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
  },
  streakStat: {
    alignItems: 'center',
  },
  streakStatValue: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  streakStatLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  streakDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  masteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  masterySubject: {
    width: 70,
    fontSize: typography.fontSizeSm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightMedium,
  },
  masteryTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
  },
  masteryFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  masteryPct: {
    width: 36,
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    textAlign: 'right',
  },
  sessionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sessionLeft: {
    gap: 2,
  },
  sessionType: {
    fontSize: typography.fontSizeXs,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  sessionSubject: {
    fontSize: typography.fontSizeMd,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightMedium,
  },
  sessionDate: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
  },
  sessionRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  sessionScore: {
    fontSize: typography.fontSizeMd,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightBold,
  },
  sessionXP: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
});
