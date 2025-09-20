import {
  getCacheStats,
  clearAllCache,
  clearPostAndCategoryCache,
  clearMediaCache,
  clearUserCache,
  delCacheByTags,
  warmupCache,
} from '../../utils/cache.js';

const cacheResolvers = {
  Query: {
    getCacheStats: async (parent, args, context) => {
      const { isAuth, userId, connection } = context;

      if (!isAuth) {
        throw new Error('Authentication required');
      }

      // Check if user is admin
      const [user] = await connection`
        SELECT u.*, um.meta_value as role_id
        FROM pw_users u
        LEFT JOIN pw_usermeta um ON u.id = um.user_id AND um.meta_key = 'pw_user_role'
        WHERE u.id = ${userId}
      `;

      if (!user || user.role_id !== '1') {
        throw new Error('Administrator access required');
      }

      return await getCacheStats();
    },
  },

  Mutation: {
    clearCache: async (parent, { type = 'all', tags = [] }, context) => {
      const { isAuth, userId, connection } = context;

      if (!isAuth) {
        throw new Error('Authentication required');
      }

      // Check if user is admin
      const [user] = await connection`
        SELECT u.*, um.meta_value as role_id
        FROM pw_users u
        LEFT JOIN pw_usermeta um ON u.id = um.user_id AND um.meta_key = 'pw_user_role'
        WHERE u.id = ${userId}
      `;

      if (!user || user.role_id !== '1') {
        throw new Error('Administrator access required');
      }

      let deletedCount = 0;

      try {
        switch (type) {
          case 'all':
            deletedCount = await clearAllCache();
            break;
          case 'posts':
            deletedCount = await clearPostAndCategoryCache();
            break;
          case 'media':
            deletedCount = await clearMediaCache();
            break;
          case 'users':
            deletedCount = await clearUserCache();
            break;
          case 'tags':
            if (tags.length > 0) {
              deletedCount = await delCacheByTags(tags);
            }
            break;
          default:
            throw new Error(`Unknown cache type: ${type}`);
        }

        return {
          success: true,
          message: `Successfully cleared ${deletedCount} cache entries`,
          deletedCount,
        };
      } catch (error) {
        const errorMessage = error?.message || error?.toString() || 'Unknown error';
        console.error('Cache clear error:', error);
        return {
          success: false,
          message: `Failed to clear cache: ${errorMessage}`,
          deletedCount: 0,
        };
      }
    },

    warmupCache: async (parent, args, context) => {
      const { isAuth, userId, connection } = context;

      if (!isAuth) {
        throw new Error('Authentication required');
      }

      // Check if user is admin
      const [user] = await connection`
        SELECT u.*, um.meta_value as role_id
        FROM pw_users u
        LEFT JOIN pw_usermeta um ON u.id = um.user_id AND um.meta_key = 'pw_user_role'
        WHERE u.id = ${userId}
      `;

      if (!user || user.role_id !== '1') {
        throw new Error('Administrator access required');
      }

      try {
        const success = await warmupCache(connection);
        return {
          success,
          message: success
            ? 'Cache warmup completed successfully'
            : 'Cache warmup failed or Redis not available',
        };
      } catch (error) {
        return {
          success: false,
          message: `Cache warmup failed: ${error.message}`,
        };
      }
    },
  },
};

export default cacheResolvers;
