import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agentApplications } from '@/db/schema';
import { sendAgentApplicationReceivedEmail, sendAdminNewApplicationAlert } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, email, phone,
      licenseNumber, licenseState, brokerageName, mlsId,
      services,
      // accept both 'zip' (legacy form field) and 'zipCode'
      zip, zipCode,
      radiusMiles, willingToTravel,
      availableDays, acceptSameDay,
      photoUrl,
      bio, specialties, languages, yearsOfExperience,
    } = body;

    const resolvedZip = zipCode ?? zip ?? '';

    if (!fullName || !email || !phone || !licenseNumber || !licenseState || !brokerageName || !resolvedZip) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [application] = await db.insert(agentApplications).values({
      fullName,
      email,
      phone,
      licenseNumber,
      licenseState,
      brokerageName,
      mlsId: mlsId || null,
      services: services || [],
      zipCode: resolvedZip,
      radiusMiles: radiusMiles || 25,
      willingToTravel: willingToTravel || false,
      availableDays: availableDays || [],
      acceptSameDay: acceptSameDay || false,
      photoUrl: photoUrl || null,
      bio: bio || null,
      specialties: specialties || [],
      languages: languages || null,
      yearsOfExperience: yearsOfExperience || null,
      status: 'PENDING',
    }).returning();

    // Send emails — fire-and-forget, never block the response
    Promise.all([
      sendAgentApplicationReceivedEmail(email, fullName),
      sendAdminNewApplicationAlert(fullName, email, services || []),
    ]).catch(err => console.error('[Email] Failed to send application emails:', err));

    return NextResponse.json({ success: true, id: application.id });
  } catch (err) {
    console.error('Agent apply error:', err);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
