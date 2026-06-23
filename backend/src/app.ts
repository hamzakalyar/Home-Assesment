import cors from 'cors';
import express, { type Express } from 'express';
import { NotFoundError } from './errors';
import { errorHandler } from './middleware/errorHandler';
import { apiRouter } from './routes';

/**
 * Builds and configures the Express application without starting a server, so it
 * can be imported directly in tests. `server.ts` is the only place that listens.
 */
export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', apiRouter);

  // Any unmatched route is a 404 in the standard error shape.
  app.use((req, _res, next) => {
    next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
  });

  app.use(errorHandler);

  return app;
}
