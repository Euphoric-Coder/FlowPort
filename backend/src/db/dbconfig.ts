import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  max: 5,
  connectionTimeoutMillis: 10000,
  ssl: connectionString ? { rejectUnauthorized: true } : undefined,
});

export const db = drizzle(pool, { schema });
