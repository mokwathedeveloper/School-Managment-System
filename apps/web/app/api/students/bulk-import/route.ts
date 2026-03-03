
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { StudentsService } from '@/lib/services/students.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    const body = await req.json();
    if (!body.students || !Array.isArray(body.students)) {
      throw new ApiError('Students data is required', 400);
    }

    const result = await StudentsService.bulkImport(tenantId, body.students);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
