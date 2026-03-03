import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { AttendanceService } from '@/lib/services/attendance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    if (!dateStr) throw new ApiError('Date is required', 400);

    const date = new Date(dateStr);
    const result = await AttendanceService.getAttendance(tenantId, params.classId, date);
    
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
