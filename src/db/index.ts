import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Server-only — DATABASE_URL is never exposed to the browser
const connectionString = process.env.DATABASE_URL!;

// prepare: false is required for Supabase's connection pooler.
// max: 1 keeps connection count low in serverless/edge environments.
const client = postgres(connectionString, {
  prepare: false,
  max: 1,
});

export const db = drizzle(client, { schema });
