import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { PracticeStackParamList } from '../../navigation/types';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';

type Props = StackScreenProps<PracticeStackParamList, 'Flashcard'>;

interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
}

// TODO: replace with real flashcards from API (/srs/due-cards)
const MOCK_FLASHCARDS: Flashcard[] = [
  { id: 'f1', front: 'What is the quadratic formula?', back: 'x = (-b ± √(b²-4ac)) / 2a', subject: 'Math' },
  { id: 'f2', front: 'Define "protagonist"', back: 'The main character in a story, who the narrative follows and whose journey drives the plot.', subject: 'Reading' },
  { id: 'f3', front: 'What is a metaphor?', back: 'A figure of speech that directly compares two unlike things without using "like" or "as".', subject: 'Writing' },
  { id: 'f4', front: 'What is mitosis?', back: 'Cell division that produces two genetically identical daughter cells, each with the same chromosome count as the parent.', subject: 'Science' },
  { id: 'f5', front: 'State the Pythagorean theorem', back: 'In a right triangle: a² + b² = c², where c is the hypotenuse.', subject: 'Math' },
];

export function FlashcardScreen({ navigation }: Props): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [dontKnowCount, setDontKnowCount] = useState(0);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const card = MOCK_FLASHCARDS[currentIndex];
  const total = MOCK_FLASHCARDS.length;
  const progress = (currentIndex + 1) / total;
  const isLast = currentIndex === total - 1;

  function flipCard() {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 1,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
    setFlipped((v) => !v);
  }

  function handleAnswer(knew: boolean) {
    if (knew) setKnownCount((c) => c + 1);
    else setDontKnowCount((c) => c + 1);

    // TODO: call POST /srs/review with grade

    if (isLast) {
      navigation.navigate('QuizResults', {
        score: knew ? knownCount + 1 : knownCount,
        total,
        xpEarned: (knew ? knownCount + 1 : knownCount) * 10,
      });
      return;
    }

    flipAnim.setValue(0);
    setFlipped(false);
    setCurrentIndex((i) => i + 1);
  }

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statGreen}>✓ {knownCount}</Text>
          <Text style={styles.cardCount}>{currentIndex + 1} / {total}</Text>
          <Text style={styles.statRed}>✗ {dontKnowCount}</Text>
        </View>
      </View>

      <View style={styles.subjectBadgeRow}>
        <View style={styles.subjectBadge}>
          <Text style={styles.subjectText}>{card.subject}</Text>
        </View>
        {!flipped && <Text style={styles.tapHint}>Tap to reveal answer</Text>}
      </View>

      <TouchableOpacity style={styles.cardContainer} onPress={flipCard} activeOpacity={1}>
        <Animated.View
          style={[styles.card, styles.cardFront, { transform: [{ rotateY: frontInterpolate }] }]}
        >
          <Text style={styles.cardSideLabel}>QUESTION</Text>
          <Text style={styles.cardText}>{card.front}</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { transform: [{ rotateY: backInterpolate }], position: 'absolute' },
          ]}
        >
          <Text style={styles.cardSideLabel}>ANSWER</Text>
          <Text style={styles.cardText}>{card.back}</Text>
        </Animated.View>
      </TouchableOpacity>

      {flipped && (
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={styles.dontKnowBtn}
            onPress={() => handleAnswer(false)}
            activeOpacity={0.85}
          >
            <Text style={styles.dontKnowText}>✗ Don't Know</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.knowBtn}
            onPress={() => handleAnswer(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.knowText}>✓ Know It</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    paddingHorizontal: spacing.xl,
  },
  header: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statGreen: {
    fontSize: typography.fontSizeSm,
    color: colors.success,
    fontWeight: typography.fontWeightBold,
  },
  cardCount: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
  },
  statRed: {
    fontSize: typography.fontSizeSm,
    color: colors.error,
    fontWeight: typography.fontWeightBold,
  },
  subjectBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  subjectBadge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  subjectText: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightSemiBold,
  },
  tapHint: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  card: {
    width: '100%',
    minHeight: 260,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    ...shadows.lg,
  },
  cardFront: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardBack: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cardSideLabel: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    fontWeight: typography.fontWeightBold,
    letterSpacing: 1.5,
    marginBottom: spacing.lg,
  },
  cardText: {
    fontSize: typography.fontSizeLg,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: typography.fontWeightMedium,
  },
  answerButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  dontKnowBtn: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.error + '20',
    borderWidth: 1.5,
    borderColor: colors.error,
    alignItems: 'center',
  },
  dontKnowText: {
    color: colors.error,
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
  },
  knowBtn: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.success + '20',
    borderWidth: 1.5,
    borderColor: colors.success,
    alignItems: 'center',
  },
  knowText: {
    color: colors.success,
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
  },
});
