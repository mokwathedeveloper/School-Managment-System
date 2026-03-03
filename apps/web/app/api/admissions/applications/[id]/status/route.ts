import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
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
    const tenantId = enforceTenant(session) as string;
    
    // RBAC: Only admin/staff can update admission status
    enforceRole(session, ROLE_GROUPS.STAFF);
    
    const body = await req.json();
    const validated = updateStatusSchema.safeParse(body);
    
    if (!validated.success) { throw validated.error; }
    
    const result = await AdmissionsService.updateStatus(
        tenantId, 
        params.id, 
        validated.data.status
    );
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
