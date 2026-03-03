import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { ParentsService } from '@/lib/services/parents.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createParentSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;

    const result = await ParentsService.findAll(tenantId, { search });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    // Only Admin/HeadTeacher/Deputy can register parents
    enforceRole(session, ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER']);

    const body = await req.json();
    const validated = createParentSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }

    const result = await ParentsService.create(tenantId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
