import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { AdmissionsService } from '@/lib/services/admissions.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only admin/staff can update admission status
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN' && session.role !== 'STAFF') {
        throw new ApiError('Forbidden: Only staff members can update application status.', 403);
    }
    
    const body = await req.json();
    const validated = updateStatusSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await AdmissionsService.updateStatus(
        session.schoolId, 
        params.id, 
        validated.data.status
    );
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
