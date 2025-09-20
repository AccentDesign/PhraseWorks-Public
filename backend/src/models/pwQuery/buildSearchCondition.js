export function buildSearchCondition(args, params) {
  if (!args.s) return [];
  const searchStr = Array.isArray(args.s) ? args.s : [args.s];
  const conditions = [];

  searchStr.forEach((s) => {
    const isNegative = s.startsWith('-');
    const term = isNegative ? s.slice(1) : s;
    params.push(`%${term}%`, `%${term}%`);
    conditions.push(
      isNegative
        ? `(post_title NOT LIKE $${params.length - 1} AND post_content NOT LIKE $${params.length})`
        : `(post_title LIKE $${params.length - 1} OR post_content LIKE $${params.length})`,
    );
  });

  return conditions;
}
