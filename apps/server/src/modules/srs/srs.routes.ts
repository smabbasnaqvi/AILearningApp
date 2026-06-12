import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { SrsService } from './srs.service';

export async function srsRoutes(fastify: FastifyInstance): Promise<void> {
  const srsService = new SrsService();

  fastify.get('/due-cards', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const query = z.object({
      subtopicId: z.string().optional(),
      limit: z.coerce.number().max(50).default(20),
    }).safeParse(request.query);

    if (!query.success) {
      return reply.status(400).send({ error: 'Validation error' });
    }

    const cards = await srsService.getDueCards(userId, query.data);
    return reply.send({ cards });
  });

  fastify.post('/review', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };

    const schema = z.object({
      flashcardId: z.string(),
      grade: z.number().min(0).max(5),
    });

    const body = schema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Validation error', details: body.error.errors });
    }

    const card = await srsService.reviewCard(userId, body.data.flashcardId, body.data.grade);
    return reply.send({ card });
  });

  fastify.get('/stats', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const stats = await srsService.getUserStats(userId);
    return reply.send({ stats });
  });
}
