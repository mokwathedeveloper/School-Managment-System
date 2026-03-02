import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { LibraryService } from '@/lib/services/library.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createBorrowSchema = z.object({
  barcode: z.string().min(1, 'Barcode is required'),
  student_id: z.string().min(1, 'Student ID is required'),
  due_date: z.string().transform(v => new Date(v)),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    const body = await req.json();
    const validated = createBorrowSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await LibraryService.createBorrow(session.schoolId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
