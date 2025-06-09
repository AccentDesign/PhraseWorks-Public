import Post from '../../models/post';

export default {
  getPageTemplate: async function ({ slug }, { connection }) {
    const query = `
        SELECT * 
        FROM pw_posts
        WHERE post_name = $1 AND post_type = 'page'
    `;
    const post = await connection.unsafe(query, [slug]);
    if (post.length == 0) return null;

    const queryMeta = `
        SELECT * 
        FROM pw_postmeta
        WHERE post_id = $1 AND meta_key = '_template_id'
    `;
    const meta = await connection.unsafe(queryMeta, [post[0].id]);
    if (meta.length == 0) return null;

    const template = await Post.getPageTemplate(parseInt(meta[0].meta_value), connection);
    if (template.length == 0) return null;
    return template[0];
  },
  getPageTemplates: async function ({ page, perPage }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const data = await Post.getPageTemplates(page, perPage, connection);
    const allTemplates = await Post.getAllPageTemplates(connection);
    return { templates: data, total: allTemplates.length };
  },
  getPageTemplatesAll: async function ({}, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const data = await Post.getAllPageTemplates(connection);
    return { templates: data, total: data.length };
  },
  createPageTemplate: async function ({ name, filename }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.createPageTemplate(name, filename, connection);
    return { success: success };
  },
  updatePageTemplate: async function ({ name, filename, templateId }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePageTemplate(name, filename, templateId, connection);
    return { success: success };
  },
  updatePageTemplateId: async function ({ templateId, postId }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePageTemplateId(templateId, postId, connection);
    return { success: success };
  },
};
