import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { AttendanceService } from '@/lib/services/attendance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const markAttendanceSchema = z.object({
  class_id: z.string(),
  date: z.string().transform(v => new Date(v)),
  records: z.array(z.object({
    student_id: z.string(),
    status: z.string(),
    remarks: z.string().optional(),
  })),
});

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

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const body = await req.json();
    const validated = markAttendanceSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input', 400);
    }

    const result = await AttendanceService.markAttendance({
      school_id: session.schoolId,
      ...validated.data,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
