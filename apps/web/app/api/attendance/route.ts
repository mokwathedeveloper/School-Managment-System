import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { AttendanceService } from '@/lib/services/attendance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const classId = searchParams.get('classId');

    if (date && classId) {
      const result = await AttendanceService.getAttendance(
        tenantId,
        classId,
        new Date(date)
      );
      return NextResponse.json(result);
    }

    const result = await AttendanceService.findAll(tenantId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
