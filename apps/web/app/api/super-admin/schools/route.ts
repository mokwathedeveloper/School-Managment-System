import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { SuperAdminService } from '@/lib/services/super-admin.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const onboardSchoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  email: z.string().email('Invalid institutional email'),
  adminFirstName: z.string().min(1, 'Admin first name is required'),
  adminLastName: z.string().min(1, 'Admin last name is required'),
  adminEmail: z.string().email('Invalid admin email'),
  temporalPassword: z.string().min(6, 'Temporal password must be at least 6 characters'),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    enforceRole(session, [ROLES.SUPER_ADMIN]);

    const result = await SuperAdminService.getSchools();
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    enforceRole(session, [ROLES.SUPER_ADMIN]);

    const body = await req.json();
    const validated = onboardSchoolSchema.safeParse(body);
    
    if (!validated.success) { throw validated.error; }

    const result = await SuperAdminService.onboardSchool(validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
