import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { InventoryService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    const result = await InventoryService.getStock(session.schoolId);
    return NextResponse.json(result);
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    const body = await req.json();
    const result = await InventoryService.createStock(session.schoolId, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { return handleApiError(error); }
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
  } catch (error) { return handleApiError(error); }
}
