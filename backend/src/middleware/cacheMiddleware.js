import { getCache, setCache, cachePost, cacheComment } from '../utils/cache.js';

const skipPatterns = [
  'getPostBy',
  'getPostComments',
  'getPageBy',
  'getPosts',
  'getPages',
  'getAllAdminComments',
  'getAllAdminCommentsByAuthor',
  'getPlugins',
  'getPluginPageComponents',
  'getPluginsRepo',
  'getUserRoles',
  'getUsers',
  'getUserBy',
  'getAuthors',
  'getAuthor',
  'getPageTemplate',
  'getPageTemplates',
  'getPageTemplatesAll',
  'getCustomPosts',
  'getCustomPostById',
  'getCustomPostBySlug',
  'getCustomPostsWhereMatch',
  'getCustomFieldGroups',
  'getCustomFieldGroupById',
  'getCustomFieldGroupsWhereMatch',
  'getPostCustomFieldData',
  'getField',
  'getFields',
];

export const cacheMiddleware = ({ ttl = 60 } = {}) => {
  return async (c, next) => {
    const req = c.req;

    if (req.method !== 'POST') return await next();

    let body;
    try {
      const bodyText = await req.text();
      body = JSON.parse(bodyText);
    } catch {
      return await next();
    }

    const isMutation = body?.query?.trim().toLowerCase().startsWith('mutation');
    if (isMutation) {
      c.set('graphqlBody', body);
      return await next();
    }

    // Build cache key
    const variablesString = JSON.stringify(
      body.variables || {},
      Object.keys(body.variables || {}).sort(),
    );
    const key = `graphql:${body.query}:${variablesString}`;

    // Try cache
    const cached = await getCache(key);
    if (cached) {
      return c.json(cached);
    }

    c.set('graphqlBody', body);

    await next();

    const resData = c.get('graphqlResponse');

    if (resData) {
      const skipFullCache = skipPatterns.some((pattern) => key.includes(pattern));
      if (!skipFullCache) {
        await setCache(key, resData, ttl);
      }

      const extractEntities = (obj) => {
        if (!obj) return;

        if (Array.isArray(obj)) {
          obj.forEach(extractEntities);
        } else if (typeof obj === 'object') {
          if (obj.id && obj.title) {
            cachePost(obj, ttl);
          } else if (obj.comment_id && obj.comment) {
            cacheComment(obj, ttl);
          }

          Object.values(obj).forEach(extractEntities);
        }
      };

      extractEntities(resData);
    }
  };
};
