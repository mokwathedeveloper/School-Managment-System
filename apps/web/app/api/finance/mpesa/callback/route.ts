
import { NextRequest, NextResponse } from 'next/server';
import { FinanceService } from '@/lib/services/finance.service';
import { handleApiError } from '@/lib/server/api-utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('M-Pesa Callback Received:', JSON.stringify(body, null, 2));
    
    await FinanceService.handleMpesaCallback(body);
    
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    // Safaricom doesn't care about our error format, but we log it
    console.error('Callback processing failed:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Error" });
  }
}
