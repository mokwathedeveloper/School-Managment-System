
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { StaffService } from '@/lib/services/staff.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const processPayrollSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    const body = await req.json();
    const validated = processPayrollSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input', 400);
    }

    const result = await StaffService.processPayroll(
      tenantId,
      validated.data.month,
      validated.data.year
    );

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
