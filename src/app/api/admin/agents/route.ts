import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/db';
import { agentApplications } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { getCurrentUserRole } from '@/lib/auth';

export async function GET(_req: NextRequest) {
  const auth = await getCurrentUserRole();
  if (!auth || !['ADMIN', 'SUPERADMIN'].includes(auth.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const applications = await db
    .select()
    .from(agentApplications)
    .orderBy(desc(agentApplications.createdAt));

  return NextResponse.json({ applications });
}
