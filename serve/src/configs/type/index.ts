import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from '../mysql/schema';
export type DrizzleDB = MySql2Database<typeof schema>;