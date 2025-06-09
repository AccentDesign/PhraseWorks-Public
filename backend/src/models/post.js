import User from './user';

export default class Post {
  constructor() {}
  static async fetchAll(connection, type, include_trash) {
    let baseQuery = `SELECT * FROM pw_posts WHERE post_type = $1`;
    let params = [type];

    if (!include_trash) {
      baseQuery += ` AND post_status != 'trash'`;
    }

    const rows = await connection.unsafe(baseQuery, params);
    return rows;
  }

  static async fetchAllPublished(connection, type) {
    const rows =
      await connection`SELECT * FROM pw_posts WHERE post_type=${type} AND post_status='publish'`;
    return rows;
  }

  static async fetchAllByStatus(connection, type, status) {
    const rows =
      await connection`SELECT * FROM pw_posts WHERE post_type=${type} AND post_status=${status}`;
    return rows;
  }

  static async fetchAllByAuthor(connection, type, author_id) {
    const rows =
      await connection`SELECT * FROM pw_posts WHERE post_type=${type} OR post_type = 'page' AND post_author=${author_id} AND post_status = 'publish'`;
    return rows;
  }

  static async fetchAllByCategory(connection, term_id) {
    return connection`
        SELECT 
          p.ID,
          p.post_title,
          p.post_name,
          p.post_date,
          p.post_excerpt,
          p.post_content,
          p.post_type,
          p.post_status
        FROM pw_posts p
        JOIN pw_term_relationships tr ON tr.object_id = p.ID
        JOIN pw_term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
        WHERE tt.term_id = ${term_id}
          AND p.post_status = 'publish'
          AND p.post_type IN ('post', 'page') -- adjust as needed
        ORDER BY p.post_date DESC;
      `;
  }

  static async getAllPostsAndPagesSlugAndChildCount(connection) {
    const rows = await connection`SELECT
      p.id,
      p.post_name,
      p.post_type,
      COUNT(c.ID) AS child_count
      FROM pw_posts p
      LEFT JOIN pw_posts c
        ON c.post_parent = p.id AND c.post_status = 'publish'
      WHERE p.post_status = 'publish'
      GROUP BY p.ID, p.post_type
      ORDER BY p.ID DESC;`;
    return rows;
  }

  static async fetch(args, type, connection, include_trash) {
    const limitArg = args.find((arg) => arg.type === 'limit');
    const limit = limitArg?.value ?? 10;

    const offsetArg = args.find((arg) => arg.type === 'offset');
    const offset = offsetArg?.value ?? 0;

    let query = connection`
      SELECT 
        p.*, 
        pm.meta_value AS featured_image_id,
        am.meta_value AS featured_image_metadata
      FROM pw_posts p
      LEFT JOIN pw_postmeta pm 
        ON p.id = pm.post_id AND pm.meta_key = '_thumbnail_id'
      LEFT JOIN pw_postmeta am 
        ON CAST(pm.meta_value AS INTEGER) = am.post_id AND am.meta_key = '_pw_attachment_metadata'
      WHERE p.post_type = ${type}
    `;

    if (!include_trash) {
      query = connection`${query} AND post_status != 'trash'`;
    }

    query = connection`${query} ORDER BY post_date DESC LIMIT ${limit} OFFSET ${offset}`;

    const rows = await query;

    await Promise.all(
      rows.map(async (row) => {
        row.author = await User.findById(row.post_author, connection);
        row.categories = await Post.fetchPostCategories(row.id, connection);
      }),
    );

    return [...rows];
  }

  static async fetchPublished(args, type, connection) {
    const limitArg = args.find((arg) => arg.type === 'limit');
    const limit = limitArg?.value ?? 10;

    const offsetArg = args.find((arg) => arg.type === 'offset');
    const offset = offsetArg?.value ?? 0;

    let query = connection`
      SELECT 
        p.*, 
        pm.meta_value AS featured_image_id,
        am.meta_value AS featured_image_metadata
      FROM pw_posts p
      LEFT JOIN pw_postmeta pm 
        ON p.id = pm.post_id AND pm.meta_key = '_thumbnail_id'
      LEFT JOIN pw_postmeta am 
        ON CAST(pm.meta_value AS INTEGER) = am.post_id AND am.meta_key = '_pw_attachment_metadata'
      WHERE p.post_type = ${type}
    `;

    query = connection`${query} AND post_status = 'publish'`;

    query = connection`${query} ORDER BY post_date DESC LIMIT ${limit} OFFSET ${offset}`;

    const rows = await query;

    await Promise.all(
      rows.map(async (row) => {
        row.author = await User.findById(row.post_author, connection);
        row.categories = await Post.fetchPostCategories(row.id, connection);
      }),
    );

    return [...rows];
  }

