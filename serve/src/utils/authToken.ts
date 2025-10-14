import {decode , sign, verify} from 'hono/jwt'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_ALGORITHM = 'HS256'

if (!JWT_SECRET){
    throw new Error('JWT_SECRET is not defined in environment variables')
}

export interface JWTPayload {
    userId: string;
    organize: string;
    jti: string,
    exp: number;
    [key: string]: unknown;
}

export interface JWTPayloadTemp{
    id : number;
    exp: number;
    [key: string]: unknown
}

export const TOKEN_EXPIRATION = 60 * 5

export const generateToken = async (payload: JWTPayload): Promise<string> => {
    return await sign(payload, JWT_SECRET, JWT_ALGORITHM)
}

export const generateTokenTemp = async (payload: JWTPayloadTemp): Promise<string> => {
  return await sign(payload, JWT_SECRET, JWT_ALGORITHM)
}

export const verifyToken = async (token: string): Promise<JWTPayload | null> => {
    try{
        const decodeedPayload = await verify(token, JWT_SECRET, JWT_ALGORITHM) 
        return decodeedPayload as JWTPayload
    }catch(error){
        console.error('Error verifying token:', error)
        return null
    }
}

export const decodeToken = (token: string): { payload: unknown, header: { alg: string, typ?: string } } | null => {
    try {
        return decode(token);
    } catch (error) {
        console.error('Token decoding failed:', error);
        return null;
    }
}





