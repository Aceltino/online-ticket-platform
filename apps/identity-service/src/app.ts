import express, { Express, json } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './infrastructure/swagger/swagger-config';
import { authRoutes } from './infrastructure/http/routes/auth.routes';
import { userRoutes } from './infrastructure/http/routes/user.routes';
import { errorHandler } from './infrastructure/http/middlewares/error-handler';
import { createRedisClient } from './infrastructure/persistence/redis/client.js';
import { RedisRefreshTokenRepository } from './infrastructure/persistence/redis/redis-refresh-token.repository';

export function createApp(): Express {
  const app: Express = express();
  const redis = createRedisClient();
  new RedisRefreshTokenRepository(redis);

  app.use(json());

  app.use('/docs', swaggerUi.serve);
  app.get('/docs', swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Identity Service API',
  }));

  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);

  app.get('/health', (_, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use(errorHandler);

  return app;
}