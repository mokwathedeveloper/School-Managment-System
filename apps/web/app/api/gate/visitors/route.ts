import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { SecurityService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createVisitorSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  id_number: z.string().optional().or(z.literal('')),
  purpose: z.string().optional().or(z.literal('')),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    const result = await SecurityService.getVisitors(session.schoolId);
    return NextResponse.json(result);
  } catch (error) { 
    return handleApiError(error); 
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // Only Admin/Staff can manage visitors
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN' && session.role !== 'STAFF') {
        throw new ApiError('Forbidden: Only authorized staff members can register visitors.', 403);
    }
    
    const body = await req.json();
    const validated = createVisitorSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await SecurityService.createVisitor(session.schoolId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
