import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
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
    const tenantId = enforceTenant(session) as string;
    
    const body = await req.json();
    const validated = createBorrowSchema.safeParse(body);
    
    if (!validated.success) { throw validated.error; }
    
    const result = await LibraryService.createBorrow(tenantId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
