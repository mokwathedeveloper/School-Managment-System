import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { LmsService } from '@/lib/services/lms.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';

const createAssignmentSchema = z.object({
  class_id: z.string(),
  subject_id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  due_date: z.string().transform(v => new Date(v)),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const body = await req.json();
    const validated = createAssignmentSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input', 400);
    }

    let subjectId = validated.data.subject_id;
    if (!subjectId) {
      let defaultSubject = await prisma.subject.findFirst({
        where: { school_id: session.schoolId }
      });
      if (!defaultSubject) {
        defaultSubject = await prisma.subject.create({
          data: { name: 'General', school_id: session.schoolId }
        });
      }
      subjectId = defaultSubject.id;
    }

    const result = await LmsService.createAssignment(session.schoolId, {
      ...validated.data,
      subject_id: subjectId
    });
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
