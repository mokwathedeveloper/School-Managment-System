import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
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
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // Check role here if needed
    
    const result = await ConductService.findAll(session.schoolId);
    return NextResponse.json(result);
  } catch (error) { 
    return handleApiError(error); 
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // Only Staff/Admins can report conduct issues
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN' && session.role !== 'STAFF') {
        throw new ApiError('Forbidden: Only staff members can record discipline events.', 403);
    }
    
    const body = await req.json();
    const validated = createConductRecordSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input', 400);
    }
    
    const result = await ConductService.create(session.schoolId, validated.data, session.userId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
