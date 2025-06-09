import Post from '../../models/post';

export default {
  getPostTags: async function ({ postId }, { connection }) {
    return await Post.getPostTags(postId, connection);
  },
  createPostTag: async function ({ name, slug, description }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.createPostTag(name, slug, description, connection);
    return { success: success };
  },
  updatePostTag: async function ({ name, slug, description, tagId }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePostTag(name, slug, description, tagId, connection);
    return { success: success };
  },
  deletePostTag: async function ({ id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.deletePostTag(id, connection);
    return { success: success };
  },
  updatePostTags: async function ({ tags, postId }, { connection, isAuth }) {
    const tagsData = JSON.parse(tags);
    const success = await Post.updatePostTags(tagsData, postId, connection);
    return { success: success };
  },
};
