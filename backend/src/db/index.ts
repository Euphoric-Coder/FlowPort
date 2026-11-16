import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';
import { env } from '../config/env';
import { logger } from '../config/logger';
import * as schema from './schema';

let pool: Pool | null = null;
let db: NodePgDatabase<typeof schema> | null = null;

export function getDatabasePool(): Pool | null {
  if (pool) {
    return pool;
  }

  if (!env.DATABASE_URL) {
    logger.warn('DATABASE_URL is not set. Database client is not initialized.');
    return null;
  }

  const poolConfig: PoolConfig = {
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: {
      rejectUnauthorized: true,
    },
  };

  pool = new Pool(poolConfig);

  pool.on('error', (err) => {
    logger.error({ err }, 'Unexpected idle client error in PostgreSQL connection pool');
  });

  return pool;
}

export function getDb(): NodePgDatabase<typeof schema> | null {
  if (db) {
    return db;
  }

  const activePool = getDatabasePool();
  if (!activePool) {
    return null;
  }

  db = drizzle(activePool, { schema });
  return db;
}

export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  latencyMs?: number;
  error?: string;
}> {
  const activePool = getDatabasePool();
  if (!activePool) {
    return {
      connected: false,
      error: 'DATABASE_URL is not configured',
    };
  }

  const start = Date.now();
  let client;
  try {
    client = await activePool.connect();
    await client.query('SELECT 1');
    const latencyMs = Date.now() - start;
    return {
      connected: true,
      latencyMs,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown database connection error';
    logger.error({ err }, 'Database health check failed');
    return {
      connected: false,
      error: 'Database connection check failed',
    };
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    try {
      await pool.end();
      logger.info('PostgreSQL connection pool closed cleanly.');
    } catch (err) {
      logger.error({ err }, 'Error closing PostgreSQL connection pool');
    } finally {
      pool = null;
      db = null;
    }
  }
}

export { schema };
