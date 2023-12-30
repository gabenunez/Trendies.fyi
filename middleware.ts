import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(
    Number(process.env.RATE_LIMIT_AMOUNT_OF_REQUESTS),
    process.env.RATE_LIMIT_REQUESTS_DURATION ?? "10 s"
  ),
});

export async function middleware(request: NextRequest) {
  const requestIP = request.ip ?? "127.0.0.1";

  if (request.nextUrl.pathname.startsWith("/api-private/")) {
    if (
      request.headers.get("internal-secret") !==
      process.env.SVT_INTERNAL_REQUEST_SECRET
    ) {
      const { success } = await ratelimit.limit(requestIP);

      if (!success) {
        return NextResponse.json({ error: "Rate limited." }, { status: 429 });
      }

      return NextResponse.json(
        { error: true, message: "Authentication failed, who are you? 🤔" },
        { status: 401 }
      );
    }
  }

  if (request.nextUrl.pathname.startsWith("/api-public/")) {
    const { success } = await ratelimit.limit(requestIP);

    if (!success) {
      return NextResponse.json({ error: "Rate limited." }, { status: 429 });
    }
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
