import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';
import { Pool } from 'pg';

dotenv.config();

async function runMigrations(): Promise<void> {
  const connectionString =
    process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    // eslint-disable-next-line no-console
    console.error(
      'CRITICAL: DIRECT_DATABASE_URL or DATABASE_URL must be configured to run migrations.'
    );
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log('Executing Drizzle migrations against Neon PostgreSQL...');

  const pool = new Pool({
    connectionString,
    max: 1,
    ssl: { rejectUnauthorized: true },
  });

  const db = drizzle(pool);

  try {
    const migrationsFolder = path.resolve(process.cwd(), 'drizzle');
    await migrate(db, { migrationsFolder });
    // eslint-disable-next-line no-console
    console.log('Drizzle migrations applied successfully.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Migration execution failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
