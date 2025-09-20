import Post from '../../models/post.js';
import { PostTags } from '../../models/postTags.js';
import System from '../../models/system.js';
import { Tags } from '../../models/tags.js';
import { clearPostAndCategoryCache } from '../../utils/cache.js';
import { sanitizeInput } from '../../utils/sanitizeInputs.js';

export default {
  Query: {
    getTags: async function (_, { type }, { connection }) {
      try {
        const tags = await Tags.getTags(type, connection);
        return { tags };
      } catch {
        return { tags: [], error: 'Failed to fetch tags.' };
      }
    },
  },

  Mutation: {
    createPageTag: async function (_, { name, slug, description }, { connection, isAuth }) {
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
        return { success: false, error: 'Failed to create tag.' };
      }
    },

    updatePageTag: async function (_, { name, slug, description, tagId }, { connection, isAuth }) {
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
        return { success: false, error: 'Failed to update tag.' };
      }
    },

    deletePageTag: async function (_, { id }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof id !== 'number') {
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
        return { success: false, error: 'Failed to delete tag.' };
      }
    },

    updatePageTags: async function (_, { tags, postId }, { connection, isAuth }) {
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

      try {
        const tagsData = typeof tags === 'string' ? JSON.parse(tags) : tags;
        const success = await PostTags.updatePostTags(tagsData, postId, connection);
        await clearPostAndCategoryCache();
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update tags.' };
      }
    },
  },
};
