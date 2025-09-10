import { secureHeaders } from 'hono/secure-headers';

export const secureHeadersMiddleware = secureHeaders({
  // ป้องกันการนำเว็บเราไปแสดงใน <iframe> ของเว็บอื่น (Clickjacking)
  xFrameOptions: 'DENY',
  // ป้องกันเบราว์เซอร์จากการเดา MIME type ของไฟล์ (MIME sniffing)
  xContentTypeOptions: 'nosniff',
  // เปิดใช้งาน XSS protection ในเบราว์เซอร์รุ่นเก่า
  xXssProtection: '1; mode=block',
  // ป้องกันการรั่วไหลของข้อมูล Referrer
  referrerPolicy: 'strict-origin-when-cross-origin',
});