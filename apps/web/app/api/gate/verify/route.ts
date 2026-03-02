
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { StudentsService } from '@/lib/services/students.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) throw new ApiError('ID/Admission Number is required', 400);

    const student = await StudentsService.findByAdmissionNo(session.schoolId, id);
    if (!student) {
        return NextResponse.json({ verified: false, message: 'No student found with this admission number.' });
    }

    return NextResponse.json({
        verified: true,
        student: {
            name: `${student.user.first_name} ${student.user.last_name}`,
            class: `${student.class?.grade.name} ${student.class?.name}`,
            admissionNo: student.admission_no
        }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
