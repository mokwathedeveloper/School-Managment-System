import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { HostelsService } from '@/lib/services/hostels.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const result = await HostelsService.findAll(session.schoolId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
