import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { TransportService } from '@/lib/services/transport.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createVehicleSchema = z.object({
  plate_number: z.string().min(1, 'Plate number is required'),
  model: z.string().optional().or(z.literal('')),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  driver_id: z.string().optional(),
  route_id: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;

    const result = await TransportService.getVehicles(tenantId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;
    if (!session) throw new ApiError('Unauthorized', 401);

    const body = await req.json();
    const validated = createVehicleSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await TransportService.createVehicle(tenantId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
