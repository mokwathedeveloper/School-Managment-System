import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { StudentsService } from '@/lib/services/students.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createStudentSchema = z.object({
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  admission_no: z.string(),
  dob: z.string().optional().transform(v => v ? new Date(v) : undefined),
  gender: z.string().optional(),
  class_id: z.string().optional(),
  parent_id: z.string().optional(),
  password: z.string().min(6).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const classId = searchParams.get('classId') || undefined;
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');

    const result = await StudentsService.findAll(tenantId, {
      search,
      classId,
      skip,
      take,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const body = await req.json();
    const validated = createStudentSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input', 400);
    }

    const student = await StudentsService.create(tenantId, validated.data);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
