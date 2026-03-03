import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
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
    const tenantId = enforceTenant(session) as string;
    
    const body = await req.json();
    const validated = updateQuantitySchema.safeParse(body);
    
    if (!validated.success) { throw validated.error; }
    
    const result = await InventoryService.updateStockQuantity(
        tenantId, 
        params.id, 
        validated.data.change
    );
    return NextResponse.json(result);
  } catch (error) { 
    return handleApiError(error); 
  }
}
