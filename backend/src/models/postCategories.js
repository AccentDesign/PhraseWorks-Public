import System from './system.js';

export class PostCategories {
  constructor() {}
  static async updatePostCategories(categories, postId, connection) {
    try {
      if (!Array.isArray(categories)) return true;

      const sanitizedCategories = categories.filter((id) => Number.isInteger(id));

      const existingLinks = await connection`
        SELECT tr.term_taxonomy_id
        FROM pw_term_relationships tr
        JOIN pw_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
        WHERE tr.object_id = ${postId}
        AND tt.taxonomy = 'category'
      `;

      const existingIds = new Set(existingLinks.map((row) => row.term_taxonomy_id));
      const incomingIds = new Set(sanitizedCategories);

      const toAdd = sanitizedCategories.filter((id) => !existingIds.has(id));
      const toRemove = [...existingIds].filter((id) => !incomingIds.has(id));

      await Promise.all(
        toAdd.map(
          (id) =>
            connection`INSERT INTO pw_term_relationships (object_id, term_taxonomy_id) VALUES (${postId}, ${id})`,
        ),
      );

      if (toRemove.length > 0) {
        await connection`
          DELETE FROM pw_term_relationships
          WHERE object_id = ${postId}
          AND term_taxonomy_id IN (
            SELECT term_taxonomy_id FROM pw_term_taxonomy
            WHERE taxonomy = 'category'
            AND term_taxonomy_id IN ${connection(toRemove)}
          )
        `;
      }

      return true;
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      return false;
    }
  }

  static async getPostCategories(postId, connection) {
    try {
      const categories = await connection`
        SELECT t.term_id, t.name, t.slug, tt.description
        FROM pw_terms t
        JOIN pw_term_taxonomy tt ON tt.term_id = t.term_id
        JOIN pw_term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
        WHERE tr.object_id = ${postId} AND tt.taxonomy = 'category'
      `;
      return { categories: categories };
    } catch (error) {
      console.error('Error fetching post categories:', error);
      return { categories: [] };
    }
  }

  static async fetchPostCategories(postId, connection) {
    return await connection`
      SELECT 
        t.term_id,
        t.name,
        t.slug,
        tt.description
      FROM pw_terms t
      JOIN pw_term_taxonomy tt ON tt.term_id = t.term_id
      JOIN pw_term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
      WHERE tr.object_id = ${postId}
        AND tt.taxonomy = 'category';
    `;
  }

  static async createPostCategory(name, slug, description, connection) {
    try {
      const termResult =
        await connection`INSERT INTO pw_terms(name, slug) VALUES (${name}, ${slug}) RETURNING *`;
      if (termResult.length === 0) return false;

      const id = termResult[0].term_id;
      const taxonomyResult =
        await connection`INSERT INTO pw_term_taxonomy (term_id, taxonomy, description) VALUES (${id}, 'category', ${description})`;
      return taxonomyResult.count === 1;
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      return false;
    }
  }

  static async updatePostCategory(name, slug, description, categoryId, connection) {
    try {
      const termResult = await connection`
        UPDATE pw_terms
        SET name = ${name}, slug = ${slug}
        WHERE term_id = ${categoryId}
      `;

      const taxonomyResult = await connection`
        UPDATE pw_term_taxonomy
        SET description = ${description}
        WHERE term_id = ${categoryId} AND taxonomy = 'category'
      `;

      return termResult.count > 0 && taxonomyResult.count > 0;
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      return false;
    }
  }

  static async deletePostCategory(id, connection) {
    try {
      const taxonomyResult = await connection`
      DELETE FROM pw_term_taxonomy WHERE term_id = ${id}
    `;

      const termResult = await connection`
      DELETE FROM pw_terms WHERE term_id = ${id}
    `;
      return taxonomyResult.count > 0 && termResult.count > 0;
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      return false;
    }
  }
}
