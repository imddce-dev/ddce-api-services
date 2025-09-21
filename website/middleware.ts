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

    
    const { payload } = await jwtVerify(accessToken, secret);

    const jti = payload.jti;
    if (!jti || typeof jti !== "string") {
      throw new Error("JTI not found in token payload");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_HONO_URL;
    const verifyUrl = new URL("/api/auth/verifyjti", baseURL);
    console.log("[Middleware] Fetching token verification:", verifyUrl.toString());

    const response = await fetch(verifyUrl.toString(),{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `accessToken=${accessToken}`, 
      },
      body: JSON.stringify({ jti }),
    });
     console.log(response)
    if (!response.ok) {
      console.error(`[Middleware] API responded with status ${response.status}`);
      const text = await response.text();
      console.error("[Middleware] API response text:", text);
      throw new Error("API verification failed");
    }

    const data = await response.json();
    if (data.success) {
      console.log("[Middleware] Token verified successfully");
      return NextResponse.next();
    }

    console.error("[Middleware] Token verification returned success=false");
    throw new Error("Token verification failed");

  } catch (error: any) {
    console.error("[Middleware Error]", error.message);

    const loginUrl = new URL("/auth/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("accessToken");
    return response;
  }
}

// 7️⃣ กำหนด matcher สำหรับ middleware
export const config = {
  matcher: ["/dashboard/:path*"],
};
