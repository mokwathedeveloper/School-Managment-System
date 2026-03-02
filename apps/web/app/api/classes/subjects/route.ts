import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import prisma from '@/lib/db/prisma';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createSubjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const subjects = await prisma.subject.findMany({
      where: { school_id: session.schoolId },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(subjects);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only admin/staff can create subjects
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN') {
        throw new ApiError('Forbidden: Only admins can create subjects.', 403);
    }
    
    const body = await req.json();
    const validated = createSubjectSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const subject = await prisma.subject.create({
      data: {
        ...validated.data,
        school_id: session.schoolId
      }
    });
    
    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
