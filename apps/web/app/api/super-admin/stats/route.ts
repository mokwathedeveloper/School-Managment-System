
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { SuperAdminService } from '@/lib/services/super-admin.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== 'SUPER_ADMIN') {
      throw new ApiError('Forbidden', 403);
    }

    const result = await SuperAdminService.getStats();
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
