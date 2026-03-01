
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { AdmissionsService } from '@/lib/services/admissions.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const result = await AdmissionsService.findAll(session.schoolId, status);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
