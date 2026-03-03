import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { LibraryService } from '@/lib/services/library.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().optional().or(z.literal('')),
  isbn: z.string().optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    const result = await LibraryService.getCatalog(tenantId);
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
    const validated = createBookSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await LibraryService.createBook(tenantId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
