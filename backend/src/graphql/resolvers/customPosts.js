import { connectedClients } from '../../server/websocket.js';
import System from '../../models/system.js';
import { sanitizeInput } from '../../utils/sanitizeInputs.js';

function notifyCustomPostChanges() {
  for (const [clientId, ws] of connectedClients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'UPDATE_ADMIN_PAGES' }));
      ws.send(JSON.stringify({ type: 'UPDATE_ADMIN_SIDEBAR' }));
    }
  }
}

export default {
  Query: {
    getCustomPosts: async function (_, {}, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const posts = await connection`SELECT * FROM pw_options WHERE option_name='custom_posts'`;
      if (posts.length === 0) {
        return JSON.stringify([]);
      }
      return posts[0].option_value;
    },

    getCustomPostById: async function (_, { postId }, { connection, isAuth }) {
      const postsData = await connection`SELECT * FROM pw_options WHERE option_name='custom_posts'`;
      if (postsData.length === 0) {
        return JSON.stringify([]);
      }
      const posts = JSON.parse(postsData[0].option_value);
      const post = posts.find((p) => p.id === postId);
      return JSON.stringify(post || {});
    },

    getCustomPostBySlug: async function (_, { slug }, { connection, isAuth }) {
      const postsData = await connection`SELECT * FROM pw_options WHERE option_name='custom_posts'`;
      if (postsData.length === 0) {
        return JSON.stringify([]);
      }
      const posts = JSON.parse(postsData[0].option_value);
      const normalizePostTypeName = (name) => {
        return name
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '_')
          .toLowerCase();
      };
      const post = posts.find((p) => normalizePostTypeName(p.name) === slug);
      return JSON.stringify(post || {});
    },

    getCustomPostsWhereMatch: async function (_, { type, equal, target }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const postsData = await connection`SELECT * FROM pw_options WHERE option_name='custom_posts'`;
      if (postsData.length === 0) {
        return '';
      }
      const posts = JSON.parse(postsData[0].option_value);
      const matchedGroups = posts.filter((p) =>
        p.rules.some(
          (rule) => rule.field === type && rule.equal === equal && rule.target === target,
        ),
      );
      return JSON.stringify(matchedGroups);
    },
  },

  Mutation: {
    updateCustomPosts: async function (_, { posts }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      let parsedData;
      try {
        parsedData = JSON.parse(posts);
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Invalid JSON format' };
      }

      try {
        const originalPostsDb =
          await connection`SELECT * FROM pw_options WHERE option_name='custom_posts'`;
        const originalPosts = originalPostsDb.length
          ? JSON.parse(originalPostsDb[0].option_value)
          : [];

        const normalizePostTypeName = (name) =>
          name
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '_')
            .toLowerCase();

        for (const newPost of parsedData) {
          const originalPost = originalPosts.find((post) => post.id === newPost.id);

          if (originalPost) {
            const oldType = normalizePostTypeName(originalPost.name);
            const newType = normalizePostTypeName(newPost.name);

            if (oldType !== newType) {
              await connection`
              UPDATE pw_posts
              SET post_type = ${newType}
              WHERE post_type = ${oldType}
            `;
            }
          }
        }

        const result = await connection`
        UPDATE pw_options
        SET option_value = ${JSON.stringify(parsedData)}
        WHERE option_name = 'custom_posts'
      `;

        notifyPluginChanges();

        return { success: result.count === 1 };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
      }
    },
    updateCustomPostStatus: async function (_, { id, status }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const cleanStatus = sanitizeInput(status);
        if (typeof id !== 'number') {
          const error = new Error('Invalid or missing post ID');
          error.code = 400;
          throw error;
        }

        const postsData =
          await connection`SELECT * FROM pw_options WHERE option_name='custom_posts'`;
        if (!postsData.length) return { success: false, message: 'No custom posts found' };

        const posts = JSON.parse(postsData[0].option_value);
        const postIndex = posts.findIndex((g) => g.id == id);

        if (postIndex === -1) {
          return { success: false, message: 'Post not found' };
        }
        posts[postIndex].status = cleanStatus;
        const result = await connection`
        UPDATE pw_options
        SET option_value = ${JSON.stringify(posts)}
        WHERE option_name = 'custom_posts'
      `;

        notifyPluginChanges();

        return { success: result.count === 1 };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
      }
    },
  },
};
