import * as crypto from 'crypto';

/**
 * สร้าง CSRF token โดยใช้หลักการ HMAC (Stateless)
 * @param {string} csrfKey - คีย์ลับสำหรับสร้าง HMAC signature
 * @returns {string} CSRF token ในรูปแบบ 'nonce.signature'
 */


export function generateHmacToken(csrfKey : string) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const hmac = crypto.createHmac('sha256', csrfKey);
  hmac.update(nonce);
  const signature = hmac.digest('hex');
  return `${nonce}.${signature}`;
}

/**
 * ตรวจสอบความถูกต้องของ CSRF token ที่สร้างจาก HMAC
 * @param {string} csrfKey - คีย์ลับที่ใช้ในการสร้าง token
 * @param {string} token - Token ที่ได้รับมาจาก client
 * @returns {boolean} - คืนค่า true หาก token ถูกต้อง, มิฉะนั้นคืนค่า false
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