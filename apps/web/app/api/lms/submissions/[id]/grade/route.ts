import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { LmsService } from '@/lib/services/lms.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';

const gradeSchema = z.object({
  grade: z.number().min(0),
  feedback: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;

    // Only staff can grade
    if (session!.role !== 'SUPER_ADMIN' && session!.role !== 'ADMIN' && session!.role !== 'TEACHER' && session!.role !== 'STAFF') {
        throw new ApiError('Forbidden: Only staff can grade submissions', 403);
    }

    const body = await req.json();
    const validated = gradeSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }

    // Find staff ID linked to this user
    const staff = await prisma.staff.findUnique({
      where: { user_id: session!.userId }
    });

    if (!staff) throw new ApiError('Staff profile not found', 404);

    const result = await LmsService.gradeSubmission(
        params.id, 
        staff.id, 
        validated.data
    );
    
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