  static async fetchByStatus(args, type, status, connection) {
    const limitArg = args.find((arg) => arg.type === 'limit');
    const limit = limitArg.value;

    const offsetArg = args.find((arg) => arg.type === 'offset');
    const offset = offsetArg.value;
    const rows =
      await connection`SELECT * FROM pw_posts WHERE post_type=${type} AND post_status=${status} ORDER BY post_date DESC LIMIT ${limit} OFFSET ${offset} `;
    await Promise.all(
      rows.map(async (row) => {
        // row.categories = await Article.fetchPostCategories(row.id, connection);
        row.author = await User.findById(row.post_author, connection);
        row.categories = await Post.fetchPostCategories(row.id, connection);
      }),
    );
    return [...rows];
  }

  static async fetchByAuthor(args, type, author_id, connection) {
    const limitArg = args.find((arg) => arg.type === 'limit');
    const limit = limitArg.value;

    const offsetArg = args.find((arg) => arg.type === 'offset');
    const offset = offsetArg.value;
    const rows = await connection`
      SELECT 
        p.*, 
        pm.meta_value AS featured_image_id,
        am.meta_value AS featured_image_metadata
      FROM pw_posts p
      LEFT JOIN pw_postmeta pm 
        ON p.id = pm.post_id AND pm.meta_key = '_thumbnail_id'
      LEFT JOIN pw_postmeta am 
        ON CAST(pm.meta_value AS INTEGER) = am.post_id AND am.meta_key = '_pw_attachment_metadata'
      WHERE p.post_type = ${type} OR p.post_type = 'page' AND post_author=${author_id} AND post_status='publish' 
      ORDER BY post_date DESC LIMIT ${limit} OFFSET ${offset} `;
    await Promise.all(
      rows.map(async (row) => {
        // row.categories = await Article.fetchPostCategories(row.id, connection);
        row.author = await User.findById(row.post_author, connection);
        row.categories = await Post.fetchPostCategories(row.id, connection);
      }),
    );
    return [...rows];
  }

  static async fetchbyCategory(args, term_id, connection) {
    const limitArg = args.find((arg) => arg.type === 'limit');
    const limit = limitArg?.value ?? 10;

    const offsetArg = args.find((arg) => arg.type === 'offset');
    const offset = offsetArg?.value ?? 0;

    let query = connection`
      SELECT 
        p.*, 
        pm.meta_value AS featured_image_id,
        am.meta_value AS featured_image_metadata
      FROM pw_posts p
      LEFT JOIN pw_postmeta pm 
        ON p.id = pm.post_id AND pm.meta_key = '_thumbnail_id'
      LEFT JOIN pw_postmeta am 
        ON CAST(pm.meta_value AS INTEGER) = am.post_id AND am.meta_key = '_pw_attachment_metadata'
      JOIN pw_term_relationships tr ON tr.object_id = p.ID
      JOIN pw_term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
        WHERE tt.term_id = ${term_id}
        AND p.post_status = 'publish'
        AND p.post_type IN ('post', 'page') -- adjust as needed
    `;

    query = connection`${query} ORDER BY post_date DESC LIMIT ${limit} OFFSET ${offset}`;

    const rows = await query;

    await Promise.all(
      rows.map(async (row) => {
        row.author = await User.findById(row.post_author, connection);
        row.categories = await Post.fetchPostCategories(row.id, connection);
      }),
    );

    return [...rows];
  }

  static async getCategory(slug, connection) {
    const category = await connection`
      SELECT 
        t.term_id,
        t.name,
        t.slug,
        tt.description
      FROM pw_terms t
      JOIN pw_term_taxonomy tt ON tt.term_id = t.term_id
      WHERE tt.taxonomy = 'category' AND t.slug = ${slug}
      LIMIT 1;
    `;
    return category[0];
  }

