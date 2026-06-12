import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { AuthScreenProps } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = AuthScreenProps<'DiagnosticQuiz'>;

interface DiagnosticQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  subject: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'q1',
    text: 'If 3x + 7 = 22, what is the value of x?',
    options: ['3', '5', '7', '9'],
    correctIndex: 1,
    subject: 'Math',
  },
  {
    id: 'q2',
    text: 'Which of the following is the best synonym for "ephemeral"?',
    options: ['Permanent', 'Transient', 'Substantial', 'Ancient'],
    correctIndex: 1,
    subject: 'Reading',
  },
  {
    id: 'q3',
    text: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctIndex: 2,
    subject: 'Science',
  },
  {
    id: 'q4',
    text: 'Identify the grammatical error: "Each of the students have submitted their assignment."',
    options: [
      '"Each of the students" should be "Each student"',
      '"have" should be "has"',
      '"their" should be "his or her"',
      'No error',
    ],
    correctIndex: 1,
    subject: 'Writing',
  },
  {
    id: 'q5',
    text: 'A train travels 240 miles in 4 hours. What is its average speed?',
    options: ['40 mph', '50 mph', '60 mph', '80 mph'],
    correctIndex: 2,
    subject: 'Math',
  },
];

const TIME_PER_QUESTION = 30;

export function DiagnosticQuizScreen({ navigation }: Props): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(DIAGNOSTIC_QUESTIONS.length).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentIndex];
  const isLast = currentIndex === DIAGNOSTIC_QUESTIONS.length - 1;

  const handleNext = useCallback(() => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedOption;
    setAnswers(newAnswers);

    if (isLast) {
      const score = newAnswers.filter(
        (ans, i) => ans === DIAGNOSTIC_QUESTIONS[i].correctIndex
      ).length;
      navigation.navigate('DiagnosticResults', {
        score,
        total: DIAGNOSTIC_QUESTIONS.length,
      });
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setTimeLeft(TIME_PER_QUESTION);
    }
  }, [answers, currentIndex, isLast, navigation, selectedOption]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setShowFeedback(true);
      setTimeout(handleNext, 1500);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleNext]);

  function handleOptionSelect(index: number): void {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
  }

  function getOptionStyle(index: number) {
    if (!showFeedback) {
      return index === selectedOption ? styles.optionSelected : styles.option;
    }
    if (index === currentQuestion.correctIndex) return styles.optionCorrect;
    if (index === selectedOption && index !== currentQuestion.correctIndex)
      return styles.optionWrong;
    return styles.option;
  }

  function getOptionTextStyle(index: number) {
    if (!showFeedback) {
      return index === selectedOption ? styles.optionTextSelected : styles.optionText;
    }
    if (index === currentQuestion.correctIndex) return styles.optionTextCorrect;
    if (index === selectedOption && index !== currentQuestion.correctIndex)
      return styles.optionTextWrong;
    return styles.optionText;
  }

  const timerColor = timeLeft <= 10 ? colors.error : colors.primary;
  const timerPercent = (timeLeft / TIME_PER_QUESTION) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.questionCounter}>
          <Text style={styles.questionCounterText}>
            Question {currentIndex + 1}/{DIAGNOSTIC_QUESTIONS.length}
          </Text>
        </View>
        <View style={styles.timerContainer}>
          <View style={styles.timerBar}>
            <View
              style={[
                styles.timerFill,
                { width: `${timerPercent}%`, backgroundColor: timerColor },
              ]}
            />
          </View>
          <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${((currentIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%`,
            },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.subjectBadge}>
          <Text style={styles.subjectBadgeText}>{currentQuestion.subject}</Text>
        </View>

        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(index)}
              onPress={() => handleOptionSelect(index)}
              disabled={showFeedback}
              activeOpacity={0.8}
            >
              <View style={styles.optionLetter}>
                <Text style={styles.optionLetterText}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={getOptionTextStyle(index)}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {showFeedback && (
          <View
            style={[
              styles.feedbackBanner,
              selectedOption === currentQuestion.correctIndex
                ? styles.feedbackCorrect
                : styles.feedbackWrong,
            ]}
          >
            <Text style={styles.feedbackText}>
              {selectedOption === currentQuestion.correctIndex
                ? '✓ Correct!'
                : `✗ The correct answer is ${String.fromCharCode(65 + currentQuestion.correctIndex)}`}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !showFeedback && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!showFeedback}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>
            {isLast ? 'See Results' : 'Next Question'}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  questionCounter: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  questionCounterText: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timerBar: {
    width: 80,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  timerText: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    minWidth: 30,
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  subjectBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  subjectBadgeText: {
    fontSize: typography.fontSizeXs,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  questionText: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
    lineHeight: typography.lineHeightXl,
    marginBottom: spacing.xxl,
  },
  optionsContainer: {
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
    backgroundColor: colors.primary + '15',
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
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    color: colors.textSecondary,
  },
  optionText: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    lineHeight: typography.lineHeightMd,
  },
  optionTextSelected: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    color: colors.primary,
    fontWeight: typography.fontWeightMedium,
    lineHeight: typography.lineHeightMd,
  },
  optionTextCorrect: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    color: colors.success,
    fontWeight: typography.fontWeightMedium,
    lineHeight: typography.lineHeightMd,
  },
  optionTextWrong: {
    flex: 1,
    fontSize: typography.fontSizeMd,
    color: colors.error,
    fontWeight: typography.fontWeightMedium,
    lineHeight: typography.lineHeightMd,
  },
  feedbackBanner: {
    marginTop: spacing.xl,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: colors.success + '20',
    borderWidth: 1,
    borderColor: colors.success,
  },
  feedbackWrong: {
    backgroundColor: colors.error + '20',
    borderWidth: 1,
    borderColor: colors.error,
  },
  feedbackText: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: colors.backgroundDark,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.border,
  },
  nextButtonText: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
});
