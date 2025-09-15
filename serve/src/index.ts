
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import * as userController from './controllers/user.controller';
import * as authController from './controllers/auth.controller';
import { db } from './configs/mysql';
import { DrizzleDB } from './configs/type';
import { sql } from 'drizzle-orm';
import { connectRedis, getRedisClient } from './configs/redis';
import { contextMiddleware } from './middlewares/context.middleware';
import { coreMiddleware } from './middlewares/core.middleware';
import { secureHeadersMiddleware } from './middlewares/secure-headers.middleware';
import *  as rateLimited from './middlewares/rate-limit.middleware';
import { verifyCsrf } from './middlewares/csrf.middleware';
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
    app.use('api/app/*', verifyCsrf);
    app.use('*', secureHeadersMiddleware);
    app.use('*', rateLimiterMiddleware); 
    app.use('*', coreMiddleware);
    app.use('*', contextMiddleware);
     
    const application = app.basePath('api/app');
    application.get('/health', (c) => c.json({ status: 'ok' }));
    application.get('/', (c) => c.json({ message: 'Welcome to the API service' }));

    const api = app.basePath('api/users');
    api.get('/get',userController.getAllUsers);
    api.post('/createusr',rateLimited.createAuthRateLimiter(), userController.createUser);
    api.delete('/:id', userController.removeUser);
    api.put('/:id', userController.editUser);
    api.get('/getusr/:username', userController.getuserByusername);
    api.post('/login',rateLimited.createAuthRateLimiter(),authController.login);
    api.post('/logout',rateLimited.createAuthRateLimiter(), authController.Logout);
    api.post('/refresh',authController.RefreshToken)

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

