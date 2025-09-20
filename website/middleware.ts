import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from 'jose';
import * as authModel from "@/services/authervice"; 

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
        const loginUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(accessToken, secret); 

        const jti = payload.jti;

        if (!jti || typeof jti !== 'string') {
            throw new Error("JTI not found in token");
        }
        const baseURL =  process.env.NEXT_PUBLIC_API_URL || '/api'
        const verifyUrl = new URL(baseURL+"/auth/verifyjti", request.url);
        const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
            'Cookie': `accessToken=${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jti: jti }),
    });
    if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
    }
    const data = await response.json(); 
    if (data.success) {
        return NextResponse.next();
    }
    throw new Error("Token verification failed (success: false)");

} catch (error) {
    console.error("Middleware Error:");
    const loginUrl = new URL('/auth/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('accessToken');
    return response;
}
}

export const config = {
    matcher: ['/dashboard/:path*'],
};