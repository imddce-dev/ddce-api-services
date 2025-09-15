import { createMiddleware } from 'hono/factory'; 
import { verifyHmacToken } from '../utils/hmactoken'
export const verifyCsrf = createMiddleware(async (c, next) => {
  const csrfKey = process.env.CSRF_KEY
  if(!csrfKey){
    console.error('CSRF_KEY is not configured on the server.');
    return c.json({ message: 'Server configuration error' }, 500);
  }
  const headerToken = c.req.header('x-csrf-token');
  if(!headerToken) {
    return c.json({ message:'CSRF Token not found in header' }, 403);
  }
  const isValid = verifyHmacToken(csrfKey, headerToken)
  if(!isValid){
    return c.json({message: 'Invalid CSRF Token'}, 403)
  }
  await next();
});