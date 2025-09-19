import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from '../mysql/schema';
export type DrizzleDB = MySql2Database<typeof schema>;


export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS', 
  USER_NOT_APPROVED: 'USER_NOT_APPROVED', 
  LOGIN_FAILED: 'LOGIN_FAILED',  
  CONFIG_ERROR: 'CONFIG_ERROR',
};

