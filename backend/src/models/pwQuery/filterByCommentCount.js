export function filterByCommentCount(rows, commentCountArg) {
  if (typeof commentCountArg === 'number') {
    return rows.filter((r) => r.comment_count === commentCountArg);
  } else if (typeof commentCountArg === 'object' && commentCountArg.value !== undefined) {
    const { value, compare = '=' } = commentCountArg;
    return rows.filter((row) => {
      switch (compare) {
        case '=':
          return row.comment_count === value;
        case '!=':
          return row.comment_count !== value;
        case '>':
          return row.comment_count > value;
        case '>=':
          return row.comment_count >= value;
        case '<':
          return row.comment_count < value;
        case '<=':
          return row.comment_count <= value;
        default:
          return row.comment_count === value;
      }
    });
  }
  return rows;
}
