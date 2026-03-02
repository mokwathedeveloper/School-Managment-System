import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { LmsService } from '@/lib/services/lms.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';

const createAssignmentSchema = z.object({
  class_id: z.string().min(1, 'Class ID is required'),
  subject_id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  due_date: z.string().transform(v => new Date(v)),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    // If student, return assignments for their class
    if (session.role === 'STUDENT') {
        const student = await prisma.student.findUnique({
            where: { user_id: session.userId }
        });
        if (!student?.class_id) return NextResponse.json([]);
        
        const result = await LmsService.getAssignmentsByClass(session.schoolId, student.class_id);
        return NextResponse.json(result);
    }

    // Otherwise return all for the school (simplified for staff)
    const result = await prisma.assignment.findMany({
        where: { school_id: session.schoolId },
        include: { subject: true, class: true },
        orderBy: { created_at: 'desc' }
    });
    
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only staff can create assignments
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN' && session.role !== 'STAFF' && session.role !== 'TEACHER') {
        throw new ApiError('Forbidden: Only staff members can create assignments.', 403);
    }

    const body = await req.json();
    const validated = createAssignmentSchema.safeParse(body);

    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
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
