import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { StaffService } from '@/lib/services/staff.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';

const leaveRequestSchema = z.object({
  type: z.enum(['SICK', 'ANNUAL', 'MATERNITY', 'PATERNITY', 'OTHER']),
  start_date: z.string().transform(v => new Date(v)),
  end_date: z.string().transform(v => new Date(v)),
  reason: z.string().optional(),
});

const updateLeaveSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    // If staff, might only want to see their own? For now return all for admins/staff view
    const result = await StaffService.getLeaves(tenantId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const staff = await prisma.staff.findUnique({ where: { user_id: session.userId } });
    if (!staff) throw new ApiError('Only staff members can request leave', 403);

    const body = await req.json();
    const validated = leaveRequestSchema.safeParse(body);
    if (!validated.success) throw new ApiError('Invalid input', 400);

    const result = await StaffService.requestLeave(tenantId, staff.id, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    // Only Admin/SuperAdmin can approve/reject
    if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
        throw new ApiError('Forbidden', 403);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) throw new ApiError('Leave ID required', 400);

    const body = await req.json();
    const validated = updateLeaveSchema.safeParse(body);
    if (!validated.success) throw new ApiError('Invalid input', 400);

    const result = await StaffService.updateLeaveStatus(tenantId, id, validated.data.status);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
