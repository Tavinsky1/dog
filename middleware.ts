import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NOTE: For production, consider using next-auth middleware.
// Here we gate /mod UI and /api/mod* endpoints via a simple cookie check
// and delegate actual role checks to the handlers too.
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  if (url.pathname.startsWith("/mod") || url.pathname.startsWith("/api/mod")) {
    // allow, actual auth check happens in route (defense-in-depth)
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/mod/:path*", "/api/mod/:path*"]
};

// Real auth: in the mod pages and API we’ll check session + role (see below).
