import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import prisma from '@/lib/db/prisma';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const subjects = await prisma.subject.findMany({
      where: { school_id: session.schoolId },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(subjects);
  } catch (error) {
    return handleApiError(error);
  }
}
