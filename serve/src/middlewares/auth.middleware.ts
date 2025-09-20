import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { jwtVerify, JWTPayload } from 'jose';
export type UserPayload = {
    userId: string;
    organizer: boolean;
    jti: string;
} & JWTPayload;

export const authMiddleware = createMiddleware<{ Variables: { user: UserPayload } }>(
    async (c, next) => {
        const accessToken = getCookie(c, 'accessToken');
        if (!accessToken) {
            return c.json({ 
                success: false, 
                message: 'Unauthorized: Access Token is missing' 
            }, 401);
        }
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            if (!secret) {
                throw new Error("JWT_SECRET is not configured on the server.");
            }
            const { payload } = await jwtVerify<UserPayload>(accessToken, secret);
            c.set('user', payload);

            await next();

        } catch (error) {
            console.error('Auth Middleware Error:');
            return c.json({ 
                success: false, 
                message: 'Unauthorized: Invalid or expired token' 
            }, 401);
        }
    }
);