import Post from '../../models/post';

export default {
  getPages: async function ({ page, perPage, type, include_trash }, { connection, isAuth }) {
    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 10;
    }
    const totalPages = await Post.fetchAll(connection, type, include_trash);
    const args = [
      { type: 'limit', value: perPage },
      { type: 'offset', value: (page - 1) * perPage },
    ];

    const pages = await Post.fetch(args, type, connection, include_trash);
    return {
      pages: pages.map((p) => {
        const item = {
          ...p,
          id: p.id,
          post_date: p.post_date.toISOString(),
          post_date_gmt: p.post_date_gmt.toISOString(),
          post_modified: p.post_modified.toISOString(),
          post_modified_gmt: p.post_modified_gmt.toISOString(),
        };
        return item;
      }),
      total: totalPages.length,
    };
  },
  getPagesByStatus: async function ({ page, perPage, type, status }, { connection, isAuth }) {
    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 10;
    }
    const totalPages = await Post.fetchAllByStatus(connection, type, status);
    const args = [
      { type: 'limit', value: perPage },
      { type: 'offset', value: (page - 1) * perPage },
    ];

    const pages = await Post.fetchByStatus(args, type, status, connection);
    return {
      pages: pages.map((p) => {
        const item = {
          ...p,
          id: p.id,
          post_date: p.post_date.toISOString(),
          post_date_gmt: p.post_date_gmt.toISOString(),
          post_modified: p.post_modified.toISOString(),
          post_modified_gmt: p.post_modified_gmt.toISOString(),
        };
        return item;
      }),
      total: totalPages.length,
    };
  },
  getPagesByAuthor: async function ({ page, perPage, type, author_id }, { connection, isAuth }) {
    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 10;
    }
    const totalPages = await Post.fetchAllByAuthor(connection, type, author_id);
    const args = [
      { type: 'limit', value: perPage },
      { type: 'offset', value: (page - 1) * perPage },
    ];

    const pages = await Post.fetchByAuthor(args, type, author_id, connection);
    return {
      pages: pages.map((p) => {
        const item = {
          ...p,
          id: p.id,
          post_date: p.post_date.toISOString(),
          post_date_gmt: p.post_date_gmt.toISOString(),
          post_modified: p.post_modified.toISOString(),
          post_modified_gmt: p.post_modified_gmt.toISOString(),
        };
        return item;
      }),
      total: totalPages.length,
    };
  },
  createDraftNewPage: async function (
    { title, content, featuredImageId, categories, tags },
    { connection, isAuth, userId },
  ) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.createDraftPost(
      title,
      content,
      featuredImageId,
      categories,
      tags,
      'page',
      userId,
      connection,
    );
    return success;
  },
  createPublishNewPage: async function (
    { title, content, featuredImageId, categories, tags },
    { connection, isAuth, userId },
  ) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.createPublishPost(
      title,
      content,
      featuredImageId,
      categories,
      tags,
      'page',
      userId,
      connection,
    );
    return success;
  },
  updatePage: async function (
    { title, content, featuredImageId, postId },
    { connection, isAuth, userId },
  ) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePost(
      title,
      content,
      featuredImageId,
      postId,
      userId,
      connection,
    );
    return success;
  },
  getCategories: async function ({ type }, { connection, isAuth }) {
    const categories = await Post.getCategories(type, connection);
    return { categories: categories };
  },

  getPagesAndPagesNavigation: async function ({}, { connection }) {
    const pages = await Post.getAllPagesAndPagesSlugAndChildCount(connection);
    const totalPages = pages.length;
    return {
      pages,
      total: totalPages,
    };
  },
  getPageBy: async function ({ field, value }, { connection }) {
    return await Post.getPostBy(field, value, connection);
  },
  updatePageStatus: async function ({ status, post_id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePostStatus(status, post_id, connection);
    return success;
  },
  updatePagePublishDate: async function ({ date, post_id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePostPublishDate(date, post_id, connection);
    return success;
  },
  updatePagePassword: async function ({ password, post_id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePostPassword(password, post_id, connection);
    return success;
  },
};
