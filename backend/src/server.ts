import http from 'http';
import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { closeDatabase, getDatabasePool } from './db';

const server = http.createServer(app);

function startServer(): void {
  // Pre-initialize pool connection if DATABASE_URL is configured
  getDatabasePool();

  server.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        env: env.NODE_ENV,
        health: `http://localhost:${env.PORT}/api/v1/health`,
        ready: `http://localhost:${env.PORT}/api/v1/health/ready`,
        docs: `http://localhost:${env.PORT}/api/docs`,
      },
      'FlowPort Backend Server initialized and listening'
    );
  });
}

// Graceful Shutdown
let isShuttingDown = false;

async function handleShutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;
  logger.info({ signal }, 'Termination signal received. Initiating graceful shutdown...');

  // Force exit timeout after 10s if graceful shutdown hangs
  const forceExitTimeout = setTimeout(() => {
    logger.error('Graceful shutdown timed out. Forcing process exit.');
    process.exit(1);
  }, 10000);
  forceExitTimeout.unref();

  server.close(async (err) => {
    if (err) {
      logger.error({ err }, 'Error during HTTP server close');
    } else {
      logger.info('HTTP server closed cleanly.');
    }

    try {
      await closeDatabase();
    } catch (dbErr) {
      logger.error({ dbErr }, 'Error closing database pool during shutdown');
    }

    clearTimeout(forceExitTimeout);
    logger.info('FlowPort backend shutdown complete.');
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception occurred. Shutting down process.');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'Unhandled promise rejection occurred. Shutting down process.');
  process.exit(1);
});

startServer();
