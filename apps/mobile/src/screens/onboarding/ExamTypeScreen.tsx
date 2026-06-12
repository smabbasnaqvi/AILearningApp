import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { AuthScreenProps } from '../../navigation/types';
import type { ExamType } from '@ailearningapp/types';
import { EXAM_CONFIGS } from '../../constants/exams';
import { useStudyStore } from '../../store/studyStore';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = AuthScreenProps<'ExamTypeSelection'>;

export function ExamTypeScreen({ navigation }: Props): React.JSX.Element {
  const [selected, setSelected] = useState<ExamType | null>(null);
  const setExamType = useStudyStore((s) => s.setExamType);

  function handleContinue(): void {
    if (!selected) return;
    setExamType(selected);
    navigation.navigate('SubjectSelection');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 1 of 4</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, styles.progressFill25]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Which exam are you{'\n'}preparing for?</Text>
        <Text style={styles.subtitle}>We'll customize your learning experience</Text>

        <View style={styles.grid}>
          {EXAM_CONFIGS.map((exam) => (
            <TouchableOpacity
              key={exam.type}
              style={[
                styles.examCard,
                selected === exam.type && styles.examCardSelected,
                selected === exam.type && { borderColor: exam.color },
              ]}
              onPress={() => setSelected(exam.type)}
              activeOpacity={0.8}
            >
              <View style={[styles.examColorDot, { backgroundColor: exam.color }]} />
              <Text style={styles.examLabel}>{exam.label}</Text>
              <Text style={styles.examDescription}>{exam.description}</Text>
              <Text style={styles.examSubjectCount}>{exam.subjects.length} subjects</Text>
              {selected === exam.type && (
                <View style={[styles.selectedBadge, { backgroundColor: exam.color }]}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selected && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: typography.fontSizeXl,
    color: colors.textPrimary,
  },
  stepText: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
    fontWeight: typography.fontWeightMedium,
  },
  progressContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressFill25: {
    width: '25%',
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  title: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeightXl,
  },
  subtitle: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  examCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  examCardSelected: {
    backgroundColor: colors.surfaceElevated,
  },
  examColorDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  examLabel: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  examDescription: {
    fontSize: typography.fontSizeXs,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  examSubjectCount: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    fontWeight: typography.fontWeightMedium,
  },
  selectedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightBold,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: colors.backgroundDark,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: colors.border,
  },
  continueButtonText: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
});
