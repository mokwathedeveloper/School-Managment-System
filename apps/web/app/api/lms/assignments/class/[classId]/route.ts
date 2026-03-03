import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { LmsService } from '@/lib/services/lms.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;

    const result = await LmsService.getAssignmentsByClass(tenantId, params.classId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
