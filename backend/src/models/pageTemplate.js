import System from './system.js';

export class PageTemplate {
  constructor() {}
  static async getPageTemplates(offset, perPage, connection) {
    const limit = perPage ?? 10;
    const page = offset - 1;
    const rows =
      await connection`SELECT * FROM pw_page_templates ORDER BY id DESC LIMIT ${limit} OFFSET ${page}`;
    return rows;
  }

  static async getPageTemplate(id, connection) {
    const rows = await connection`SELECT * FROM pw_page_templates WHERE id=${id}`;
    return rows;
  }

  static async getAllPageTemplates(connection) {
    const rows = await connection`SELECT * FROM pw_page_templates`;
    return rows;
  }

  static async createPageTemplate(name, filename, connection) {
    try {
      const result =
        await connection`INSERT INTO pw_page_templates(name, file_name) VALUES (${name}, ${filename}) RETURNING *`;
      return result.count === 1;
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      return false;
    }
  }

  static async updatePageTemplate(name, filename, templateId, connection) {
    try {
      const result = await connection`
        UPDATE pw_page_templates
        SET name = ${name}, file_name = ${filename}
        WHERE id = ${templateId}
        RETURNING *
      `;
      return result.length === 1;
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      return false;
    }
  }

  static async updatePageTemplateId(templateId, postId, connection) {
    try {
      if (templateId === -1) {
        await connection`
          DELETE FROM pw_postmeta
          WHERE post_id = ${postId} AND meta_key = '_template_id'
        `;
      } else {
        const existing = await connection`
        SELECT meta_id FROM pw_postmeta
        WHERE post_id = ${postId} AND meta_key = '_template_id'
        LIMIT 1
      `;

        if (existing.length > 0) {
          await connection`
          UPDATE pw_postmeta
          SET meta_value = ${templateId}
          WHERE meta_id = ${existing[0].meta_id}
        `;
        } else {
          await connection`
          INSERT INTO pw_postmeta (post_id, meta_key, meta_value)
          VALUES (${postId}, '_template_id', ${templateId})
        `;
        }
      }
      return true;
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      return false;
    }
  }
}
