export function buildPostTypeCondition(args, params) {
  const conditions = [];
  if (args.post_type) {
    if (Array.isArray(args.post_type)) {
      if (!args.post_type.every((type) => typeof type === 'string')) {
        throw new Error('post_type array must contain strings');
      }
      if (args.post_type.includes('any')) {
        conditions.push(`post_type NOT IN ('revision', 'attachment')`);
      } else {
        const placeholders = args.post_type.map((_, i) => `$${params.length + i + 1}`);
        params.push(...args.post_type);
        conditions.push(`post_type IN (${placeholders.join(', ')})`);
      }
    } else if (typeof args.post_type === 'string') {
      if (args.post_type === 'any') {
        conditions.push(`post_type NOT IN ('revision', 'attachment')`);
      } else {
        params.push(args.post_type);
        conditions.push(`post_type = $${params.length}`);
      }
    } else {
      throw new Error('post_type must be a string or an array of strings');
    }
  }
  return conditions;
}
