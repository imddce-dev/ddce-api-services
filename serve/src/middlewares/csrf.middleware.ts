
import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie'; 
import { verifyHmacToken } from '../utils/hmactoken';

export const verifyCsrf = createMiddleware(async (c, next) => {
  const csrfKey = process.env.CSRF_KEY;
  if (!csrfKey) {
    console.error('CSRF_KEY is not configured on the server.');
    return c.json({ message: 'Server configuration error' }, 500);
  }

  const headerToken = c.req.header('x-csrf-token');
  const cookieToken = getCookie(c, 'csrf_token'); 

  if (!headerToken || !cookieToken) {
    return c.json({ message: 'CSRF Token missing from header or cookie' }, 403);
  }

  if (headerToken !== cookieToken) {
    return c.json({ message: 'CSRF Token mismatch' }, 403);
  }

  const isValid = verifyHmacToken(csrfKey, headerToken);
  if (!isValid) {
    return c.json({ message: 'Invalid CSRF Token' }, 403);
  }

  await next();
});