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
import type { Subject } from '@ailearningapp/types';
import { getSubjectsForExam } from '../../constants/exams';
import { useStudyStore } from '../../store/studyStore';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = AuthScreenProps<'SubjectSelection'>;

export function SubjectSelectionScreen({ navigation }: Props): React.JSX.Element {
  const { currentExamType, setSubjects } = useStudyStore();
  const availableSubjects = currentExamType ? getSubjectsForExam(currentExamType) : [];
  const [selected, setSelected] = useState<Subject[]>([]);

  function toggleSubject(subject: Subject): void {
    setSelected((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }

  function handleContinue(): void {
    if (selected.length === 0) return;
    setSubjects(selected);
    navigation.navigate('ExamDate');
  }

  function handleSelectAll(): void {
    setSelected(selected.length === availableSubjects.length ? [] : [...availableSubjects]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 2 of 4</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, styles.progressFill50]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Select your subjects</Text>
        <Text style={styles.subtitle}>
          Choose the subjects you want to study. You can change this later.
        </Text>

        <View style={styles.selectAllRow}>
          <Text style={styles.selectedCount}>
            {selected.length} of {availableSubjects.length} selected
          </Text>
          <TouchableOpacity onPress={handleSelectAll}>
            <Text style={styles.selectAllText}>
              {selected.length === availableSubjects.length ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chipsContainer}>
          {availableSubjects.map((subject) => (
            <TouchableOpacity
              key={subject}
              style={[styles.chip, selected.includes(subject) && styles.chipSelected]}
              onPress={() => toggleSubject(subject)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  selected.includes(subject) && styles.chipTextSelected,
                ]}
              >
                {subject}
              </Text>
              {selected.includes(subject) && <Text style={styles.chipCheck}> ✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, selected.length === 0 && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={selected.length === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>
            Continue with {selected.length} subject{selected.length !== 1 ? 's' : ''}
          </Text>
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
  progressFill50: {
    width: '50%',
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
  },
  subtitle: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: typography.lineHeightLg,
  },
  selectAllRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  selectedCount: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
  },
  selectAllText: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightMedium,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  chipCheck: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
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
