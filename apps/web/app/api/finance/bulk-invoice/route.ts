import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { FinanceService } from '@/lib/services/finance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const body = await req.json();
    const { grade_id, term_id } = body;

    if (!grade_id || !term_id) {
      throw new ApiError('Grade ID and Term ID are required', 400);
    }

    const result = await FinanceService.generateBulkInvoices(session.schoolId, grade_id, term_id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
