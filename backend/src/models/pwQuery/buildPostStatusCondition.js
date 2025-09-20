export function buildPostStatusCondition(args, params) {
  const conditions = [];
  const statuses = Array.isArray(args.post_status)
    ? args.post_status
    : args.post_status
      ? [args.post_status]
      : ['publish'];

  if (!statuses.every((s) => typeof s === 'string')) {
    throw new Error('post_status must be string or array of strings');
  }

  if (statuses.includes('any')) {
    conditions.push(`post_status NOT IN ('inherit', 'trash', 'auto-draft')`);
  }

  return conditions;
}
