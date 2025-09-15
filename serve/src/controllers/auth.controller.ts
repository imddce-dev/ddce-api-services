import { Context } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';

import * as authModel from '../models/auth.model'; 
import { DrizzleDB } from '../configs/type';

export const login = async (c: Context) => {
    try {
        const db = c.get('db') as DrizzleDB;
        const body = await c.req.json();
        const { username, password } = body;
        if (!username || !password){
            return c.json({ success: false, message: 'Username and password are required' }, 400);
        }
        const result = await authModel.Login(db, username, password);

        if (!result.success) {
            return c.json({ success: false, message: result.message || 'Invalid credentials' }, 401);
        }
        setCookie(c, 'accessToken', result.token || '', {
            httpOnly: true,
            secure: true, 
            sameSite: 'Strict',
            path: '/', 
            maxAge: 60 * 15, 
        });
        setCookie(c, 'refreshToken', result.refreshToken || '', {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/api/auth/refresh', 
            maxAge: 60 * 60 * 24 * 7, 
        });

        setCookie(c, 'csrf_token', result.csrfToken || '', {
            httpOnly: false,
            secure: true,
            sameSite: 'Strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, 
        });

        return c.json(result.success ? { success: true } : { success: false, message: result.message || 'Cannot login' });

    } catch (error) {
        console.error(error);
        return c.json({ success: false, message: 'An internal error occurred' }, 500);
    }
};

export const Logout = async (c: Context) => {
    try{
      const db = c.get('db') as DrizzleDB
      const body = await c.req.json();
      const userId = body.userId;
      if (!userId){
        return c.json({ success: false, message: 'User ID is required' }, 400);
      }
      const result = await authModel.Logout(db, userId)
      if (result.status === true){
        deleteCookie(c, 'accessToken', { path: '/' });
        deleteCookie(c, 'refreshToken', { path: '/api/auth/refresh' });
        deleteCookie(c, 'csrf_token', { path: '/' });
        deleteCookie(c, 'token', { path: '/' });
        return c.json({ success: true });
      }
      return c.json({ success: false, message: result.message || 'Cannot logout' }, 400);
    }catch(error){
        console.error(error);
        return c.json({ success: false, message: 'An internal error occurred' }, 500);
    }
}

export const RefreshToken = async (c: Context) => {
    try{
        const db = c.get('db') as DrizzleDB
        const body = await c.req.json();
        const refreshToken = body.refreshToken;
         if(!refreshToken){
            return c.json({ success: false, message: 'refreshToken is required' }, 400);
         }
        const result = await authModel.RefreshToken(db, refreshToken)
        if(!result.success){
            return c.json({success:false, message:'refreshToken is not success'})
        }
        return c.json({success: true})
    }catch (error){
         console.error(error);
        return c.json({ success: false, message: 'An internal error occurred' }, 500);
    }
}