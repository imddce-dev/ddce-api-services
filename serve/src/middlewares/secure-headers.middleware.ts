import { secureHeaders } from 'hono/secure-headers';

export const secureHeadersMiddleware = secureHeaders({
  xFrameOptions: false,
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  strictTransportSecurity: 'max-age=31536000; includeSubDomains',
  xXssProtection: '0',
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"],
    objectSrc: ["'none'"],
    frameAncestors: ["'self'", "http://localhost:8000"]
  },
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
    payment: []
  },
});