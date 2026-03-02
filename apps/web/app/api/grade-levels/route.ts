import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
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
    if (!session) throw new ApiError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await GradeLevelsService.findOne(session.schoolId, id);
      if (!result) throw new ApiError('Grade level not found', 404);
      return NextResponse.json(result);
    }

    const result = await GradeLevelsService.findAll(session.schoolId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only Admin can configure grade levels
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN') {
        throw new ApiError('Forbidden: Only admins can configure grade levels.', 403);
    }

    const body = await req.json();
    const validated = createGradeLevelSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }

    const result = await GradeLevelsService.create(session.schoolId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
