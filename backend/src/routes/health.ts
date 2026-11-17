import { Request, Response, Router } from 'express';
import { pool } from '../db/dbconfig';

export const healthRouter = Router();

// Liveness probe - returns 200 when service process is running
healthRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'flowport-api',
      status: 'ok',
      version: '1.1.0',
      uptime: Math.floor(process.uptime()),
    },
  });
});

// Readiness probe - checks real database connectivity
healthRouter.get('/ready', async (_req: Request, res: Response) => {
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({
      success: false,
      error: {
        message: 'Database connection unavailable',
      },
      data: {
        service: 'flowport-api',
        status: 'unready',
        database: { status: 'unavailable' },
      },
    });
  }

  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    const latencyMs = Date.now() - start;

    return res.status(200).json({
      success: true,
      data: {
        service: 'flowport-api',
        status: 'ready',
        version: '1.1.0',
        database: {
          status: 'connected',
          latencyMs,
        },
      },
    });
  } catch (err: unknown) {
    return res.status(503).json({
      success: false,
      error: {
        message: 'Database connection failed',
      },
      data: {
        service: 'flowport-api',
        status: 'unready',
        database: { status: 'unavailable' },
      },
    });
  }
});
