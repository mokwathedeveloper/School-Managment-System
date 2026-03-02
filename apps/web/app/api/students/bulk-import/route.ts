
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { StudentsService } from '@/lib/services/students.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const body = await req.json();
    if (!body.students || !Array.isArray(body.students)) {
      throw new ApiError('Students data is required', 400);
    }

    const result = await StudentsService.bulkImport(session.schoolId, body.students);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
