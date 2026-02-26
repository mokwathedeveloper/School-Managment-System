import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { FinanceService } from '@/lib/services/finance.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const createInvoiceSchema = z.object({
  student_id: z.string().uuid(),
  title: z.string().min(1),
  amount: z.number().positive(),
  due_date: z.string().transform(v => new Date(v)),
  items: z.any().optional(),
});

const recordExpenseSchema = z.object({
  title: z.string().min(1),
  category: z.string(),
  amount: z.number().positive(),
  date: z.string().transform(v => new Date(v)),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (type === 'expenses') {
      const result = await FinanceService.getExpenses(session.schoolId);
      return NextResponse.json(result);
    }

    const result = await FinanceService.findAll(session.schoolId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const body = await req.json();

    if (type === 'expense') {
      const validated = recordExpenseSchema.safeParse(body);
      if (!validated.success) throw new ApiError('Invalid input', 400);
      
      const result = await FinanceService.recordExpense(session.schoolId, session.userId, validated.data);
      return NextResponse.json(result, { status: 201 });
    }

    const validated = createInvoiceSchema.safeParse(body);
    if (!validated.success) throw new ApiError('Invalid input', 400);

    const result = await FinanceService.createInvoice({
      ...validated.data,
      school_id: session.schoolId,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
