import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { InventoryService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createStockSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().int().min(0).default(0),
  min_quantity: z.number().int().min(0).default(5),
  unit: z.string().min(1, 'Unit is required'),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    const result = await InventoryService.getStock(session.schoolId);
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
    const validated = createStockSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await InventoryService.createStock(session.schoolId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) throw new ApiError('ID is required', 400);
    
    await InventoryService.removeStock(session.schoolId, id);
    return NextResponse.json({ success: true });
  } catch (error) { 
    return handleApiError(error); 
  }
}
