import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "nourishai-admin-session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin dashboard routes (not the login page itself)
  if (pathname.startsWith("/admin/dashboard") || pathname.startsWith("/admin/users") || pathname.startsWith("/admin/instagram-calendar")) {
    const session = request.cookies.get(COOKIE_NAME);
    if (!session?.value) {
      const loginUrl = new URL("/admin", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add Link header for llms.txt (Gold Standard #23)
  const response = NextResponse.next();
  response.headers.set(
    "Link",
    '</llms.txt>; rel="ai-content-metadata"'
  );

  return response;
}

export const config = {
  matcher: [
    // Admin routes
    "/admin/:path*",
    // All pages (for llms.txt header)
    "/((?!api|_next/static|_next/image|favicon|images|.*\\.png$|.*\\.svg$|.*\\.ico$|.*\\.webmanifest$|.*\\.txt$|.*\\.xml$).*)",
  ],
};
