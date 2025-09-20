import Post from '../../models/post.js';
import { PostTags } from '../../models/postTags.js';
import System from '../../models/system.js';
import { clearPostAndCategoryCache } from '../../utils/cache.js';
import { sanitizeInput } from '../../utils/sanitizeInputs.js';

export default {
  Query: {
    getPostTags: async function (_, { postId }, { connection }) {
      try {
        const tags = await PostTags.getPostTags(postId, connection);
        return tags.tags;
      } catch {
        throw new Error('Failed to fetch post tags.');
      }
    },
  },

  Mutation: {
    createPostTag: async function (_, { name, slug, description }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanName = sanitizeInput(name);
      const cleanSlug = sanitizeInput(slug);
      const cleanDescription = sanitizeInput(description);

      try {
        const success = await PostTags.createPostTag(
          cleanName,
          cleanSlug,
          cleanDescription,
          connection,
        );
        await clearPostAndCategoryCache();
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to create post tag.' };
      }
    },

    updatePostTag: async function (_, { tagId, name, slug, description }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanName = sanitizeInput(name);
      const cleanSlug = sanitizeInput(slug);
      const cleanDescription = sanitizeInput(description);

      if (typeof tagId !== 'number') {
        const error = new Error('Invalid or missing tag ID');
        error.code = 400;
        throw error;
      }

      try {
        const success = await PostTags.updatePostTag(
          cleanName,
          cleanSlug,
          cleanDescription,
          tagId,
          connection,
        );
        await clearPostAndCategoryCache();
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update post tag.' };
      }
    },

    deletePostTag: async function (_, { id }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof tagId !== 'number') {
        const error = new Error('Invalid or missing tag ID');
        error.code = 400;
        throw error;
      }

      try {
        const success = await PostTags.deletePostTag(id, connection);
        await clearPostAndCategoryCache();
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to delete post tag.' };
      }
    },

    updatePostTags: async function (_, { tags, postId }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof postId !== 'number') {
        const error = new Error('Invalid or missing post ID');
        error.code = 400;
        throw error;
      }

      let parsedTags;
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Invalid JSON for tags.' };
      }
      try {
        const success = await PostTags.updatePostTags(parsedTags, postId, connection);
        await clearPostAndCategoryCache();
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update post tags.' };
      }
    },
  },
};
