import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { PracticeStackParamList } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = StackScreenProps<PracticeStackParamList, 'Quiz'>;

interface QuizQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

// TODO: replace with real questions from API
const MOCK_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1', subject: 'Math',
    question: 'Solve: 2x² - 8 = 0',
    options: ['x = ±2', 'x = ±4', 'x = 2', 'x = 4'],
    correctIndex: 0,
    hint: 'Divide both sides by 2 first, then take the square root.',
  },
  {
    id: 'q2', subject: 'Reading',
    question: 'What does "ubiquitous" mean?',
    options: ['Rare', 'Present everywhere', 'Ancient', 'Mysterious'],
    correctIndex: 1,
    hint: 'Think of the word "everywhere" — this word describes something very commonly found.',
  },
  {
    id: 'q3', subject: 'Writing',
    question: 'Which sentence uses the correct verb form?\n"The committee _____ agreed."',
    options: ['have', 'has', 'had had', 'are'],
    correctIndex: 1,
    hint: '"Committee" is a collective noun treated as singular in American English.',
  },
  {
    id: 'q4', subject: 'Math',
    question: 'If f(x) = 3x + 2, what is f(4)?',
    options: ['10', '12', '14', '16'],
    correctIndex: 2,
    hint: 'Substitute x = 4 into the function and simplify.',
  },
  {
    id: 'q5', subject: 'Science',
    question: 'What type of bond holds water molecules together?',
    options: ['Covalent', 'Ionic', 'Hydrogen', 'Metallic'],
    correctIndex: 2,
    hint: 'Water molecules are attracted to each other through a special intermolecular bond named after an element.',
  },
];

export function QuizScreen({ navigation }: Props): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const question = MOCK_QUESTIONS[currentIndex];
  const total = MOCK_QUESTIONS.length;
  const isLast = currentIndex === total - 1;
  const progress = (currentIndex + 1) / total;

  function handleSubmit() {
    if (selectedOption === null) return;
    setSubmitted(true);
    if (selectedOption === question.correctIndex) {
      setCorrectAnswers((c) => c + 1);
    }
  }

  function handleNext() {
    if (isLast) {
      const finalCorrect = submitted && selectedOption === question.correctIndex
        ? correctAnswers
        : correctAnswers;
      navigation.navigate('QuizResults', {
        score: finalCorrect,
        total,
        xpEarned: finalCorrect * 15,
      });
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
    setSubmitted(false);
    setShowHint(false);
  }

  function getOptionStyle(idx: number) {
    if (!submitted) {
      return selectedOption === idx ? styles.optionSelected : styles.option;
    }
    if (idx === question.correctIndex) return styles.optionCorrect;
    if (idx === selectedOption) return styles.optionWrong;
    return styles.option;
  }

  function getOptionTextStyle(idx: number) {
    if (!submitted) {
      return selectedOption === idx ? styles.optionTextSelected : styles.optionText;
    }
    if (idx === question.correctIndex) return styles.optionTextCorrect;
    if (idx === selectedOption) return styles.optionTextWrong;
    return styles.optionText;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.headerMeta}>
          <Text style={styles.questionCount}>{currentIndex + 1} / {total}</Text>
          <TouchableOpacity
            style={styles.hintBtn}
            onPress={() => setShowHint((v) => !v)}
            activeOpacity={0.8}
          >
            <Text style={styles.hintBtnText}>{showHint ? '🙈 Hide Hint' : '💡 Hint'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        <View style={styles.subjectBadge}>
          <Text style={styles.subjectText}>{question.subject}</Text>
        </View>

        <Text style={styles.questionText}>{question.question}</Text>

        {showHint && (
          <View style={styles.hintCard}>
            <Text style={styles.hintLabel}>💡 Hint</Text>
            <Text style={styles.hintText}>{question.hint}</Text>
          </View>
        )}

        <View style={styles.options}>
          {question.options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={getOptionStyle(idx)}
              onPress={() => !submitted && setSelectedOption(idx)}
              activeOpacity={submitted ? 1 : 0.8}
            >
              <View style={styles.optionLetterContainer}>
                <Text style={styles.optionLetter}>{String.fromCharCode(65 + idx)}</Text>
              </View>
              <Text style={getOptionTextStyle(idx)}>{option}</Text>
              {submitted && idx === question.correctIndex && (
                <Text style={styles.correctIcon}>✓</Text>
              )}
              {submitted && idx === selectedOption && idx !== question.correctIndex && (
                <Text style={styles.wrongIcon}>✗</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {!submitted ? (
          <TouchableOpacity
            style={[styles.actionBtn, selectedOption === null && styles.actionBtnDisabled]}
            onPress={handleSubmit}
            disabled={selectedOption === null}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionBtn} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.actionBtnText}>{isLast ? 'See Results' : 'Next →'}</Text>
          </TouchableOpacity>
        )}
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  headerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionCount: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  hintBtn: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  hintBtnText: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  body: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  subjectBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.lg,
  },
  subjectText: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  questionText: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: spacing.lg,
  },
  hintCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
    marginBottom: spacing.lg,
  },
  hintLabel: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    color: colors.warning,
    marginBottom: 4,
  },
  hintText: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  options: {
    gap: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.md,
  },
  optionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: spacing.md,
  },
  optionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.success,
    gap: spacing.md,
  },
  optionWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '15',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.error,
    gap: spacing.md,
  },
  optionLetterContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetter: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    color: colors.textSecondary,
  },
  optionText: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
  },
  optionTextSelected: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightMedium,
  },
  optionTextCorrect: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    color: colors.success,
    fontWeight: typography.fontWeightSemiBold,
  },
  optionTextWrong: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    color: colors.error,
    fontWeight: typography.fontWeightMedium,
  },
  correctIcon: {
    fontSize: 16,
    color: colors.success,
    fontWeight: typography.fontWeightBold,
  },
  wrongIcon: {
    fontSize: 16,
    color: colors.error,
    fontWeight: typography.fontWeightBold,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.md,
  },
  actionBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  actionBtnDisabled: {
    backgroundColor: colors.border,
  },
  actionBtnText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
  },
});
