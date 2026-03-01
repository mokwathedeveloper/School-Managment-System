import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { MessagingService } from '@/lib/services/messaging.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    const body = await req.json();
    const result = await MessagingService.broadcastAnnouncement(session.schoolId, body);
    return NextResponse.json(result);
  } catch (error) { return handleApiError(error); }
}
