
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
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
    if (!session) throw new ApiError('Unauthorized', 401);

    const body = await req.json();
    const validated = processPayrollSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input', 400);
    }

    const result = await StaffService.processPayroll(
      session.schoolId,
      validated.data.month,
      validated.data.year
    );

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
