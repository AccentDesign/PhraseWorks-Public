import Post from '../../models/post';
export default {
  getPageCategories: async function ({ postId }, { connection }) {
    return await Post.getPostCategories(postId, connection);
  },
  createPageCategory: async function ({ name, slug, description }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.createPostCategory(name, slug, description, connection);
    return { success: success };
  },
  updatePageCategory: async function (
    { name, slug, description, categoryId },
    { connection, isAuth },
  ) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePostCategory(name, slug, description, categoryId, connection);
    return { success: success };
  },
  deletePageCategory: async function ({ id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.deletePostCategory(id, connection);
    return { success: success };
  },
  updatePageCategories: async function ({ categories, postId }, { connection, isAuth }) {
    const categoriesData = JSON.parse(categories);
    const success = await Post.updatePostCategories(categoriesData, postId, connection);
    return { success: success };
  },
};
