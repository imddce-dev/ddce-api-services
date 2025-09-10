import Ratelimit from 'hono-rate-limit';
export const createRateLimiter = () => {
  return Ratelimit({
    windowMs: 60 * 1000, // 1 นาที (60 seconds * 1000 milliseconds)
    limit: 100, // อนุญาต 100 requests ต่อ 1 IP ในทุกๆ 1 นาที
    message: 'Too many requests, please try again after a minute.',
  });
};