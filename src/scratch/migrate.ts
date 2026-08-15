import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

async function migrate() {
  const sql = postgres(dbUrl!);
  
  console.log('Adding client_name...');
  await sql`ALTER TABLE "requests" ADD COLUMN IF NOT EXISTS "client_name" text;`;
  
  console.log('Adding client_phone...');
  await sql`ALTER TABLE "requests" ADD COLUMN IF NOT EXISTS "client_phone" text;`;
  
  console.log('Adding additional_notes...');
  await sql`ALTER TABLE "requests" ADD COLUMN IF NOT EXISTS "additional_notes" text;`;
  
  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
