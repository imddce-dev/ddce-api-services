import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie'; 

export const verifyCsrf = createMiddleware(async (c, next) => {
  const cookieToken = getCookie(c, 'csrf_token');
  const headerToken = c.req.header('x-csrf-token');
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return c.json({ message: 'Invalid CSRF Token' }, 403);
  }

  await next();
});