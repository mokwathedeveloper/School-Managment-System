import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { TransportService } from '@/lib/services/transport.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const result = await TransportService.getRoutes(session.schoolId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
