import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { TimetableService } from '@/lib/services/timetable.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  capacity: z.number().int().min(1).optional(),
});

const createSlotSchema = z.object({
  class_id: z.string().min(1, 'Class ID is required'),
  subject_id: z.string().min(1, 'Subject ID is required'),
  teacher_id: z.string().optional(),
  room_id: z.string().optional(),
  day_of_week: z.number().int().min(0).max(6),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;

    const { pathname } = new URL(req.url);

    if (pathname.endsWith('/rooms')) {
      const result = await TimetableService.getRooms(tenantId);
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
    const tenantId = enforceTenant(session) as string;
    if (!session) throw new ApiError('Unauthorized', 401);

    const { pathname } = new URL(req.url);
    const body = await req.json();

    if (pathname.endsWith('/rooms')) {
      const validated = createRoomSchema.safeParse(body);
      if (!validated.success) throw new ApiError('Invalid input: ' + validated.error.message, 400);
      
      const result = await TimetableService.createRoom(tenantId, validated.data);
      return NextResponse.json(result, { status: 201 });
    }

    const validated = createSlotSchema.safeParse(body);
    if (!validated.success) throw new ApiError('Invalid input: ' + validated.error.message, 400);

    const result = await TimetableService.createSlot(tenantId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
