import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { TimetableService } from '@/lib/services/timetable.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { pathname } = new URL(req.url);

    if (pathname.endsWith('/rooms')) {
      const result = await TimetableService.getRooms(session.schoolId);
      return NextResponse.json(result);
    }

    throw new ApiError('Not found', 404);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { pathname } = new URL(req.url);
    const body = await req.json();

    if (pathname.endsWith('/rooms')) {
      const result = await TimetableService.createRoom(session.schoolId, body);
      return NextResponse.json(result, { status: 201 });
    }

    const result = await TimetableService.createSlot(session.schoolId, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
