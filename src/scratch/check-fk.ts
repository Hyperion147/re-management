import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

async function check() {
  const sql = postgres(dbUrl!);
  const userId = 'f4528f7b-9798-4ae8-a204-f28b1a83115c';
  
  const user = await sql`SELECT * FROM users WHERE id = ${userId}`;
  console.log('User in users table:', user);
  
  if (user.length === 0) {
    console.log('User NOT found. This will cause a foreign key violation.');
  }
  
  process.exit(0);
}

check().catch(console.error);
