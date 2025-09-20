To amend the db/R2 bucket, amend the wrangler.jsonc in the backend folder.

You will also need to do an amend to the name (backend) in the wrangler.jsonc after a new worker has been created.

## Deployment

Before doing a commit to live you need to go into the front end and do an npm run build, this will build it all into the dist folder in the backend.

So front end folder `npm run build`

Then in back end folder `npm run deploy`

## Development

On initial download, do an `npm run install-all`

After this install you may run `npm run dev` and it will trigger both the frontend and backend `npm run dev` commands

Alternatively:
For dev in the backend folder `npm run dev`
This will run the frontend by default from what is built in the dist folder, you can run a live update front end from in a second terminal in the frontend folder doing `npm run dev`

The live action frontend will run on http://localhost:5173 (Meaning npm run dev on the front-end wordpress side seperate to the backend. The backend runs the react built in its /dist folder by default)
The actual built version will run on http://localhost

## Example Plugin

To create a plugin you need to add two foldes, a folder inside the Plugins folder in the frontend and a folder inside the plugins folder in the backend. For the examples below we will use pluginName for both. The name should match the slug in the backend plugin folders index.js.

Once both the front end and the backend are created you will need to go into the backend and type `npm run generate:plugins`.

This updates the admin plugins page to show the plugin to activate or deactivate it and also adds any pages it has to the allowed pages list.

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

### FrontEnd Plugin Folder

Once your folder is created you will need to create an index.js file in there

```
/*
Plugin Name - Frontend
*/
```

The plugin can have Admin based Components and Pages
Pages are specifically that, so if we add:
/Plugins/pluginName/Pages/pluginNamePage.jsx

We can populate it with:

```jsx
import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import PageContent from '../../../Admin/Components/PageContent.jsx';
import PluginPageContent from './Components/PluginPageContent.jsx';

const PluginNamePage = ({ siteTitle }) => {
  document.title = `Dashboard - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <PluginPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default PluginNamePage;
```

Then in a Components folder inside the Pages folder we can add PluginPageContent.jsx

```jsx
import React from 'react';

const PluginPageContent = () => {
  return <div>PluginPageContent</div>;
};

export default PluginPageContent;
```

This will output the content seperated out from the parent page so you know it will appear in there without worrying about the headers, they are addded on the parent page.

### Adding an admin page meta box to posts/pages

In the admin index.js file we can add:

```js
adminPageComponents: {
    add_page: [
        {
            name: 'Plugin Name MetaBox',
            location: '/src/Plugins/pluginName/Components/PluginNameMetaBox',
        },
    ],
},
```

To the default export, so it looks like:

```js
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
  adminPageComponents: {
    add_page: [
      {
        name: 'Plugin Name MetaBox',
        location: '/src/Plugins/pluginName/Components/PluginNameMetaBox',
      },
    ],
  },
};
```

This will allow us to add to the add new page a meta box underneath the rest of the content in the admin area.

There are other admin pages you could add metaboxes to, to find them (until i write the readme fully) search in the frontend the Admin folder for:

```jsx
<PluginComponents page="" />
```

Whatever the page is is what you would put them under, so an edit page would be

```js
adminPageComponents: {
    add_page: [
        {
            name: 'Plugin Name MetaBox',
            location: '/src/Plugins/pluginName/Components/PluginNameMetaBox',
        },
    ],
    edit_page: [
        {
            name: 'Plugin Name Edit Metabox',
            location: '/src/Plugins/pluginName/Components/EditPagePluginMetaBox',
        }
    ]
}
```

An example of one of these Components is:

```jsx
import React from 'react';

const PluginNameMetaBox = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold">Plugin Name MetaBox</h1>
      <p>In here we could have loads of stuff as its a really simple component!</p>
      <p>It gets loaded in a really interesting and insane way of course.</p>
    </div>
  );
};

export default PluginNameMetaBox;
```
