import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      console.log("[Middleware] No accessToken cookie found");
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error("[Middleware] JWT_SECRET not set in environment");
      throw new Error("JWT_SECRET not configured");
    }
    const secret = new TextEncoder().encode(secretKey);

    // ✅ ตรวจสอบ JWT อย่างเดียว ไม่ต้อง verify jti
    await jwtVerify(accessToken, secret);

    console.log("[Middleware] Token verified successfully");
    return NextResponse.next();

  } catch (error: any) {
    console.error("[Middleware Error]", error.message);

    const loginUrl = new URL("/auth/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("accessToken");
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
