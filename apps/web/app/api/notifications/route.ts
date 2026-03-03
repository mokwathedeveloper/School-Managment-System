import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { NotificationService } from '@/lib/services/notification.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    const result = await NotificationService.getByUser(session.userId, tenantId);
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
      await NotificationService.markAllAsRead(session.userId, tenantId);
      return NextResponse.json({ success: true });
    }

    if (!id) throw new ApiError('Notification ID is required', 400);
    const result = await NotificationService.markAsRead(id, session.userId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
