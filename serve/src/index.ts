
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import * as userController from './controllers/user.controller';
import * as authController from './controllers/auth.controller';
import * as orgController from './controllers/org.controller'
import * as apiController from './controllers/api.controller'
import * as otpController from './controllers/otp.controller'
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
import { tempAuthMiddleware } from './middlewares/tempAuth.Middleware';


type AppContext = {
  Variables: {
    db: DrizzleDB;
    redis: ReturnType<typeof getRedisClient>;
  }
}
const app = new Hono<AppContext>();
const main = async () => {
  try {
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
     
  
    const auth = app.basePath('web-api/auth/')
    auth.post('login', rateLimited.createAuthRateLimiter(), authController.login);
    auth.post('logout', authMiddleware, verifyCsrf, authController.Logout);
    auth.post('refresh', verifyCsrf, authController.RefreshToken);
    auth.get('profile', authMiddleware, authController.GetuserByToken);
    auth.post('verifyjti',authMiddleware,authController.VerifyJti);


    const options = app.basePath('web-api/options/')
    options.post('api-request',authMiddleware,apiController.creatApiReq)
    options.get('api-request/:id',authMiddleware,apiController.EvenApiByID)
    options.get('api-request',authMiddleware,apiController.FetchEventApi)
    options.put('api-request',authMiddleware,apiController.updateDataRequest)
    options.put('approve-request',authMiddleware,apiController.updatStatusApi)
    options.delete('api-request/:id',authMiddleware,apiController.deleteDataRequest)
    options.get('otp/:id',authMiddleware,otpController.otpVertiKey)
    options.post('vertify-otp',authMiddleware,otpController.verifyTokenKey)
    options.get('get-apikey',tempAuthMiddleware,apiController.getApikeyByToken)
    options.post('remove-temp-token',authMiddleware,apiController.RemoveTokenTemp)

    const application = app.basePath('web-api/');
    application.get('org', orgController.getOrg);
    
    const userApi = app.basePath('web-api/users');
    userApi.post('/createusr', userController.createUser);
    userApi.get('/fetchusers',authMiddleware,userController.getAllUsers)
    userApi.post('/approve',authMiddleware,userController.appoveUser)
    userApi.put('/update-user',authMiddleware,userController.updateUser) 
    userApi.delete('/delete-user',authMiddleware,userController.deleteUser) 
  
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

