import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis, { isCacheAvailable } from '../utils/redis.js';

// Helper to configure RedisStore safely with failover
const createRedisStore = (prefix) => {
  try {
    if (redis && isCacheAvailable()) {
      return new RedisStore({
        sendCommand: (...args) => redis.call(...args),
        prefix: `rl:${prefix}:`,
      });
    }
  } catch (error) {
    console.warn(`[RateLimiter] Failed to initialize RedisStore for ${prefix}, falling back to memory store:`, error.message);
  }
  return undefined; // Falls back to default in-memory store
};

/**
 * General API Rate Limiter
 * 150 requests per minute per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 150,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in a minute.',
  },
  store: createRedisStore('api'),
  skip: (req) => req.path === '/api/v1/health', // Don't rate limit health checks
});

/**
 * Auth Rate Limiter (Login & Register)
 * Stricter limit: 10 requests per 15 minutes per IP to prevent brute-force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login/registration attempts from this IP. Please try again after 15 minutes.',
  },
  store: createRedisStore('auth'),
});

/**
 * Job Application Rate Limiter
 * 15 applications per 15 minutes per user/IP to prevent spamming
 */
export const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'You have submitted too many job applications recently. Please wait a few minutes before applying again.',
  },
  store: createRedisStore('apply'),
});
