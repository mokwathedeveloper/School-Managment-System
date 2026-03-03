import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { FinanceService } from '@/lib/services/finance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;

    const result = await FinanceService.getTerms(tenantId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
