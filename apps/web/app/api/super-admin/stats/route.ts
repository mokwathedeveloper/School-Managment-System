
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { SuperAdminService } from '@/lib/services/super-admin.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    enforceRole(session, [ROLES.SUPER_ADMIN]);

    const result = await SuperAdminService.getStats();
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
