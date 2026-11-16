import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { corsOptions } from './config/cors';
import { openapiSpec } from './docs/openapi';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFound';
import { requestLogger } from './middleware/requestLogger';
import { healthRouter } from './modules/health/health.routes';

export function createApp(): Express {
  const app = express();

  // 1. Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    })
  );

  // 2. CORS allowlist
  app.use(cors(corsOptions));

  // 3. Request Body Size Limits & Parsing
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // 4. Request Logging & Request IDs
  app.use(requestLogger);

  // 5. Swagger UI Documentation
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, {
      customSiteTitle: 'FlowPort API Documentation',
    })
  );
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openapiSpec);
  });

  // 6. Base API Router
  const apiRouter = express.Router();
  apiRouter.use('/health', healthRouter);

  // Mount API Router under /api/v1
  app.use('/api/v1', apiRouter);

  // Root endpoint info
  app.get('/', (_req, res) => {
    res.status(200).json({
      service: 'flowport-api',
      version: '1.0.0',
      docs: '/api/docs',
      health: '/api/v1/health',
    });
  });

  // 7. Unknown Route Handling
  app.use(notFoundHandler);

  // 8. Centralized Error Handling
  app.use(errorHandler);

  return app;
}

export const app = createApp();
