import Post from '../../models/post.js';
import { connectedClients } from '../../server/websocket.js';
import { sanitizeInput } from '../../utils/sanitizeInputs.js';
import { Categories } from '../../models/categories.js';
import System from '../../models/system.js';
import { clearPostAndCategoryCache } from '../../utils/cache.js';

function notifyPostChanges() {
  for (const [clientId, ws] of connectedClients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'UPDATE_ADMIN_PAGES' }));
    }
  }
}

function formatPostDates(post) {
  return {
    ...post,
    id: post.id,
    post_date: post.post_date.toISOString(),
    post_date_gmt: post.post_date_gmt.toISOString(),
    post_modified: post.post_modified.toISOString(),
    post_modified_gmt: post.post_modified_gmt.toISOString(),
  };
}

export default {
  Query: {
    getPages: async function (
      _,
      { page = 1, perPage = 10, type, include_trash },
      { connection, isAuth, loaders },
    ) {
      try {
        const totalPages = await Post.fetchAll(connection, type, include_trash);
        const args = [
          { type: 'limit', value: perPage },
          { type: 'offset', value: (page - 1) * perPage },
        ];
        const pages = await Post.fetch(args, type, connection, include_trash, loaders);
        return {
          pages: pages.map(formatPostDates),
          total: totalPages.length,
        };
      } catch {
        return { pages: [], total: 0, error: 'Failed to fetch pages.' };
      }
    },

    getPagesByStatus: async function (
      _,
      { page = 1, perPage = 10, type, status },
      { connection, isAuth, loaders },
    ) {
      try {
        const totalPages = await Post.fetchAllByStatus(connection, type, status);
        const args = [
          { type: 'limit', value: perPage },
          { type: 'offset', value: (page - 1) * perPage },
        ];
        const pages = await Post.fetchByStatus(args, type, status, connection, loaders);
        return {
          pages: pages.map(formatPostDates),
          total: totalPages.length,
        };
      } catch {
        return { pages: [], total: 0, error: 'Failed to fetch pages by status.' };
      }
    },

    getPagesByAuthor: async function (
      _,
      { page = 1, perPage = 10, type, author_id },
      { connection, isAuth, loaders },
    ) {
      try {
        const totalPages = await Post.fetchAllByAuthor(connection, type, author_id);
        const args = [
          { type: 'limit', value: perPage },
          { type: 'offset', value: (page - 1) * perPage },
        ];
        const pages = await Post.fetchByAuthor(args, type, author_id, connection, loaders);
        return {
          pages: pages.map(formatPostDates),
          total: totalPages.length,
        };
      } catch {
        return { pages: [], total: 0, error: 'Failed to fetch pages by author.' };
      }
    },

    getCategories: async function (_, { type }, { connection, isAuth, loaders }) {
      try {
        const categories = await Categories.getCategories(type, connection, loaders);
        return { categories };
      } catch {
        return { categories: [], error: 'Failed to get categories.' };
      }
    },

    getPagesAndPagesNavigation: async function (_, {}, { connection }) {
      try {
        const pages = await Post.getAllPagesAndPagesSlugAndChildCount(connection);
        return { pages, total: pages.length };
      } catch {
        return { pages: [], total: 0, error: 'Failed to fetch pages navigation.' };
      }
    },

    getPageBy: async function (_, { field, value }, { connection, loaders }) {
      try {
        return await Post.getPostBy(field, value, connection, loaders);
      } catch {
        return null;
      }
    },
  },

  Mutation: {
    createDraftNewPage: async function (
      _,
      { title, content, featuredImageId, categories, tags },
      { connection, isAuth, userId },
    ) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const cleanTitle = sanitizeInput(title);
      const cleanContent = sanitizeInput(content);

      const safeCategories = Array.isArray(categories) ? categories : [];
      const safeTags = Array.isArray(tags) ? tags : [];
      const safeFeaturedImageId = typeof featuredImageId === 'number' ? featuredImageId : null;

      try {
        const draftPage = await Post.createDraftPost(
          cleanTitle,
          cleanContent,
          safeFeaturedImageId,
          safeCategories,
          safeTags,
          'page',
          userId,
          connection,
        );

        try {
          if (draftPage?.id) {
            await clearPostAndCategoryCache();
          }
        } catch (cacheErr) {
          console.warn('⚠️ Failed to update Redis cache for draft page:', cacheErr.message);
        }

        return draftPage;
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to create draft page.' };
      }
    },

    createPublishNewPage: async function (
      _,
      { title, content, featuredImageId, categories, tags },
      { connection, isAuth, userId },
    ) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanTitle = sanitizeInput(title);
      const cleanContent = sanitizeInput(content);

      const safeCategories = Array.isArray(categories) ? categories : [];
      const safeTags = Array.isArray(tags) ? tags : [];
      const safeFeaturedImageId = typeof featuredImageId === 'number' ? featuredImageId : null;

      try {
        const newPage = await Post.createPublishPost(
          cleanTitle,
          cleanContent,
          safeFeaturedImageId,
          safeCategories,
          safeTags,
          'page',
          userId,
          connection,
          notifyPostChanges,
        );

        try {
          if (newPage?.id) {
            await clearPostAndCategoryCache();
          }
        } catch (cacheErr) {
          console.warn('⚠️ Failed to update Redis cache for new page:', cacheErr.message);
        }

        return newPage;
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to publish new page.' };
      }
    },

    updatePage: async function (
      _,
      { title, content, featuredImageId, postId },
      { connection, isAuth, userId },
    ) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanTitle = sanitizeInput(title);
      const cleanContent = sanitizeInput(content);

      const safeFeaturedImageId = typeof featuredImageId === 'number' ? featuredImageId : null;

      try {
        const updatedPage = await Post.updatePost(
          cleanTitle,
          cleanContent,
          safeFeaturedImageId,
          postId,
          userId,
          connection,
          notifyPostChanges,
        );

        try {
          await clearPostAndCategoryCache();
        } catch (err) {
          console.warn('⚠️ Failed to update Redis cache for page:', err.message);
        }

        return updatedPage;
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update page.' };
      }
    },

    updatePageStatus: async function (_, { status, post_id }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanStatus = sanitizeInput(status);
      if (typeof post_id !== 'number') {
        const error = new Error('Invalid or missing post_id');
        error.code = 400;
        throw error;
      }

      try {
        const success = await Post.updatePostStatus(
          cleanStatus,
          post_id,
          connection,
          notifyPostChanges,
        );

        try {
          const page = await Post.getPostBy('id', post_id, connection, loaders);
          if (page) {
            await clearPostAndCategoryCache();
          }
        } catch (cacheErr) {
          console.warn('⚠️ Failed to update Redis cache for page:', cacheErr.message);
        }

        return success;
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update page status.' };
      }
    },

    updatePagePublishDate: async function (_, { date, post_id }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof post_id !== 'number') {
        const error = new Error('Invalid or missing post_id');
        error.code = 400;
        throw error;
      }

      const publishDate = new Date(date);
      if (isNaN(publishDate.getTime())) {
        const error = new Error('Invalid publish date');
        error.code = 400;
        throw error;
      }

      try {
        const success = await Post.updatePostPublishDate(date, post_id, connection);

        try {
          const page = await Post.getPostBy('id', post_id, connection, loaders);
          if (page) {
            await clearPostAndCategoryCache();
          }
        } catch (cacheErr) {
          console.warn('⚠️ Failed to update Redis cache for page:', cacheErr.message);
        }

        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update publish date.' };
      }
    },

    updatePagePassword: async function (_, { password, post_id }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof post_id !== 'number') {
        const error = new Error('Invalid or missing post_id');
        error.code = 400;
        throw error;
      }

      if (typeof password !== 'string' || password.length === 0) {
        const error = new Error('Invalid or missing password');
        error.code = 400;
        throw error;
      }

      try {
        const success = await Post.updatePostPassword(password, post_id, connection);

        try {
          const page = await Post.getPostBy('id', post_id, connection, loaders);
          if (page) {
            await clearPostAndCategoryCache();
          }
        } catch (cacheErr) {
          console.warn('⚠️ Failed to update Redis cache for page:', cacheErr.message);
        }

        return success;
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update page password.' };
      }
    },
  },
};
