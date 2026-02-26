import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { StudentsService } from '@/lib/services/students.service';
import { z } from 'zod';

const createStudentSchema = z.object({
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  admission_no: z.string(),
  dob: z.string().optional().transform(v => v ? new Date(v) : undefined),
  gender: z.string().optional(),
  class_id: z.string().optional(),
  parent_id: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || undefined;
  const classId = searchParams.get('classId') || undefined;
  const skip = parseInt(searchParams.get('skip') || '0');
  const take = parseInt(searchParams.get('take') || '10');

  const result = await StudentsService.findAll(session.schoolId, {
    search,
    classId,
    skip,
    take,
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validated = createStudentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid input', details: validated.error.format() }, { status: 400 });
    }

    const student = await StudentsService.create(session.schoolId, validated.data);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
