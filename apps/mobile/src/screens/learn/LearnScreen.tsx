import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { LearnStackScreenProps } from '../../navigation/types';
import { useStudyStore } from '../../store/studyStore';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = LearnStackScreenProps<'LearnHome'>;

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

const SUBJECT_MOCK_DATA: Record<string, { topicsCount: number; mastery: number }> = {
  Math: { topicsCount: 12, mastery: 68 },
  Reading: { topicsCount: 8, mastery: 45 },
  Writing: { topicsCount: 6, mastery: 72 },
  Science: { topicsCount: 10, mastery: 38 },
  English: { topicsCount: 9, mastery: 55 },
  History: { topicsCount: 14, mastery: 30 },
  Physics: { topicsCount: 11, mastery: 62 },
  Chemistry: { topicsCount: 13, mastery: 41 },
  Biology: { topicsCount: 15, mastery: 57 },
  Economics: { topicsCount: 10, mastery: 49 },
  Psychology: { topicsCount: 8, mastery: 66 },
  'Computer Science': { topicsCount: 12, mastery: 78 },
};

export function LearnScreen({ navigation }: Props): React.JSX.Element {
  const { subjects, currentExamType } = useStudyStore();

  const displaySubjects = subjects.length > 0 ? subjects : (['Math', 'Reading', 'Writing'] as const);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Learn</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {currentExamType && (
          <View style={styles.examBadge}>
            <Text style={styles.examBadgeText}>📋 {currentExamType} Prep</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Your Subjects</Text>

        {displaySubjects.map((subject) => {
          const data = SUBJECT_MOCK_DATA[subject] ?? { topicsCount: 8, mastery: 50 };
          const emoji = SUBJECT_EMOJIS[subject] ?? '📚';

          return (
            <TouchableOpacity
              key={subject}
              style={styles.subjectCard}
              onPress={() =>
                navigation.navigate('TopicList', {
                  subjectId: subject.toLowerCase().replace(' ', '-'),
                  subjectName: subject,
                })
              }
              activeOpacity={0.85}
            >
              <View style={styles.subjectCardTop}>
                <View style={styles.subjectIconContainer}>
                  <Text style={styles.subjectEmoji}>{emoji}</Text>
                </View>
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{subject}</Text>
                  <Text style={styles.subjectMeta}>{data.topicsCount} topics</Text>
                </View>
                <View style={styles.masteryCircle}>
                  <Text style={styles.masteryPct}>{data.mastery}%</Text>
                </View>
              </View>

              <View style={styles.masteryBarBg}>
                <View style={[styles.masteryBarFill, { width: `${data.mastery}%` }]} />
              </View>

              <View style={styles.subjectCardFooter}>
                <Text style={styles.masteryLabel}>Mastery progress</Text>
                <View style={styles.continueButton}>
                  <Text style={styles.continueButtonText}>Continue →</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.aiTutorBanner}
          onPress={() => navigation.navigate('AIChat', { title: 'AI Tutor' })}
          activeOpacity={0.85}
        >
          <View style={styles.aiTutorLeft}>
            <Text style={styles.aiTutorEmoji}>🤖</Text>
            <View>
              <Text style={styles.aiTutorTitle}>AI Tutor</Text>
              <Text style={styles.aiTutorSubtitle}>Stuck on something? Ask me!</Text>
            </View>
          </View>
          <View style={styles.aiTutorButton}>
            <Text style={styles.aiTutorButtonText}>Ask →</Text>
          </View>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  pageTitle: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 18,
  },
  examBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary + '50',
  },
  examBadgeText: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  sectionTitle: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subjectCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subjectCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  subjectIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  subjectEmoji: {
    fontSize: 24,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  subjectMeta: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  masteryCircle: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  masteryPct: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
  },
  masteryBarBg: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  masteryBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  subjectCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masteryLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
  },
  continueButton: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary + '50',
  },
  continueButtonText: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  aiTutorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  aiTutorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  aiTutorEmoji: {
    fontSize: 28,
  },
  aiTutorTitle: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  aiTutorSubtitle: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  aiTutorButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  aiTutorButtonText: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
});
