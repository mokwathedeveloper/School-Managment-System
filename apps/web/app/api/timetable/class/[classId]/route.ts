import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { TimetableService } from '@/lib/services/timetable.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const result = await TimetableService.getByClass(session.schoolId, params.classId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
