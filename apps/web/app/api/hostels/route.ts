import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { HostelsService } from '@/lib/services/hostels.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createHostelSchema = z.object({
  name: z.string().min(1, 'Hostel name is required'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  type: z.enum(['BOYS', 'GIRLS', 'MIXED']).default('MIXED'),
  warden_id: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const result = await HostelsService.findAll(session.schoolId);
    return NextResponse.json(result);
  } catch (error) { 
    return handleApiError(error); 
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    const body = await req.json();
    const validated = createHostelSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await HostelsService.create(session.schoolId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
