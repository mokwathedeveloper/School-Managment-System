
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { AcademicsService } from '@/lib/services/academics.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const termId = searchParams.get('termId');
    if (!termId) throw new ApiError('termId is required', 400);

    const result = await AcademicsService.getStudentReport(session.schoolId, params.id, termId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
