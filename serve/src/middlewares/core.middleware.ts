import { cors } from 'hono/cors';

export const coreMiddleware = cors({
    origin:['http://localhost:3000', process.env.WEBSITE_URL || ''],
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
})