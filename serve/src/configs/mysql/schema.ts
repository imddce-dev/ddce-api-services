import { mysqlTable, serial, varchar, timestamp, int } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('name', { length: 20 }).notNull().unique(),
  password  : varchar('password', { length: 191 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  prename: varchar('prename', { length: 100 }).notNull(),
  surname: varchar('surname', { length: 100 }).notNull(),
  organizer: int('organizer').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  appoveAt: timestamp('appove_at').defaultNow(),
});

export const agency_types = mysqlTable('agency_types', {
  id: serial('id').primaryKey(),
  name: varchar('name',{ length:191}).notNull(),
  creatAt: timestamp('creat_at').defaultNow().notNull(),
})

export const organizer_group = mysqlTable('organizer_group', {
  id: serial('id').primaryKey(),
  name: varchar('name',{ length:191}).notNull(),
  type_id: int('type_id').notNull(),
  creatAt: timestamp('creat_at').defaultNow().notNull(),
})

export const organizer = mysqlTable('organizer',{
  id: serial('id').primaryKey(),
  parent_id: int('parent_id').notNull(),
  name: varchar('name',{ length:191}).notNull(),
  creatAt: timestamp('creat_at').defaultNow().notNull(),
})

export const users_session = mysqlTable('users_session',{
  id: serial('id').primaryKey(),
  user_id:int('user_id').notNull(),
  jti: varchar('jti',{length:191}).notNull().unique(),
  createAt: timestamp('create_at').defaultNow().notNull(),
  expireAt: timestamp('expire_at').notNull(),
})
