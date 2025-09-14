import Ratelimit from 'hono-rate-limit';

export const createRateLimiter = () => {
  return Ratelimit({
    windowMs: 60 * 1000, // 1 นาที (60 seconds * 1000 milliseconds)
    limit: 100, // อนุญาต 100 requests ต่อ 1 IP ในทุกๆ 1 นาที
    message: 'Too many requests, please try again after a minute.',
  });
};

export const createAuthRateLimiter = () => {
  return Ratelimit({
    windowMs: 15 * 60 * 1000, 
    limit: 5, 
    message: 'Too many login attempts, please try again after 15 minutes.',
  });
}