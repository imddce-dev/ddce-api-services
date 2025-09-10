import { IsAutoincrement } from './../../../node_modules/drizzle-orm/column-builder.d';
import { password } from 'bun';
import { mysqlTable, serial, varchar, timestamp, int } from 'drizzle-orm/mysql-core';
import app from '../..';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('name', { length: 20 }).notNull(),
  password  : varchar('password', { length: 191 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  prename: varchar('prename', { length: 100 }).notNull(),
  surname: varchar('surname', { length: 100 }).notNull(),
  organizer: int('organizer').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  appoveAt: timestamp('appove_at').defaultNow().notNull(),
});