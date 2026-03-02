import { NextRequest, NextResponse } from 'next/server';
import { FinanceService } from '@/lib/services/finance.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const stk = body.Body?.stkCallback;
    
    if (!stk) {
        return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid Payload" });
    }
    
    await FinanceService.handleMpesaCallback(
        stk.CheckoutRequestID, 
        stk.ResultCode, 
        stk.CallbackMetadata || {}
    );
    
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error('M-Pesa Callback processing failed:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Error" });
  }
}
