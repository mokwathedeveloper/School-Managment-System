import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { CalendarService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().or(z.literal('')),
  start_date: z.string().transform(str => new Date(str)),
  end_date: z.string().transform(str => new Date(str)),
  category: z.enum(['ACADEMIC', 'HOLIDAY', 'SPORTS', 'EXAM', 'OTHER']).default('OTHER'),
  is_all_day: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    
    if (!start || !end) {
      throw new ApiError('Start and end dates are required', 400);
    }
    
    const result = await CalendarService.getEvents(
      session.schoolId, 
      new Date(start), 
      new Date(end)
    );
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
    const validated = createEventSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input', 400);
    }
    
    // Validate date logic
    if (validated.data.start_date > validated.data.end_date) {
      throw new ApiError('End date must be after start date', 400);
    }
    
    const result = await CalendarService.create(session.schoolId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
