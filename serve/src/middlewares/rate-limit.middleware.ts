import Ratelimit from 'hono-rate-limit';

export const createRateLimiter = () => {
  return Ratelimit({
    windowMs: 60 * 1000, // 1 นาที (60 seconds * 1000 milliseconds)
    limit: 100, 
    message: 'Too many requests, please try again after a minute.',
  });
};

export const createAuthRateLimiter = () => {
  return Ratelimit({
    windowMs: 5 * 60 * 1000, 
    limit: 7, 
    message: 'Too many login attempts, please try again after 5 minutes.',
  });
}