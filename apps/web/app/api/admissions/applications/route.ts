import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { AdmissionsService } from '@/lib/services/admissions.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only Admin/Staff can view applications
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN' && session.role !== 'STAFF') {
        throw new ApiError('Forbidden: Only authorized staff members can view applications.', 403);
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const result = await AdmissionsService.findAll(session.schoolId, status);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
