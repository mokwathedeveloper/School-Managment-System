
import { NextRequest, NextResponse } from 'next/server';
import { AdmissionsService } from '@/lib/services/admissions.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const applicationSchema = z.object({
  school_id: z.string().uuid(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  applied_grade_id: z.string().uuid(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = applicationSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid application data', 400);
    }

    const result = await AdmissionsService.create(validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
