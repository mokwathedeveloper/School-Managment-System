
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { AcademicsService } from '@/lib/services/academics.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    const { searchParams } = new URL(req.url);
    const termId = searchParams.get('termId');
    if (!termId) throw new ApiError('termId is required', 400);

    const result = await AcademicsService.getStudentReport(tenantId, params.id, termId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
