import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { InventoryService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const updateQuantitySchema = z.object({
  change: z.number().int('Change must be an integer'),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    const body = await req.json();
    const validated = updateQuantitySchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await InventoryService.updateStockQuantity(
        session.schoolId, 
        params.id, 
        validated.data.change
    );
    return NextResponse.json(result);
  } catch (error) { 
    return handleApiError(error); 
  }
}
