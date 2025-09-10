import { Hono } from 'hono';
import { serve } from '@hono/node-server'; 
import * as userController from './controllers/user.controller';
import { db } from './configs/mysql';
import { DrizzleDB } from './models/user.model';
import { sql } from 'drizzle-orm'; 
type AppContext = {
  Variables: {
    db: DrizzleDB
  }
}

const app = new Hono<AppContext>();
app.use('*', async (c, next) => {
  c.set('db', db);
  await next();
});

const api = app.basePath('/api');
api.get('/users', userController.getAllUsers);
api.post('/users', userController.createUser);
app.get('/', (c) => c.text('API is running!'));


const startup = async () => {
  try {
    await db.execute(sql`select 1`);
    console.log('Mysql connection successfully.');
    const port = parseInt(process.env.SERVER_PORT || '8000');
     serve({
      fetch: app.fetch,
      port: port,
  });
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error('Could not connect to the database:', error);
    process.exit(1);
  }
};

startup();

export default app;