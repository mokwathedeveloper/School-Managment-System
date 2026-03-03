import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { HealthService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createVisitSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
  symptoms: z.string().min(1, 'Symptoms are required'),
  diagnosis: z.string().optional().or(z.literal('')),
  visit_date: z.string().transform(v => new Date(v)),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);
    
    const result = await HealthService.getVisits(tenantId);
    return NextResponse.json(result);
  } catch (error) { 
    return handleApiError(error); 
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only staff/admin can record health visits
    enforceRole(session, ROLE_GROUPS.STAFF);
    
    const body = await req.json();
    const validated = createVisitSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await HealthService.create(tenantId, validated.data, session.userId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
