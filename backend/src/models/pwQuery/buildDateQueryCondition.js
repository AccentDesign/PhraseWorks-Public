export function buildDateQueryCondition(args, params) {
  if (!args.date_query || !Array.isArray(args.date_query)) return [];

  const conditions = [];

  args.date_query.forEach((dq) => {
    const subConditions = [];

    if (dq.year !== undefined) {
      params.push(dq.year);
      subConditions.push(`EXTRACT(YEAR FROM post_date) = $${params.length}`);
    }
    if (dq.month !== undefined) {
      params.push(dq.month);
      subConditions.push(`EXTRACT(MONTH FROM post_date) = $${params.length}`);
    }
    if (dq.week !== undefined) {
      params.push(dq.week);
      subConditions.push(`EXTRACT(WEEK FROM post_date) = $${params.length}`);
    }
    if (dq.day !== undefined) {
      params.push(dq.day);
      subConditions.push(`EXTRACT(DAY FROM post_date) = $${params.length}`);
    }
    if (dq.hour !== undefined) {
      params.push(dq.hour);
      subConditions.push(`EXTRACT(HOUR FROM post_date) ${dq.compare || '='} $${params.length}`);
    }
    if (dq.minute !== undefined) {
      params.push(dq.minute);
      subConditions.push(`EXTRACT(MINUTE FROM post_date) ${dq.compare || '='} $${params.length}`);
    }
    if (dq.second !== undefined) {
      params.push(dq.second);
      subConditions.push(`EXTRACT(SECOND FROM post_date) ${dq.compare || '='} $${params.length}`);
    }

    if (dq.after) {
      if (typeof dq.after === 'string') {
        params.push(dq.after);
        subConditions.push(`post_date >= $${params.length}`);
      } else if (typeof dq.after === 'object') {
        const year = dq.after.year || 1970;
        const month = dq.after.month || 1;
        const day = dq.after.day || 1;
        const afterDate = new Date(year, month - 1, day).toISOString();
        params.push(afterDate);
        subConditions.push(`post_date >= $${params.length}`);
      }
      if (dq.inclusive === false) {
        subConditions[subConditions.length - 1] = subConditions[subConditions.length - 1].replace(
          '>=',
          '>',
        );
      }
    }

    if (dq.before) {
      if (typeof dq.before === 'string') {
        params.push(dq.before);
        subConditions.push(`post_date <= $${params.length}`);
      } else if (typeof dq.before === 'object') {
        const year = dq.before.year || 9999;
        const month = dq.before.month || 12;
        const day = dq.before.day || 31;
        const beforeDate = new Date(year, month - 1, day).toISOString();
        params.push(beforeDate);
        subConditions.push(`post_date <= $${params.length}`);
      }
      if (dq.inclusive === false) {
        subConditions[subConditions.length - 1] = subConditions[subConditions.length - 1].replace(
          '<=',
          '<',
        );
      }
    }

    const column = dq.column || 'post_date';
    const finalSub = subConditions.map((c) => c.replace(/post_date/g, column));

    const relation = dq.relation?.toUpperCase() === 'OR' ? ' OR ' : ' AND ';
    if (finalSub.length) conditions.push(`(${finalSub.join(relation)})`);
  });

  const globalRelation = args.date_query_relation?.toUpperCase() === 'OR' ? ' OR ' : ' AND ';
  return conditions.length ? [`(${conditions.join(globalRelation)})`] : [];
}
