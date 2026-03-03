import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { ConductService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createConductRecordSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().or(z.literal('')),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('LOW'),
  action_taken: z.string().optional().or(z.literal('')),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;
    
    // Check role here if needed
    
    const result = await ConductService.findAll(tenantId);
    return NextResponse.json(result);
  } catch (error) { 
    return handleApiError(error); 
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;
    
    // Only Staff/Admins can report conduct issues
    enforceRole(session, ROLE_GROUPS.STAFF);
    
    const body = await req.json();
    const validated = createConductRecordSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input', 400);
    }
    
    const result = await ConductService.create(tenantId, validated.data, session!.userId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
