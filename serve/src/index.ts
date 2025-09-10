import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import * as userController from './controllers/user.controller';
import { db } from './configs/mysql';
import { DrizzleDB } from './models/user.model';
import { sql } from 'drizzle-orm';
import { connectRedis, getRedisClient } from './configs/redis';
import { contextMiddleware } from './middlewares/context.middleware';
import { coreMiddleware } from './middlewares/core.middleware';
import { secureHeadersMiddleware } from './middlewares/secure-headers.middleware';
import { createRateLimiter } from './middlewares/rate-limit.middleware';

// การกำหนด Type แบบนี้ยอดเยี่ยมมากครับ
// It's excellent to define the type this way.
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
    // การเชื่อมต่อฐานข้อมูลพร้อมกันแบบนี้มีประสิทธิภาพมาก
    // Connecting databases in parallel like this is very efficient.
    await Promise.all([
      db.execute(sql`select 1`),
      connectRedis()
    ]);
    console.log('MySQL and Redis connected successfully.');

    // สร้าง middleware หลังจากเชื่อมต่อทุกอย่างสำเร็จแล้ว
    // Create the middleware after all connections are successful.
    const rateLimiterMiddleware = createRateLimiter();

    app.use('*', secureHeadersMiddleware);
    
    // --- จุดสำคัญ ---
    // ตอนนี้คุณสามารถเปิดใช้งานบรรทัดนี้ได้แล้ว
    // Now you can safely uncomment this line.
    app.use('*', rateLimiterMiddleware); 
    
    app.use('*', coreMiddleware);
    app.use('*', contextMiddleware);

    const api = app.basePath('/api/v1');
    api.get('/users', userController.getAllUsers);
    api.post('/users', userController.createUser);

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

