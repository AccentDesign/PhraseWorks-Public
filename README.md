# PhraseWorks

A modern full-stack content management system with a plugin architecture, built as a WordPress-like alternative. Features a React frontend and Node.js/Hono backend with GraphQL API, designed to run on Cloudflare Workers.

## Architecture

### Frontend (React/Vite)
- **Framework**: React 18.3.1 with React Router DOM 7.6.2
- **Build Tool**: Vite 6.3.1 with SWC
- **Styling**: TailwindCSS 3.4.4 with Flowbite components
- **State Management**: React Context API (APIConnectorContext, UserContext)
- **Rich Text**: TinyMCE integration

### Backend (Node.js/Hono)
- **Framework**: Hono 4.7.10 web framework
- **API**: GraphQL with custom resolvers
- **Database**: PostgreSQL via Cloudflare Hyperdrive
- **Storage**: Cloudflare R2 (S3-compatible)
- **Authentication**: JWT with custom middleware
- **WebSocket**: Real-time features on port 8081

## Quick Start

### Initial Setup
```bash
npm run install-all    # Install all dependencies (frontend & backend)
npm run dev            # Start both frontend (5173) & backend (8787) concurrently
```

### Development Servers
- **Frontend**: http://localhost:5173 (live reload during development)
- **Backend**: http://localhost:8787 (serves built frontend from /dist)

### Environment Configuration
1. Copy `.env.example` to `.env` in the backend folder
2. Replace placeholder values with your actual credentials:
   - Generate strong random strings for `SECRET_KEY` and `AUTH_SECRET`
   - Configure PostgreSQL database credentials
   - Set up Cloudflare R2 storage credentials
   - Configure SMTP settings for email functionality
3. **Never commit the `.env` file with real credentials**

## Development

### Frontend Development
```bash
cd frontend
npm run dev            # Development server at localhost:5173
npm run build          # Build to backend/dist directory
npm run lint           # ESLint checking
```

### Backend Development
```bash
cd backend
npm run dev            # Development server at localhost:8787
npm run deploy         # Deploy to Cloudflare Workers
npm run generate:plugins  # Regenerate plugin GraphQL resolvers
```

## Deployment

### Local Build
```bash
cd frontend && npm run build
cd ../backend && npm run dev
```

### Production Deployment
```bash
cd frontend && npm run build
cd ../backend && npm run deploy
```

### Docker Development
```bash
docker-compose up --build
```

## Key Features

### Plugin Architecture
- **Dual Plugin System**: Frontend and backend plugins work together
- **Hook System**: Extensible via `doAction`/`addAction` for customization
- **Admin Integration**: Dynamic menu and page registration
- **Meta Boxes**: Custom components for post/page editing
- **GraphQL Extensions**: Custom endpoints and resolvers

### Error Handling
- **Error Boundaries**: React error boundaries for graceful failure handling
- **WebSocket Resilience**: Robust connection management with StrictMode compatibility
- **Authentication**: JWT-based authentication with proper CORS handling

### Job System
- **Background Jobs**: Asynchronous task processing
- **Real-time Updates**: WebSocket integration for live notifications

## Plugin Development

PhraseWorks uses a dual plugin system requiring both frontend and backend components.

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
