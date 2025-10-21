import * as crypto from 'crypto';

/**
 * @param {string} csrfKey 
 * @returns {string} 
 */

const ALGORITHM = 'aes-256-gcm'; 
const IV_LENGTH = 16; 
const SECRET = process.env.MASTER_KEY_ENCRYPTION!; 

export function generateHmacToken(csrfKey : string) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const hmac = crypto.createHmac('sha256', csrfKey);
  hmac.update(nonce);
  const signature = hmac.digest('hex');
  return `${nonce}.${signature}`;
}

/**
 * @param {string} csrfKey 
 * @param {string} token 
 * @returns {boolean} 
 */

export function verifyHmacToken(csrfKey : string, token : string) {
  try {
    const [nonce, receivedSignature] = token.split('.');
    if (!nonce || !receivedSignature) {
      return false;
    }
    const hmac = crypto.createHmac('sha256', csrfKey);
    hmac.update(nonce);
    const expectedSignature = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature));
  } catch (error) {
    return false;
  }
}

export function generateClientKey(length: number): string {
  const prefix = 'ddce_';
  const randomLength = length - prefix.length;
  if (randomLength <= 0) {
    throw new Error(`Length must be greater than prefix length (${prefix.length})`);
  }
  const randomPart = crypto.randomBytes(randomLength)
    .toString('base64url') 
    .slice(0, randomLength); 

  return prefix + randomPart;
}

export function generateSecretKey (length: number) : string { 
  return crypto.randomBytes(length).toString('base64url') 
}

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`; 
}

export function decrypt(data: string) {
  const [ivHex, authTagHex, encryptedData] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET, 'hex'), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}