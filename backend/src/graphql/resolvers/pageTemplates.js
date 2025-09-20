import { PageTemplate } from '../../models/pageTemplate.js';
import System from '../../models/system.js';

export default {
  Query: {
    getPageTemplate: async function (_, { slug }, { connection }) {
      try {
        const query = `
          SELECT * 
          FROM pw_posts
          WHERE post_name = $1 AND post_type = 'page'
        `;
        const post = await connection.unsafe(query, [slug]);
        if (post.length === 0) return null;

        const queryMeta = `
          SELECT * 
          FROM pw_postmeta
          WHERE post_id = $1 AND meta_key = '_template_id'
        `;
        const meta = await connection.unsafe(queryMeta, [post[0].id]);
        if (meta.length === 0) return null;

        const template = await PageTemplate.getPageTemplate(
          parseInt(meta[0].meta_value, 10),
          connection,
        );
        if (template.length === 0) return null;

        return template[0];
      } catch {
        throw new Error('Failed to fetch page template.');
      }
    },

    getPageTemplates: async function (_, { page, perPage }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const data = await PageTemplate.getPageTemplates(page, perPage, connection);
        const allTemplates = await PageTemplate.getAllPageTemplates(connection);
        return { templates: data, total: allTemplates.length };
      } catch {
        return { templates: [], total: 0, error: 'Failed to fetch page templates.' };
      }
    },

    getPageTemplatesAll: async function (_, __, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const data = await PageTemplate.getAllPageTemplates(connection);
        return { templates: data, total: data.length };
      } catch {
        return { templates: [], total: 0, error: 'Failed to fetch all page templates.' };
      }
    },
  },

  Mutation: {
    createPageTemplate: async function (_, { name, filename }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanName = sanitizeInput(name);
      const cleanFilename = sanitizeInput(filename);

      try {
        const success = await PageTemplate.createPageTemplate(cleanName, cleanFilename, connection);
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to create page template.' };
      }
    },

    updatePageTemplate: async function (_, { name, filename, templateId }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanName = sanitizeInput(name);
      const cleanFilename = sanitizeInput(filename);

      if (typeof templateId !== 'number') {
        const error = new Error('Invalid or missing template ID');
        error.code = 400;
        throw error;
      }

      try {
        const success = await PageTemplate.updatePageTemplate(
          cleanName,
          cleanFilename,
          templateId,
          connection,
        );
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update page template.' };
      }
    },

    updatePageTemplateId: async function (_, { templateId, postId }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof templateId !== 'number') {
        const error = new Error('Invalid or missing template ID');
        error.code = 400;
        throw error;
      }
      if (typeof postId !== 'number') {
        const error = new Error('Invalid or missing post ID');
        error.code = 400;
        throw error;
      }

      try {
        const success = await PageTemplate.updatePageTemplateId(templateId, postId, connection);
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update page template ID.' };
      }
    },
  },
};
