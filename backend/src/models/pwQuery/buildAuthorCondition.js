export function buildAuthorCondition(args, params) {
  const conditions = [];
  if (!args.author) return conditions;

  const authors = Array.isArray(args.author) ? args.author : [args.author];
  if (!authors.every((a) => typeof a === 'number')) {
    throw new Error('author must be number or array of numbers');
  }

  const includeAuthors = authors.filter((a) => a > 0);
  const excludeAuthors = authors.filter((a) => a < 0).map((a) => Math.abs(a));

  if (includeAuthors.length > 0) {
    const placeholders = includeAuthors.map((_, i) => `$${params.length + i + 1}`);
    params.push(...includeAuthors);
    conditions.push(`post_author IN (${placeholders.join(', ')})`);
  }

  if (excludeAuthors.length > 0) {
    const placeholders = excludeAuthors.map((_, i) => `$${params.length + i + 1}`);
    params.push(...excludeAuthors);
    conditions.push(`post_author NOT IN (${placeholders.join(', ')})`);
  }

  return conditions;
}
