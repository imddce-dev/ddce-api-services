import { users, users_session } from '../configs/mysql/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { generateToken, JWTPayload } from '../utils/authToken';
import { generateHmacToken } from '../utils/hmactoken'
import { DrizzleDB } from '../configs/type';
import { error } from 'console';


const DAMMY_HASH = crypto.randomBytes(32).toString('hex');
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS', 
  USER_NOT_APPROVED: 'USER_NOT_APPROVED', 
  LOGIN_FAILED: 'LOGIN_FAILED',  
  CONFIG_ERROR: 'CONFIG_ERROR',
};

export const Login = async (db: DrizzleDB, username : string, password: string) => {
  const pepper = process.env.PASSWORD_PEPPER
   if (!pepper) {
        console.log("PASSWORD_PEPPER is not set in environment variables");
        return {
          success: false,
          message: "Application security configuration is incomplete.",
          errorCode: AUTH_ERROR_CODES.CONFIG_ERROR
        }
  }
  const existingUser = await db
    .select({
      id: users.id,
      password:users.password,
      oraganize: users.organizer,
      appove: users.appove,
      appoveAt: users.appoveAt
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1)
  const hashToCompare = existingUser.length === 0 ? DAMMY_HASH : existingUser[0].password;
  try{
    const passwordWithPepper = password + pepper;
    const isMatch = await bcrypt.compare(passwordWithPepper, hashToCompare)
    if (existingUser.length === 0 || !isMatch) {
      return { 
        success: false, 
        message: 'Username หรือ Password ไม่ถูกต้อง !!',
        errorCode: AUTH_ERROR_CODES.INVALID_CREDENTIALS
      };
    }
    if (existingUser[0].appoveAt === null && existingUser[0].appove === false){
      return { 
        success: false, 
        message: 'Username ยังไม่ถูกอนุญาตให้เข้าใช้งาน',
        errorCode: AUTH_ERROR_CODES.USER_NOT_APPROVED 
      };
    }

  await db.delete(users_session).where(eq(users_session.user_id, existingUser[0].id));

  const user = existingUser[0];
  const jwtid = crypto.randomUUID();
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 วัน

  await db.insert(users_session).values({
    user_id: user.id,
    jti: jwtid,
    expireAt: refreshTokenExpiry,
    refreshtoken: refreshToken,
  });
      const payload: JWTPayload = {
        userId: user.id.toString(),
        organize: user.oraganize.toString(),
        jti: jwtid,
        exp: Math.floor(Date.now() / 1000) + (15 * 60) 
  }
  const accessToken = await generateToken(payload)
  const csrfKey = process.env.CSRF_KEY || 'THZZuYm99jYPMXtEPd6bI811NswjDR8kW4qjh8c6UWg='
  const newcsrfToken = await generateHmacToken(csrfKey)
    return { 
      success: true, 
      token: accessToken,
      refreshToken: refreshToken,
      csrfToken: newcsrfToken
    };
  }catch (error){ 
    console.error(error);
    return { 
      success: false,
      message: 'An unexpected error occurred during login.',
      errorCode: AUTH_ERROR_CODES.LOGIN_FAILED 
    };
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

export const RefreshToken = async (db: DrizzleDB, refreshToken: string) => {
    try {
        const existingSession = await db
            .select()
            .from(users_session)
            .where(eq(users_session.refreshtoken, refreshToken));

        if (existingSession.length === 0) {
            return { success: false, message: 'Invalid or revoked session. Please login again.' };
        }
        const session = existingSession[0];
        if (session.expireAt < new Date()) {
            await db.delete(users_session).where(eq(users_session.id, session.id));
            return { success: false, message: 'Session expired. Please login again.' };
        }
        const newJti = crypto.randomUUID();
        const newRefreshToken = crypto.randomBytes(64).toString('hex');
        const newRefreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
        await db.update(users_session)
            .set({
                jti: newJti,
                refreshtoken: newRefreshToken, 
                expireAt: newRefreshTokenExpiry
            })
            .where(eq(users_session.id, session.id));  
        const userRecord = await db
            .select({ id: users.id, organizer: users.organizer })
            .from(users)
            .where(eq(users.id, session.user_id)) 
            .limit(1);
        if (userRecord.length === 0) {
            return { success: false, message: 'User not found' };
        }
        const user = userRecord[0];
        const payload: JWTPayload = {
            userId: user.id.toString(),
            organize: user.organizer,
            jti: newJti, 
            exp: Math.floor(Date.now() / 1000) + (15 * 60) 
        };
        const newAccessToken = await generateToken(payload);
        return {
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Cannot refresh token' };
    }
};


export const forgotPassword = async (db: DrizzleDB,userId: number, type: string, passwordold: string, passwordnew: string) => {
  if(type === 'inWeb'){
    const pepper = process.env.PASSWORD_PEPPER
    if (!pepper) {
          console.log("PASSWORD_PEPPER is not set in environment variables");
          throw new Error("Application security configuration is incomplete.");
    }
    const existingUser = await db
      .select({
        id: users.id,
        password: users.password,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
    if (existingUser.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const hashTocompare = existingUser[0].password;
    const passwordWithPepper = passwordold + pepper;
    const isMatch = await bcrypt.compare(passwordWithPepper, hashTocompare)
    if(!isMatch){
      return { success: false, message: 'Invalid current password' };
    }
    const newPasswordWithPepper = passwordnew + pepper;
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPasswordWithPepper, saltRounds);
    try{
      await db.update(users)
        .set({ password: hashedPassword})
        .where(eq(users.id, userId));
      return { success: true, message: 'Password updated successfully' };
    }catch(error){
      console.error(error);
      return { success: false, message: 'Cannot update password' };
    }
  } else if(type === 'token'){
    const saltRounds = 12;
    const pepper = process.env.PASSWORD_PEPPER
    if (!pepper) {
        console.log("PASSWORD_PEPPER is not set in environment variables");
        throw new Error("Application security configuration is incomplete.");
    }
    const newPasswordWithpepper = passwordnew + pepper;
    const hashedPassword = await bcrypt.hash(newPasswordWithpepper, saltRounds);
    try{
      await db.update(users)
        .set({ password: hashedPassword})
        .where(eq(users.id, userId));
      return { success: true, message: 'Password updated successfully' };
    }catch(error){
      console.error(error);
      return { success: false, message: 'Cannot update password' };
    }
  } else{
    return { success: false, message: 'Invalid type' };
  }
}