import { mysqlTable, serial, varchar, timestamp, int, boolean, text, index, unique } from 'drizzle-orm/mysql-core';
import { ref } from 'process';
import { create } from '../../models/user.model';

export const users = mysqlTable('users', {
  id:         int('id').autoincrement().primaryKey(),
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

export const users_session = mysqlTable('users_session',{
  id:           int('id').autoincrement().primaryKey(),
  user_id:      int('user_id').references(() => users.id, { onDelete: "cascade" }).notNull(),
  jti:          varchar('jti',{length:191}).notNull().unique(),
  refreshtoken: varchar('refreshtoken',{length:191}),
  createAt:     timestamp('create_at').defaultNow().notNull(),
  expireAt:     timestamp('expire_at').notNull(),
});

export const agency_types = mysqlTable('agency_types', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 191 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const organizer_group = mysqlTable('organizer_group', {
  id: int('id').autoincrement().primaryKey(),
  org_type: int('org_type').references(() => agency_types.id, { onDelete: "cascade" }).notNull(),
  name: varchar('name', { length: 191 }).notNull(),
  agency_type_id: int('agency_type_id').references(() => agency_types.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const organizer = mysqlTable('organizer', {
  id: int('id').autoincrement().primaryKey(),
  organizer_group_id: int('organizer_group_id').references(() => organizer_group.id, { onDelete: "cascade" }).notNull(),
  name: varchar('name', { length: 191 }).notNull(),
  province_code: int('province_code').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const apiRequests = mysqlTable("api_requests", {
  id:                 int("id").autoincrement().primaryKey(),
  requesterName:      varchar("requester_name", { length: 100 }).notNull(),
  requesterEmail:     varchar("requester_email", { length: 255 }).notNull(),
  requesterPhone:     varchar("requester_phone", { length: 20 }),
  organizerName:      varchar("organizer_name", { length: 191 }),
  agree:              boolean("agree").notNull().default(false),
  allowedIPs:         text("allowed_ips"), 
  authMethod:         varchar("auth_method", { length: 50 }).notNull(),
  callbackUrl:        varchar("callback_url", { length: 500 }),
  dataFormat:         varchar("data_format", { length: 50 }).default("json"),
  dataSource:         varchar("data_source", { length: 100 }),
  description:        text("description"),
  projectName:        varchar("project_name", { length: 100 }),
  purpose:            text("purpose"),
  rateLimitPerMinute: int("rate_limit_per_minute").default(60),
  retentionDays:      int("retention_days").default(30),
  userRecord:         int("user_record").references(() => users.id, { onDelete: "cascade" }).notNull(),
  status:             varchar('status',{length: 191}).notNull().default("sending"),
  createdAt:          timestamp("created_at").defaultNow().notNull(),
  updatedAt:          timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const apiRequestAttachments = mysqlTable("api_request_attachments", {
  id:               int("id").autoincrement().primaryKey(),
  apiRequestId:     int("api_request_id")
                       .references(() => apiRequests.id, { onDelete: "cascade" })
                       .notNull(),
  fileName:         varchar("file_name", { length: 255 }).notNull(),
  fileSize:         int("file_size"),
  fileLastModified: timestamp("file_last_modified"),
  filePath:         varchar("file_path", { length: 500 }),
  createdAt:        timestamp("created_at").defaultNow().notNull(),
});

export const api_keys = mysqlTable('api_keys',{
  id:                int('id').autoincrement().primaryKey(), 
  user_id:           int('user_id').references(() => users.id, { onDelete: "cascade" }).notNull(),
  client_key:        varchar('client_key',{ length:191}).notNull(),
  secret_key:        varchar('secret_key',{ length:191}).notNull(),
  status:            int('status').notNull(),
  createdAt:         timestamp('created_at').defaultNow().notNull(),
  expiresAt:         timestamp('expires_at').defaultNow().notNull(),
  last_used_at:      timestamp('last_used_at'),
});

export const api_key_ips = mysqlTable('api_key_ips',{
  id:                  int('id').autoincrement().primaryKey(),
  api_key_id:          int('api_key_id').references(() => api_keys.id, { onDelete: "cascade" }).notNull(),
  ip_pattern:          varchar('ip_pattern',{length:64}).notNull(),
  createdAt:           timestamp('created_at').defaultNow().notNull(),
});

export const api_key_limits = mysqlTable('api_key_limits',{
  id:                 int('id').autoincrement().primaryKey(),
  api_key_id:         int('api_key_id').references(() => api_keys.id, { onDelete: "cascade" }).notNull(),
  route_prefix:       varchar('route_prefix',{ length:191 }).notNull(),
  per_min:            int('per_min').notNull(),
  burst:              int('burst').notNull(),
  createdAt:          timestamp('created_at').defaultNow().notNull(),
});  
export const otp_code = mysqlTable('otp_code',{
  id:                 int('id').autoincrement().primaryKey(),
  userId:             int('userId').references(()=> users.id, {onDelete : 'cascade'}).notNull(),
  code:               varchar('code',{length:6}).notNull(),
  ref:                varchar('ref',{length:50}).notNull(),
  createdAt:          timestamp('created_at').defaultNow().notNull(),       
  expiredAt:          timestamp('expired_at').notNull()
}, (table) => ({
      userIdx: unique('uniq_user_id').on(table.userId), 
      refIdx: index('idx_ref').on(table.ref),
}))

export const users_notification = mysqlTable('users_notification',{
  id:                 int('id').autoincrement().primaryKey(),
  userId:             int('user_id').references(()=> users.id, {onDelete : 'cascade'}).notNull(),
  sendMail:           varchar('send_mail',{ length: 191 }).notNull(),
  createdAt:           timestamp('created_at').defaultNow().notNull()
})

export const api_notification = mysqlTable('api_notification',{
  id:                 int('id').autoincrement().primaryKey(),
  eventId:            int('event_id').references(()=> apiRequests.id, {onDelete : 'cascade'}).notNull(),
  sendMail:           varchar('send_mail', { length: 191 }).notNull(),
  createdAt:           timestamp('created_at').defaultNow().notNull()
})
