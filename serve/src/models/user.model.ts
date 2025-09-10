
import { MySql2Database, drizzle } from 'drizzle-orm/mysql2';
import { users } from '../configs/mysql/schema';
import { eq } from 'drizzle-orm';

export type DrizzleDB = MySql2Database<typeof import('../configs/mysql/schema')>;


export const findAll = async (db: DrizzleDB) => {
  return await db.query.users.findMany();
};

export const create = async (
  db: DrizzleDB,
  data: {
    username: string;
    password: string;
    prename: string;
    surname: string;
    organizer: string;
    email: string;
  }
) => {
  const result = await db.insert(users).values({
    ...data,
    organizer: Number(data.organizer),
  });
  const newId = result[0].insertId;
  return { id: newId, ...data };
};

export const findByUsername = async (db: DrizzleDB, username: string) => {
  return await db
    .select().from(users)
    .where(eq(users.username, username))
    .limit(1)
    .then((res) => res[0]);
}


