import { NextRequest, NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(public message: string, public status: number = 400) {
    super(message);
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

export function getTenantId(req: NextRequest) {
  // Support X-School-Id header or custom subdomain
  const schoolId = req.headers.get('x-school-id');
  if (schoolId) return schoolId;

  const host = req.headers.get('host');
  // Simple subdomain logic if needed: school1.example.com -> school1 (as slug)
  // For now, we primarily rely on JWT session schoolId or header
  return null;
}

export function checkRole(session: any, allowedRoles: string[]) {
  if (!session || !allowedRoles.includes(session.role)) {
    throw new ApiError('Forbidden: Insufficient permissions', 403);
  }
}
