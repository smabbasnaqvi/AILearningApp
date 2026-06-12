import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthService } from './auth.service';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  const authService = new AuthService();

  fastify.post('/register', async (request, reply) => {
    const body = registerSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Validation error', details: body.error.errors });
    }

    const { email, password, displayName } = body.data;

    const existing = await authService.findUserByEmail(email);
    if (existing) {
      return reply.status(409).send({ error: 'User already exists' });
    }

    const user = await authService.createUser(email, password, displayName);
    const token = fastify.jwt.sign({ userId: user.id, email: user.email });

    return reply.status(201).send({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName,
      },
    });
  });

  fastify.post('/login', async (request, reply) => {
    const body = loginSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Validation error', details: body.error.errors });
    }

    const { email, password } = body.data;

    const user = await authService.validatePassword(email, password);
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ userId: user.id, email: user.email });

    return reply.send({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  });

  fastify.get('/me', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string; email: string };
    const user = await authService.findUserById(userId);
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }
    return reply.send({ user });
  });

  fastify.put('/profile', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { userId } = request.user as { userId: string; email: string };

    const profileSchema = z.object({
      examType: z.enum(['SAT', 'ACT', 'A_LEVELS', 'IB']).optional(),
      subjects: z.array(z.string()).optional(),
      examDate: z.string().optional(),
    });

    const body = profileSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Validation error', details: body.error.errors });
    }

    const profile = await authService.updateProfile(userId, {
      ...body.data,
      examDate: body.data.examDate ? new Date(body.data.examDate) : undefined,
    });

    return reply.send({ profile });
  });
}
