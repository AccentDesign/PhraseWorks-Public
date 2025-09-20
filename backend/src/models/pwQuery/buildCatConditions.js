export function buildCatConditions(args, params, conditions, joins) {
  if (!args.cat) return;
  const cats = Array.isArray(args.cat) ? args.cat : [args.cat];
  if (!cats.every((c) => typeof c === 'number')) throw new Error('cat must be a number or array');

  const includeCats = cats.filter((c) => c > 0);
  const excludeCats = cats.filter((c) => c < 0).map((c) => Math.abs(c));

  joins.push(`
    INNER JOIN pw_term_relationships tr ON tr.object_id = pw_posts.id
    INNER JOIN pw_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
  `);

  if (includeCats.length > 0) {
    const placeholders = includeCats.map((_, i) => `$${params.length + i + 1}`);
    params.push(...includeCats);
    conditions.push(`tt.term_id IN (${placeholders.join(', ')}) AND tt.taxonomy = 'category'`);
  }

  if (excludeCats.length > 0) {
    const placeholders = excludeCats.map((_, i) => `$${params.length + i + 1}`);
    params.push(...excludeCats);
    conditions.push(`tt.term_id NOT IN (${placeholders.join(', ')}) AND tt.taxonomy = 'category'`);
  }
}
