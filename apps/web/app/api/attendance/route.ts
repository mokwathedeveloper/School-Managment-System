import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { AttendanceService } from '@/lib/services/attendance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const classId = searchParams.get('classId');

    if (!date || !classId) throw new ApiError('Date and classId are required', 400);

    const result = await AttendanceService.getAttendance(
      session.schoolId,
      classId,
      new Date(date)
    );

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
