import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { StaffService } from '@/lib/services/staff.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';

const processPayrollSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get('month') || '');
    const year = parseInt(searchParams.get('year') || '');

    if (isNaN(month) || isNaN(year)) {
        // Return recent payroll records
        const result = await prisma.payrollRecord.findMany({
            where: { school_id: session.schoolId },
            include: { staff: { include: { user: true } } },
            orderBy: { created_at: 'desc' },
            take: 50
        });
        return NextResponse.json(result);
    }

    const result = await prisma.payrollRecord.findMany({
      where: { school_id: session.schoolId, month, year },
      include: { staff: { include: { user: true } } },
    });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      throw new ApiError('Forbidden', 403);
    }

    const body = await req.json();
    const validated = processPayrollSchema.safeParse(body);
    if (!validated.success) throw new ApiError('Invalid input', 400);

    const result = await StaffService.processPayroll(
        session.schoolId, 
        validated.data.month, 
        validated.data.year
    );
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
