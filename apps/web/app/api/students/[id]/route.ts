import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { StudentsService } from '@/lib/services/students.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const updateStudentSchema = z.object({
  admission_no: z.string().optional(),
  dob: z.string().optional().transform(v => v ? new Date(v) : undefined),
  gender: z.string().optional(),
  class_id: z.string().optional(),
  parent_id: z.string().optional(),
  user: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email().optional(),
  }).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const student = await StudentsService.findOne(session.schoolId, params.id);
    if (!student) throw new ApiError('Student not found', 404);

    return NextResponse.json(student);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only staff/admin can update student records
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN' && session.role !== 'STAFF') {
        throw new ApiError('Forbidden: Only staff members can update student records.', 403);
    }
    
    const body = await req.json();
    const validated = updateStudentSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    // Convert to Prisma update format
    const { user, ...studentData } = validated.data;
    
    const updateData: any = {
        ...studentData,
        ...(user && {
            user: {
                update: user
            }
        })
    };

    const student = await StudentsService.update(session.schoolId, params.id, updateData);

    return NextResponse.json(student);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only admin can delete students
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN') {
        throw new ApiError('Forbidden: Only admins can delete student records.', 403);
    }

    await StudentsService.remove(session.schoolId, params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
