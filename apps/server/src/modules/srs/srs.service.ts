import { PrismaClient } from '@prisma/client';
import { calculateNextReview } from '../../../../packages/utils/src/srs';

const prisma = new PrismaClient();

export class SrsService {
  async getDueCards(userId: string, options: { subtopicId?: string; limit: number }) {
    const now = new Date();

    return prisma.sRSCardRecord.findMany({
      where: {
        userId,
        subtopicId: options.subtopicId,
        OR: [
          { nextReviewAt: null },
          { nextReviewAt: { lte: now } },
        ],
      },
      include: { flashcard: true },
      take: options.limit,
      orderBy: { nextReviewAt: 'asc' },
    });
  }

  async reviewCard(userId: string, flashcardId: string, grade: number) {
    const existing = await prisma.sRSCardRecord.findUnique({
      where: { userId_flashcardId: { userId, flashcardId } },
    });

    const currentEaseFactor = existing?.easeFactor ?? 2.5;
    const currentInterval = existing?.interval ?? 0;

    const result = calculateNextReview(currentEaseFactor, currentInterval, grade);

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + result.nextInterval);

    const flashcard = await prisma.flashcard.findUnique({ where: { id: flashcardId } });
    if (!flashcard) throw new Error('Flashcard not found');

    return prisma.sRSCardRecord.upsert({
      where: { userId_flashcardId: { userId, flashcardId } },
      update: {
        easeFactor: result.newEaseFactor,
        interval: result.nextInterval,
        repetitions: result.repetitions,
        lastReviewedAt: new Date(),
        nextReviewAt,
      },
      create: {
        userId,
        flashcardId,
        subtopicId: flashcard.subtopicId,
        easeFactor: result.newEaseFactor,
        interval: result.nextInterval,
        repetitions: result.repetitions,
        lastReviewedAt: new Date(),
        nextReviewAt,
      },
    });
  }

  async getUserStats(userId: string) {
    const now = new Date();
    const total = await prisma.sRSCardRecord.count({ where: { userId } });
    const due = await prisma.sRSCardRecord.count({
      where: {
        userId,
        OR: [{ nextReviewAt: null }, { nextReviewAt: { lte: now } }],
      },
    });
    const mastered = await prisma.sRSCardRecord.count({
      where: { userId, interval: { gte: 21 } },
    });

    return { total, due, mastered, remaining: total - mastered };
  }
}
