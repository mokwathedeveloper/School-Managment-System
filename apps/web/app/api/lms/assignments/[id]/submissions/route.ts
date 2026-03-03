import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { LmsService } from '@/lib/services/lms.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);
    
    // Check if staff
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN' && session.role !== 'TEACHER' && session.role !== 'STAFF') {
        throw new ApiError('Forbidden: Only staff can view submissions', 403);
    }

    const result = await LmsService.getSubmissions(params.id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
