import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { NotificationService } from '@/lib/services/notification.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const result = await NotificationService.getByUser(session.userId, session.schoolId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { id, readAll } = await req.json();

    if (readAll) {
      await NotificationService.markAllAsRead(session.userId, session.schoolId);
      return NextResponse.json({ success: true });
    }

    if (!id) throw new ApiError('Notification ID is required', 400);
    const result = await NotificationService.markAsRead(id, session.userId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
