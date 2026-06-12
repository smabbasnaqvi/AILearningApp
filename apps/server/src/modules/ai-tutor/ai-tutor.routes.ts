import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AiTutorService } from './ai-tutor.service';

export async function aiTutorRoutes(fastify: FastifyInstance): Promise<void> {
  const aiTutorService = new AiTutorService();

  fastify.post('/conversation', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };

    const schema = z.object({
      subtopicId: z.string().optional(),
      topicId: z.string().optional(),
    });

    const body = schema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Validation error', details: body.error.errors });
    }

    const conversation = await aiTutorService.createConversation(userId, body.data);
    return reply.status(201).send({ conversation });
  });

  fastify.post('/conversation/:conversationId/message', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const { conversationId } = request.params as { conversationId: string };

    const schema = z.object({
      content: z.string().min(1).max(2000),
    });

    const body = schema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Validation error', details: body.error.errors });
    }

    const result = await aiTutorService.sendMessage(userId, conversationId, body.data.content);
    return reply.send(result);
  });

  fastify.get('/conversation/:conversationId', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const { conversationId } = request.params as { conversationId: string };

    const conversation = await aiTutorService.getConversation(userId, conversationId);
    if (!conversation) {
      return reply.status(404).send({ error: 'Conversation not found' });
    }

    return reply.send({ conversation });
  });

  fastify.get('/conversations', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string };
    const conversations = await aiTutorService.getUserConversations(userId);
    return reply.send({ conversations });
  });
}
