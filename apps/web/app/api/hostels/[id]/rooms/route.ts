import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { HostelsService } from '@/lib/services/hostels.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const result = await HostelsService.getRooms(session.schoolId, params.id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    const body = await req.json();
    const result = await HostelsService.createRoom(session.schoolId, params.id, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
