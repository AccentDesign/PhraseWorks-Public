import { PostCategories } from './postCategories.js';
import { PostTags } from './postTags.js';
import System from './system.js';
import User from './user.js';

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

  static async fetchAllSearch(connection, type, search) {
    let baseQuery = `SELECT * FROM pw_posts WHERE post_type = $1 AND post_status != 'trash'`;
    const params = [type];

    if (search) {
      baseQuery += ` AND post_title ILIKE $2`;
      params.push(`%${search}%`);
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
      await connection`SELECT * FROM pw_posts WHERE post_type=${type} AND post_author=${author_id} AND post_status = 'publish'`;
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

  static async fetch(args, type, connection, include_trash, loaders) {
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
    `;

    let q = `
      SELECT 
        p.*, 
        pm.meta_value AS featured_image_id,
        am.meta_value AS featured_image_metadata
      FROM pw_posts p
      LEFT JOIN pw_postmeta pm 
        ON p.id = pm.post_id AND pm.meta_key = '_thumbnail_id'
      LEFT JOIN pw_postmeta am 
        ON CAST(pm.meta_value AS INTEGER) = am.post_id AND am.meta_key = '_pw_attachment_metadata'
    `;

    const conditions = [];

    if (type != '') {
      conditions.push(connection`p.post_type = ${type}`);
    }

    if (!include_trash) {
      conditions.push(connection`p.post_status != 'trash'`);
    }

    if (conditions.length > 0) {
      query = connection`${query} WHERE ${conditions.reduce((acc, condition, index) => {
        return index === 0 ? condition : connection`${acc} AND ${condition}`;
      })}`;
    }

    query = connection`${query} ORDER BY p.post_date DESC LIMIT ${limit} OFFSET ${offset}`;

    const rows = await query;
    await Promise.all(
      rows.map(async (row) => {
        row.author = await loaders.user.load(row.post_author);
        row.categories = await loaders.categories.load(row.id);
      }),
    );
    return [...rows];
  }

  static async fetchSearch(args, type, connection, search, loaders) {
    const limitArg = args.find((arg) => arg.type === 'limit');
    const limit = Math.max(0, parseInt(limitArg?.value ?? 10));

    const offsetArg = args.find((arg) => arg.type === 'offset');
    const offset = Math.max(0, parseInt(offsetArg?.value ?? 0));

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
    `;

    const conditions = [];

    if (type) {
      conditions.push(connection`p.post_type = ${type}`);
    }

    conditions.push(connection`p.post_status != 'trash'`);

    if (search) {
      conditions.push(connection`p.post_title ILIKE ${'%' + search + '%'}`);
    }

    if (conditions.length > 0) {
      query = connection`${query} WHERE ${conditions.reduce((acc, condition, index) => {
        return index === 0 ? condition : connection`${acc} AND ${condition}`;
      })}`;
    }

    query = connection`${query} ORDER BY p.post_date DESC LIMIT ${limit} OFFSET ${offset}`;

    const rows = await query;

    await Promise.all(
      rows.map(async (row) => {
        row.author = await loaders.user.load(row.post_author);
        row.categories = await loaders.categories.load(row.id);
      }),
    );

    return [...rows];
  }

  static async fetchPublished(args, type, connection, loaders) {
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
        row.author = await loaders.user.load(row.post_author);
        row.categories = await loaders.categories.load(row.id);
      }),
    );

    return [...rows];
  }

  static async fetchByStatus(args, type, status, connection, loaders) {
    const limitArg = args.find((arg) => arg.type === 'limit');
    const limit = limitArg.value;

    const offsetArg = args.find((arg) => arg.type === 'offset');
    const offset = offsetArg.value;
    const rows =
      await connection`SELECT * FROM pw_posts WHERE post_type=${type} AND post_status=${status} ORDER BY post_date DESC LIMIT ${limit} OFFSET ${offset} `;
    await Promise.all(
      rows.map(async (row) => {
        row.author = await loaders.user.load(row.post_author);
        row.categories = await loaders.categories.load(row.id);
      }),
    );
    return [...rows];
  }

  static async fetchByAuthor(args, type, author_id, connection, loaders) {
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
      WHERE p.post_type = ${type} AND post_author=${author_id} AND post_status='publish' 
      ORDER BY post_date DESC LIMIT ${limit} OFFSET ${offset} `;

    await Promise.all(
      rows.map(async (row) => {
        row.author = await loaders.user.load(row.post_author);
        row.categories = await loaders.categories.load(row.id);
      }),
    );
    return [...rows];
  }

  static async fetchbyCategory(args, term_id, connection, loaders) {
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
        row.author = await loaders.user.load(row.post_author);
        row.categories = await loaders.categories.load(row.id);
      }),
    );

    return [...rows];
  }

  static async getPostBy(field, value, connection, loaders) {
    const allowedFields = ['id', 'post_name', 'post_title', 'post_author'];
    if (!allowedFields.includes(field)) {
      throw new Error('Invalid field parameter');
    }
    const query = `
      SELECT 
        p.*, 
        pm.meta_value AS featured_image_id,
        am.meta_value AS featured_image_metadata,
        to_json(fi) AS featured_image_imagedata,
        tm.meta_value AS template_id
      FROM pw_posts p
      LEFT JOIN pw_postmeta pm 
        ON p.id = pm.post_id AND pm.meta_key = '_thumbnail_id'
      LEFT JOIN pw_postmeta am 
        ON CAST(pm.meta_value AS INTEGER) = am.post_id 
        AND am.meta_key = '_pw_attachment_metadata'
      LEFT JOIN pw_posts fi
        ON fi.id = CAST(pm.meta_value AS INTEGER)
      LEFT JOIN pw_postmeta tm
        ON p.id = tm.post_id AND tm.meta_key = '_template_id'
      WHERE p.${field} = $1
    `;
    const post = await connection.unsafe(query, [value]);
    if (post.length > 0) {
      await Promise.all(
        post.map(async (row) => {
          row.author = await loaders.user.load(row.post_author);
          row.categories = await loaders.categories.load(row.id);
          row.post_date = row.post_date ? row.post_date.toISOString() : null;
          row.post_date_gmt = row.post_date_gmt ? row.post_date_gmt.toISOString() : null;
          row.post_modified = row.post_modified ? row.post_modified.toISOString() : null;
          row.post_modified_gmt = row.post_modified_gmt
            ? row.post_modified_gmt.toISOString()
            : null;
          row.featured_image_imagedata = JSON.stringify(row.featured_image_imagedata);
        }),
      );
      return post[0];
    }
    return null;
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
        null,
        null,
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

      await PostCategories.updatePostCategories(categoriesData, postId, connection);
      await PostTags.updatePostTags(tagsData, postId, connection);

      return { success: true, post_id: postId };
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      return { success: false, error: err.message };
    }
  }

  static async createScheduledPost(
    title,
    content,
    featuredImageId,
    categories,
    tags,
    type,
    authorId,
    connection,
    publishDate,
  ) {
    try {
      const categoriesData = JSON.parse(categories);
      const tagsData = JSON.parse(tags);
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      let postDate = connection`NOW()`; // if your client supports tagged sql literals
      let postDateGmt = connection`NOW()`;

      if (publishDate && publishDate !== '') {
        const dateObj = new Date(publishDate);
        if (!isNaN(dateObj)) {
          postDate = dateObj; // local time as Date object
          postDateGmt = new Date(dateObj.toISOString()); // or same dateObj
        }
      }
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
        ${postDate},
        ${postDateGmt},
        ${content},
        ${title},
        '',
        'scheduled',
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

      await PostCategories.updatePostCategories(categoriesData, postId, connection);
      await PostTags.updatePostTags(tagsData, postId, connection);

      return { success: true, post_id: postId };
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
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
    publishDate,
    notifyPostChanges,
  ) {
    try {
      const categoriesData = JSON.parse(categories);
      const tagsData = JSON.parse(tags);
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      let postDate = 'NOW()';
      let postDateGmt = 'NOW()';
      if (publishDate && publishDate !== '') {
        // Convert ISO string to SQL datetime literal in UTC (for GMT)
        const dateObj = new Date(publishDate);
        if (!isNaN(dateObj)) {
          const pad = (n) => n.toString().padStart(2, '0');

          // local datetime (for post_date) — optionally you can store as UTC here or convert to local timezone if needed
          const localDate = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;

          // GMT datetime (UTC time)
          const utcDate = `${dateObj.getUTCFullYear()}-${pad(dateObj.getUTCMonth() + 1)}-${pad(dateObj.getUTCDate())} ${pad(dateObj.getUTCHours())}:${pad(dateObj.getUTCMinutes())}:${pad(dateObj.getUTCSeconds())}`;

          postDate = connection.raw(localDate);
          postDateGmt = connection.raw(utcDate);
        }
      }

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
        ${postDate},
        ${postDateGmt},
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

      await PostCategories.updatePostCategories(categoriesData, postId, connection);
      await PostTags.updatePostTags(tagsData, postId, connection);
      notifyPostChanges();
      return { success: true, post_id: postId };
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      return { success: false, error: err.message };
    }
  }

  static async updatePost(
    title,
    content,
    featuredImageId,
    postId,
    authorId,
    connection,
    notifyPostChanges,
  ) {
    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();

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

      if (featuredImageId) {
        const existing = await connection`
          SELECT * FROM pw_postmeta
          WHERE post_id = ${postId} AND meta_key = '_thumbnail_id'
          LIMIT 1;
        `;

        if (existing.length > 0) {
          await connection`
            UPDATE pw_postmeta
            SET meta_value = ${featuredImageId}
            WHERE post_id = ${postId} AND meta_key = '_thumbnail_id';
          `;
        } else {
          await connection`
            INSERT INTO pw_postmeta (post_id, meta_key, meta_value)
            VALUES (${postId}, '_thumbnail_id', ${featuredImageId});
          `;
        }
      }
      notifyPostChanges();
      return { success: true, post_id: postId };
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      return { success: false, error: err.message };
    }
  }

  static async updatePostStatus(status, post_id, connection, notifyPostChanges) {
    try {
      let update;
      if (status === 'draft') {
        update = await connection`
        UPDATE pw_posts
        SET post_status = ${status},
            post_date = NULL,
            post_date_gmt = NULL
        WHERE id = ${post_id}
        RETURNING *;
      `;
      } else {
        update = await connection`
        UPDATE pw_posts
        SET post_status = ${status}
        WHERE id = ${post_id}
        RETURNING *;
      `;
      }

      if (update.length === 1) {
        notifyPostChanges();
        return { success: true, post_id: post_id };
      } else {
        return { success: false, error: 'No rows updated or multiple rows affected' };
      }
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      return { success: false, error: err.message };
    }
  }

  static async updatePostPublishDate(date, post_id, connection) {
    const utcDate = new Date(date + 'Z');
    try {
      const update =
        await connection`UPDATE pw_posts SET post_date = ${utcDate.toISOString()} WHERE id = ${post_id}`;
      if (update.count === 1) {
        return { success: true, post_id: post_id };
      } else {
        return { success: false, error: 'No rows updated or multiple rows affected' };
      }
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      return { success: false, error: err.message };
    }
  }
}
