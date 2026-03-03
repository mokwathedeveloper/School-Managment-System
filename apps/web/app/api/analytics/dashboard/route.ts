
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { AnalyticsService } from '@/lib/services/analytics.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const result = await AnalyticsService.getDashboardStats(
      session.role === 'SUPER_ADMIN' ? null : session.schoolId
    );
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
