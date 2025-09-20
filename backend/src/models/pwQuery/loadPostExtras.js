export async function loadPostExtras(rows, loaders) {
  await Promise.all(
    rows.map(async (row) => {
      row.author = await loaders.user.load(row.post_author);
      row.comments = await loaders.comment.load(row.id);
      row.comment_count = row.comments?.length || 0;
      row.categories = await loaders.categories.load(row.id);
      row.meta = await loaders.postMeta.load(row.id);
      row.post_date = new Date(row.post_date).toISOString();
      row.post_date_gmt = new Date(row.post_date_gmt).toISOString();
      row.post_modified = new Date(row.post_modified).toISOString();
      row.post_modified_gmt = new Date(row.post_modified_gmt).toISOString();
      row.terms = await loaders.term.load(row.id);
      const featured_image = await loaders.featuredImage.load(row.id);
      row.featured_image_id = featured_image?.featured_image_id || null;
      row.featured_image_metadata = featured_image?.featured_image_metadata || null;
      row.featured_image_imagedata = featured_image?.featured_image_imagedata || null;
    }),
  );
}
