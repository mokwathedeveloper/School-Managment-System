import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { FinanceService } from '@/lib/services/finance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createFeeStructureSchema = z.object({
  grade_id: z.string().min(1, 'Grade ID is required'),
  term_id: z.string().min(1, 'Term ID is required'),
  items: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    amount: z.number().min(0, 'Amount must be non-negative'),
  })).min(1, 'At least one fee item is required'),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    const result = await FinanceService.getFeeStructures(tenantId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only admin/accountant can manage fee structures
    enforceRole(session, ROLE_GROUPS.STAFF);

    const body = await req.json();
    const validated = createFeeStructureSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }
    
    const result = await FinanceService.createFeeStructure(tenantId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
