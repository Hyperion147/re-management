import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agentApplications } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, email, phone,
      licenseNumber, licenseState, brokerageName, mlsId,
      services,
      zipCode, radiusMiles, willingToTravel,
      availableDays, acceptSameDay,
      photoUrl,
      bio, specialties, languages, yearsOfExperience,
    } = body;

    if (!fullName || !email || !phone || !licenseNumber || !licenseState || !brokerageName || !zipCode) {
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
      zipCode,
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

    return NextResponse.json({ success: true, id: application.id });
  } catch (err) {
    console.error('Agent apply error:', err);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
