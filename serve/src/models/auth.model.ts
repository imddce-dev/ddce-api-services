import { users, users_session } from '../configs/mysql/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { generateToken, JWTPayload } from '../utils/authToken';
import { DrizzleDB } from '../configs/type';
import { stat } from 'fs';
import { getCookie } from 'hono/cookie';

const DAMMY_HASH = crypto.randomBytes(32).toString('hex');


export const Login = async (db: DrizzleDB, username : string, password: string) => {
  const pepper = process.env.PASSWORD_PEPPER
   if (!pepper) {
        console.log("PASSWORD_PEPPER is not set in environment variables");
        throw new Error("Application security configuration is incomplete.");
  }
  const existingUser = await db
    .select({
      id: users.id,
      password:users.password,
      role: users.role,
      appove: users.appoveAt
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1)
  const hashToCompare = existingUser.length === 0 ? DAMMY_HASH : existingUser[0].password;
  try{
    const passwordWithPepper = password + pepper;
    const isMatch = await bcrypt.compare(passwordWithPepper, hashToCompare)
    if (existingUser.length === 0 || !isMatch) {
      return { success: false, message: 'Invalid username or password' };
    }
    if (existingUser[0].appove === null){
      return { success:false, message: 'User not approved yet' };
    }

  await db.delete(users_session).where(eq(users_session.user_id, existingUser[0].id));

  const user = existingUser[0];
  const jwtid = crypto.randomUUID();
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 วัน

  await db.insert(users_session).values({
    user_id: user.id,
    jti: jwtid,
    expireAt: refreshTokenExpiry 
  });

      const payload: JWTPayload = {
        userId: user.id.toString(),
        role: user.role,
        jti: jwtid,
        exp: Math.floor(Date.now() / 1000) + (15 * 60) 
  }
  const accessToken = await generateToken(payload)
    return { 
      success: true, 
      token: accessToken,
      refreshToken: refreshToken 
    };
  }catch (error){ 
    console.error(error);
    return { message: 'Cannot login user' };
  }   
}

export const Logout = async (db: DrizzleDB, userId: number) =>{
  try{

    await db.delete(users_session).where(eq(users_session.user_id, userId))
    return {status: true, message: 'Logout successful'}


  }catch(error){
    console.error(error);
    return {status: false, message: 'Connot Logout user'}
  }
}