import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { SecurityService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);
    const result = await SecurityService.getActiveVisits(tenantId);
    return NextResponse.json(result);
  } catch (error) { return handleApiError(error); }
}
