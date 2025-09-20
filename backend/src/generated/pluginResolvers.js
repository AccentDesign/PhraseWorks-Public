import plugin1 from '../plugins/testPlugin/index.js';

const pluginResolvers = [plugin1.resolvers].filter(Boolean);

const pluginTypeDefs = [plugin1.typeDefs].filter(Boolean);

const pluginMeta = [
  {
    version: plugin1.version,
    name: plugin1.name,
    slug: 'testPlugin',
    pageUrls: ['/admin/test-plugin'],
    description: plugin1.description || '',
    author: plugin1.author || '',
    authorUrl: plugin1.authorUrl || '',
    init: plugin1.init,
    disable: plugin1.disable,
    adminPageComponents: plugin1.adminPageComponents || {},
    shortcodes: plugin1.shortCodes || {},
    src: plugin1.src || {},
  },
].filter(Boolean);

export { pluginResolvers, pluginTypeDefs, pluginMeta };
