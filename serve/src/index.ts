
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import * as userController from './controllers/user.controller';
import * as authController from './controllers/auth.controller';
import * as orgController from './controllers/org.controller'
import * as apiController from './controllers/api.controller'
import { db } from './configs/mysql';
import { DrizzleDB } from './configs/type';
import { sql } from 'drizzle-orm';
import { connectRedis, getRedisClient } from './configs/redis';
import { contextMiddleware } from './middlewares/context.middleware';
import { coreMiddleware } from './middlewares/core.middleware';
import { secureHeadersMiddleware } from './middlewares/secure-headers.middleware';
import *  as rateLimited from './middlewares/rate-limit.middleware';
import { verifyCsrf } from './middlewares/csrf.middleware';
import { authMiddleware } from './middlewares/auth.middleware'
type AppContext = {
  Variables: {
    db: DrizzleDB;
    redis: ReturnType<typeof getRedisClient>;
  }
}
const app = new Hono<AppContext>();
const main = async () => {
  try {
    console.log('Connecting to MySQL and Redis...');
    await Promise.all([
      db.execute(sql`select 1`),
      connectRedis()
    ]);
    console.log('MySQL and Redis connected successfully.');
    const rateLimiterMiddleware = rateLimited.createRateLimiter();

    app.use('*', secureHeadersMiddleware);
    app.use('*', rateLimiterMiddleware); 
    app.use('*', coreMiddleware);
    app.use('*', contextMiddleware);
     
  
    const auth = app.basePath('api/auth/')
    auth.post('login', rateLimited.createAuthRateLimiter(), authController.login);
    auth.post('logout', authMiddleware, verifyCsrf, authController.Logout);
    auth.post('refresh', verifyCsrf, authController.RefreshToken);
    auth.get('profile', authMiddleware, authController.GetuserByToken);
    auth.post('verifyjti',authMiddleware,authController.VerifyJti);


    const options = app.basePath('api/options/')
    options.post('api-request',apiController.creatApiReq)


    const application = app.basePath('api/');
    application.get('org', orgController.getOrg);

    const userApi = app.basePath('api/users');
    userApi.use('*',rateLimited.createAuthRateLimiter())
    userApi.post('/createusr', userController.createUser);
  
    const port = parseInt(process.env.SERVER_PORT || '8080');
    serve({
      fetch: app.fetch,
      port: port,
    });
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error('Could not start the server:', error);
    process.exit(1);
  }
};
main();
export default app;

