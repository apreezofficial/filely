import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define protected routes
    const isProtectedRoute = pathname.startsWith('/dashboard');

    // Check for auth cookie (simple mock auth)
    const authToken = request.cookies.get('auth_token');

    if (isProtectedRoute && !authToken) {
        // Redirect to login page if trying to access protected route without token
        const loginUrl = new URL('/auth/login', request.url);
        // Optional: add a redirect parameter to return here after login
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/dashboard/:path*'],
};
