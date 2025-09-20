import { Context } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
import * as authModel from '../models/auth.model'; 
import { DrizzleDB } from '../configs/type';
import type { StatusCode } from 'hono/utils/http-status';
import { UserPayload } from '../middlewares/auth.middleware';

type MyContext = Context<{
  Variables: {
    db: DrizzleDB;
    user: UserPayload;
  };
}>;


export const login = async (c: Context) => {
    try {
        const db = c.get('db') as DrizzleDB;
        const body = await c.req.json();
        const { username, password } = body;
        if (!username || !password){
            return c.json({ 
                success: false, 
                message: 'Username and password are required', 
                errorCode: 'MISSING_CREDENTIALS'
            },{status:400});
        }
        const result = await authModel.Login(db, username, password);
        if (!result.success) {
            let statusCode: StatusCode = 401;
            if (result.errorCode === authModel.AUTH_ERROR_CODES.INVALID_CREDENTIALS || result.errorCode === authModel.AUTH_ERROR_CODES.USER_NOT_APPROVED){
                statusCode = 500;
            }
            return c.json({ 
                success: false, 
                message: result.message,
                errorCode: result.errorCode
            },{status : statusCode});
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
        return c.json({success: true});
    } catch (error) {
         console.log(error);
         return c.json({ 
            success: false, 
            message: 'An internal server error occurred',
            errorCode: 'INTERNAL_SERVER_ERROR'
        }, {status : 500});
    }
}



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
        if (!result.success) {
            return c.json({ success: false, message: result.message }, 401);
        }

        setCookie(c, 'accessToken', result.accessToken || '', {
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

       return c.json({ success: true, message: 'Tokens refreshed' });
    }catch (error){
         console.error(error);
        return c.json({ success: false, message: 'An internal error occurred' }, 500);
    }
}

export const GetuserByToken = async (c: MyContext) => {
  try {
    const db = c.get('db');
    const userPayload = c.get('user');

    if (!userPayload || !userPayload.userId) {
      return c.json({ success: false, message: 'User information not found in token' }, 401);
    }

    const userProfile = await authModel.getUserById(db, userPayload.userId);

    if (!userProfile) {
      return c.json({ success: false, message: 'User not found in database' }, 404);
    }

    return c.json({ success: true, data: userProfile });

  } catch (error) {
    console.error('GetuserByToken Controller Error:', error);
    return c.json({ success: false, message: 'An internal error occurred' }, 500);
  }
};

export const VerifyJti =async (c: Context) => {
    try{
        const db = c.get('db') as DrizzleDB
        const body = await c.req.json();
        const jsonID =  body.jti
        if(!jsonID){
            return c.json({ success: false, message: 'Json WebTokenID is missing' }, 401);
        }
        const result = await authModel.verifyJti(db,jsonID)
        return c.json(result)

    }catch(error){
        console.error(error);
        return c.json({ success: false, message: 'An internal error occurred' }, 500);
    }
}