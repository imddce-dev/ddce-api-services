import { secureHeaders } from 'hono/secure-headers';

export const secureHeadersMiddleware = secureHeaders({
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  strictTransportSecurity: 'max-age=31536000; includeSubDomains',
  xXssProtection: '0',
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"],
    objectSrc: ["'none'"]
  },
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
    payment: []
  },
});