import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { AdmissionsService } from '@/lib/services/admissions.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;
    
    // RBAC: Only Admin/Staff can view applications
    enforceRole(session, ROLE_GROUPS.STAFF);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const result = await AdmissionsService.findAll(tenantId, status);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
