import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { SecurityService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { visitId: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    const result = await SecurityService.checkOut(session.schoolId, params.visitId);
    return NextResponse.json(result);
  } catch (error) { return handleApiError(error); }
}
