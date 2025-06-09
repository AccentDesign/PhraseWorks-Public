import Post from '../../models/post';

export default {
  getPosts: async function ({ page, perPage, type, include_trash }, { connection, isAuth }) {
    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 10;
    }
    const totalPosts = await Post.fetchAll(connection, type, include_trash);
    const args = [
      { type: 'limit', value: perPage },
      { type: 'offset', value: (page - 1) * perPage },
    ];

    const posts = await Post.fetch(args, type, connection, include_trash);
    return {
      posts: posts.map((p) => {
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
      total: totalPosts.length,
    };
  },
  getPostsByType: async function ({ page, perPage, type }, { connection }) {
    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 10;
    }
    const totalPosts = await Post.fetchAllPublished(connection, type);
    const args = [
      { type: 'limit', value: perPage },
      { type: 'offset', value: (page - 1) * perPage },
    ];

    const posts = await Post.fetchPublished(args, type, connection);
    return {
      posts: posts.map((p) => {
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
      total: totalPosts.length,
    };
  },
  getPostsByStatus: async function ({ page, perPage, type, status }, { connection, isAuth }) {
    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 10;
    }
    const totalPosts = await Post.fetchAllByStatus(connection, type, status);
    const args = [
      { type: 'limit', value: perPage },
      { type: 'offset', value: (page - 1) * perPage },
    ];

    const posts = await Post.fetchByStatus(args, type, status, connection);
    return {
      posts: posts.map((p) => {
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
      total: totalPosts.length,
    };
  },
  getPostsByAuthor: async function ({ page, perPage, type, author_id }, { connection, isAuth }) {
    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 10;
    }
    const totalPosts = await Post.fetchAllByAuthor(connection, type, author_id);
    const args = [
      { type: 'limit', value: perPage },
      { type: 'offset', value: (page - 1) * perPage },
    ];

    const posts = await Post.fetchByAuthor(args, type, author_id, connection);
    return {
      posts: posts.map((p) => {
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
      total: totalPosts.length,
    };
  },

  getPostsByCategory: async function ({ page, perPage, term_id }, { connection }) {
    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 10;
    }
    const totalPosts = await Post.fetchAllByCategory(connection, term_id);
    const args = [
      { type: 'limit', value: perPage },
      { type: 'offset', value: (page - 1) * perPage },
    ];

    const posts = await Post.fetchbyCategory(args, term_id, connection);
    return {
      posts: posts.map((p) => {
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
      total: totalPosts.length,
    };
  },
  createDraftNewPost: async function (
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
      'post',
      userId,
      connection,
    );
    return success;
  },
  createPublishNewPost: async function (
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
      'post',
      userId,
      connection,
    );
    return success;
  },
  updatePost: async function (
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
  getCategory: async function ({ slug }, { connection }) {
    const category = await Post.getCategory(slug, connection);
    return category;
  },
  getCategories: async function ({ type }, { connection, isAuth }) {
    const categories = await Post.getCategories(type, connection);
    return { categories: categories };
  },
  getPostsAndPagesNavigation: async function ({}, { connection }) {
    const posts = await Post.getAllPostsAndPagesSlugAndChildCount(connection);
    const totalPosts = posts.length;
    return {
      posts,
      total: totalPosts,
    };
  },
  getPostBy: async function ({ field, value }, { connection }) {
    return await Post.getPostBy(field, value, connection);
  },
  getPostByAuthor: async function ({ id }, { connection }) {
    return await Post.getPostByAuthor(id, connection);
  },
  updatePostStatus: async function ({ status, post_id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePostStatus(status, post_id, connection);
    return success;
  },
  updatePostPublishDate: async function ({ date, post_id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePostPublishDate(date, post_id, connection);
    return success;
  },
  updatePostPassword: async function ({ password, post_id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePostPassword(password, post_id, connection);
    return success;
  },
};
