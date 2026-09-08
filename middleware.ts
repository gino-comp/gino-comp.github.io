import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/ko", request.url));
  }
  const locale = pathname.split("/")[1];
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-ridm-locale", locale === "en" ? "en" : "ko");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/).*)"]
};
