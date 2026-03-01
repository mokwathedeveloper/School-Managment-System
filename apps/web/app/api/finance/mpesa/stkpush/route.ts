
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { FinanceService } from '@/lib/services/finance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const body = await req.json();
    if (!body.invoice_id || !body.phone_number) {
      throw new ApiError('Invoice ID and Phone Number are required', 400);
    }

    const result = await FinanceService.initiateStkPush(session.schoolId, body);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
