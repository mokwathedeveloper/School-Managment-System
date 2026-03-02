import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { SuperAdminService } from '@/lib/services/super-admin.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const onboardSchoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  email: z.string().email('Invalid institutional email'),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== 'SUPER_ADMIN') {
      throw new ApiError('Forbidden: Super Admin access required', 403);
    }

    const result = await SuperAdminService.getSchools();
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== 'SUPER_ADMIN') {
      throw new ApiError('Forbidden: Super Admin access required', 403);
    }

    const body = await req.json();
    const validated = onboardSchoolSchema.safeParse(body);
    
    if (!validated.success) {
        throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }

    const result = await SuperAdminService.onboardSchool(validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
