import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { PracticeStackScreenProps } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = PracticeStackScreenProps<'Quiz'>;

interface QuizQuestion {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    subject: 'Math',
    text: 'What is the value of x if 2x² - 8 = 0?',
    options: ['x = 2 only', 'x = ±2', 'x = 4', 'x = ±4'],
    correctIndex: 1,
    explanation: 'Solving: 2x² = 8, x² = 4, x = ±2.',
  },
  {
    id: 'q2',
    subject: 'Reading',
    text: 'The word "ambiguous" most closely means:',
    options: ['Clearly defined', 'Open to multiple interpretations', 'Extremely large', 'Rarely occurring'],
    correctIndex: 1,
    explanation: 'Ambiguous means open to more than one interpretation; not having one obvious meaning.',
  },
  {
    id: 'q3',
    subject: 'Science',
    text: 'Which law states that energy cannot be created or destroyed?',
    options: ['Newton\'s First Law', 'Law of Conservation of Momentum', 'First Law of Thermodynamics', 'Boyle\'s Law'],
    correctIndex: 2,
    explanation: 'The First Law of Thermodynamics states that energy cannot be created or destroyed, only converted.',
  },
  {
    id: 'q4',
    subject: 'Writing',
    text: 'Choose the correctly punctuated sentence:',
    options: [
      'The students, who studied hard passed the exam.',
      'The students who studied hard, passed the exam.',
      'The students who studied hard passed the exam.',
      'The students, who studied hard, passed the exam.',
    ],
    correctIndex: 2,
    explanation: '"Who studied hard" is a restrictive clause that identifies which students — no commas needed.',
  },
  {
    id: 'q5',
    subject: 'Math',
    text: 'A rectangle has a perimeter of 36 cm and a length of 10 cm. What is its area?',
    options: ['80 cm²', '72 cm²', '160 cm²', '36 cm²'],
    correctIndex: 0,
    explanation: 'Width = (36/2) - 10 = 18 - 10 = 8 cm. Area = 10 × 8 = 80 cm².',
  },
];

const TIME_PER_QUESTION = 30;

export function QuizScreen({ navigation, route }: Props): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(QUIZ_QUESTIONS.length).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const isLast = currentIndex === QUIZ_QUESTIONS.length - 1;

  const handleNext = useCallback(() => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedOption;
    setAnswers(newAnswers);

    if (isLast) {
      const score = newAnswers.filter(
        (ans, i) => ans === QUIZ_QUESTIONS[i].correctIndex
      ).length;
      navigation.replace('QuizResults', {
        score,
        total: QUIZ_QUESTIONS.length,
        xpEarned: score * 10,
      });
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setTimeLeft(TIME_PER_QUESTION);
    }
  }, [answers, currentIndex, isLast, navigation, selectedOption]);

  useEffect(() => {
    if (showFeedback) return;
    if (timeLeft <= 0) {
      setShowFeedback(true);
      const t = setTimeout(handleNext, 1500);
      return () => clearTimeout(t);
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showFeedback, handleNext]);

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
    if (index === selectedOption && index !== currentQuestion.correctIndex) return styles.optionWrong;
    return styles.option;
  }

  function getOptionTextStyle(index: number) {
    if (!showFeedback) {
      return index === selectedOption ? styles.optionTextSelected : styles.optionText;
    }
    if (index === currentQuestion.correctIndex) return styles.optionTextCorrect;
    if (index === selectedOption && index !== currentQuestion.correctIndex) return styles.optionTextWrong;
    return styles.optionText;
  }

  const timerColor = timeLeft <= 10 ? colors.error : colors.primary;
  const progressPct = ((currentIndex) / QUIZ_QUESTIONS.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{currentIndex + 1}/{QUIZ_QUESTIONS.length}</Text>
        </View>
        <View style={styles.timerRow}>
          <View style={styles.timerBarBg}>
            <View
              style={[
                styles.timerBarFill,
                {
                  width: `${(timeLeft / TIME_PER_QUESTION) * 100}%`,
                  backgroundColor: timerColor,
                },
              ]}
            />
          </View>
          <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
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
              <View style={styles.optionLetterBubble}>
                <Text style={styles.optionLetterText}>{String.fromCharCode(65 + index)}</Text>
              </View>
              <Text style={getOptionTextStyle(index)}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {showFeedback && (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>
              {selectedOption === currentQuestion.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
            </Text>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
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
          <Text style={styles.nextButtonText}>{isLast ? 'See Results' : 'Next →'}</Text>
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
  counterBadge: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterText: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timerBarBg: {
    width: 80,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  timerText: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    minWidth: 28,
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
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
    lineHeight: typography.lineHeightLg,
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
  optionLetterBubble: {
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
  explanationCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  explanationTitle: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  explanationText: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeightMd,
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
