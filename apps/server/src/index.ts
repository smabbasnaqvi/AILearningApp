import 'dotenv/config';
import Fastify from 'fastify';
import corsPlugin from './plugins/cors';
import jwtPlugin from './plugins/jwt';
import { authRoutes } from './modules/auth/auth.routes';
import { aiTutorRoutes } from './modules/ai-tutor/ai-tutor.routes';
import { srsRoutes } from './modules/srs/srs.routes';
import { progressRoutes } from './modules/progress/progress.routes';

const server = Fastify({
  logger: true,
});

async function bootstrap(): Promise<void> {
  await server.register(corsPlugin);
  await server.register(jwtPlugin);

  await server.register(authRoutes, { prefix: '/api/auth' });
  await server.register(aiTutorRoutes, { prefix: '/api/ai-tutor' });
  await server.register(srsRoutes, { prefix: '/api/srs' });
  await server.register(progressRoutes, { prefix: '/api/progress' });

  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  const port = parseInt(process.env['PORT'] ?? '3000', 10);
  const host = process.env['HOST'] ?? '0.0.0.0';

  await server.listen({ port, host });
  server.log.info(`Server running on http://${host}:${port}`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
