import DataLoader from 'dataloader';

/**
 * Creates a DataLoader for batching user queries
 * @param {Function} connection - Postgres-js connection function
 * @returns {DataLoader} - Configured user DataLoader
 */
export function createUserLoader(connection) {
  if (typeof connection !== 'function') {
    throw new Error('Invalid connection: Expected a postgres-js client function');
  }
  const roleMap = {
    1: 'administrator',
    2: 'editor',
    3: 'author',
    4: 'contributor',
    5: 'subscriber',
  };
  const roleCapabilities = {
    administrator: [
      'read',
      'edit_posts',
      'edit_others_posts',
      'publish_posts',
      'read_private_posts',
    ],
    editor: ['read', 'edit_posts', 'edit_others_posts', 'publish_posts', 'read_private_posts'],
    author: ['read', 'edit_posts', 'publish_posts'],
    contributor: ['read', 'edit_posts'],
    subscriber: ['read'],
  };

  return new DataLoader(
    async (ids) => {
      const validIds = ids.filter((id) => id != null);
      if (!validIds.length) {
        return Array(ids.length).fill(null);
      }

      try {
        const arrayLiteral = `{${validIds.map((id) => Number(id)).join(',')}}`;

        const rows = await connection`
        SELECT u.*, um.meta_value as role_id
        FROM pw_users u
        LEFT JOIN pw_usermeta um
          ON u.id = um.user_id AND um.meta_key = 'pw_user_role'
        WHERE u.id = ANY(${arrayLiteral}::integer[])
        ORDER BY u.id
      `;

        const userMap = new Map();

        for (const row of rows) {
          const roleSlug = roleMap[row.role_id] || 'subscriber';
          const capabilities = roleCapabilities[roleSlug] || [];
          userMap.set(row.id, {
            ...row,
            roles: [roleSlug],
            capabilities,
          });
        }

        return ids.map((id) => (id == null ? null : userMap.get(id) || null));
      } catch (err) {
        console.error('UserLoader failed:', err.message);
        throw new Error(`Failed to load users: ${err.message}`);
      }
    },
    { cache: true },
  );
}

/**
 * Creates a DataLoader for batching post queries
 * @param {Function} connection - Postgres-js connection function
 * @returns {DataLoader} - Configured post DataLoader
 */
export function createPostLoader(connection) {
  if (typeof connection !== 'function') {
    throw new Error('Invalid connection: Expected a postgres-js client function');
  }

  return new DataLoader(
    async (ids) => {
      const validIds = ids.filter((id) => id != null);
      if (!validIds.length) {
        return Array(ids.length).fill(null);
      }

      try {
        const arrayLiteral = `{${validIds.map((id) => Number(id)).join(',')}}`;

        const rows = await connection`
          SELECT *
          FROM pw_posts
          WHERE id = ANY(${arrayLiteral}::integer[])
          ORDER BY id
        `;

        const postMap = new Map(rows.map((row) => [row.id, row]));

        return ids.map((id) => (id == null ? null : postMap.get(id) || null));
      } catch (err) {
        console.error('PostLoader failed:', err.message);
        throw new Error(`Failed to load posts: ${err.message}`);
      }
    },
    { cache: true },
  );
}

