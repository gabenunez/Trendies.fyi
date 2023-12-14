import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (
    request.headers.get("internal-secret") !==
    process.env.SVT_INTERNAL_REQUEST_SECRET
  )
    return NextResponse.json(
      { error: true, message: "Authentication failed, who are you? 🤔" },
      { status: 401 }
    );
}

export const config = {
  matcher: "/api/:path*",
};
