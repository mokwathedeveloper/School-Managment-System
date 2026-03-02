import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { AttendanceService } from '@/lib/services/attendance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const markAttendanceSchema = z.object({
  class_id: z.string().min(1, 'Class ID is required'),
  date: z.string().transform(v => new Date(v)),
  records: z.array(z.object({
    student_id: z.string().min(1, 'Student ID is required'),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    remarks: z.string().optional().or(z.literal('')),
  })).min(1, 'Attendance records cannot be empty'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    // RBAC: Only admin or staff (teachers) can mark attendance
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN' && session.role !== 'STAFF') {
        throw new ApiError('Forbidden: Only staff members can record attendance.', 403);
    }

    const body = await req.json();
    const validated = markAttendanceSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
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
