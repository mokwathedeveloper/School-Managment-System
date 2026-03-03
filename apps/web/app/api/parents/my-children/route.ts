import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { ParentsService } from '@/lib/services/parents.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;

    const children = await ParentsService.getChildren(session!.userId);
    return NextResponse.json(children);
  } catch (error) {
    return handleApiError(error);
  }
}
