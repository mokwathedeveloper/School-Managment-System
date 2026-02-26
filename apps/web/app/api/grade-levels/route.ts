import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { GradeLevelsService } from '@/lib/services/grade-levels.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await GradeLevelsService.findOne(session.schoolId, id);
      return NextResponse.json(result);
    }

    const result = await GradeLevelsService.findAll(session.schoolId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
