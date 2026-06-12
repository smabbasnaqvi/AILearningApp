import { PrismaClient } from '@prisma/client';
import { calculateMasteryScore } from '../../../../packages/utils/src/mastery';
import { incrementStreak, applyStreakFreeze as applyFreeze } from '../../../../packages/utils/src/streak';

const prisma = new PrismaClient();

const XP_SESSION_BASE = 10;
const XP_CORRECT_ANSWER = 5;
const XP_STREAK_BONUS = 20;

export class ProgressService {
  async recordSession(
    userId: string,
    data: {
      subtopicId?: string;
      topicId?: string;
      durationMs: number;
      questionsAttempted: Array<{
        questionId: string;
        correct: boolean;
        timeTakenMs: number;
      }>;
    }
  ) {
    const correctCount = data.questionsAttempted.filter((q) => q.correct).length;
    const xpEarned = XP_SESSION_BASE + correctCount * XP_CORRECT_ANSWER;

    const session = await prisma.session.create({
      data: {
        userId,
        subtopicId: data.subtopicId,
        topicId: data.topicId,
        durationMs: data.durationMs,
        xpEarned,
        endedAt: new Date(),
        questionAttempts: {
          create: data.questionsAttempted.map((q) => ({
            questionId: q.questionId,
            correct: q.correct,
            timeTakenMs: q.timeTakenMs,
            attemptedAt: new Date(),
          })),
        },
      },
      include: { questionAttempts: true },
    });

    // Update XP
    await prisma.xPEvent.create({
      data: {
        userId,
        type: 'session_complete',
        amount: xpEarned,
        description: `Completed study session: ${correctCount}/${data.questionsAttempted.length} correct`,
        occurredAt: new Date(),
      },
    });

    await prisma.userProfile.updateMany({
      where: { userId },
      data: { xp: { increment: xpEarned } },
    });

    // Update streak
    const streak = await prisma.streak.findUnique({ where: { userId } });
    if (streak) {
      const updatedStreak = incrementStreak({
        userId,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastActivityDate: streak.lastActivityDate,
        freezesAvailable: streak.freezesAvailable,
        freezesUsed: streak.freezesUsed,
      });

      const isNewStreakDay =
        new Date(streak.lastActivityDate).toDateString() !== new Date().toDateString();

      await prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: updatedStreak.currentStreak,
          longestStreak: updatedStreak.longestStreak,
          lastActivityDate: updatedStreak.lastActivityDate,
        },
      });

      if (isNewStreakDay && updatedStreak.currentStreak > 1) {
        const streakXP = XP_STREAK_BONUS;
        await prisma.xPEvent.create({
          data: {
            userId,
            type: 'streak_bonus',
            amount: streakXP,
            description: `${updatedStreak.currentStreak} day streak bonus!`,
            occurredAt: new Date(),
          },
        });
        await prisma.userProfile.updateMany({
          where: { userId },
          data: { xp: { increment: streakXP } },
        });
      }
    }

    // Update mastery if subtopicId provided
    if (data.subtopicId) {
      await this.recalculateMastery(userId, data.subtopicId);
    }

    return session;
  }

  private async recalculateMastery(userId: string, subtopicId: string) {
    const allAttempts = await prisma.questionAttempt.findMany({
      where: {
        question: { subtopicId },
        session: { userId },
      },
      orderBy: { attemptedAt: 'desc' },
      take: 100,
    });

    const score = calculateMasteryScore(
      allAttempts.map((a) => ({
        questionId: a.questionId,
        correct: a.correct,
        attemptedAt: a.attemptedAt,
        timeTakenMs: a.timeTakenMs,
      }))
    );

    const subtopic = await prisma.subtopic.findUnique({
      where: { id: subtopicId },
      include: { topic: true },
    });

    if (!subtopic) return;

    await prisma.masteryScore.upsert({
      where: {
        userId_subjectId_topicId_subtopicId: {
          userId,
          subjectId: subtopic.topic.subjectId,
          topicId: subtopic.topicId,
          subtopicId,
        },
      },
      update: { score, calculatedAt: new Date() },
      create: {
        userId,
        subjectId: subtopic.topic.subjectId,
        topicId: subtopic.topicId,
        subtopicId,
        score,
        calculatedAt: new Date(),
      },
    });
  }

  async getMasteryScores(userId: string, subjectId?: string) {
    return prisma.masteryScore.findMany({
      where: {
        userId,
        subjectId,
      },
      orderBy: { calculatedAt: 'desc' },
    });
  }

  async getStreak(userId: string) {
    return prisma.streak.findUnique({ where: { userId } });
  }

  async applyStreakFreeze(userId: string) {
    const streak = await prisma.streak.findUnique({ where: { userId } });
    if (!streak) throw new Error('Streak not found');

    const updated = applyFreeze({
      userId,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityDate: streak.lastActivityDate,
      freezesAvailable: streak.freezesAvailable,
      freezesUsed: streak.freezesUsed,
    });

    return prisma.streak.update({
      where: { userId },
      data: {
        freezesAvailable: updated.freezesAvailable,
        freezesUsed: updated.freezesUsed,
        lastActivityDate: updated.lastActivityDate,
      },
    });
  }

  async getXPEvents(userId: string, limit: number) {
    return prisma.xPEvent.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
      take: limit,
    });
  }

  async getWeaknessReport(userId: string, subjectId: string) {
    const weakMastery = await prisma.masteryScore.findMany({
      where: {
        userId,
        subjectId,
        score: { lt: 50 },
      },
      orderBy: { score: 'asc' },
      take: 10,
    });

    return {
      userId,
      subjectId,
      weakTopicIds: weakMastery
        .filter((m) => m.topicId !== null)
        .map((m) => m.topicId as string),
      generatedAt: new Date(),
    };
  }
}
