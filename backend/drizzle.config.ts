import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

const connectionString =
  process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL || '';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
  verbose: true,
  strict: true,
});
