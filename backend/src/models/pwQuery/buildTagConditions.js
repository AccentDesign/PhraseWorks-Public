export function buildTagConditions(args, params, conditions, joins) {
  if (!args.tag) return;
  const tags = Array.isArray(args.tag) ? args.tag : [args.tag];
  if (!tags.every((t) => typeof t === 'number')) throw new Error('tag must be a number or array');

  const includeTags = tags.filter((t) => t > 0);
  const excludeTags = tags.filter((t) => t < 0).map((t) => Math.abs(t));

  joins.push(`
    INNER JOIN pw_term_relationships tr ON tr.object_id = pw_posts.id
    INNER JOIN pw_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
  `);

  if (includeTags.length > 0) {
    const placeholders = includeTags.map((_, i) => `$${params.length + i + 1}`);
    params.push(...includeTags);
    conditions.push(`tt.term_id IN (${placeholders.join(', ')}) AND tt.taxonomy = 'post_tag'`);
  }

  if (excludeTags.length > 0) {
    const placeholders = excludeTags.map((_, i) => `$${params.length + i + 1}`);
    params.push(...excludeTags);
    conditions.push(`tt.term_id NOT IN (${placeholders.join(', ')}) AND tt.taxonomy = 'post_tag'`);
  }
}
