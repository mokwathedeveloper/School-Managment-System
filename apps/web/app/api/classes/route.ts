import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { ClassesService } from '@/lib/services/classes.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  grade_id: z.string().uuid('Invalid grade ID'),
  term_id: z.string().uuid().optional(),
  form_teacher_id: z.string().uuid().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await ClassesService.findOne(tenantId, id);
      if (!result) throw new ApiError('Class not found', 404);
      return NextResponse.json(result);
    }

    const result = await ClassesService.findAll(tenantId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only Admin/SuperAdmin/HeadTeacher can create classes
    enforceRole(session, ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER']);

    const body = await req.json();
    const validated = createClassSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }

    const result = await ClassesService.create(tenantId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
