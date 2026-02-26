import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Example tenant resolution logic:
  // 1. Check for custom header (e.g., x-school-id)
  // 2. Fallback to subdomain (e.g., school1.example.com)
  
  const schoolIdFromHeader = request.headers.get('x-school-id');
  
  // For now, we'll just pass through, but this is where we'd inject 
  // tenant info into headers or cookies if needed for public routes.
  // Private routes already resolve schoolId via JWT in getSession().
  
  const response = NextResponse.next();
  
  if (schoolIdFromHeader) {
    response.headers.set('x-tenant-id', schoolIdFromHeader);
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
