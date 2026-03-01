
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { AdmissionsService } from '@/lib/services/admissions.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { status } = await req.json();
    if (!status) throw new ApiError('Status is required', 400);

    const result = await AdmissionsService.updateStatus(session.schoolId, params.id, status);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
