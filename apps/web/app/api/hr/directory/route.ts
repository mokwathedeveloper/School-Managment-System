import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { StaffService } from '@/lib/services/staff.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createStaffSchema = z.object({
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().optional().or(z.literal('')),
  id_number: z.string().optional().or(z.literal('')),
  base_salary: z.number().min(0).optional(),
  role: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;

    const result = await StaffService.findAll(tenantId, { search });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only Admin/SuperAdmin/HeadTeacher can add staff
    enforceRole(session, ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER']);
    
    const body = await req.json();
    const validated = createStaffSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await StaffService.create(tenantId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
