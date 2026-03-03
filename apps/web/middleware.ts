import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { canAccessRoute } from './lib/authz';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // Define public vs private route sets
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/login');

  // 1. Redirect unauthenticated users away from dashboard
  if (isDashboardRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect authenticated users away from auth pages (login)
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. Dashboard Route Isolation
  if (isDashboardRoute && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-change-in-production');
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role as string;
      
      if (!canAccessRoute(userRole, pathname)) {
        // User does not have permission for this specific dashboard route
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (e) {
      // Invalid token
      request.cookies.delete('access_token');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 4. Multi-tenancy logic (tenant resolution)
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
