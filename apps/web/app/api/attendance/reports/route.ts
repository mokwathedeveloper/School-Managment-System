import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { AttendanceService } from '@/lib/services/attendance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only Admin/Staff can view reports
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN' && session.role !== 'STAFF') {
        throw new ApiError('Forbidden', 403);
    }

    const result = await AttendanceService.getReport(session.schoolId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
