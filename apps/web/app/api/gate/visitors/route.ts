import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { SecurityService } from '@/lib/services/extended.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    const result = await SecurityService.getVisitors(session.schoolId);
    return NextResponse.json(result);
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    const body = await req.json();
    const result = await SecurityService.createVisitor(session.schoolId, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