  static async getCategories(type, connection) {
    return connection`
        SELECT 
          t.term_id,
          t.name,
          t.slug,
          tt.description,
          COUNT(tr.object_id) AS post_count
        FROM pw_terms t
        JOIN pw_term_taxonomy tt ON tt.term_id = t.term_id
        LEFT JOIN pw_term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
        WHERE tt.taxonomy = ${type}
        GROUP BY t.term_id, t.name, t.slug, tt.description;
      `;
  }

  static async getTags(type, connection) {
    return connection`
        SELECT 
          t.term_id,
          t.name,
          t.slug,
          tt.description,
          COUNT(tr.object_id) AS post_count
        FROM pw_terms t
        JOIN pw_term_taxonomy tt ON tt.term_id = t.term_id
        LEFT JOIN pw_term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
        WHERE tt.taxonomy = ${type}
        GROUP BY t.term_id, t.name, t.slug, tt.description;
      `;
  }

  static async createDraftPost(
    title,
    content,
    featuredImageId,
    categories,
    tags,
    type,
    authorId,
    connection,
  ) {
    try {
      const categoriesData = JSON.parse(categories);
      const tagsData = JSON.parse(tags);
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      const result = await connection`INSERT INTO pw_posts (
        post_author,
        post_date,
        post_date_gmt,
        post_content,
        post_title,
        post_excerpt,
        post_status,
        post_name,
        post_modified,
        post_modified_gmt,
        post_type,
        guid
      ) VALUES (
        ${authorId}, 
        NOW(),
        NOW(),
        ${content},
        ${title},
        '',
        'draft',
        ${slug},
        NOW(),
        NOW(),
        ${type},
        ${`/${slug}`}
      ) RETURNING ID;`;
      const postId = result[0].id;

      if (featuredImageId) {
        await connection`INSERT INTO pw_postmeta (
          post_id,
          meta_key,
          meta_value
        ) VALUES (
          ${postId},
          '_thumbnail_id',
          ${featuredImageId}
        );`;
      }

      await Post.updatePostCategories(categoriesData, postId, connection);
      await Post.updatePostTags(tagsData, postId, connection);

      return { success: true, post_id: postId };
    } catch (err) {
      console.error('createDraftPost failed:', err);
      return { success: false, error: err.message };
    }
  }

  static async createPublishPost(
    title,
    content,
    featuredImageId,
    categories,
    tags,
    type,
    authorId,
    connection,
  ) {
    try {
      const categoriesData = JSON.parse(categories);
      const tagsData = JSON.parse(tags);
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      const result = await connection`INSERT INTO pw_posts (
        post_author,
        post_date,
        post_date_gmt,
        post_content,
        post_title,
        post_excerpt,
        post_status,
        post_name,
        post_modified,
        post_modified_gmt,
        post_type,
        guid
      ) VALUES (
        ${authorId}, 
        NOW(),
        NOW(),
        ${content},
        ${title},
        '',
        'publish',
        ${slug},
        NOW(),
        NOW(),
        ${type},
        ${`/${slug}`}
      ) RETURNING ID;`;
      const postId = result[0].id;
      if (featuredImageId) {
        await connection`INSERT INTO pw_postmeta (
          post_id,
          meta_key,
          meta_value
        ) VALUES (
          ${postId},
          '_thumbnail_id',
          ${featuredImageId}
        );`;
      }

      await Post.updatePostCategories(categoriesData, postId, connection);
      await Post.updatePostTags(tagsData, postId, connection);

      return { success: true, post_id: postId };
    } catch (err) {
      console.error('createPublishPost failed:', err);
      return { success: false, error: err.message };
    }
  }

