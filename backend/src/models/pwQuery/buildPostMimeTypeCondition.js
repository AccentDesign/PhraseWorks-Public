export function buildPostMimeTypeCondition(args, params) {
  const conditions = [];

  if (!args.post_mime_type) return conditions;

  if (Array.isArray(args.post_mime_type)) {
    if (!args.post_mime_type.every((m) => typeof m === 'string')) {
      throw new Error('post_mime_type must be string or array of strings');
    }
    const placeholders = args.post_mime_type.map((_, i) => `$${params.length + i + 1}`);
    params.push(...args.post_mime_type);
    conditions.push(`post_mime_type IN (${placeholders.join(', ')})`);
  } else if (typeof args.post_mime_type === 'string') {
    params.push(args.post_mime_type);
    conditions.push(`post_mime_type = $${params.length}`);
  } else {
    throw new Error('post_mime_type must be a string or array of strings');
  }

  return conditions;
}
