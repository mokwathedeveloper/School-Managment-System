import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
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
    if (!session) throw new ApiError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await ClassesService.findOne(session.schoolId, id);
      if (!result) throw new ApiError('Class not found', 404);
      return NextResponse.json(result);
    }

    const result = await ClassesService.findAll(session.schoolId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only Admin/SuperAdmin can create classes
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN') {
        throw new ApiError('Forbidden: Only admins can create classes.', 403);
    }

    const body = await req.json();
    const validated = createClassSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }

    const result = await ClassesService.create(session.schoolId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
