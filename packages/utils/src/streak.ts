import type { Streak } from '@ailearningapp/types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Check if a streak is still alive (last activity was today or yesterday).
 */
export function isStreakAlive(lastActivityDate: Date): boolean {
  const now = new Date();
  const last = new Date(lastActivityDate);

  // Normalize to start of day
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());

  const diffDays = Math.floor((nowDay.getTime() - lastDay.getTime()) / MS_PER_DAY);

  return diffDays <= 1;
}

/**
 * Increment the streak if last activity was yesterday or today.
 * If missed (>1 day ago), reset streak to 1.
 */
export function incrementStreak(streak: Streak): Streak {
  const now = new Date();
  const last = new Date(streak.lastActivityDate);

  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());

  const diffDays = Math.floor((nowDay.getTime() - lastDay.getTime()) / MS_PER_DAY);

  if (diffDays === 0) {
    // Already active today, no change
    return { ...streak, lastActivityDate: now };
  }

  if (diffDays === 1) {
    // Continue streak
    const newStreak = streak.currentStreak + 1;
    return {
      ...streak,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streak.longestStreak),
      lastActivityDate: now,
    };
  }

  // Streak broken
  return {
    ...streak,
    currentStreak: 1,
    lastActivityDate: now,
  };
}

/**
 * Apply a streak freeze to protect against a missed day.
 */
export function applyStreakFreeze(streak: Streak): Streak {
  if (streak.freezesAvailable <= 0) {
    throw new Error('No streak freezes available');
  }

  return {
    ...streak,
    freezesAvailable: streak.freezesAvailable - 1,
    freezesUsed: streak.freezesUsed + 1,
    lastActivityDate: new Date(), // Extend by setting last activity to now
  };
}
