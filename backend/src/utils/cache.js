import redis, { isRedisConnected, safeRedisOperation } from './redis.js';

const CACHE_PREFIXES = {
  GRAPHQL: 'graphql:',
  POST: 'post:',
  USER: 'user:',
  COMMENT: 'comment:',
  MEDIA: 'media:',
  MENU: 'menu:',
  CATEGORY: 'category:',
  SETTINGS: 'settings:',
};

const DEFAULT_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
};

export async function getCache(key) {
  return await safeRedisOperation(async () => {
    const pipeline = redis.pipeline();
    pipeline.get(key);
    pipeline.ttl(key);

    const results = await pipeline.exec();
    const [cacheResult, ttlResult] = results;

    if (cacheResult[1]) {
      const cached = JSON.parse(cacheResult[1]);
      return cached;
    }
    return null;
  }, null);
}

export async function setCache(key, value, ttl = DEFAULT_TTL.SHORT) {
  return await safeRedisOperation(async () => {
    await redis.setex(key, ttl, JSON.stringify(value));
    return true;
  }, false);
}

export async function setCacheWithTags(key, value, ttl = DEFAULT_TTL.SHORT, tags = []) {
  if (!redis || !isRedisConnected) return false;

  const pipeline = redis.pipeline();

  try {
    // Set the main cache entry
    pipeline.setex(key, ttl, JSON.stringify(value));

    // Add to tag sets for easier invalidation
    for (const tag of tags) {
      pipeline.sadd(`tag:${tag}`, key);
      pipeline.expire(`tag:${tag}`, ttl + 3600); // Tags live longer than cache
    }

    await pipeline.exec();
    return true;
  } catch (error) {
    console.warn('Cache set with tags error:', error.message);
    return false;
  }
}

export async function delCache(key) {
  if (!redis || !isRedisConnected) return false;
  try {
    const result = await redis.del(key);
    return result > 0;
  } catch (error) {
    console.warn('Cache delete error:', error.message);
    return false;
  }
}

export async function delCacheByPattern(pattern) {
  if (!redis || !isRedisConnected) return 0;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      const result = await redis.del(keys);
      return result;
    }
    return 0;
  } catch (error) {
    console.warn('Cache delete by pattern error:', error.message);
    return 0;
  }
}

export async function delCacheByTags(tags) {
  if (!redis || !isRedisConnected) return 0;

  const pipeline = redis.pipeline();
  let totalDeleted = 0;

  try {
    for (const tag of tags) {
      const keys = await redis.smembers(`tag:${tag}`);
      if (keys.length) {
        pipeline.del(keys);
        pipeline.del(`tag:${tag}`);
        totalDeleted += keys.length;
      }
    }

    await pipeline.exec();
    return totalDeleted;
  } catch (error) {
    console.warn('Cache delete by tags error:', error.message);
    return 0;
  }
}

export async function cachePost(post, ttl = DEFAULT_TTL.MEDIUM) {
  if (!post?.id) return false;

  const tags = ['posts', `post-${post.id}`];
  if (post.post_type) tags.push(`type-${post.post_type}`);
  if (post.post_author) tags.push(`author-${post.post_author}`);

  await setCacheWithTags(`${CACHE_PREFIXES.POST}${post.id}`, post, ttl, tags);

  if (post.post_name) {
    await setCacheWithTags(`post_name:${post.post_name}`, post, ttl, tags);
  }

  return true;
}

export async function getCachedPost(key) {
  return getCache(key.startsWith(CACHE_PREFIXES.POST) ? key : `${CACHE_PREFIXES.POST}${key}`);
}

export async function cacheUser(user, ttl = DEFAULT_TTL.LONG) {
  if (!user?.id) return false;

  const tags = ['users', `user-${user.id}`];
  return await setCacheWithTags(`${CACHE_PREFIXES.USER}${user.id}`, user, ttl, tags);
}

export async function getCachedUser(id) {
  return getCache(`${CACHE_PREFIXES.USER}${id}`);
}

export async function cacheComment(comment, ttl = DEFAULT_TTL.MEDIUM) {
  if (!comment?.comment_id) return false;

  const tags = ['comments', `comment-${comment.comment_id}`];
  if (comment.comment_post_id) tags.push(`post-${comment.comment_post_id}`);

  return await setCacheWithTags(
    `${CACHE_PREFIXES.COMMENT}${comment.comment_id}`,
    comment,
    ttl,
    tags,
  );
}

