import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useStudyStore } from '../../store/studyStore';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

export function HomeScreen(): React.JSX.Element {
  const { profile } = useAuthStore();
  const { xp, streak, subjects, currentExamType } = useStudyStore();

  const displayName = profile?.displayName ?? 'Learner';
  const currentStreak = streak?.currentStreak ?? 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const todayPlan = [
    { id: '1', subject: subjects[0] ?? 'Math', duration: 30, type: 'lesson' },
    { id: '2', subject: subjects[1] ?? 'Reading', duration: 20, type: 'practice' },
    { id: '3', subject: subjects[2] ?? 'Writing', duration: 15, type: 'review' },
  ].filter((_, i) => i < subjects.length || subjects.length === 0);

  const typeColors: Record<string, string> = {
    lesson: colors.primary,
    practice: colors.secondary,
    review: colors.warning,
    mock: colors.error,
  };

  const dailyGoalMinutes = 60;
  const completedMinutes = 25;
  const dailyGoalPct = Math.min(1, completedMinutes / dailyGoalMinutes);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}, {displayName}!</Text>
            <Text style={styles.dateText}>{todayDate}</Text>
          </View>
          <View style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </View>
        </View>

        {/* XP & Streak Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⚡</Text>
              <View>
                <Text style={styles.statValue}>{xp.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🔥</Text>
              <View>
                <Text style={styles.statValue}>{currentStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>📚</Text>
              <View>
                <Text style={styles.statValue}>{subjects.length || 0}</Text>
                <Text style={styles.statLabel}>Subjects</Text>
              </View>
            </View>
          </View>

          <View style={styles.dailyGoalSection}>
            <View style={styles.dailyGoalHeader}>
              <Text style={styles.dailyGoalLabel}>Daily Goal</Text>
              <Text style={styles.dailyGoalProgress}>{completedMinutes}/{dailyGoalMinutes} min</Text>
            </View>
            <View style={styles.goalBar}>
              <View style={[styles.goalBarFill, { width: `${dailyGoalPct * 100}%` }]} />
            </View>
          </View>
        </View>

        {/* Today's Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Plan</Text>
          {todayPlan.length > 0 ? (
            todayPlan.map((session) => (
              <TouchableOpacity key={session.id} style={styles.planCard} activeOpacity={0.8}>
                <View style={styles.planCardLeft}>
                  <Text style={styles.planSubject}>{session.subject}</Text>
                  <Text style={styles.planDuration}>{session.duration} minutes</Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: typeColors[session.type] + '20', borderColor: typeColors[session.type] }]}>
                  <Text style={[styles.typeBadgeText, { color: typeColors[session.type] }]}>
                    {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyPlan}>
              <Text style={styles.emptyPlanText}>Select subjects to build your study plan</Text>
            </View>
          )}
        </View>

        {/* Continue Learning */}
        {currentExamType && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <View style={styles.continueCard}>
              <View style={styles.continueCardTop}>
                <Text style={styles.continueCardEmoji}>📖</Text>
                <View style={styles.continueCardInfo}>
                  <Text style={styles.continueCardTitle}>
                    {subjects[0] ?? 'Math'} — Algebra Basics
                  </Text>
                  <Text style={styles.continueCardSubtitle}>{currentExamType} Prep</Text>
                </View>
              </View>
              <View style={styles.continueProgressBar}>
                <View style={styles.continueProgressFill} />
              </View>
              <Text style={styles.continueProgressText}>42% complete</Text>
            </View>
          </View>
        )}

        {/* Quick Practice */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Practice</Text>
          <View style={styles.quickPracticeRow}>
            <TouchableOpacity style={styles.quickButton} activeOpacity={0.8}>
              <Text style={styles.quickButtonEmoji}>🃏</Text>
              <Text style={styles.quickButtonText}>Flashcards</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickButton} activeOpacity={0.8}>
              <Text style={styles.quickButtonEmoji}>✏️</Text>
              <Text style={styles.quickButtonText}>Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickButton} activeOpacity={0.8}>
              <Text style={styles.quickButtonEmoji}>🤖</Text>
              <Text style={styles.quickButtonText}>AI Tutor</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsIcon: {
    fontSize: 18,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statEmoji: {
    fontSize: 22,
  },
  statValue: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  dailyGoalSection: {
    gap: spacing.sm,
  },
  dailyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dailyGoalLabel: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  dailyGoalProgress: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  goalBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  goalBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planCardLeft: {
    gap: spacing.xs,
  },
  planSubject: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  planDuration: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
  },
  typeBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightSemiBold,
  },
  emptyPlan: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyPlanText: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  continueCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  continueCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  continueCardEmoji: {
    fontSize: 28,
  },
  continueCardInfo: {
    flex: 1,
  },
  continueCardTitle: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  continueCardSubtitle: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  continueProgressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  continueProgressFill: {
    width: '42%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  continueProgressText: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
  },
  quickPracticeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  quickButtonEmoji: {
    fontSize: 26,
  },
  quickButtonText: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
    textAlign: 'center',
  },
});
