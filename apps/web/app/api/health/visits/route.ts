import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
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
    if (!session) throw new ApiError('Unauthorized', 401);
    
    const result = await HealthService.getVisits(session.schoolId);
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
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN' && session.role !== 'STAFF') {
        throw new ApiError('Forbidden: Only staff members can record health visits.', 403);
    }
    
    const body = await req.json();
    const validated = createVisitSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await HealthService.create(session.schoolId, validated.data, session.userId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
