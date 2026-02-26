import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { ClassesService } from '@/lib/services/classes.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createClassSchema = z.object({
  name: z.string().min(1),
  grade_id: z.string().uuid(),
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

    const body = await req.json();
    const validated = createClassSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input', 400);
    }

    const result = await ClassesService.create(session.schoolId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