export async function getCachedComment(id) {
  return getCache(`${CACHE_PREFIXES.COMMENT}${id}`);
}

export async function cacheSettings(key, value, ttl = DEFAULT_TTL.VERY_LONG) {
  const tags = ['settings'];
  return await setCacheWithTags(`${CACHE_PREFIXES.SETTINGS}${key}`, value, ttl, tags);
}

export async function getCachedSettings(key) {
  return getCache(`${CACHE_PREFIXES.SETTINGS}${key}`);
}

export async function cacheMenu(menu, ttl = DEFAULT_TTL.LONG) {
  if (!menu?.name) return false;

  const tags = ['menus', `menu-${menu.name}`];
  return await setCacheWithTags(`${CACHE_PREFIXES.MENU}${menu.name}`, menu, ttl, tags);
}

export async function getCachedMenu(name) {
  return getCache(`${CACHE_PREFIXES.MENU}${name}`);
}

export async function clearAllCache(pattern = '*') {
  if (!redis || !isRedisConnected) {
    return 0;
  }
  try {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      const result = await redis.del(keys);
      return result;
    }
    return 0;
  } catch (err) {
    return 0;
  }
}

export async function clearPostAndCategoryCache() {
  try {
    const deletedCount = await delCacheByTags(['posts', 'categories']);
    console.log(`🗑️ Cleared ${deletedCount} post/category cache entries`);
    return deletedCount;
  } catch (cacheErr) {
    console.warn('Failed to clear post/category cache:', cacheErr.message);
    return 0;
  }
}

export async function clearMediaCache() {
  try {
    const deletedCount = await delCacheByPattern(`${CACHE_PREFIXES.MEDIA}*`);
    console.log(`🗑️ Cleared ${deletedCount} media cache entries`);
    return deletedCount;
  } catch (err) {
    console.warn('Failed to clear media cache:', err.message);
    return 0;
  }
}

export async function clearUserCache(userId = null) {
  try {
    if (userId) {
      const deletedCount = await delCacheByTags([`user-${userId}`]);
      console.log(`🗑️ Cleared ${deletedCount} cache entries for user ${userId}`);
      return deletedCount;
    } else {
      const deletedCount = await delCacheByTags(['users']);
      console.log(`🗑️ Cleared ${deletedCount} user cache entries`);
      return deletedCount;
    }
  } catch (err) {
    console.warn('Failed to clear user cache:', err.message);
    return 0;
  }
}

export async function getCacheStats() {
  if (!redis || !isRedisConnected) return null;

  try {
    const info = await redis.info('memory');
    const keyspace = await redis.info('keyspace');
    const dbsize = await redis.dbsize();

    return {
      connected: isRedisConnected,
      totalKeys: dbsize,
      memoryInfo: info,
      keyspaceInfo: keyspace,
      timestamp: Date.now(),
    };
  } catch (err) {
    console.warn('Failed to get cache stats:', err.message);
    return null;
  }
}

// Warmup frequently accessed data
export async function warmupCache(sql) {
  if (!redis || !isRedisConnected) return false;

  try {
    console.log('🔥 Starting cache warmup...');

    // Cache site settings
    const [siteSettings] =
      await sql`SELECT * FROM pw_options WHERE option_name IN ('site_title', 'site_description', 'site_url')`;
    if (siteSettings) {
      await cacheSettings('site_settings', siteSettings, DEFAULT_TTL.VERY_LONG);
    }

    // Cache recent published posts
    const recentPosts = await sql`
      SELECT * FROM pw_posts
      WHERE post_status = 'publish' AND post_type IN ('post', 'page')
      ORDER BY post_date DESC
      LIMIT 10
    `;

    for (const post of recentPosts) {
      await cachePost(post, DEFAULT_TTL.LONG);
    }

    console.log(`✅ Cache warmup completed: ${recentPosts.length} posts cached`);
    return true;
  } catch (err) {
    console.warn('Cache warmup failed:', err.message);
    return false;
  }
}

export { CACHE_PREFIXES, DEFAULT_TTL };
