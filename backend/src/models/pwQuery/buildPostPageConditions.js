export async function buildPostPageConditions(args, params, conditions, connection) {
  if (args.p) {
    params.push(args.p);
    conditions.push(`id = $${params.length}`);
  }
  if (args.name) {
    params.push(args.name);
    conditions.push(`post_name = $${params.length}`);
  }
  if (args.page_id) {
    params.push(args.page_id);
    conditions.push(`id = $${params.length}`);
  }

  if (args.pagename) {
    const slugs = args.pagename.split('/');
    let parentId = 0;
    for (let i = 0; i < slugs.length - 1; i++) {
      const slug = slugs[i];
      const parentRows = await connection.unsafe(
        `SELECT id FROM pw_posts WHERE post_name = $1 AND post_type = 'page' AND post_parent = $2`,
        [slug, parentId],
      );
      parentId = parentRows.length ? parentRows[0].id : 0;
    }
    const childSlug = slugs[slugs.length - 1];
    params.push(childSlug, parentId);
    conditions.push(`post_name = $${params.length - 1} AND post_parent = $${params.length}`);
  }

  if (args.post_parent !== undefined) {
    params.push(args.post_parent);
    conditions.push(`post_parent = $${params.length}`);
  }
  if (args.post_parent__in) {
    const parents = Array.isArray(args.post_parent__in)
      ? args.post_parent__in
      : [args.post_parent__in];
    if (!parents.every((p) => typeof p === 'number'))
      throw new Error('post_parent__in must be numbers');
    const placeholders = parents.map((_, i) => `$${params.length + i + 1}`);
    params.push(...parents);
    conditions.push(`post_parent IN (${placeholders.join(', ')})`);
  }
  if (args.post_parent__not_in) {
    const parents = Array.isArray(args.post_parent__not_in)
      ? args.post_parent__not_in
      : [args.post_parent__not_in];
    if (!parents.every((p) => typeof p === 'number'))
      throw new Error('post_parent__not_in must be numbers');
    const placeholders = parents.map((_, i) => `$${params.length + i + 1}`);
    params.push(...parents);
    conditions.push(`post_parent NOT IN (${placeholders.join(', ')})`);
  }

  if (args.post__in) {
    const ids = Array.isArray(args.post__in) ? args.post__in : [args.post__in];
    if (!ids.every((id) => typeof id === 'number')) throw new Error('post__in must be numbers');
    const placeholders = ids.map((_, i) => `$${params.length + i + 1}`);
    params.push(...ids);
    conditions.push(`id IN (${placeholders.join(', ')})`);
  }

  if (args.post__not_in) {
    const ids = Array.isArray(args.post__not_in) ? args.post__not_in : [args.post__not_in];
    if (!ids.every((id) => typeof id === 'number')) throw new Error('post__not_in must be numbers');
    const placeholders = ids.map((_, i) => `$${params.length + i + 1}`);
    params.push(...ids);
    conditions.push(`id NOT IN (${placeholders.join(', ')})`);
  }

  if (args.post_name__in) {
    const names = Array.isArray(args.post_name__in) ? args.post_name__in : [args.post_name__in];
    if (!names.every((n) => typeof n === 'string'))
      throw new Error('post_name__in must be strings');
    const placeholders = names.map((_, i) => `$${params.length + i + 1}`);
    params.push(...names);
    conditions.push(`post_name IN (${placeholders.join(', ')})`);
  }

  if (args.title) {
    params.push(args.title);
    conditions.push(`post_title = $${params.length}`);
  }
}
