import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { FinanceService } from '@/lib/services/finance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const stkPushSchema = z.object({
  invoice_id: z.string().min(1),
  phone_number: z.string().min(10),
  amount: z.number().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;

    const body = await req.json();
    const validated = stkPushSchema.safeParse(body);
    
    if (!validated.success) {
        throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }

    const result = await FinanceService.initiateStkPush(tenantId, {
        phone: validated.data.phone_number,
        amount: validated.data.amount,
        invoiceId: validated.data.invoice_id
    });
    
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
