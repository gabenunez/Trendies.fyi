import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api-private/")) {
    if (
      request.headers.get("internal-secret") !==
      process.env.SVT_INTERNAL_REQUEST_SECRET
    )
      return NextResponse.json(
        { error: true, message: "Authentication failed, who are you? 🤔" },
        { status: 401 }
      );
  }

  if (request.nextUrl.pathname === "/") {
    const requestHeaders = new Headers(request.headers);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.headers.set("x-request-url", request.url);
    return response;
  }

  return NextResponse.next();
}
