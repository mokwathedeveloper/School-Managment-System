import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { LibraryService } from '@/lib/services/library.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    const body = await req.json();
    const result = await LibraryService.createBorrow(session.schoolId, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
