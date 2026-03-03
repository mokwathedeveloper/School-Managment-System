import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { TimetableService } from '@/lib/services/timetable.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    const result = await TimetableService.getByClass(tenantId, params.classId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
