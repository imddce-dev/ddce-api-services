import { MiddlewareHandler } from 'hono';
import { db } from '../configs/mysql';
import { getRedisClient } from '../configs/redis'; 
export const contextMiddleware: MiddlewareHandler /* <AppContext> */ = async (c, next) => {
  c.set('db', db);
  c.set('redis', getRedisClient()); 
  await next();
};