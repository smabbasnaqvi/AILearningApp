import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import type { PracticeStackScreenProps } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = PracticeStackScreenProps<'Flashcard'>;

interface FlashcardData {
  id: string;
  front: string;
  back: string;
}

const MOCK_FLASHCARDS: FlashcardData[] = [
  { id: '1', front: 'What is the quadratic formula?', back: 'x = (-b ± √(b²-4ac)) / 2a\n\nUsed to solve ax² + bx + c = 0' },
  { id: '2', front: 'Define: Ephemeral', back: 'Lasting for a very short time; transitory.\n\nExample: "The ephemeral beauty of cherry blossoms"' },
  { id: '3', front: 'What is Newton\'s Second Law of Motion?', back: 'F = ma\n\nForce equals mass times acceleration. The net force on an object equals its mass multiplied by its acceleration.' },
  { id: '4', front: 'What is the difference between "affect" and "effect"?', back: '"Affect" is usually a verb meaning to influence.\n"Effect" is usually a noun meaning the result.\n\nExample: The rain affected our plans. The effect was a cancelled picnic.' },
  { id: '5', front: 'What is photosynthesis?', back: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n\nThe process by which plants convert light energy into chemical energy (glucose), releasing oxygen as a byproduct.' },
];

const RATING_BUTTONS = [
  { label: 'Again', grade: 0, color: colors.error },
  { label: 'Hard', grade: 2, color: colors.warning },
  { label: 'Good', grade: 4, color: colors.success },
  { label: 'Easy', grade: 5, color: colors.primary },
];

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function FlashcardScreen({ navigation }: Props): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);

  const cards = MOCK_FLASHCARDS;
  const currentCard = cards[currentIndex];

  function handleFlip(): void {
    if (!isFlipped) setIsFlipped(true);
  }

  function handleRate(grade: number): void {
    if (!currentCard) return;
    setRatings((prev) => ({ ...prev, [currentCard.id]: grade }));

    if (currentIndex >= cards.length - 1) {
      setCompleted(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  }

  if (completed) {
    const goodCount = Object.values(ratings).filter((g) => g >= 3).length;
    const againCount = Object.values(ratings).filter((g) => g < 3).length;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completionContainer}>
          <Text style={styles.completionEmoji}>🎉</Text>
          <Text style={styles.completionTitle}>Session Complete!</Text>
          <Text style={styles.completionSubtitle}>You reviewed {cards.length} cards</Text>

          <View style={styles.completionStats}>
            <View style={styles.completionStat}>
              <Text style={[styles.completionStatValue, { color: colors.success }]}>{goodCount}</Text>
              <Text style={styles.completionStatLabel}>Good / Easy</Text>
            </View>
            <View style={styles.completionStatDivider} />
            <View style={styles.completionStat}>
              <Text style={[styles.completionStatValue, { color: colors.error }]}>{againCount}</Text>
              <Text style={styles.completionStatLabel}>Again / Hard</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.completionButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.completionButtonText}>Back to Practice</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.completionSecondaryButton}
            onPress={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
              setRatings({});
              setCompleted(false);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.completionSecondaryButtonText}>Review Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentCard) return <SafeAreaView style={styles.container} />;

  const progress = ((currentIndex) / cards.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentIndex + 1} / {cards.length}</Text>
      </View>

      <View style={styles.cardArea}>
        <TouchableOpacity
          style={[styles.flashcard, isFlipped && styles.flashcardFlipped]}
          onPress={handleFlip}
          activeOpacity={0.95}
        >
          <View style={styles.cardLabelRow}>
            <View style={[styles.cardLabel, isFlipped && styles.cardLabelBack]}>
              <Text style={[styles.cardLabelText, isFlipped && styles.cardLabelTextBack]}>
                {isFlipped ? 'ANSWER' : 'QUESTION'}
              </Text>
            </View>
          </View>

          <Text style={[styles.cardContent, isFlipped && styles.cardContentBack]}>
            {isFlipped ? currentCard.back : currentCard.front}
          </Text>

          {!isFlipped && (
            <Text style={styles.tapHint}>Tap to reveal answer</Text>
          )}
        </TouchableOpacity>
      </View>

      {isFlipped ? (
        <View style={styles.ratingArea}>
          <Text style={styles.ratingPrompt}>How well did you know this?</Text>
          <View style={styles.ratingButtons}>
            {RATING_BUTTONS.map((btn) => (
              <TouchableOpacity
                key={btn.label}
                style={[styles.ratingButton, { borderColor: btn.color, backgroundColor: btn.color + '20' }]}
                onPress={() => handleRate(btn.grade)}
                activeOpacity={0.85}
              >
                <Text style={[styles.ratingButtonText, { color: btn.color }]}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.ratingArea}>
          <TouchableOpacity
            style={styles.revealButton}
            onPress={handleFlip}
            activeOpacity={0.85}
          >
            <Text style={styles.revealButtonText}>Reveal Answer</Text>
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
  },
  progressContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
    textAlign: 'center',
    fontWeight: typography.fontWeightMedium,
  },
  cardArea: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    justifyContent: 'center',
  },
  flashcard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    minHeight: SCREEN_HEIGHT * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  flashcardFlipped: {
    backgroundColor: colors.success + '08',
    borderColor: colors.success + '50',
  },
  cardLabelRow: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.xl,
  },
  cardLabel: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  cardLabelBack: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success + '40',
  },
  cardLabelText: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
    letterSpacing: 1,
  },
  cardLabelTextBack: {
    color: colors.success,
  },
  cardContent: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightSemiBold,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeightLg,
    marginTop: spacing.xl,
  },
  cardContentBack: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightRegular,
    color: colors.textSecondary,
    lineHeight: typography.lineHeightLg,
  },
  tapHint: {
    position: 'absolute',
    bottom: spacing.xl,
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  ratingArea: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.md,
  },
  ratingPrompt: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ratingButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  ratingButtonText: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
  },
  revealButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  revealButtonText: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  completionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.lg,
  },
  completionEmoji: {
    fontSize: 64,
  },
  completionTitle: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightExtraBold,
    color: colors.textPrimary,
  },
  completionSubtitle: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
  },
  completionStats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xl,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  completionStat: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  completionStatValue: {
    fontSize: typography.fontSize2xl,
    fontWeight: typography.fontWeightExtraBold,
  },
  completionStatLabel: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
  },
  completionStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  completionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxxl,
    alignItems: 'center',
    width: '100%',
  },
  completionButtonText: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  completionSecondaryButton: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  completionSecondaryButtonText: {
    fontSize: typography.fontSizeMd,
    color: colors.primary,
    fontWeight: typography.fontWeightMedium,
  },
});
