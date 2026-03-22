import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

  const userCookie = req.cookies.get("user");

  if (!userCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = JSON.parse(userCookie.value);

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

// ✅ PUT IT HERE (same file, below middleware function)
export const config = {
  matcher: ["/admin/:path*"]
};