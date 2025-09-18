import { mysqlTable, serial, varchar, timestamp, int, boolean } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id:         serial('id').primaryKey(),
  fullname:   varchar('fullname', { length: 191 }).notNull(),
  username:   varchar('username', { length: 20 }).notNull().unique(),
  email:      varchar('email', { length: 100 }).notNull(),
  phone:      varchar('phone',{length:15}).notNull(),
  password:   varchar('password', { length: 191 }).notNull(),
  organizer:  varchar('organizer',{ length: 50}).notNull(),
  policy:     boolean('policy').notNull().default(false),
  root:       boolean('root').notNull().default(false),
  createdAt:  timestamp('createdAt').defaultNow().notNull(),
  appove:     boolean('appove').notNull().default(false),
  appoveAt:   timestamp('appoveAt'),
  status:     varchar('status',{length:100}).notNull().default('pedding'),
});

export const agency_types = mysqlTable('agency_types', {
  id:         serial('id').primaryKey(),
  name:       varchar('name',{ length:191}).notNull(),
  creatAt:    timestamp('creat_at').defaultNow().notNull(),
})

export const organizer_group = mysqlTable('organizer_group', {
  id:         serial('id').primaryKey(),
  name:       varchar('name',{ length:191}).notNull(),
  type_id:    int('type_id').notNull(),
  creatAt:    timestamp('creat_at').defaultNow().notNull(),
})

export const organizer = mysqlTable('organizer',{
  id:         serial('id').primaryKey(),
  parent_id:  int('parent_id').notNull(),
  name:       varchar('name',{ length:191}).notNull(),
  creatAt:    timestamp('creat_at').defaultNow().notNull(),
})

export const users_session = mysqlTable('users_session',{
  id:           serial('id').primaryKey(),
  user_id:      int('user_id').notNull(),
  jti:          varchar('jti',{length:191}).notNull().unique(),
  refreshtoken: varchar('refreshtoken',{length:191}),
  createAt:     timestamp('create_at').defaultNow().notNull(),
  expireAt:   timestamp('expire_at').notNull(),
})
