import Redis from 'ioredis';

let redis = null;
let isRedisConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

/**
 * Enhanced retry strategy with exponential backoff
 * @param {number} times - Number of retry attempts
 * @returns {number|null} - Delay in ms or null to stop retrying
 */
const retryStrategy = (times) => {
  if (times > MAX_RECONNECT_ATTEMPTS) {
    console.error(`❌ Redis: Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Caching disabled.`);
    return null;
  }

  const delay = Math.min(times * 500, 3000); // 500ms, 1s, 1.5s, 2s, 2.5s, 3s max
  console.log(`🔄 Redis: Retrying connection in ${delay}ms (attempt ${times}/${MAX_RECONNECT_ATTEMPTS})`);
  return delay;
};

/**
 * Gracefully handle Redis operations with fallback
 * @param {Function} operation - Redis operation to attempt
 * @param {*} fallback - Fallback value if Redis is unavailable
 * @returns {Promise<*>} - Operation result or fallback
 */
export const safeRedisOperation = async (operation, fallback = null) => {
  if (!redis || !isRedisConnected) {
    return fallback;
  }

  try {
    return await operation();
  } catch (error) {
    console.warn('⚠️ Redis operation failed, using fallback:', error.message);
    return fallback;
  }
};

if (process.env.REDIS_URL) {
  console.log('🌟 Initializing Redis with URL:', process.env.REDIS_URL);
  redis = new Redis(process.env.REDIS_URL, {
    retryStrategy,
    maxRetriesPerRequest: 3,
    lazyConnect: false,
    keepAlive: 30000,
    connectTimeout: 10000,
    commandTimeout: 5000,
    enableReadyCheck: true,
    maxMemoryPolicy: 'allkeys-lru', // Evict least recently used keys when memory is full
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected');
    reconnectAttempts = 0; // Reset counter on successful connection
  });

  redis.on('ready', () => {
    console.log('✅ Redis ready to accept commands');
    isRedisConnected = true;
  });

  redis.on('error', (err) => {
    console.warn('⚠️ Redis connection error, caching disabled:', err.message);
    isRedisConnected = false;
  });

  redis.on('close', () => {
    console.warn('⚠️ Redis connection closed');
    isRedisConnected = false;
  });

  redis.on('reconnecting', (delayTime) => {
    reconnectAttempts++;
    console.log(`🔄 Redis reconnecting in ${delayTime}ms (attempt ${reconnectAttempts})`);
  });

  redis.on('end', () => {
    console.warn('⚠️ Redis connection ended');
    isRedisConnected = false;
  });
} else {
  console.warn('⚠️ REDIS_URL not configured, caching disabled');
}

export { redis as default, isRedisConnected };
