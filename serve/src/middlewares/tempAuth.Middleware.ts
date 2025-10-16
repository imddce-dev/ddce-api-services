import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { jwtVerify, JWTPayload } from 'jose';
import { JWTPayloadTemp } from '../utils/authToken';

export const tempAuthMiddleware = createMiddleware<{ Variables: { tempAuth: JWTPayloadTemp } }>(
    async (c, next) => {
        const tempAuthToken = getCookie(c, 'token_temp');
        if (!tempAuthToken) {
            return c.json({
                success: false,
                message: 'Unauthorized: Temp Auth Token is missing'
            },401)
        }
        try{
            const secretEnv = process.env.JWT_SECRET;
            if (!secretEnv) throw new Error("JWT_SECRET is not configured.");
            const secret = new TextEncoder().encode(secretEnv);

            const { payload } = await jwtVerify<JWTPayloadTemp>(tempAuthToken, secret);
            c.set('tempAuth', payload);
            await next();
        }catch(error  : any){
             if (error?.code === 'ERR_JWT_EXPIRED') {
                return c.json({
                success: false,
                message: 'Token expired. Please verify OTP again.',
                }, 401);
            }
            console.error('Temp Auth Middleware Error:', error);
            return c.json({
                success: false,
                message: 'Unauthorized: Invalid token',
            }, 401);
                    }

})
        