import System from './system.js';

export class PostSEO {
  constructor() {}
  static async getPostSEOById(postId, connection) {
    const existing = await connection`
          SELECT * FROM pw_postmeta
          WHERE post_id = ${postId} AND meta_key = '_seo'
          LIMIT 1;
        `;
    if (existing.length == 0) {
      return null;
    }
    const seo = JSON.parse(JSON.parse(existing[0].meta_value));

    const reading = await connection`
        SELECT * FROM pw_options
        WHERE option_name = 'search_engine_visibility'
      `;
    if (reading.length === 0) {
      return existing[0].meta_value;
    }

    seo.search_engine_visibility = reading[0].option_value === 'true';

    return JSON.stringify(JSON.stringify(seo));
  }

  static async updatePostSEO(postId, seo, connection) {
    let metaValue = seo;

    try {
      if (typeof seo !== 'string') {
        metaValue = JSON.stringify(seo);
      }
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      metaValue = '{}';
    }
    const result = await connection`
      INSERT INTO pw_postmeta (post_id, meta_key, meta_value)
      VALUES (${postId}, '_seo', ${metaValue})
      ON CONFLICT (post_id, meta_key) DO UPDATE SET meta_value = EXCLUDED.meta_value
      RETURNING *;
    `;
    if (result.length > 0) {
      return true;
    }
    return false;
  }
}
