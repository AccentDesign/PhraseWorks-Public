import system from './resolvers/system.js';
import auth from './resolvers/auth.js';
import media from './resolvers/media.js';
import posts from './resolvers/posts.js';
import postCategory from './resolvers/postCategory.js';
import postTag from './resolvers/postTag.js';
import pages from './resolvers/pages.js';
import pageCategory from './resolvers/pageCategory.js';
import pageTag from './resolvers/pageTag.js';
import users from './resolvers/users.js';
import pageTemplates from './resolvers/pageTemplates.js';
import menus from './resolvers/menus.js';
import plugins from './resolvers/plugins.js';
import { pluginResolvers } from '../generated/pluginResolvers.js';
import customFields from './resolvers/customFields.js';
import customPosts from './resolvers/customPosts.js';
import cache from './resolvers/cache.js';
import { simpleJobResolvers } from './resolvers/simpleJobs.js';

import { mergeResolvers } from '@graphql-tools/merge';
export async function createResolvers(connection) {
  let activePluginResolvers = null;

  const tableCheck = await connection`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name = 'pw_options'
    ) AS table_exists;
  `;

  if (tableCheck[0].table_exists) {
    const pluginsData = await connection`
      SELECT * FROM pw_options WHERE option_name='plugins'
    `;
    if (pluginsData.length == 0) {
      activePluginResolvers = pluginResolvers;
    } else {
      const activePlugins = JSON.parse(pluginsData[0].option_value);

      const activePluginSlugs = activePlugins.map((p) => p.slug);

      activePluginResolvers = pluginResolvers.filter((r) =>
        activePluginSlugs.includes(r.__pluginSlug),
      );
    }
  } else {
    activePluginResolvers = pluginResolvers;
  }
  const staticResolversArray = [
    system,
    auth,
    menus,
    customFields,
    customPosts,
    media,
    posts,
    postCategory,
    postTag,
    pages,
    pageCategory,
    pageTag,
    pageTemplates,
    users,
    plugins,
    cache,
    simpleJobResolvers,
  ];

  return mergeResolvers([mergeResolvers(staticResolversArray), ...pluginResolvers]);
}