export function createFeaturedImageLoader(connection) {
  if (typeof connection !== 'function') {
    throw new Error('Invalid connection: Expected a postgres-js client function');
  }

  return new DataLoader(async (postIds) => {
    if (!postIds.length) return [];

    const validIds = postIds.map((id) => Number(id));
    const arrayLiteral = `{${validIds.join(',')}}`;

    const thumbnailRows = await connection`
      SELECT post_id, meta_value AS featured_image_id
      FROM pw_postmeta
      WHERE meta_key = '_thumbnail_id' AND post_id = ANY(${arrayLiteral}::integer[])
    `;

    const postToThumbId = new Map();
    const uniqueThumbIds = new Set();

    for (const row of thumbnailRows) {
      const postId = Number(row.post_id);
      const thumbId = Number(row.featured_image_id);
      postToThumbId.set(postId, thumbId);
      if (!isNaN(thumbId)) uniqueThumbIds.add(thumbId);
    }

    let attachments = [];
    if (uniqueThumbIds.size) {
      const arrayLiteralThumbs = `{${[...uniqueThumbIds].join(',')}}`;
      attachments = await connection`
        SELECT 
          p.*, 
          am.meta_value AS featured_image_metadata
        FROM pw_posts p
        LEFT JOIN pw_postmeta am
          ON p.id = am.post_id AND am.meta_key = '_pw_attachment_metadata'
        WHERE p.id = ANY(${arrayLiteralThumbs}::integer[])
      `;
    }

    function mapPostgresBools(row) {
      const mapped = { ...row };
      for (const key in mapped) {
        if (mapped[key] === 't') mapped[key] = true;
        else if (mapped[key] === 'f') mapped[key] = false;
      }
      return mapped;
    }

    const attachmentMap = new Map();
    for (const att of attachments) {
      attachmentMap.set(att.id, {
        featured_image_id: att.id,
        featured_image_metadata: att.featured_image_metadata || null,
        featured_image_imagedata: JSON.stringify(mapPostgresBools(att)),
      });
    }

    return postIds.map((postId) => {
      const thumbId = postToThumbId.get(postId);
      if (!thumbId)
        return {
          featured_image_id: null,
          featured_image_metadata: null,
          featured_image_imagedata: null,
        };
      return (
        attachmentMap.get(thumbId) || {
          featured_image_id: thumbId,
          featured_image_metadata: null,
          featured_image_imagedata: null,
        }
      );
    });
  });
}

export function createPostsByAuthorsLoader(connection) {
  if (typeof connection !== 'function') {
    throw new Error('Invalid connection: Expected a postgres-js client function');
  }

  return new DataLoader(
    async (ids) => {
      const validIds = ids.filter((id) => id != null);
      if (!validIds.length) {
        return Array(ids.length).fill(null);
      }

      try {
        const arrayLiteral = `{${validIds.map((id) => Number(id)).join(',')}}`;

        const rows = await connection`
          SELECT *
          FROM pw_posts
          WHERE post_author = ANY(${arrayLiteral}::integer[]) AND post_type != 'attachment'
          ORDER BY id
        `;

        const authorMap = new Map();

        for (const row of rows) {
          if (!authorMap.has(row.post_author)) {
            authorMap.set(row.post_author, []);
          }
          authorMap.get(row.post_author).push(row);
        }

        return ids.map((id) => (id == null ? null : authorMap.get(id) || null));
      } catch (err) {
        console.error('PostsByAuthorLoader failed:', err.message);
        throw new Error(`Failed to load posts: ${err.message}`);
      }
    },
    { cache: true },
  );
}

export function createPostCategoriesLoader(connection) {
  return new DataLoader(async (postIds) => {
    if (!postIds.length) return [];

    const arrayLiteral = `{${postIds.map((id) => Number(id)).join(',')}}`;

    const rows = await connection`
      SELECT tr.object_id AS post_id, tt.term_id, t.name AS category_name, t.slug AS slug
      FROM pw_term_relationships tr
      JOIN pw_term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
      JOIN pw_terms t ON t.term_id = tt.term_id
      WHERE tr.object_id = ANY(${arrayLiteral}::integer[])
    `;

    const map = new Map();
    postIds.forEach((id) => map.set(id, []));
    rows.forEach((row) => {
      map.get(row.post_id).push({ term_id: row.term_id, name: row.category_name, slug: row.slug });
    });

    return postIds.map((id) => map.get(id));
  });
}

