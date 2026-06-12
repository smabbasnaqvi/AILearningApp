export interface SRSCard {
  easeFactor: number;
  interval: number;
  repetitions: number;
}

export interface SRSResult {
  nextInterval: number;
  newEaseFactor: number;
  repetitions: number;
}

/**
 * SM-2 Spaced Repetition Algorithm
 * Grade 0-5: 0=complete blackout, 1=incorrect but remembered, 2=incorrect with hint,
 *            3=correct with difficulty, 4=correct after hesitation, 5=perfect
 */
export function calculateNextReview(
  easeFactor: number,
  interval: number,
  grade: number
): SRSResult {
  if (grade < 0 || grade > 5) {
    throw new Error('Grade must be between 0 and 5');
  }

  let newEaseFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  let nextInterval: number;
  let repetitions: number;

  if (grade < 3) {
    // Incorrect response - reset
    nextInterval = 1;
    repetitions = 0;
  } else {
    // Correct response
    if (interval === 0) {
      nextInterval = 1;
      repetitions = 1;
    } else if (interval === 1) {
      nextInterval = 6;
      repetitions = 2;
    } else {
      nextInterval = Math.round(interval * newEaseFactor);
      repetitions = Math.floor(interval / (interval === 1 ? 1 : 6)) + 1;
    }
  }

  return {
    nextInterval,
    newEaseFactor,
    repetitions,
  };
}

export function getInitialCard(): SRSCard {
  return {
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
  };
}

export function isDue(card: SRSCard & { lastReviewedAt?: Date }): boolean {
  if (!card.lastReviewedAt) return true;
  const now = new Date();
  const dueDate = new Date(card.lastReviewedAt);
  dueDate.setDate(dueDate.getDate() + card.interval);
  return now >= dueDate;
}
