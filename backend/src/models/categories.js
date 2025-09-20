export class Categories {
  constructor() {}
  static async getCategory(slug, connection) {
    const category = await connection`
      SELECT 
        t.term_id,
        t.name,
        t.slug,
        tt.description
      FROM pw_terms t
      JOIN pw_term_taxonomy tt ON tt.term_id = t.term_id
      WHERE tt.taxonomy = 'category' AND t.slug = ${slug}
      LIMIT 1;
    `;
    return category[0];
  }

  static async getCategories(type, connection) {
    return connection`
        SELECT 
          t.term_id,
          t.name,
          t.slug,
          tt.description,
          COUNT(tr.object_id) AS post_count
        FROM pw_terms t
        JOIN pw_term_taxonomy tt ON tt.term_id = t.term_id
        LEFT JOIN pw_term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
        WHERE tt.taxonomy = ${type}
        GROUP BY t.term_id, t.name, t.slug, tt.description;
      `;
  }
}
