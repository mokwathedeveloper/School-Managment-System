import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
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
    const tenantId = enforceTenant(session) as string;

    const subjects = await prisma.subject.findMany({
      where: { school_id: tenantId },
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
    const tenantId = enforceTenant(session) as string;
    
    // RBAC: Only admin/staff can create subjects
    enforceRole(session, ROLE_GROUPS.ADMIN);
    
    const body = await req.json();
    const validated = createSubjectSchema.safeParse(body);
    
    if (!validated.success) { throw validated.error; }
    
    const subject = await prisma.subject.create({
      data: {
        ...validated.data,
        school_id: tenantId
      }
    });
    
    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
