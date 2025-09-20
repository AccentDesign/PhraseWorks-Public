export function getOrderBy(args) {
  const wpOrderMap = {
    none: null,
    ID: 'id',
    id: 'id',
    author: 'post_author',
    title: 'post_title',
    name: 'post_name',
    type: 'post_type',
    date: 'post_date',
    modified: 'post_modified',
    parent: 'post_parent',
    rand: 'RANDOM()',
    comment_count: '(SELECT COUNT(*) FROM pw_comments WHERE post_id = pw_posts.id)',
    menu_order: 'menu_order',
  };

  let orderBy = 'post_date';
  if (args.orderby) {
    if (Array.isArray(args.orderby))
      orderBy = args.orderby.map((o) => wpOrderMap[o] || 'post_date').join(', ');
    else orderBy = wpOrderMap[args.orderby] || 'post_date';
  }

  let order = 'DESC';
  if (args.order) {
    if (Array.isArray(args.order))
      order = args.order.map((o) => (o.toUpperCase() === 'ASC' ? 'ASC' : 'DESC')).join(', ');
    else order = args.order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  }

  return { orderBy, order };
}
