import { Context } from 'hono';
import * as userModel from '../models/user.model';
import { DrizzleDB } from '../configs/type'; 


export const getAllUsers = async (c: Context) => {
  try {
    const db = c.get('db') as DrizzleDB;
    const users = await userModel.findAll(db);
    return c.json(users);
  } catch (error) {
    console.error(error);
    return c.json({ message: 'Cannot fetch users' }, 500);
  }
};

export const createUser = async (c: Context) => {
    try {
        const db = c.get('db') as DrizzleDB;
        const body = await c.req.json();
        const result = await userModel.create(db, body)
        if (result.success === false) {
            if (result.code === 'USERNAME_TAKEN') {
                return c.json(result, 409); 
            }
            return c.json(result, 400); 
        }
        return c.json(result, 201); 
    } catch (error: any) {
        //console.error(error);
        return c.json({ 
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An internal server error occurred.' 
        }, 500);
    }
};


