import 'dotenv/config';
import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import { pool } from './db/dbconfig';
import { errorHandler } from './middleware/errorHandler';
import { healthRouter } from './routes/health';

export const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/v1/health', healthRouter);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'flowport-api',
    version: '1.1.0',
    health: '/api/v1/health',
  });
});

// 404 Catch-All
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' },
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Server startup (only when not in test mode)
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`FlowPort backend running on port ${PORT}`);
  });

  const shutdown = async () => {
    console.log('Shutting down FlowPort backend...');
    server.close(async () => {
      try {
        await pool.end();
        console.log('Database pool closed cleanly.');
      } catch (err) {
        console.error('Error closing database pool:', err);
      }
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
