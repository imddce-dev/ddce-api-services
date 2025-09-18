import { Context } from "hono";
import { DrizzleDB } from "../configs/type";
import * as org from "../models/org.modal"

export const getOrg = async (c: Context) => {
  try {
    const db = c.get('db') as DrizzleDB;
    const result = await org.getOrg(db); 
    if (result.error) {
      return c.json({
        success: false,
        message: result.error,
      }, { status: 500 });
    }
    return c.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Critical error in getOrg handler:", error);
    return c.json({
      success: false,
      message: 'An internal server error occurred',
    }, { status: 500 });
  }
}