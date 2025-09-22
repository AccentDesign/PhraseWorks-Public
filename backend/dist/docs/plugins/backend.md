### BackEnd Plugin Folder

Once your folder is created you will need to create an index.js file, a resolver.js file and a schema.js file.

The index.js file consists of:

```js
/*
Plugin Name - Backend
*/

import resolvers from './resolvers';
import typeDefs from './schema';
import { addAction, removeAction } from '../../utils/actionBus.js';

let initialized = false;
let getPostsCallback, getAdminMenusCallback, getAdminPagesCallback;

export function init() {
  if (initialized) return;

  getPostsCallback = async (posts) => {
    console.log('Hook: get_posts', posts.length);
    return posts;
  };

  getAdminMenusCallback = async (menu) => {
    const exists = menu.some((item) => item.id === 'foo');
    if (!exists) {
      menu.push({
        id: 'plugin-name',
        name: 'Plugin Name',
        slug: '/admin/plugin-name',
        icon: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><path d="M96 0C78.3 0 64 14.3 64 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c0 77.4 55 142 128 156.8l0 67.2c0 17.7 14.3 32 32 32s32-14.3 32-32l0-67.2C297 398 352 333.4 352 256l0-32c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z"></path></svg>',
        order: 2,
        children: [],
      });
    }
    return menu;
  };

  getAdminPagesCallback = async (pages) => {
    const exists = pages.some((item) => item.key === 'plugin-name-page');
    if (!exists) {
      pages.push({
        key: 'plugin-name-page',
        path: '/plugin-name',
        index: false,
        core: false,
        element: 'pluginNamePage',
        elementLocation: 'pluginName/Pages',
        children: [],
      });
    }
    return pages;
  };

  addAction('get_posts', getPostsCallback);
  addAction('get_admin_menus', getAdminMenusCallback);
  addAction('get_admin_pages', getAdminPagesCallback);

  initialized = true;
}

export function disable() {
  removeAction('get_posts', getPostsCallback);
  removeAction('get_admin_menus', getAdminMenusCallback);
  removeAction('get_admin_pages', getAdminPagesCallback);

  initialized = false;
}

export default {
  version: '0.0.1',
  name: 'Plugin Name',
  slug: 'pluginName',
  description: 'A plugin for...',
  author: 'Your Name',
  authorUrl: 'http://yoururl.com',
  resolvers,
  typeDefs,
  init: init,
  disable: disable,
};
```

The above code will generate a plugin that can detect the get_posts call in the core and add more or remove things from the returned data.
There are multiple other hooks you can create, the easiest way to find them (until i create the help system) is by searching the resolvers folder in the backend for `await doAction`. Any of the names you find in there such as: `posts = await doAction('get_posts', posts);` are useable, this one is the one used in the code above.

The getAdminMenusCallback allows you to add to the admin menu a link to your plugins page which is added to the admin system via: getAdminPagesCallback.

The resolvers.js file will be along these lines:

```js
export default {
  Query: {
    sayHello: () => 'Hello from plugin!',
  },
  Mutation: {
    addHello: (value) => `Add functionality can go here ${value}`,
  },
};
```

So each of the endpoings or mutations you want to add to the backends resolvers are put in here.

The schema.js file will be along these lines:

```js
export default /* GraphQL */ `
  extend type Query {
    sayHello: String!
  }
  extend type Mutation {
    addHello(value: String!): String!
  }
`;
```
