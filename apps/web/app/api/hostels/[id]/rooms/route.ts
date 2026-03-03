import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { HostelsService } from '@/lib/services/hostels.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createRoomSchema = z.object({
  room_number: z.string().min(1, 'Room number is required'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;

    const result = await HostelsService.getRooms(tenantId, params.id);
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
    const tenantId = enforceTenant(session) as string;
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only Admin/Staff can manage hostel rooms
    enforceRole(session, ROLE_GROUPS.STAFF);

    const body = await req.json();
    const validated = createRoomSchema.safeParse(body);
    
    if (!validated.success) { throw validated.error; }

    const result = await HostelsService.createRoom(tenantId, params.id, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
