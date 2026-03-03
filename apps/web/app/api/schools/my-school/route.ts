
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { SchoolsService } from '@/lib/services/schools.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !session.schoolId) {
      throw new ApiError('Unauthorized', 401);
    }

    const school = await SchoolsService.findOne(session.schoolId);
    if (!school) {
      throw new ApiError('School not found', 404);
    }

    return NextResponse.json(school);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !session.schoolId) {
      throw new ApiError('Unauthorized', 401);
    }

    enforceRole(session, ROLE_GROUPS.ADMIN);

    const body = await req.json();
    const updatedSchool = await SchoolsService.update(session.schoolId, body);

    return NextResponse.json(updatedSchool);
  } catch (error) {
    return handleApiError(error);
  }
}
