import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { InventoryService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createAssetSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  category: z.string().min(1, 'Category is required'),
  serial_no: z.string().optional().or(z.literal('')),
  purchase_date: z.string().optional().transform(v => v ? new Date(v) : undefined),
  cost: z.number().optional(),
  status: z.enum(['OPERATIONAL', 'UNDER_REPAIR', 'RETIRED', 'LOST']).default('OPERATIONAL'),
  location: z.string().optional().or(z.literal('')),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    const result = await InventoryService.getAssets(session.schoolId);
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
    const validated = createAssetSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await InventoryService.createAsset(session.schoolId, validated.data);
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
    
    await InventoryService.removeAsset(session.schoolId, id);
    return NextResponse.json({ success: true });
  } catch (error) { 
    return handleApiError(error); 
  }
}
