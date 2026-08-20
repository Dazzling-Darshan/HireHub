import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// TTL Presets (in seconds)
export const CACHE_TTL = {
  SHORT: 120,       // 2 minutes (rapidly changing queries)
  MEDIUM: 600,     // 10 minutes (standard listings, jobs)
  LONG: 1800,      // 30 minutes (company details, static lookups)
};

let redis = null;
let isRedisReady = false;

try {
  const redisOptions = {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 5) {
        return null;
      }
      return Math.min(times * 1000, 3000);
    },
    reconnectOnError(err) {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    },
  };

  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, redisOptions);
  } else if (process.env.REDIS_HOST) {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
      username: process.env.REDIS_USERNAME || 'default',
      password: process.env.REDIS_PASSWORD || undefined,
      ...redisOptions,
    });
  } else {
    redis = new Redis({
      host: '127.0.0.1',
      port: 6379,
      ...redisOptions,
    });
  }

  redis.on('connect', () => {
    console.log('[Redis] Connected to Redis server.');
  });

  redis.on('ready', () => {
    isRedisReady = true;
    console.log('[Redis] Client is ready to handle cache operations.');
  });

  redis.on('error', (err) => {
    isRedisReady = false;
    console.warn('[Redis] Connection Warning:', err.message);
  });

  redis.on('close', () => {
    isRedisReady = false;
  });
} catch (error) {
  console.warn('[Redis] Initialization skipped:', error.message);
}

/**
 * Check if Redis is operational
 */
export const isCacheAvailable = () => isRedisReady && redis !== null;

/**
 * Retrieve and deserialize JSON data from Redis
 * @param {string} key
 * @returns {Promise<any|null>}
 */
export const getCache = async (key) => {
  if (!isCacheAvailable()) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn(`[Redis] getCache failed for key "${key}":`, error.message);
    return null;
  }
};

/**
 * Serialize and store data in Redis with TTL
 * @param {string} key
 * @param {any} value
 * @param {number} ttlInSeconds - Default: CACHE_TTL.MEDIUM (600s)
 * @returns {Promise<boolean>}
 */
export const setCache = async (key, value, ttlInSeconds = CACHE_TTL.MEDIUM) => {
  if (!isCacheAvailable() || value === undefined) return false;
  try {
    const stringified = JSON.stringify(value);
    await redis.set(key, stringified, 'EX', ttlInSeconds);
    return true;
  } catch (error) {
    console.warn(`[Redis] setCache failed for key "${key}":`, error.message);
    return false;
  }
};

/**
 * Delete a specific key from Redis
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export const deleteCache = async (key) => {
  if (!isCacheAvailable()) return false;
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.warn(`[Redis] deleteCache failed for key "${key}":`, error.message);
    return false;
  }
};

/**
 * Delete all keys matching a wildcard pattern using non-blocking SCAN stream
 * Example: deleteKeysByPattern('jobs:all:*')
 * @param {string} pattern
 * @returns {Promise<number>} Number of keys deleted
 */
export const deleteKeysByPattern = async (pattern) => {
  if (!isCacheAvailable()) return 0;
  return new Promise((resolve) => {
    let deletedCount = 0;
    try {
      const stream = redis.scanStream({
        match: pattern,
        count: 100,
      });

      stream.on('data', async (keys = []) => {
        if (keys.length > 0) {
          stream.pause();
          try {
            const pipeline = redis.pipeline();
            keys.forEach((key) => pipeline.del(key));
            await pipeline.exec();
            deletedCount += keys.length;
          } catch (err) {
            console.warn(`[Redis] Error deleting batch for pattern "${pattern}":`, err.message);
          } finally {
            stream.resume();
          }
        }
      });

      stream.on('end', () => {
        resolve(deletedCount);
      });

      stream.on('error', (err) => {
        console.warn(`[Redis] scanStream error for pattern "${pattern}":`, err.message);
        resolve(deletedCount);
      });
    } catch (error) {
      console.warn(`[Redis] deleteKeysByPattern failed for pattern "${pattern}":`, error.message);
      resolve(0);
    }
  });
};

export default redis;
