import Redis from 'ioredis';
import { ENV } from './env';

let redisClient: Redis | null = null;
let isRedisConnected = false;

// In-memory fallback for environments without an active Redis server
const inMemoryCache = new Map<string, { value: string; expiresAt: number }>();
const inMemoryZSets = new Map<string, Map<string, number>>();
const inMemoryLocks = new Map<string, number>();

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(ENV.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) {
          console.warn('[Redis] Max reconnect retries reached. Switching to mock in-memory fallback.');
          return null; // Stop retrying
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      isRedisConnected = true;
      console.log('[Redis] Connected successfully');
    });

    redisClient.on('error', (err) => {
      isRedisConnected = false;
      console.warn(`[Redis] Connection warning: ${err.message}`);
    });

    redisClient.connect().catch((err) => {
      console.warn(`[Redis] Initial connection error: ${err.message}. Using in-memory fallback.`);
    });
  }

  return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log('[Redis] Disconnected gracefully');
    } catch (err: any) {
      console.error(`[Redis] Disconnect error: ${err.message}`);
    }
  }
};

/**
 * Distributed Lock helper using SET key val NX PX ttlMs with in-memory fallback
 */
export const acquireDistributedLock = async (lockKey: string, ttlMs: number): Promise<boolean> => {
  const client = getRedisClient();
  const lockVal = Date.now().toString();

  if (isRedisConnected && client) {
    try {
      const result = await client.set(lockKey, lockVal, 'PX', ttlMs, 'NX');
      return result === 'OK';
    } catch (error) {
      console.warn('[Redis Lock] Error acquiring Redis lock, defaulting to memory fallback:', error);
    }
  }

  // Memory fallback
  const now = Date.now();
  const existingExpires = inMemoryLocks.get(lockKey);
  if (existingExpires && existingExpires > now) {
    return false; // Lock taken
  }

  inMemoryLocks.set(lockKey, now + ttlMs);
  return true;
};

/**
 * Cache GET helper (Redis with memory fallback)
 */
export const cacheGet = async (key: string): Promise<string | null> => {
  const client = getRedisClient();
  if (isRedisConnected && client) {
    try {
      return await client.get(key);
    } catch (err) {
      console.warn(`[Redis Cache] GET error for ${key}:`, err);
    }
  }

  const item = inMemoryCache.get(key);
  if (!item) return null;
  if (item.expiresAt < Date.now()) {
    inMemoryCache.delete(key);
    return null;
  }
  return item.value;
};

/**
 * Cache SET with TTL in seconds (Redis with memory fallback)
 */
export const cacheSet = async (key: string, value: string, ttlSeconds: number): Promise<void> => {
  const client = getRedisClient();
  if (isRedisConnected && client) {
    try {
      await client.setex(key, ttlSeconds, value);
      return;
    } catch (err) {
      console.warn(`[Redis Cache] SET error for ${key}:`, err);
    }
  }

  inMemoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

/**
 * Leaderboard ZSET ADD (Redis with memory fallback)
 */
export const zAddLeaderboard = async (setKey: string, score: number, member: string): Promise<void> => {
  const client = getRedisClient();
  if (isRedisConnected && client) {
    try {
      await client.zadd(setKey, score, member);
      return;
    } catch (err) {
      console.warn('[Redis ZSET] ZADD error:', err);
    }
  }

  let zset = inMemoryZSets.get(setKey);
  if (!zset) {
    zset = new Map<string, number>();
    inMemoryZSets.set(setKey, zset);
  }
  zset.set(member, score);
};

/**
 * Leaderboard ZSET REVRANGE with scores (Redis with memory fallback)
 */
export const zRevRangeLeaderboard = async (
  setKey: string,
  start: number,
  stop: number
): Promise<{ member: string; score: number }[]> => {
  const client = getRedisClient();
  if (isRedisConnected && client) {
    try {
      const raw = await client.zrevrange(setKey, start, stop, 'WITHSCORES');
      const results: { member: string; score: number }[] = [];
      for (let i = 0; i < raw.length; i += 2) {
        results.push({
          member: raw[i],
          score: parseFloat(raw[i + 1]),
        });
      }
      return results;
    } catch (err) {
      console.warn('[Redis ZSET] ZREVRANGE error:', err);
    }
  }

  const zset = inMemoryZSets.get(setKey);
  if (!zset) return [];

  const sorted = Array.from(zset.entries())
    .map(([member, score]) => ({ member, score }))
    .sort((a, b) => b.score - a.score);

  return sorted.slice(start, stop === -1 ? undefined : stop + 1);
};
