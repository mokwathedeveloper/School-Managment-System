import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { CalendarService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    if (!start || !end) throw new ApiError('Start and end dates are required', 400);
    const result = await CalendarService.getEvents(session.schoolId, new Date(start), new Date(end));
    return NextResponse.json(result);
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    const body = await req.json();
    const result = await CalendarService.create(session.schoolId, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
