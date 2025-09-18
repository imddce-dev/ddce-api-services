import { cors } from 'hono/cors';
export const coreMiddleware = cors({
    origin: ['http://localhost:8000',process.env.WEBSITE_URL].filter((url): url is string => typeof url === 'string' && url.length > 0),
    allowHeaders: [
        'Content-Type',
        'X-CSRF-Token', 
        'X-Custom-Header',
        'Upgrade-Insecure-Requests'
    ],
    allowMethods: [ 
        'POST',
        'GET',
        'PUT',
        'DELETE',
        'OPTIONS'
    ],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
});