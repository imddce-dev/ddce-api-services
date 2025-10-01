import * as crypto from 'crypto';

/**
 * @param {string} csrfKey 
 * @returns {string} 
 */


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