  static async updatePost(title, content, featuredImageId, postId, authorId, connection) {
    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      // Update the main post
      await connection`
        UPDATE pw_posts
        SET
          post_title = ${title},
          post_content = ${content},
          post_modified = NOW(),
          post_modified_gmt = NOW(),
          post_name = ${slug},
          guid = ${`/${slug}`},
          post_author = ${authorId}
        WHERE ID = ${postId};
      `;

      // If featured image ID is provided, update or insert the postmeta
      if (featuredImageId) {
        const existing = await connection`
          SELECT * FROM pw_postmeta
          WHERE post_id = ${postId} AND meta_key = '_thumbnail_id'
          LIMIT 1;
        `;

        if (existing.length > 0) {
          // Update existing featured image meta
          await connection`
            UPDATE pw_postmeta
            SET meta_value = ${featuredImageId}
            WHERE post_id = ${postId} AND meta_key = '_thumbnail_id';
          `;
        } else {
          // Insert new featured image meta
          await connection`
            INSERT INTO pw_postmeta (post_id, meta_key, meta_value)
            VALUES (${postId}, '_thumbnail_id', ${featuredImageId});
          `;
        }
      }

      return { success: true, post_id: postId };
    } catch (err) {
      console.error('updatePost failed:', err);
      return { success: false, error: err.message };
    }
  }

  static async getPostBy(field, value, connection) {
    const allowedFields = ['id', 'post_name', 'post_title', 'post_author'];
    if (!allowedFields.includes(field)) {
      throw new Error('Invalid field parameter');
    }
    const query = `
      SELECT 
        p.*, 
        pm.meta_value AS featured_image_id,
        am.meta_value AS featured_image_metadata,
        tm.meta_value AS template_id
      FROM pw_posts p
      LEFT JOIN pw_postmeta pm 
        ON p.id = pm.post_id AND pm.meta_key = '_thumbnail_id'
      LEFT JOIN pw_postmeta am 
        ON CAST(pm.meta_value AS INTEGER) = am.post_id AND am.meta_key = '_pw_attachment_metadata'
      LEFT JOIN pw_postmeta tm
        ON p.id = tm.post_id AND tm.meta_key = '_template_id'
      WHERE p.${field} = $1
    `;
    const post = await connection.unsafe(query, [value]);
    if (post.length > 0) {
      await Promise.all(
        post.map(async (row) => {
          row.categories = await Post.fetchPostCategories(row.id, connection);
          row.author = await User.findById(row.post_author, connection);
          row.post_date = row.post_date.toISOString();
          row.post_date_gmt = row.post_date_gmt.toISOString();
          row.post_modified = row.post_modified.toISOString();
          row.post_modified_gmt = row.post_modified_gmt.toISOString();
        }),
      );
      return post[0];
    }
    return null;
  }

  static async fetchPostCategories(postId, connection) {
    return await connection`
      SELECT 
        t.term_id,
        t.name,
        t.slug,
        tt.description
      FROM pw_terms t
      JOIN pw_term_taxonomy tt ON tt.term_id = t.term_id
      JOIN pw_term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
      WHERE tr.object_id = ${postId}
        AND tt.taxonomy = 'category';
    `;
  }

  static async getPostCategories(postId, connection) {
    try {
      const categories = await connection`
        SELECT t.term_id, t.name, t.slug, tt.description
        FROM pw_terms t
        JOIN pw_term_taxonomy tt ON tt.term_id = t.term_id
        JOIN pw_term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
        WHERE tr.object_id = ${postId} AND tt.taxonomy = 'category'
      `;
      return { categories: categories };
    } catch (error) {
      console.error('Error fetching post categories:', error);
      return { categories: [] };
    }
  }

  static async getPostTags(postId, connection) {
    try {
      const tags = await connection`
        SELECT t.term_id, t.name, t.slug, tt.description
        FROM pw_terms t
        JOIN pw_term_taxonomy tt ON tt.term_id = t.term_id
        JOIN pw_term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
        WHERE tr.object_id = ${postId} AND tt.taxonomy = 'post_tag'
      `;
      return { tags: tags };
    } catch (error) {
      console.error('Error fetching post tags:', error);
      return { tags: [] };
    }
  }

  static async updatePostStatus(status, post_id, connection) {
    try {
      const update =
        await connection`UPDATE pw_posts SET post_status = ${status} WHERE id = ${post_id}`;
      if (update.count === 1) {
        return { success: true, post_id: post_id };
      } else {
        return { success: false, error: 'No rows updated or multiple rows affected' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  static async updatePostPublishDate(date, post_id, connection) {
    try {
      const update =
        await connection`UPDATE pw_posts SET post_date = ${date} WHERE id = ${post_id}`;
      if (update.count === 1) {
        return { success: true, post_id: post_id };
      } else {
        return { success: false, error: 'No rows updated or multiple rows affected' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  static async updatePostPassword(password, post_id, connection) {
    try {
      const update =
        await connection`UPDATE pw_posts SET post_password = ${password}, post_status = 'publish' WHERE id = ${post_id}`;
      if (update.count === 1) {
        return { success: true, post_id: post_id };
      } else {
        return { success: false, error: 'No rows updated or multiple rows affected' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  static async createPostCategory(name, slug, description, connection) {
    try {
      const termResult =
        await connection`INSERT INTO pw_terms(name, slug) VALUES (${name}, ${slug}) RETURNING *`;
      if (termResult.length === 0) return false;

      const id = termResult[0].term_id;
      const taxonomyResult =
        await connection`INSERT INTO pw_term_taxonomy (term_id, taxonomy, description) VALUES (${id}, 'category', ${description})`;
      return taxonomyResult.count === 1;
    } catch (error) {
      console.error('Error creating post category:', error);
      return false;
    }
  }

  static async updatePostCategory(name, slug, description, categoryId, connection) {
    try {
      const termResult = await connection`
        UPDATE pw_terms
        SET name = ${name}, slug = ${slug}
        WHERE term_id = ${categoryId}
      `;

      const taxonomyResult = await connection`
        UPDATE pw_term_taxonomy
        SET description = ${description}
        WHERE term_id = ${categoryId} AND taxonomy = 'category'
      `;

      return termResult.count > 0 && taxonomyResult.count > 0;
    } catch (error) {
      console.error('Error updating post category:', error);
      return false;
    }
  }

  static async deletePostCategory(id, connection) {
    try {
      const taxonomyResult = await connection`
      DELETE FROM pw_term_taxonomy WHERE term_id = ${id}
    `;

      const termResult = await connection`
      DELETE FROM pw_terms WHERE term_id = ${id}
    `;
      return taxonomyResult.count > 0 && termResult.count > 0;
    } catch (error) {
      console.error('Error deleting post category:', error);
      return false;
    }
  }

  static async createPostTag(name, slug, description, connection) {
    try {
      const termResult =
        await connection`INSERT INTO pw_terms(name, slug) VALUES (${name}, ${slug}) RETURNING *`;
      if (termResult.length === 0) return false;

      const id = termResult[0].term_id;
      const taxonomyResult =
        await connection`INSERT INTO pw_term_taxonomy (term_id, taxonomy, description) VALUES (${id}, 'post_tag', ${description})`;
      return taxonomyResult.count === 1;
    } catch (error) {
      console.error('Error creating post tag:', error);
      return false;
    }
  }

  static async updatePostTag(name, slug, description, tagId, connection) {
    try {
      const termResult = await connection`
        UPDATE pw_terms
        SET name = ${name}, slug = ${slug}
        WHERE term_id = ${tagId}
      `;

      const taxonomyResult = await connection`
        UPDATE pw_term_taxonomy
        SET description = ${description}
        WHERE term_id = ${tagId} AND taxonomy = 'post_tag'
      `;

      return termResult.count > 0 && taxonomyResult.count > 0;
    } catch (error) {
      console.error('Error updating post tag:', error);
      return false;
    }
  }

  static async deletePostTag(id, connection) {
    try {
      const taxonomyResult = await connection`
      DELETE FROM pw_term_taxonomy WHERE term_id = ${id}
    `;

      const termResult = await connection`
      DELETE FROM pw_terms WHERE term_id = ${id}
    `;
      return taxonomyResult.count > 0 && termResult.count > 0;
    } catch (error) {
      console.error('Error deleting post tag:', error);
      return false;
    }
  }

  static async updatePostCategories(categories, postId, connection) {
    try {
      if (!Array.isArray(categories)) return true;

      const sanitizedCategories = categories.filter((id) => Number.isInteger(id));

      const existingLinks = await connection`
        SELECT tr.term_taxonomy_id
        FROM pw_term_relationships tr
        JOIN pw_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
        WHERE tr.object_id = ${postId}
        AND tt.taxonomy = 'category'
      `;

      const existingIds = new Set(existingLinks.map((row) => row.term_taxonomy_id));
      const incomingIds = new Set(sanitizedCategories);

      const toAdd = sanitizedCategories.filter((id) => !existingIds.has(id));
      const toRemove = [...existingIds].filter((id) => !incomingIds.has(id));

      await Promise.all(
        toAdd.map(
          (id) =>
            connection`INSERT INTO pw_term_relationships (object_id, term_taxonomy_id) VALUES (${postId}, ${id})`,
        ),
      );

      if (toRemove.length > 0) {
        await connection`
          DELETE FROM pw_term_relationships
          WHERE object_id = ${postId}
          AND term_taxonomy_id IN (
            SELECT term_taxonomy_id FROM pw_term_taxonomy
            WHERE taxonomy = 'category'
            AND term_taxonomy_id IN ${connection(toRemove)}
          )
        `;
      }

      return true;
    } catch (error) {
      console.error('Error syncing post categories:', error);
      return false;
    }
  }

  static async updatePostTags(tags, postId, connection) {
    try {
      if (!Array.isArray(tags)) return true;

      const sanitizedTags = tags.filter((id) => Number.isInteger(id));

      const existingLinks = await connection`
        SELECT tr.term_taxonomy_id
        FROM pw_term_relationships tr
        JOIN pw_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
        WHERE tr.object_id = ${postId}
        AND tt.taxonomy = 'post_tag'
      `;

      const existingIds = new Set(existingLinks.map((row) => row.term_taxonomy_id));
      const incomingIds = new Set(sanitizedTags);

      const toAdd = sanitizedTags.filter((id) => !existingIds.has(id));
      const toRemove = [...existingIds].filter((id) => !incomingIds.has(id));

      await Promise.all(
        toAdd.map(
          (id) =>
            connection`INSERT INTO pw_term_relationships (object_id, term_taxonomy_id) VALUES (${postId}, ${id})`,
        ),
      );

      if (toRemove.length > 0) {
        await connection`
          DELETE FROM pw_term_relationships
          WHERE object_id = ${postId}
          AND term_taxonomy_id IN (
            SELECT term_taxonomy_id FROM pw_term_taxonomy
            WHERE taxonomy = 'post_tag'
            AND term_taxonomy_id IN ${connection(toRemove)}
          )
        `;
      }

      return true;
    } catch (error) {
      console.error('Error syncing post tags:', error);
      return false;
    }
  }

  static async getPageTemplates(offset, perPage, connection) {
    const limit = perPage ?? 10;
    const page = offset - 1;
    const rows =
      await connection`SELECT * FROM pw_page_templates ORDER BY id DESC LIMIT ${limit} OFFSET ${page}`;
    return rows;
  }

  static async getPageTemplate(id, connection) {
    const rows = await connection`SELECT * FROM pw_page_templates WHERE id=${id}`;
    return rows;
  }

  static async getAllPageTemplates(connection) {
    const rows = await connection`SELECT * FROM pw_page_templates`;
    return rows;
  }

  static async createPageTemplate(name, filename, connection) {
    try {
      const result =
        await connection`INSERT INTO pw_page_templates(name, file_name) VALUES (${name}, ${filename}) RETURNING *`;
      return result.count === 1;
    } catch (error) {
      console.error('Error creating page template:', error);
      return false;
    }
  }

  static async updatePageTemplate(name, filename, templateId, connection) {
    try {
      const result = await connection`
        UPDATE pw_page_templates
        SET name = ${name}, file_name = ${filename}
        WHERE id = ${templateId}
        RETURNING *
      `;
      return result.length === 1;
    } catch (error) {
      console.error('Error updating page template:', error);
      return false;
    }
  }

  static async updatePageTemplateId(templateId, postId, connection) {
    try {
      if (templateId === -1) {
        await connection`
          DELETE FROM pw_postmeta
          WHERE post_id = ${postId} AND meta_key = '_template_id'
        `;
      } else {
        const existing = await connection`
        SELECT meta_id FROM pw_postmeta
        WHERE post_id = ${postId} AND meta_key = '_template_id'
        LIMIT 1
      `;

        if (existing.length > 0) {
          await connection`
          UPDATE pw_postmeta
          SET meta_value = ${templateId}
          WHERE meta_id = ${existing[0].meta_id}
        `;
        } else {
          await connection`
          INSERT INTO pw_postmeta (post_id, meta_key, meta_value)
          VALUES (${postId}, '_template_id', ${templateId})
        `;
        }
      }
      return true;
    } catch (error) {
      console.error('Error updating page template ID:', error);
      return false;
    }
  }
}
