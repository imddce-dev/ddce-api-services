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
        const newUser = await userModel.create(db, body);
        return c.json(newUser, 201); 
    } catch (error: any) { 
        console.error(error);
        if (error.message && error.message.includes('is already taken')) {
            return c.json({ 
                message: error.message 
            }, 409); 
        }
        return c.json({ 
            message: 'An internal server error occurred.' 
        }, 500); 
    }
};

export const getuserByusername = async (c: Context) => {
  try{
     const db = c.get('db') as DrizzleDB;
     const { username } = c.req.param();
     const user = await userModel.findByUsername(db, username);
     if (!user) {
       return c.json({ message: 'User not found' }, 404);
     }
     return c.json(user);
  } catch (error){
    console.error(error);
    return c.json({ message: 'Cannot fetch user' }, 500);
  }
}

export const removeUser = async (c: Context) =>{
  try{
    const db = c.get('db') as DrizzleDB;
    const id = Number(c.req.param('id'))
    const result = await userModel.RemoveUser(db, id)
    if (!result){
      return c.json({ message: 'User not found' }, 404);
    }
    return c.json(result);
  }catch (error){
    console.error(error);
    return c.json({ message: 'Cannot delete user' }, 500);
  }
}


export const editUser = async (c: Context) =>{
  try{
    const db = c.get('db') as DrizzleDB;
    const id = Number(c.req.param('id'))
    const body = await c.req.json();
    const result = await userModel.EditUser(db, id, body)
    if (!result){
      return c.json({ message: 'User not found' }, 404);
    } 
    return c.json(result);
  }catch (error){
    console.error(error);
    return c.json({ message: 'Cannot edit user' }, 500);
  }
}

