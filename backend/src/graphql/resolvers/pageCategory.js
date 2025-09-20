import Post from '../../models/post.js';
import { PostCategories } from '../../models/postCategories.js';
import System from '../../models/system.js';
import { clearPostAndCategoryCache } from '../../utils/cache.js';
import { sanitizeInput } from '../../utils/sanitizeInputs.js';

export default {
  Query: {
    // getPageCategories: async function ({ postId }, { connection }) {
    //   try {
    //     return await Post.getPostCategories(postId, connection);
    //   } catch {
    //     return [];
    //   }
    // },
  },

  Mutation: {
    createPageCategory: async function (_, { name, slug, description }, { connection, isAuth }) {
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
        return { success: false, error: 'Failed to create category.' };
      }
    },

    updatePageCategory: async function (
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
        return { success: false, error: 'Failed to update category.' };
      }
    },

    deletePageCategory: async function (_, { id }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof id !== 'number') {
        const error = new Error('Invalid or missing ID');
        error.code = 400;
        throw error;
      }

      try {
        const success = await PostCategories.deletePostCategory(id, connection);
        await clearPostAndCategoryCache();
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to delete category.' };
      }
    },

    updatePageCategories: async function (_, { categories, postId }, { connection, isAuth }) {
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
        const categoriesData = JSON.parse(categories);
        const success = await PostCategories.updatePostCategories(
          categoriesData,
          postId,
          connection,
        );
        await clearPostAndCategoryCache();
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update page categories.' };
      }
    },
  },
};
