import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { LmsService } from '@/lib/services/lms.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';

const submitAssignmentSchema = z.object({
  assignment_id: z.string().min(1, 'Assignment ID is required'),
  content: z.string().optional(),
  file_url: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    // Only students can submit
    if (session.role !== 'STUDENT') {
        throw new ApiError('Forbidden: Only students can submit assignments', 403);
    }

    const body = await req.json();
    const validated = submitAssignmentSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }

    // Find student ID linked to this user
    const student = await prisma.student.findUnique({
      where: { user_id: session.userId }
    });

    if (!student) throw new ApiError('Student profile not found', 404);

    const result = await LmsService.submitAssignment(
        student.id, 
        validated.data.assignment_id, 
        {
            content: validated.data.content,
            file_url: validated.data.file_url
        }
    );
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
