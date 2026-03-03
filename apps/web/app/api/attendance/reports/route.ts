import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { AttendanceService } from '@/lib/services/attendance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);
    
    // RBAC: Only Admin/Staff can view reports
    enforceRole(session, ROLE_GROUPS.STAFF);

    const result = await AttendanceService.getReport(tenantId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
