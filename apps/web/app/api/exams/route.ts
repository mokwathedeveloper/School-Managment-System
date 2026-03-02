import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { ExamsService } from '@/lib/services/exams.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createExamSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  term_id: z.string().min(1, 'Term ID is required'),
  subject_id: z.string().min(1, 'Subject ID is required'),
  date: z.string().transform(str => new Date(str)),
  max_marks: z.number().int().min(1).default(100),
  grading_system_id: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await ExamsService.findOne(session.schoolId, id);
      if (!result) throw new ApiError('Exam not found', 404);
      return NextResponse.json(result);
    }

    const result = await ExamsService.findAll(session.schoolId);
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
    const validated = createExamSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }

    const result = await ExamsService.create(session.schoolId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
