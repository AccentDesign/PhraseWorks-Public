import Post from '../../models/post.js';
import { PostCategories } from '../../models/postCategories.js';
import System from '../../models/system.js';
import { sanitizeInput } from '../../utils/sanitizeInputs.js';
import { clearPostAndCategoryCache } from '../../utils/cache.js';

export default {
  Query: {
    getPostCategories: async function (_, { postId }, { connection }) {
      try {
        return await PostCategories.getPostCategories(postId, connection);
      } catch {
        throw new Error('Failed to get post categories.');
      }
    },
  },

  Mutation: {
    createPostCategory: async function (_, { name, slug, description }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanName = sanitizeInput(name);
      const cleanSlug = sanitizeInput(slug);
      const cleanDescription = sanitizeInput(description);

      try {
        const success = await PostCategories.createPostCategory(
          cleanName,
          cleanSlug,
          cleanDescription,
          connection,
        );
        await clearPostAndCategoryCache();
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to create post category.' };
      }
    },

    updatePostCategory: async function (
      _,
      { name, slug, description, categoryId },
      { connection, isAuth },
    ) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanName = sanitizeInput(name);
      const cleanSlug = sanitizeInput(slug);
      const cleanDescription = sanitizeInput(description);

      if (typeof categoryId !== 'number') {
        const error = new Error('Invalid or missing category ID');
        error.code = 400;
        throw error;
      }

      try {
        const success = await PostCategories.updatePostCategory(
          cleanName,
          cleanSlug,
          cleanDescription,
          categoryId,
          connection,
        );
        await clearPostAndCategoryCache();
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update post category.' };
      }
    },

    deletePostCategory: async function (_, { id }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof id !== 'number') {
        const error = new Error('Invalid or missing category ID');
        error.code = 400;
        throw error;
      }

      try {
        const success = await PostCategories.deletePostCategory(id, connection);
        await clearPostAndCategoryCache();
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to delete post category.' };
      }
    },

    updatePostCategories: async function (_, { categories, postId }, { connection, isAuth }) {
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
        const categoriesData = typeof categories === 'string' ? JSON.parse(categories) : categories;
        const success = await PostCategories.updatePostCategories(
          categoriesData,
          postId,
          connection,
        );
        await clearPostAndCategoryCache();
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update post categories.' };
      }
    },
  },
};
