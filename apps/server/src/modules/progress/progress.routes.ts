import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ProgressService } from './progress.service';

export async function progressRoutes(fastify: FastifyInstance): Promise<void> {
  const progressService = new ProgressService();

  fastify.post('/session', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };

    const schema = z.object({
      subtopicId: z.string().optional(),
      topicId: z.string().optional(),
      durationMs: z.number(),
      questionsAttempted: z.array(
        z.object({
          questionId: z.string(),
          correct: z.boolean(),
          timeTakenMs: z.number(),
        })
      ),
    });

    const body = schema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Validation error', details: body.error.errors });
    }

    const session = await progressService.recordSession(userId, body.data);
    return reply.status(201).send({ session });
  });

  fastify.get('/mastery', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const query = z.object({
      subjectId: z.string().optional(),
    }).safeParse(request.query);

    const mastery = await progressService.getMasteryScores(
      userId,
      query.success ? query.data.subjectId : undefined
    );
    return reply.send({ mastery });
  });

  fastify.get('/streak', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const streak = await progressService.getStreak(userId);
    return reply.send({ streak });
  });

  fastify.post('/streak/freeze', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const streak = await progressService.applyStreakFreeze(userId);
    return reply.send({ streak });
  });

  fastify.get('/xp', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const query = z.object({
      limit: z.coerce.number().max(100).default(20),
    }).safeParse(request.query);

    const xpEvents = await progressService.getXPEvents(
      userId,
      query.success ? query.data.limit : 20
    );
    return reply.send({ xpEvents });
  });

  fastify.get('/weakness-report', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const query = z.object({ subjectId: z.string() }).safeParse(request.query);

    if (!query.success) {
      return reply.status(400).send({ error: 'subjectId is required' });
    }

    const report = await progressService.getWeaknessReport(userId, query.data.subjectId);
    return reply.send({ report });
  });
}
