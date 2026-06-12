import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { PracticeStackScreenProps } from '../../navigation/types';
import { useStudyStore } from '../../store/studyStore';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = PracticeStackScreenProps<'PracticeHub'>;

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const SUBJECT_EMOJIS: Record<string, string> = {
  Math: '📐',
  Reading: '📖',
  Writing: '✍️',
  Science: '🔬',
  English: '📝',
  History: '🏛️',
  Physics: '⚡',
  Chemistry: '⚗️',
  Biology: '🧬',
  Economics: '📈',
  Psychology: '🧠',
  'Computer Science': '💻',
};

export function PracticeHubScreen({ navigation }: Props): React.JSX.Element {
  const { subjects } = useStudyStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Medium');

  const displaySubjects = subjects.length > 0 ? subjects : ['Math', 'Reading', 'Writing'];

  const flashcardDecks = displaySubjects.slice(0, 3).map((subject, i) => ({
    subject,
    emoji: SUBJECT_EMOJIS[subject] ?? '📚',
    cardsDue: [12, 5, 8][i] ?? 6,
    totalCards: [45, 30, 38][i] ?? 30,
  }));

  const quizTypes = [
    { id: 'quick', title: 'Quick Quiz', subtitle: '10 questions · ~5 min', icon: '⚡', questionCount: 10 },
    { id: 'full', title: 'Full Practice Test', subtitle: '30 questions · ~20 min', icon: '📝', questionCount: 30 },
    { id: 'weak', title: 'Weak Areas Focus', subtitle: 'Personalized · adaptive', icon: '🎯', questionCount: 15 },
  ];

  const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];
  const difficultyColors: Record<Difficulty, string> = {
    Easy: colors.success,
    Medium: colors.warning,
    Hard: colors.error,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Practice</Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🃏</Text>
            <Text style={styles.statValue}>25</Text>
            <Text style={styles.statLabel}>Cards Due</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Quiz Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Practiced</Text>
          </View>
        </View>

        {/* Daily Challenge */}
        <TouchableOpacity
          style={styles.dailyChallenge}
          onPress={() =>
            navigation.navigate('Quiz', {
              title: 'Daily Challenge',
            })
          }
          activeOpacity={0.85}
        >
          <View style={styles.dailyChallengeLeft}>
            <Text style={styles.dailyChallengeEmoji}>🔥</Text>
            <View>
              <Text style={styles.dailyChallengeTitle}>Daily Challenge</Text>
              <Text style={styles.dailyChallengeSubtitle}>5 questions · Mixed · Bonus XP ⚡</Text>
            </View>
          </View>
          <View style={styles.dailyChallengeButton}>
            <Text style={styles.dailyChallengeButtonText}>Start</Text>
          </View>
        </TouchableOpacity>

        {/* Flashcard Decks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Flashcard Decks</Text>
            <Text style={styles.sectionSeeAll}>See all</Text>
          </View>
          {flashcardDecks.map((deck) => (
            <View key={deck.subject} style={styles.deckCard}>
              <View style={styles.deckLeft}>
                <View style={styles.deckIconContainer}>
                  <Text style={styles.deckEmoji}>{deck.emoji}</Text>
                </View>
                <View>
                  <Text style={styles.deckSubject}>{deck.subject}</Text>
                  <Text style={styles.deckMeta}>
                    <Text style={styles.deckDueCount}>{deck.cardsDue} due</Text>
                    {' · '}{deck.totalCards} total
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() =>
                  navigation.navigate('Flashcard', {
                    subtopicId: deck.subject.toLowerCase(),
                    title: `${deck.subject} Flashcards`,
                  })
                }
                activeOpacity={0.85}
              >
                <Text style={styles.reviewButtonText}>Review</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Quizzes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quizzes</Text>

          <View style={styles.difficultyRow}>
            {difficulties.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.difficultyPill,
                  selectedDifficulty === d && {
                    backgroundColor: difficultyColors[d] + '20',
                    borderColor: difficultyColors[d],
                  },
                ]}
                onPress={() => setSelectedDifficulty(d)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.difficultyPillText,
                    selectedDifficulty === d && { color: difficultyColors[d] },
                  ]}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {quizTypes.map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              style={styles.quizCard}
              onPress={() =>
                navigation.navigate('Quiz', {
                  title: quiz.title,
                })
              }
              activeOpacity={0.85}
            >
              <View style={styles.quizIconContainer}>
                <Text style={styles.quizEmoji}>{quiz.icon}</Text>
              </View>
              <View style={styles.quizInfo}>
                <Text style={styles.quizTitle}>{quiz.title}</Text>
                <Text style={styles.quizSubtitle}>{quiz.subtitle}</Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: difficultyColors[selectedDifficulty] + '20', borderColor: difficultyColors[selectedDifficulty] }]}>
                <Text style={[styles.difficultyBadgeText, { color: difficultyColors[selectedDifficulty] }]}>
                  {selectedDifficulty}
                </Text>
              </View>
            </TouchableOpacity>
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
    paddingBottom: spacing.massive,
  },
  pageTitle: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
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
    textAlign: 'center',
  },
  dailyChallenge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.secondary + '15',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.secondary + '40',
  },
  dailyChallengeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  dailyChallengeEmoji: {
    fontSize: 28,
  },
  dailyChallengeTitle: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  dailyChallengeSubtitle: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  dailyChallengeButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  dailyChallengeButtonText: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionSeeAll: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightMedium,
  },
  deckCard: {
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
  deckLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  deckIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckEmoji: {
    fontSize: 22,
  },
  deckSubject: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  deckMeta: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  deckDueCount: {
    color: colors.warning,
    fontWeight: typography.fontWeightSemiBold,
  },
  reviewButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  reviewButtonText: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  difficultyPill: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  difficultyPillText: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textMuted,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  quizIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizEmoji: {
    fontSize: 22,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  quizSubtitle: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  difficultyBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
  },
  difficultyBadgeText: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightSemiBold,
  },
});
