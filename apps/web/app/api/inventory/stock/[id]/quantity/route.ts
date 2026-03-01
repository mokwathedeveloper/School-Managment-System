import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { InventoryService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    const { change } = await req.json();
    const result = await InventoryService.updateStockQuantity(session.schoolId, params.id, change);
    return NextResponse.json(result);
  } catch (error) { return handleApiError(error); }
}
