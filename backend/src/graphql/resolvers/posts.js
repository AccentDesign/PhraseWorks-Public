import Post from '../../models/post.js';
import { doAction } from '../../utils/actionBus.js';
import { connectedClients } from '../../server/websocket.js';
import { sanitizeInput } from '../../utils/sanitizeInputs.js';
import { PostSEO } from '../../models/postSEO.js';
import { Categories } from '../../models/categories.js';
import System from '../../models/system.js';
import PW_Query from '../../models/pwQuery.js';
import { clearPostAndCategoryCache, delCache, delCacheByPattern } from '../../utils/cache.js';

function notifyPostChanges() {
  for (const [clientId, ws] of connectedClients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'UPDATE_ADMIN_PAGES' }));
    }
  }
}

const mapPostDates = (p) => ({
  ...p,
  id: p.id,
  post_date: p.post_date ? p.post_date.toISOString() : null,
  post_date_gmt: p.post_date_gmt ? p.post_date_gmt.toISOString() : null,
  post_modified: p.post_modified ? p.post_modified.toISOString() : null,
  post_modified_gmt: p.post_modified_gmt ? p.post_modified_gmt.toISOString() : null,
});

export default {
  Query: {
    getPWQuery: async function (_, { args }, { connection, loaders, userId }) {
      try {
        let parsedArgs = {};
        try {
          parsedArgs = JSON.parse(args);
        } catch (e) {
          throw new Error('Invalid args format. Must be valid JSON.');
        }

        // Skip caching for individual posts to prevent wrong post being shown
        const isIndividualPost = parsedArgs.name || parsedArgs.p;
        let cachedResult = null;
        let cacheKey = null;

        if (!isIndividualPost) {
          // Check cache for listings only - create more specific cache key
          const argsString = JSON.stringify(parsedArgs, Object.keys(parsedArgs).sort());
          cacheKey = `graphql:getPWQuery:${Buffer.from(argsString).toString('base64')}`;
        }

        const allowedKeys = [
          'p',
          'name',
          'title',
          'page_id',
          'pagename',
          'pagename__in',
          'post_parent',
          'post_parent__in',
          'post_parent__not_in',
          'post__in',
          'post__not_in',
          'post_name__in',
          'author',
          'author_name',
          'post_type',
          'post_status',
          'cat',
          'category_name',
          'category__and',
          'category__in',
          'category__not_in',
          'comment_count',
          'tag',
          'tag_id',
          'tag__and',
          'tag__in',
          'tag__not_in',
          'tag_slug__and',
          'tag_slug__in',
          'tax_query',
          's',
          'exact',
          'sentence',
          'has_password',
          'post_password',
          'fields',
          'meta_key',
          'meta_value',
          'meta_value_num',
          'meta_compare',
          'meta_query',
          'year',
          'monthnum',
          'w',
          'day',
          'hour',
          'minute',
          'second',
          'm',
          'date_query',
          'posts_per_page',
          'nopaging',
          'paged',
          'offset',
          'posts_per_archive_page',
          'orderby',
          'order',
          'ignore_sticky_posts',
          'cache_results',
          'update_post_meta_cache',
          'update_post_term_cache',
          'lazy_load_term_meta',
          'perm',
          'post_mime_type',
        ];

        Object.keys(parsedArgs).forEach((key) => {
          if (!allowedKeys.includes(key)) {
            throw new Error(`Invalid argument: ${key}`);
          }
        });

        if (parsedArgs.post_type && typeof parsedArgs.post_type !== 'string') {
          throw new Error('post_type must be a string');
        }
        if (parsedArgs.post_status) {
          if (
            !Array.isArray(parsedArgs.post_status) &&
            typeof parsedArgs.post_status !== 'string'
          ) {
            throw new Error('post_status must be a string or array of strings');
          }
          if (
            Array.isArray(parsedArgs.post_status) &&
            !parsedArgs.post_status.every((s) => typeof s === 'string')
          ) {
            throw new Error('post_status array must contain only strings');
          }
        }
        if (parsedArgs.author) {
          if (
            !(
              typeof parsedArgs.author === 'number' ||
              (Array.isArray(parsedArgs.author) &&
                parsedArgs.author.every((a) => typeof a === 'number'))
            )
          ) {
            throw new Error('author must be a number or an array of numbers');
          }
        }
        if (parsedArgs.meta_query) {
          if (!Array.isArray(parsedArgs.meta_query)) {
            throw new Error('meta_query must be an array');
          }
          parsedArgs.meta_query.forEach((meta, i) => {
            if (!meta.key || typeof meta.key !== 'string') {
              throw new Error(`meta_query[${i}].key must be a string`);
            }
            if (
              meta.value !== undefined &&
              typeof meta.value !== 'string' &&
              typeof meta.value !== 'number'
            ) {
              throw new Error(`meta_query[${i}].value must be a string or number`);
            }
          });
        }
        if (
          parsedArgs.posts_per_page &&
          (isNaN(parsedArgs.posts_per_page) || parsedArgs.posts_per_page < 1)
        ) {
          throw new Error('posts_per_page must be a positive number');
        }
        if (parsedArgs.paged && (isNaN(parsedArgs.paged) || parsedArgs.paged < 1)) {
          throw new Error('paged must be a positive number');
        }

        const posts = await PW_Query.fetchPWQuery(parsedArgs, connection, loaders, userId);

        const total = await PW_Query.countWPQuery(parsedArgs, connection, loaders, userId);

        const result = {
          posts: posts,
          total: total,
        };

        return result;
      } catch (err) {
        console.error('getPWQuery failed', err);
        throw new Error('Failed to run PWQuery.');
      }
    },
    getPostTypes: async function (_, __, { connection }) {
      const data = await connection`SELECT DISTINCT post_type FROM pw_posts`;
      return data.map((row) => row.post_type);
    },
    getPosts: async function (
      _,
      { page = 1, perPage = 10, type, include_trash },
      { connection, loaders },
    ) {
      try {
        const totalPosts = await Post.fetchAll(connection, type, include_trash);
        if (totalPosts.length > 0) {
          const args = [
            { type: 'limit', value: perPage },
            { type: 'offset', value: (page - 1) * perPage },
          ];

          let posts = await Post.fetch(args, type, connection, include_trash, loaders);

          // posts = await doAction('get_all_posts', posts);

          return {
            posts: posts.map(mapPostDates),
            total: totalPosts.length,
          };
        } else {
          return {
            posts: [],
            total: 0,
          };
        }
      } catch {
        throw new Error('Failed to fetch posts.');
      }
    },

    getPostsSearch: async function (
      _,
      { search, page = 1, perPage = 10, type, include_trash },
      { connection, loaders },
    ) {
      try {
        const totalPosts = await Post.fetchAllSearch(connection, type, search);
        const args = [
          { type: 'limit', value: perPage },
          { type: 'offset', value: (page - 1) * perPage },
        ];
        const posts = await Post.fetchSearch(args, type, connection, search, loaders);

        return {
          posts: posts.map(mapPostDates),
          total: totalPosts.length,
        };
      } catch {
        throw new Error('Failed to fetch posts with search.');
      }
    },

    getPostsByType: async function (_, { page = 1, perPage = 10, type }, { connection, loaders }) {
      try {
        const totalPosts = await Post.fetchAllPublished(connection, type);
        const args = [
          { type: 'limit', value: perPage },
          { type: 'offset', value: (page - 1) * perPage > 0 ? (page - 1) * perPage : 0 },
        ];

        const posts = await Post.fetchPublished(args, type, connection, loaders);

        return {
          posts: posts.map(mapPostDates),
          total: totalPosts.length,
        };
      } catch {
        throw new Error('Failed to fetch posts by type.');
      }
    },

    getPostsByStatus: async function (
      _,
      { page = 1, perPage = 10, type, status },
      { connection, loaders },
    ) {
      try {
        const totalPosts = await Post.fetchAllByStatus(connection, type, status);
        const args = [
          { type: 'limit', value: perPage },
          { type: 'offset', value: (page - 1) * perPage },
        ];
        const posts = await Post.fetchByStatus(args, type, status, connection, loaders);

        return {
          posts: posts.map(mapPostDates),
          total: totalPosts.length,
        };
      } catch {
        throw new Error('Failed to fetch posts by status.');
      }
    },

    getPostsByAuthor: async function (
      _,
      { page = 1, perPage = 10, type, author_id },
      { connection, loaders },
    ) {
      try {
        const totalPosts = await Post.fetchAllByAuthor(connection, type, author_id);
        const args = [
          { type: 'limit', value: perPage },
          { type: 'offset', value: (page - 1) * perPage },
        ];
        const posts = await Post.fetchByAuthor(args, type, author_id, connection, loaders);

        return {
          posts: posts.map(mapPostDates),
          total: totalPosts.length,
        };
      } catch {
        throw new Error('Failed to fetch posts by author.');
      }
    },

    getPostsByCategory: async function (
      _,
      { page = 1, perPage = 10, term_id },
      { connection, loaders },
    ) {
      try {
        const totalPosts = await Post.fetchAllByCategory(connection, term_id);
        const args = [
          { type: 'limit', value: perPage },
          { type: 'offset', value: (page - 1) * perPage },
        ];
        const posts = await Post.fetchbyCategory(args, term_id, connection, loaders);

        return {
          posts: posts.map(mapPostDates),
          total: totalPosts.length,
        };
      } catch {
        throw new Error('Failed to fetch posts by category.');
      }
    },

    getCategory: async function (_, { slug }, { connection }) {
      try {
        const category = await Categories.getCategory(slug, connection);
        return category;
      } catch {
        throw new Error('Failed to get category.');
      }
    },

    getCategories: async function (_, { type }, { connection }) {
      try {
        const categories = await Categories.getCategories(type, connection);
        return { categories };
      } catch {
        throw new Error('Failed to get categories.');
      }
    },
    getPostsAndPagesNavigation: async function (_, __, { connection }) {
      try {
        const posts = await Post.getAllPostsAndPagesSlugAndChildCount(connection);
        return {
          posts,
          total: posts.length,
        };
      } catch {
        throw new Error('Failed to get posts/pages navigation.');
      }
    },

    getPostBy: async function (_, { field, value }, { connection, loaders }) {
      try {
        let post = await Post.getPostBy(field, value, connection, loaders);

        let postAction = await doAction('get_post', post);
        if (postAction == undefined) return post;
        return postAction;
      } catch (err) {
        console.error('getPostBy error:', err);
        throw new Error('Failed to get post.');
      }
    },

    getPostSEO: async function (_, { postId }, { connection }) {
      let seo = await PostSEO.getPostSEOById(postId, connection);

      return seo;
    },
    getPostTableFields: async function (_, { postType }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      let fields = [
        { name: 'id', title: 'ID', order: 1 },
        { name: 'title', title: 'Title', order: 2 },
      ];

      if (postType == 'post' || postType == 'page' || postType == '') {
        fields = [
          { name: 'id', title: 'ID', order: 1 },
          { name: 'title', title: 'Title', order: 2 },
          { name: 'author', title: 'Author', order: 3 },
          { name: 'categories', title: 'Categories', order: 4 },
          { name: 'tags', title: 'Tags', order: 5 },
          { name: 'date', title: 'Date', order: 6 },
        ];
      }

      let hookFields = await doAction('get_post_table_fields', fields, postType, connection);

      if (hookFields) {
        return { fields: hookFields };
      }
      return { fields: fields };
    },
    getPostComments: async function (_, { postId }, { connection, loaders }) {
      try {
        const rows =
          await connection`SELECT comment_id FROM pw_comments WHERE comment_post_id=${postId}`;

        const commentIds = rows.map((r) => r.comment_id);

        const processedComments = await Promise.all(
          commentIds.map(async (id) => {
            try {
              const [row] = await connection`SELECT * FROM pw_comments WHERE comment_id=${id}`;
              const comment = row;

              const user = comment.user_id ? await loaders.user.load(comment.user_id) : null;
              const post = comment.comment_post_id
                ? await loaders.post.load(comment.comment_post_id)
                : null;

              // Safely convert dates with validation
              let commentDate = null;
              let commentDateGmt = null;

              if (comment.comment_date) {
                try {
                  const date = new Date(comment.comment_date);
                  if (!isNaN(date.getTime())) {
                    commentDate = date.toISOString();
                  } else {
                    console.warn(`Invalid comment_date for comment ${id}:`, comment.comment_date);
                  }
                } catch (e) {
                  console.warn(`Invalid comment_date for comment ${id}:`, comment.comment_date);
                }
              }

              if (comment.comment_date_gmt) {
                try {
                  const dateGmt = new Date(comment.comment_date_gmt);
                  if (!isNaN(dateGmt.getTime())) {
                    commentDateGmt = dateGmt.toISOString();
                  }
                } catch (e) {
                  console.warn(
                    `Invalid comment_date_gmt for comment ${id}:`,
                    comment.comment_date_gmt,
                  );
                }
              }

              return {
                ...comment,
                comment_date: commentDate,
                comment_date_gmt: commentDateGmt,
                comment_author_name: user ? user.display_name : 'Anonymous',
                user,
                post,
              };
            } catch (commentErr) {
              console.error(`Error processing comment ${id}:`, commentErr);
              throw commentErr;
            }
          }),
        );

        const result = { comments: processedComments };
        return result;
      } catch (err) {
        console.error(`getPostComments failed for postId ${postId}:`, err);
        throw new Error(`Failed to get comments for post ${postId}: ${err.message}`);
      }
    },

    getAllAdminComments: async function (_, { page, perPage }, { connection, isAuth, loaders }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof connection !== 'function') {
        throw new Error('Invalid connection: Expected a postgres-js client function');
      }

      try {
        const totalComments = await connection`
      SELECT COUNT(*) AS count FROM pw_comments
    `;
        const totalCount = Number(totalComments[0].count);

        const limit = perPage ?? 10;
        const offset = (page - 1) * perPage ?? 0;

        const rows = await connection`
      SELECT *
      FROM pw_comments
      ORDER BY comment_id DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

        const processedComments = await Promise.all(
          rows.map(async (comment) => {
            const user = comment.user_id ? await loaders.user.load(comment.user_id) : null;
            const post = comment.comment_post_id
              ? await loaders.post.load(comment.comment_post_id)
              : null;

            return {
              ...comment,
              comment_date: comment.comment_date
                ? new Date(comment.comment_date).toISOString()
                : null,
              comment_date_gmt: comment.comment_date_gmt
                ? new Date(comment.comment_date_gmt).toISOString()
                : null,
              comment_author_name: user ? user.display_name : 'Anonymous',
              user,
              post,
            };
          }),
        );

        return { comments: processedComments, totalComments: totalCount };
      } catch (err) {
        console.error('getAllAdminComments failed:', err.message);
        throw new Error(`Failed to load comments: ${err.message}`);
      }
    },

    getAllAdminCommentsByAuthor: async function (
      _,
      { page, perPage, userId },
      { connection, isAuth, loaders },
    ) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      // Validate connection
      if (typeof connection !== 'function') {
        throw new Error('Invalid connection: Expected a postgres-js client function');
      }

      try {
        // Fetch total comments for the user
        const totalComments = await connection`
      SELECT COUNT(*) AS count
      FROM pw_comments
      WHERE user_id = ${userId}
    `;
        const totalCount = Number(totalComments[0].count);

        // Set pagination parameters
        const limit = perPage ?? 10;
        const offset = (page - 1) * perPage ?? 0;

        // Fetch paginated comments
        const rows = await connection`
      SELECT *
      FROM pw_comments
      WHERE user_id = ${userId}
      ORDER BY comment_id DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

        // Process comments with DataLoader
        const processedComments = await Promise.all(
          rows.map(async (comment) => {
            const user = comment.user_id ? await loaders.user.load(comment.user_id) : null;
            const post = comment.comment_post_id
              ? await loaders.post.load(comment.comment_post_id)
              : null;

            return {
              ...comment,
              comment_date: comment.comment_date
                ? new Date(comment.comment_date).toISOString()
                : null,
              comment_date_gmt: comment.comment_date_gmt
                ? new Date(comment.comment_date_gmt).toISOString()
                : null,
              comment_author_name: user ? user.display_name : 'Anonymous',
              user,
              post,
            };
          }),
        );

        return { comments: processedComments, totalComments: totalCount };
      } catch (err) {
        console.error('getAllAdminCommentsByAuthor failed:', err.message);
        throw new Error(`Failed to load comments: ${err.message}`);
      }
    },
  },

  Mutation: {
    createDraftNewPost: async function (
      _,
      { title, content, featuredImageId, categories, tags, postType },
      { connection, isAuth, userId },
    ) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanTitle = sanitizeInput(title);
      const cleanContent = sanitizeInput(content);

      const safeCategories = Array.isArray(categories) ? categories : [];
      const safeTags = Array.isArray(tags) ? tags : [];
      const safeFeaturedImageId = typeof featuredImageId === 'number' ? featuredImageId : null;

      try {
        const success = await Post.createDraftPost(
          cleanTitle,
          cleanContent,
          safeFeaturedImageId,
          safeCategories,
          safeTags,
          postType,
          userId,
          connection,
        );

        await clearPostAndCategoryCache();

        return success;
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to create draft post.' };
      }
    },

    createScheduledNewPost: async function (
      _,
      { title, content, featuredImageId, categories, tags, postType, publishDate },
      { connection, isAuth, userId },
    ) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanTitle = sanitizeInput(title);
      const cleanContent = sanitizeInput(content);

      const safeCategories = Array.isArray(categories) ? categories : [];
      const safeTags = Array.isArray(tags) ? tags : [];
      const safeFeaturedImageId = typeof featuredImageId === 'number' ? featuredImageId : null;

      try {
        const success = await Post.createScheduledPost(
          cleanTitle,
          cleanContent,
          safeFeaturedImageId,
          safeCategories,
          safeTags,
          postType,
          userId,
          connection,
          publishDate,
        );

        await clearPostAndCategoryCache();

        return success;
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to create scheduled post.' };
      }
    },

    createPublishNewPost: async function (
      _,
      { title, content, featuredImageId, categories, tags, postType },
      { connection, isAuth, userId },
    ) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanTitle = sanitizeInput(title);
      const cleanContent = sanitizeInput(content);

      const safeCategories = Array.isArray(categories) ? categories : [];
      const safeTags = Array.isArray(tags) ? tags : [];
      const safeFeaturedImageId = typeof featuredImageId === 'number' ? featuredImageId : null;

      try {
        const success = await Post.createPublishPost(
          cleanTitle,
          cleanContent,
          safeFeaturedImageId,
          safeCategories,
          safeTags,
          postType,
          userId,
          connection,
          notifyPostChanges,
        );

        await clearPostAndCategoryCache();

        return success;
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to create and publish post.' };
      }
    },

    updatePost: async function (
      _,
      { title, content, featuredImageId, postId },
      { connection, isAuth, userId, loaders },
    ) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanTitle = sanitizeInput(title);
      const cleanContent = sanitizeInput(content);

      const safeFeaturedImageId = typeof featuredImageId === 'number' ? featuredImageId : null;

      try {
        const success = await Post.updatePost(
          cleanTitle,
          cleanContent,
          safeFeaturedImageId,
          postId,
          userId,
          connection,
          notifyPostChanges,
        );
        let post = await Post.getPostBy('id', postId, connection, loaders);
        const hookResult = await doAction('post_update', post);

        try {
          await clearPostAndCategoryCache();
          // Clear all GraphQL query caches (more aggressive approach)
          await delCacheByPattern(`graphql:*`);
          await delCacheByPattern(`post:*`);
        } catch (err) {
          console.warn('⚠️ Failed to update Redis cache for post:', err.message);
        }

        if (hookResult !== undefined && hookResult !== post) {
          return hookResult;
        }

        return success;
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update post.' };
      }
    },

    updatePostStatus: async function (_, { status, post_id }, { connection, isAuth, loaders }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanStatus = sanitizeInput(status);
      if (typeof post_id !== 'number') {
        const error = new Error('Invalid or missing post_id');
        error.code = 400;
        throw error;
      }

      try {
        const success = await Post.updatePostStatus(cleanStatus, post_id, connection);

        let post;
        try {
          post = await Post.getPostBy('id', post_id, connection, loaders);
        } catch (fetchErr) {
          console.error('Error fetching post after status update:', fetchErr);
          throw fetchErr;
        }

        try {
          if (post) {
            await clearPostAndCategoryCache();
          }
        } catch (cacheErr) {
          console.warn('⚠️ Failed to update Redis cache for post:', cacheErr.message);
        }

        await doAction('post_update_status', post);

        notifyPostChanges();

        return success;
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update post status.' };
      }
    },

    updatePostPublishDate: async function (_, { date, post_id }, { connection, isAuth, loaders }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof post_id !== 'number') {
        const error = new Error('Invalid or missing post_id');
        error.code = 400;
        throw error;
      }

      const publishDate = new Date(date);
      if (isNaN(publishDate.getTime())) {
        const error = new Error('Invalid publish date');
        error.code = 400;
        throw error;
      }

      try {
        let post;
        try {
          post = await Post.getPostBy('id', post_id, connection, loaders);
        } catch (fetchErr) {
          console.error('Error fetching post after publish date update:', fetchErr);
          throw fetchErr;
        }

        try {
          if (post) {
            await clearPostAndCategoryCache();
          }
        } catch (cacheErr) {
          console.warn('⚠️ Failed to update Redis cache for post:', cacheErr.message);
        }

        await doAction('post_update_publish_date', post);

        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update post publish date.' };
      }
    },

    updatePostPassword: async function (_, { password, post_id }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof post_id !== 'number') {
        const error = new Error('Invalid or missing post_id');
        error.code = 400;
        throw error;
      }

      if (typeof password !== 'string' || password.length === 0) {
        const error = new Error('Invalid or missing password');
        error.code = 400;
        throw error;
      }

      try {
        const success = await Post.updatePostPassword(password, post_id, connection);

        try {
          const post = await Post.getPostBy('id', post_id, connection, loaders);
          if (post) {
            await clearPostAndCategoryCache();
          }
        } catch (cacheErr) {
          console.warn('⚠️ Failed to update Redis cache for post:', cacheErr.message);
        }

        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update post password.' };
      }
    },

    deletePost: async function (_, { postId }, { connection, isAuth, loaders }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof post_id !== 'number') {
        const error = new Error('Invalid or missing post_id');
        error.code = 400;
        throw error;
      }

      try {
        let post = await Post.getPostBy('id', postId, connection, loaders);
        await doAction('post_delete', post);
        await connection.begin(async (sql) => {
          await sql`DELETE FROM pw_postmeta WHERE post_id = ${postId}`;
          await sql`DELETE FROM pw_posts WHERE id = ${postId}`;
        });

        await delCache(`post:${postId}`);
        if (post.post_name) {
          await delCache(`post_name:${post.post_name}`);
        }

        notifyPostChanges();
        return { success: true };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Could not delete post.' };
      }
    },

    updatePostSEO: async function (_, { seo, postId }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof postId !== 'number') {
        const error = new Error('Invalid or missing post_id');
        error.code = 400;
        throw error;
      }

      let parsedSEO;
      try {
        parsedSEO = typeof seo === 'string' ? JSON.parse(seo) : seo;
      } catch (err) {
        const error = new Error('Invalid SEO JSON');
        error.code = 400;
        throw error;
      }

      if (typeof parsedSEO !== 'object' || parsedSEO === null) {
        const error = new Error('SEO data must be an object');
        error.code = 400;
        throw error;
      }

      try {
        const success = await PostSEO.updatePostSEO(postId, seo, connection);

        try {
        } catch (cacheErr) {
          console.warn('⚠️ Failed to update Redis cache after SEO update:', cacheErr.message);
        }

        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Could not update SEO.' };
      }
    },

    addNewPostComment: async function (_, { postId, comment }, { connection }) {
      try {
        if (typeof postId !== 'number') {
          const error = new Error('Invalid or missing postId');
          error.code = 400;
          throw error;
        }

        let commentData;
        try {
          commentData = JSON.parse(comment);
        } catch {
          const error = new Error('Invalid comment JSON');
          error.code = 400;
          throw error;
        }

        // Validate required fields
        if (!commentData.comment_author || !commentData.comment_content) {
          const error = new Error('Missing required comment fields');
          error.code = 400;
          throw error;
        }

        // Sanitize strings
        const author = sanitizeInput(commentData.comment_author);
        const content = sanitizeInput(commentData.comment_content);
        const commentType = commentData.comment_type || '';
        const commentApproved = commentData.comment_approved ?? 't';
        const commentParent = commentData.comment_parent || null;
        const userId = commentData.user_id || null;

        const result = await connection`
        INSERT INTO pw_comments 
          (comment_post_id, comment_author, comment_date, comment_date_gmt, comment_content, comment_approved, comment_type, user_id, comment_parent)
        VALUES 
          (${postId}, ${author}, ${commentData.comment_date}, ${commentData.comment_date_gmt}, ${content}, ${commentApproved}, ${commentType}, ${userId}, ${commentParent})
        RETURNING *;
      `;

        if (result.length > 0) {
          // Comment added successfully
        }

        return { success: !!result[0] };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        throw err;
      }
    },
    deleteCommentById: async function (_, { id }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof id !== 'number') {
        const error = new Error('Invalid or missing comment id');
        error.code = 400;
        throw error;
      }

      try {
        const result = await connection`
          WITH RECURSIVE comment_tree AS (
            SELECT comment_id
            FROM pw_comments
            WHERE comment_id = ${id}
            UNION
            SELECT c.comment_id
            FROM pw_comments c
            INNER JOIN comment_tree ct ON c.comment_parent = ct.comment_id
          )
          DELETE FROM pw_comments
          WHERE comment_id IN (SELECT comment_id FROM comment_tree)
          RETURNING *;
        `;

        if (result.length > 0) {
        }

        return { success: result.length > 0 };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to delete comment.' };
      }
    },
  },
};
