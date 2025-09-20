export function buildMetaQueryCondition(args, params) {
  const conditions = [];

  if (args.meta_key) {
    const compare = args.meta_compare || '=';
    params.push(args.meta_key);
    let cond = `id IN (
      SELECT post_id FROM pw_postmeta
      WHERE meta_key = $${params.length}`;
    if (args.meta_value !== undefined) {
      params.push(args.meta_value);
      cond += ` AND meta_value ${compare} $${params.length}`;
    }
    cond += ')';
    conditions.push(cond);
  } else if (args.meta_value && !args.meta_query) {
    params.push(args.meta_value);
    conditions.push(`id IN (
      SELECT post_id FROM pw_postmeta
      WHERE meta_value = $${params.length}
    )`);
  }

  if (args.meta_query && Array.isArray(args.meta_query)) {
    const processMetaQuery = (mq) => {
      const innerConditions = [];

      const relation = mq.relation?.toUpperCase() === 'OR' ? ' OR ' : ' AND ';

      mq.forEach((item) => {
        if (item.relation && Array.isArray(item)) {
          innerConditions.push(`(${processMetaQuery(item)})`);
        } else if (item.key) {
          const cmp = item.compare || '=';
          const type = item.type || 'CHAR';
          params.push(item.key);
          let cond = `id IN (
            SELECT post_id FROM pw_postmeta
            WHERE meta_key = $${params.length}`;
          if (item.value !== undefined) {
            params.push(item.value);
            cond += ` AND meta_value ${cmp} $${params.length}`;
          }
          cond += ')';
          innerConditions.push(cond);
        }
      });

      return innerConditions.join(relation);
    };

    conditions.push(processMetaQuery(args.meta_query));
  }

  return conditions;
}
