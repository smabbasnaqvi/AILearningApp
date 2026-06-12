import type { QuestionAttempt } from '@ailearningapp/types';

export interface MasteryInput {
  attempts: QuestionAttempt[];
}

/**
 * Calculate mastery score (0-100) from question attempts.
 * Recent attempts are weighted more heavily using exponential decay.
 */
export function calculateMasteryScore(attempts: QuestionAttempt[]): number {
  if (attempts.length === 0) return 0;

  const now = new Date();
  const sortedAttempts = [...attempts].sort(
    (a, b) => new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime()
  );

  const DECAY_RATE = 0.1; // per day
  let weightedCorrect = 0;
  let totalWeight = 0;

  for (const attempt of sortedAttempts) {
    const attemptDate = new Date(attempt.attemptedAt);
    const daysAgo = (now.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24);
    const weight = Math.exp(-DECAY_RATE * daysAgo);

    weightedCorrect += attempt.correct ? weight : 0;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;

  const rawScore = (weightedCorrect / totalWeight) * 100;

  // Apply confidence multiplier based on number of attempts
  const confidenceMultiplier = Math.min(1, attempts.length / 10);
  const adjustedScore = rawScore * confidenceMultiplier;

  return Math.round(Math.max(0, Math.min(100, adjustedScore)));
}

export function getMasteryLevel(score: number): 'novice' | 'developing' | 'proficient' | 'mastered' {
  if (score >= 85) return 'mastered';
  if (score >= 65) return 'proficient';
  if (score >= 40) return 'developing';
  return 'novice';
}
