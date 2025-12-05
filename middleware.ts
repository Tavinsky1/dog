import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { addSecurityHeaders } from "@/lib/security";

// Force NEXTAUTH_URL to production domain on Vercel
if (process.env.VERCEL && !process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = 'https://www.dog-atlas.com'
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Create response
  let response = NextResponse.next();

  // Add security headers to all responses
  response = addSecurityHeaders(response);

  // Special handling for API routes
  if (url.pathname.startsWith("/api/")) {
    // Add CORS headers for API routes
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3004');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers });
    }
  }

  // Admin route protection
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/admin")) {
    // Allow through - auth check happens in route handlers
    return response;
  }

  // Mod route protection
  if (url.pathname.startsWith("/mod") || url.pathname.startsWith("/api/mod")) {
    // Allow through - auth check happens in route handlers
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes handled above)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

// Real auth: in the mod pages and API we’ll check session + role (see below).
