export function buildAuthorNameCondition(args, params) {
  if (!args.author_name) return [];
  const names = Array.isArray(args.author_name) ? args.author_name : [args.author_name];
  if (!names.every((n) => typeof n === 'string')) {
    throw new Error('author_name must be a string or array of strings');
  }
  const placeholders = names.map((_, i) => `$${params.length + i + 1}`);
  params.push(...names);
  return [
    `post_author IN (
       SELECT id FROM pw_users WHERE user_nicename IN (${placeholders.join(', ')})
     )`,
  ];
}
