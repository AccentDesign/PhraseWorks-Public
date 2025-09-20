export function getPagination(args) {
  let perPage = Number(args.posts_per_page ?? 10);
  if (args.posts_per_archive_page !== undefined) perPage = Number(args.posts_per_archive_page);
  if (args.nopaging || perPage === -1) perPage = null;

  const paged = Math.max(1, Number(args.paged ?? args.page ?? 1));
  let offset = Number(args.offset ?? 0);

  // Only calculate offset if offset is undefined
  if (args.offset === undefined) {
    offset = perPage ? (paged - 1) * perPage : 0;
  }

  if (perPage === null) offset = 0;

  return { perPage, offset };
}
