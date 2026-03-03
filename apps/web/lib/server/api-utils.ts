import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  public fieldErrors?: Record<string, string[]>;
  constructor(public message: string, public status: number = 400, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return NextResponse.json({ 
      success: false, 
      message: 'Validation failed', 
      fieldErrors: error.flatten().fieldErrors 
    }, { status: 400 });
  }
  
  if (error instanceof ApiError) {
    return NextResponse.json({ 
      success: false, 
      message: error.message,
      fieldErrors: error.fieldErrors
    }, { status: error.status });
  }

  return NextResponse.json({ 
    success: false, 
    message: error instanceof Error ? error.message : 'Internal Server Error' 
  }, { status: 500 });
}

export function getTenantId(req: NextRequest) {
  const schoolId = req.headers.get('x-school-id');
  if (schoolId) return schoolId;
  return null;
}

