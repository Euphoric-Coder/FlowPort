import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './dbconfig';

async function runMigrate(): Promise<void> {
  const conn = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  if (!conn) {
    console.error('DIRECT_DATABASE_URL or DATABASE_URL is required for migrations');
    process.exit(1);
  }

  console.log('Applying migrations to Neon PostgreSQL...');
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrate();
