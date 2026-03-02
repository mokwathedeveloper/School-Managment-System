import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // Define public vs private route sets
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/login');

  // 1. Redirect unauthenticated users away from dashboard
  if (isDashboardRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Optional: save the intended destination to redirect back after login
    // loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect authenticated users away from auth pages (login)
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. Multi-tenancy logic (tenant resolution)
  const schoolIdFromHeader = request.headers.get('x-school-id');
  const response = NextResponse.next();
  
  if (schoolIdFromHeader) {
    response.headers.set('x-tenant-id', schoolIdFromHeader);
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (handled by backend or separate middleware)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};