export function createCommentLoader(connection) {
  if (typeof connection !== 'function') {
    throw new Error('Invalid connection: Expected a postgres-js client function');
  }

  return new DataLoader(
    async (ids) => {
      const validIds = ids.filter((id) => id != null);
      if (!validIds.length) {
        return Array(ids.length).fill(null);
      }

      try {
        const arrayLiteral = `{${validIds.map((id) => Number(id)).join(',')}}`;

        const rows = await connection`
          SELECT *
          FROM pw_comments
          WHERE comment_post_id = ANY(${arrayLiteral}::integer[])
          ORDER BY comment_id
        `;

        const postMap = new Map();

        for (const row of rows) {
          row.comment_approved = row.comment_approved === 't';
          if (!postMap.has(row.comment_post_id)) {
            postMap.set(row.comment_post_id, []);
          }
          postMap.get(row.comment_post_id).push(row);
        }

        return ids.map((id) => (id == null ? null : postMap.get(id) || null));
      } catch (err) {
        console.error('PostLoader failed:', err.message);
        throw new Error(`Failed to load posts: ${err.message}`);
      }
    },
    { cache: true },
  );
}

export function createPostMetaLoader(connection) {
  if (typeof connection !== 'function') {
    throw new Error('Invalid connection: Expected a postgres-js client function');
  }

  return new DataLoader(
    async (postIds) => {
      const validIds = postIds.filter((id) => id != null);
      if (!validIds.length) return Array(postIds.length).fill([]);

      try {
        const arrayLiteral = `{${validIds.map((id) => Number(id)).join(',')}}`;

        const rows = await connection`
          SELECT *
          FROM pw_postmeta
          WHERE post_id = ANY(${arrayLiteral}::integer[])
          ORDER BY meta_id
        `;

        const postMetaMap = new Map();
        for (const row of rows) {
          if (!postMetaMap.has(row.post_id)) {
            postMetaMap.set(row.post_id, []);
          }
          postMetaMap.get(row.post_id).push({
            meta_id: row.meta_id,
            meta_key: row.meta_key,
            meta_value: row.meta_value,
          });
        }

        return postIds.map((id) => (id == null ? [] : postMetaMap.get(id) || []));
      } catch (err) {
        console.error('PostMetaLoader failed:', err.message);
        throw new Error(`Failed to load post meta: ${err.message}`);
      }
    },
    { cache: true },
  );
}

export function createTermLoader(connection) {
  if (typeof connection !== 'function') {
    throw new Error('Invalid connection: Expected a postgres-js client function');
  }

  return new DataLoader(
    async (termTaxonomyIds) => {
      const validIds = termTaxonomyIds.filter((id) => id != null && !isNaN(Number(id)));
      if (!validIds.length) {
        return Array(termTaxonomyIds.length).fill(null);
      }

      try {
        // Use safe parameterized query with postgres-js array syntax
        const arrayLiteral = `{${validIds.map((id) => Number(id)).join(',')}}`;

        const rows = await connection`
        SELECT       
          t.term_id,
          t.name,
          t.slug,
          tt.taxonomy,
          tt.description,
          tt.parent,
          tt.count,
          tt.term_taxonomy_id,
          tr.object_id AS post_id
        FROM pw_terms t
        INNER JOIN pw_term_taxonomy tt ON t.term_id = tt.term_id
        INNER JOIN pw_term_relationships tr ON tt.term_taxonomy_id = tr.term_taxonomy_id
        WHERE tr.object_id = ANY(${arrayLiteral}::integer[])
        ORDER BY tr.object_id, t.term_id
      `;

        const termMap = new Map();
        for (const row of rows) {
          if (!termMap.has(row.post_id)) {
            termMap.set(row.post_id, []);
          }
          termMap.get(row.post_id).push(row);
        }

        return termTaxonomyIds.map((id) => (id == null ? null : termMap.get(id) || null));
      } catch (error) {
        console.error('TermLoader failed:', error.message);
        throw new Error(`Failed to load terms: ${error.message}`);
      }
    },
    { cache: true },
  );
}
