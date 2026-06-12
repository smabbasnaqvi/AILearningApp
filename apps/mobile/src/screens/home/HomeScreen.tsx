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
import { useAuthStore } from '../../store/authStore';
import { useStudyStore } from '../../store/studyStore';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';

// TODO: replace with real data from API
const MOCK_SUBJECTS = [
  { name: 'Math', mastery: 72, color: '#6C63FF' },
  { name: 'Reading', mastery: 58, color: '#FF6584' },
  { name: 'Writing', mastery: 85, color: '#4CAF50' },
];

export function HomeScreen(): React.JSX.Element {
  const user = useAuthStore((s) => s.user);
  const streak = useStudyStore((s) => s.streak);
  const xp = useStudyStore((s) => s.xp);
  const examDate = useStudyStore((s) => s.examDate);

  const daysUntilExam = examDate
    ? Math.max(0, Math.round((new Date(examDate).getTime() - Date.now()) / 86400000))
    : null;

  const firstName = user?.email?.split('@')[0] ?? 'Learner';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{firstName} 👋</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>⚡ {xp} XP</Text>
          </View>
        </View>

        {/* Streak Card */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.streakCard}
        >
          <View style={styles.streakLeft}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View>
              <Text style={styles.streakNumber}>{streak?.currentStreak ?? 0}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
          <View style={styles.streakRight}>
            <Text style={styles.streakBest}>Best: {streak?.longestStreak ?? 0} days</Text>
            <TouchableOpacity style={styles.resumeBtn} activeOpacity={0.85}>
              <Text style={styles.resumeBtnText}>Resume →</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Daily Goal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Goal</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalInfo}>
              <Text style={styles.goalText}>Complete 2 study sessions</Text>
              <Text style={styles.goalProgress}>1 / 2 done</Text>
            </View>
            <View style={styles.goalBarTrack}>
              <View style={[styles.goalBarFill, { width: '50%' }]} />
            </View>
          </View>
        </View>

        {/* Exam Countdown */}
        {daysUntilExam !== null && (
          <View style={styles.countdownCard}>
            <Text style={styles.countdownIcon}>📅</Text>
            <View>
              <Text style={styles.countdownNumber}>{daysUntilExam} days</Text>
              <Text style={styles.countdownLabel}>until your exam</Text>
            </View>
          </View>
        )}

        {/* Subject Mastery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject Mastery</Text>
          {MOCK_SUBJECTS.map((s) => (
            <View key={s.name} style={styles.subjectRow}>
              <View style={[styles.subjectDot, { backgroundColor: s.color }]} />
              <Text style={styles.subjectName}>{s.name}</Text>
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
  greeting: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
  },
  name: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  xpBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  xpText: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightBold,
  },
  streakCard: {
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.md,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  streakEmoji: {
    fontSize: 36,
  },
  streakNumber: {
    fontSize: typography.fontSize3xl,
    fontWeight: typography.fontWeightExtraBold,
    color: colors.textPrimary,
  },
  streakLabel: {
    fontSize: typography.fontSizeSm,
    color: 'rgba(255,255,255,0.75)',
  },
  streakRight: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  streakBest: {
    fontSize: typography.fontSizeSm,
    color: 'rgba(255,255,255,0.8)',
  },
  resumeBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  resumeBtnText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalText: {
    fontSize: typography.fontSizeMd,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightMedium,
  },
  goalProgress: {
    fontSize: typography.fontSizeMd,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  goalBarTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
  },
  goalBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  countdownCard: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countdownIcon: {
    fontSize: 28,
  },
  countdownNumber: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  countdownLabel: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  subjectDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
  },
  subjectName: {
    fontSize: typography.fontSizeMd,
    color: colors.textPrimary,
    width: 70,
    fontWeight: typography.fontWeightMedium,
  },
  masteryTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
  },
  masteryFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  masteryPct: {
    width: 40,
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    textAlign: 'right',
  },
});
