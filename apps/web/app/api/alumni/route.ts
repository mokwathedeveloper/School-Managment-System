import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { AlumniService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createAlumnusSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  graduation_year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  current_occupation: z.string().optional().or(z.literal('')),
  employer: z.string().optional().or(z.literal('')),
  university: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // In a real application, you might add pagination here
    const result = await AlumniService.findAll(session.schoolId);
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
    const validated = createAlumnusSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input', 400);
    }
    
    const result = await AlumniService.create(session.schoolId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
