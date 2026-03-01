
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { ExamsService } from '@/lib/services/exams.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const exam = await ExamsService.findOne(session.schoolId, params.id);
    if (!exam) throw new ApiError('Exam not found', 404);

    return NextResponse.json(exam.results);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { records } = await req.json();
    if (!records || !Array.isArray(records)) {
      throw new ApiError('Records are required', 400);
    }

    const result = await ExamsService.saveResults(session.schoolId, params.id, records);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
