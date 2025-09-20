export function buildPermissionCondition(args, params, user) {
  const conditions = [];

  if (!args.perm) return conditions;

  const postStatuses = Array.isArray(args.post_status)
    ? args.post_status
    : args.post_status
      ? [args.post_status]
      : ['publish'];

  const userCaps = user?.capabilities || [];

  switch (args.perm) {
    case 'readable':
      if (userCaps.includes('read_private_posts')) {
        if (postStatuses.length) {
          const placeholders = postStatuses.map((_, i) => `$${params.length + i + 1}`);
          params.push(...postStatuses);
          conditions.push(`post_status IN (${placeholders.join(', ')})`);
        }
      } else {
        if (postStatuses.includes('private')) {
          const allowedStatuses = postStatuses.filter((s) => s !== 'private');
          if (allowedStatuses.length) {
            const placeholders = allowedStatuses.map((_, i) => `$${params.length + i + 1}`);
            params.push(...allowedStatuses);
            conditions.push(`post_status IN (${placeholders.join(', ')})`);
          } else {
            params.push('publish');
            conditions.push(`post_status = $${params.length}`);
          }
        } else {
          const placeholders = postStatuses.map((_, i) => `$${params.length + i + 1}`);
          params.push(...postStatuses);
          conditions.push(`post_status IN (${placeholders.join(', ')})`);
        }
      }
      break;

    case 'edit':
      if (!userCaps.includes('edit_posts')) {
        conditions.push('1=0');
      }
      break;

    case 'delete':
      if (!userCaps.includes('delete_posts')) {
        conditions.push('1=0');
      }
      break;

    default:
      throw new Error(`Unknown permission type: ${args.perm}`);
  }

  return conditions;
}
