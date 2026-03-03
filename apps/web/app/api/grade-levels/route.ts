import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { GradeLevelsService } from '@/lib/services/grade-levels.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createGradeLevelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  level: z.number().int().min(0),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await GradeLevelsService.findOne(tenantId, id);
      if (!result) throw new ApiError('Grade level not found', 404);
      return NextResponse.json(result);
    }

    const result = await GradeLevelsService.findAll(tenantId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only Admin/SuperAdmin/HeadTeacher can configure grade levels
    enforceRole(session, ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER']);

    const body = await req.json();
    const validated = createGradeLevelSchema.safeParse(body);

    if (!validated.success) { throw validated.error; }

    const result = await GradeLevelsService.create(tenantId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
