import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

async function checkUser() {
  const userId = 'f4528f7b-9798-4ae8-a204-f28b1a83115c';
  const user = await db.select().from(users).where(eq(users.id, userId));
  console.log('User:', user);
}

checkUser().catch(console.error);
