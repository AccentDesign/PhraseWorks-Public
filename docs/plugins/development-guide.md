# Plugin Development Guide

This comprehensive guide will walk you through creating plugins for PhraseWorks, from basic setup to advanced patterns.

## Overview

PhraseWorks plugins follow a **dual architecture** pattern, requiring both backend and frontend components. This design ensures full-stack functionality while maintaining clean separation of concerns.

### Key Concepts:
- **Hook System**: WordPress-inspired actions and filters
- **GraphQL Schema Extension**: Add custom types and resolvers
- **Admin Integration**: Custom pages and meta boxes
- **Real-time Updates**: WebSocket integration for live changes

## Plugin Structure

Every plugin requires both backend and frontend components with matching names:

```
📁 PhraseWorks/
├── 📁 backend/src/plugins/
│   └── 📁 yourPlugin/
│       ├── 📄 index.js       # Plugin registration & hooks
│       ├── 📄 resolvers.js   # GraphQL resolvers
│       └── 📄 schema.js      # GraphQL schema definitions
└── 📁 frontend/src/Plugins/
    └── 📁 yourPlugin/
        ├── 📄 index.js       # Frontend plugin registration
        ├── 📁 Pages/         # Admin pages
        ├── 📁 Components/    # Reusable components
        └── 📁 API/           # API integration helpers
```

## Backend Plugin Development

### 1. Plugin Registration (`index.js`)

```javascript
/*
Plugin Name: Your Plugin
Description: A comprehensive example plugin
Version: 1.0.0
Author: Your Name
*/

import resolvers from './resolvers.js';
import typeDefs from './schema.js';
import { addAction, removeAction } from '../../utils/actionBus.js';

let initialized = false;
let callbacks = {};

export function init() {
  if (initialized) return;

  // Hook: Modify posts before returning
  callbacks.getPosts = async (posts) => {
    console.log(`YourPlugin: Processing ${posts.length} posts`);
    // Add custom data or filter posts
    return posts.map(post => ({
      ...post,
      customField: `Processed by YourPlugin`
    }));
  };

  // Hook: Add admin menu item
  callbacks.getAdminMenus = async (menu) => {
    const exists = menu.some(item => item.id === 'your-plugin');
    if (!exists) {
      menu.push({
        id: 'your-plugin',
        name: 'Your Plugin',
        slug: '/admin/your-plugin',
        icon: generateSVGIcon(), // Helper function below
        order: 10,
        children: [
          {
            id: 'your-plugin-settings',
            name: 'Settings',
            slug: '/admin/your-plugin/settings',
            order: 1
          }
        ],
      });
    }
    return menu;
  };

  // Hook: Add admin routes
  callbacks.getAdminPages = async (pages) => {
    const routes = [
      {
        key: 'your-plugin-main',
        path: '/your-plugin',
        index: false,
        core: false,
        element: 'YourPluginMainPage',
        elementLocation: 'yourPlugin/Pages',
        children: [],
      },
      {
        key: 'your-plugin-settings',
        path: '/your-plugin/settings',
        index: false,
        core: false,
        element: 'YourPluginSettingsPage',
        elementLocation: 'yourPlugin/Pages',
        children: [],
      }
    ];

    // Add routes that don't already exist
    routes.forEach(route => {
      const exists = pages.some(page => page.key === route.key);
      if (!exists) {
        pages.push(route);
      }
    });

    return pages;
  };

  // Register hooks
  addAction('get_posts', callbacks.getPosts);
  addAction('get_admin_menus', callbacks.getAdminMenus);
  addAction('get_admin_pages', callbacks.getAdminPages);

  console.log('YourPlugin initialized successfully');
  initialized = true;
}

export function disable() {
  // Clean up all hooks
  Object.keys(callbacks).forEach(hookName => {
    const actionName = hookName.replace(/([A-Z])/g, '_$1').toLowerCase();
    removeAction(actionName, callbacks[hookName]);
  });

  console.log('YourPlugin disabled');
  initialized = false;
}

// Helper function for SVG icons
function generateSVGIcon() {
  return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>`;
}

// Plugin metadata export
export default {
  version: '1.0.0',
  name: 'Your Plugin',
  slug: 'yourPlugin',
  description: 'A comprehensive example plugin showing all features',
  author: 'Your Name',
  authorUrl: 'https://yourwebsite.com',
  pluginUrl: 'https://github.com/yourname/your-plugin',
  resolvers,
  typeDefs,
  init,
  disable,
  // Admin page meta boxes
  adminPageComponents: {
    add_post: [
      {
        name: 'Your Plugin Meta Box',
        location: '/src/Plugins/yourPlugin/Components/PostMetaBox',
      },
    ],
    edit_post: [
      {
        name: 'Your Plugin Edit Meta Box',
        location: '/src/Plugins/yourPlugin/Components/PostEditMetaBox',
      },
    ],
    add_page: [
      {
        name: 'Your Plugin Page Meta Box',
        location: '/src/Plugins/yourPlugin/Components/PageMetaBox',
      },
    ],
  },
};
```

### 2. GraphQL Schema (`schema.js`)

```javascript
export default /* GraphQL */ `
  # Custom types for your plugin
  type YourPluginSettings {
    id: Int!
    enableFeature: Boolean!
    apiKey: String
    maxItems: Int!
    createdAt: String!
    updatedAt: String!
  }

  type YourPluginData {
    id: Int!
    title: String!
    content: String
    status: String!
    metadata: String
  }

  # Input types for mutations
  input YourPluginSettingsInput {
    enableFeature: Boolean!
    apiKey: String
    maxItems: Int!
  }

  input YourPluginDataInput {
    title: String!
    content: String
    status: String!
    metadata: String
  }

  # Extend existing types (optional)
  extend type Post {
    yourPluginData: YourPluginData
  }

  # Extend Query type
  extend type Query {
    # Get plugin settings
    getYourPluginSettings: YourPluginSettings

    # Get all plugin data
    getYourPluginData(page: Int = 1, perPage: Int = 10): [YourPluginData!]!

    # Get single plugin data item
    getYourPluginDataById(id: Int!): YourPluginData
  }

  # Extend Mutation type
  extend type Mutation {
    # Update plugin settings
    updateYourPluginSettings(input: YourPluginSettingsInput!): YourPluginSettings!

    # Create plugin data
    createYourPluginData(input: YourPluginDataInput!): YourPluginData!

    # Update plugin data
    updateYourPluginData(id: Int!, input: YourPluginDataInput!): YourPluginData!

    # Delete plugin data
    deleteYourPluginData(id: Int!): Boolean!
  }
`;
```

### 3. GraphQL Resolvers (`resolvers.js`)

```javascript
export default {
  Query: {
    getYourPluginSettings: async (_, __, { connection, isAuth, userId }) => {
      // Check authentication
      if (!isAuth) {
        throw new Error('Authentication required');
      }

      try {
        const result = await connection`
          SELECT * FROM pw_options
          WHERE option_name = 'your_plugin_settings'
        `;

        if (result.length === 0) {
          // Return default settings
          return {
            id: 0,
            enableFeature: false,
            apiKey: null,
            maxItems: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }

        const settings = JSON.parse(result[0].option_value);
        return {
          id: result[0].option_id,
          ...settings,
        };
      } catch (error) {
        console.error('Error fetching plugin settings:', error);
        throw new Error('Failed to fetch plugin settings');
      }
    },

    getYourPluginData: async (_, { page, perPage }, { connection, isAuth }) => {
      if (!isAuth) {
        throw new Error('Authentication required');
      }

      const offset = (page - 1) * perPage;

      try {
        const result = await connection`
          SELECT * FROM pw_your_plugin_data
          ORDER BY created_at DESC
          LIMIT ${perPage} OFFSET ${offset}
        `;

        return result.map(row => ({
          id: row.id,
          title: row.title,
          content: row.content,
          status: row.status,
          metadata: row.metadata,
        }));
      } catch (error) {
        console.error('Error fetching plugin data:', error);
        throw new Error('Failed to fetch plugin data');
      }
    },

    getYourPluginDataById: async (_, { id }, { connection, isAuth }) => {
      if (!isAuth) {
        throw new Error('Authentication required');
      }

      try {
        const result = await connection`
          SELECT * FROM pw_your_plugin_data WHERE id = ${id}
        `;

        if (result.length === 0) {
          throw new Error('Plugin data not found');
        }

        return {
          id: result[0].id,
          title: result[0].title,
          content: result[0].content,
          status: result[0].status,
          metadata: result[0].metadata,
        };
      } catch (error) {
        console.error('Error fetching plugin data by ID:', error);
        throw new Error('Failed to fetch plugin data');
      }
    },
  },

  Mutation: {
    updateYourPluginSettings: async (_, { input }, { connection, isAuth, userId }) => {
      if (!isAuth) {
        throw new Error('Authentication required');
      }

      // Additional permission check for admin-only features
      const user = await connection`SELECT user_role FROM pw_users WHERE id = ${userId}`;
      if (!user.length || user[0].user_role !== 'administrator') {
        throw new Error('Administrator access required');
      }

      try {
        const settingsData = {
          enableFeature: input.enableFeature,
          apiKey: input.apiKey,
          maxItems: input.maxItems,
          updatedAt: new Date().toISOString(),
        };

        await connection`
          INSERT INTO pw_options (option_name, option_value)
          VALUES ('your_plugin_settings', ${JSON.stringify(settingsData)})
          ON CONFLICT (option_name)
          DO UPDATE SET option_value = ${JSON.stringify(settingsData)}
        `;

        return {
          id: 1, // You might want to get the actual ID
          ...settingsData,
          createdAt: new Date().toISOString(), // Should be actual creation date
        };
      } catch (error) {
        console.error('Error updating plugin settings:', error);
        throw new Error('Failed to update plugin settings');
      }
    },

    createYourPluginData: async (_, { input }, { connection, isAuth, userId }) => {
      if (!isAuth) {
        throw new Error('Authentication required');
      }

      try {
        const result = await connection`
          INSERT INTO pw_your_plugin_data (
            title, content, status, metadata, user_id, created_at, updated_at
          )
          VALUES (
            ${input.title},
            ${input.content || ''},
            ${input.status},
            ${input.metadata || ''},
            ${userId},
            NOW(),
            NOW()
          )
          RETURNING *
        `;

        return {
          id: result[0].id,
          title: result[0].title,
          content: result[0].content,
          status: result[0].status,
          metadata: result[0].metadata,
        };
      } catch (error) {
        console.error('Error creating plugin data:', error);
        throw new Error('Failed to create plugin data');
      }
    },

    updateYourPluginData: async (_, { id, input }, { connection, isAuth, userId }) => {
      if (!isAuth) {
        throw new Error('Authentication required');
      }

      try {
        const result = await connection`
          UPDATE pw_your_plugin_data
          SET
            title = ${input.title},
            content = ${input.content || ''},
            status = ${input.status},
            metadata = ${input.metadata || ''},
            updated_at = NOW()
          WHERE id = ${id} AND user_id = ${userId}
          RETURNING *
        `;

        if (result.length === 0) {
          throw new Error('Plugin data not found or permission denied');
        }

        return {
          id: result[0].id,
          title: result[0].title,
          content: result[0].content,
          status: result[0].status,
          metadata: result[0].metadata,
        };
      } catch (error) {
        console.error('Error updating plugin data:', error);
        throw new Error('Failed to update plugin data');
      }
    },

    deleteYourPluginData: async (_, { id }, { connection, isAuth, userId }) => {
      if (!isAuth) {
        throw new Error('Authentication required');
      }

      try {
        const result = await connection`
          DELETE FROM pw_your_plugin_data
          WHERE id = ${id} AND user_id = ${userId}
          RETURNING id
        `;

        return result.length > 0;
      } catch (error) {
        console.error('Error deleting plugin data:', error);
        throw new Error('Failed to delete plugin data');
      }
    },
  },

  // Field resolvers for extended types (optional)
  Post: {
    yourPluginData: async (post, _, { connection, loaders }) => {
      try {
        const result = await connection`
          SELECT * FROM pw_your_plugin_data
          WHERE post_id = ${post.id}
          LIMIT 1
        `;

        return result.length > 0 ? {
          id: result[0].id,
          title: result[0].title,
          content: result[0].content,
          status: result[0].status,
          metadata: result[0].metadata,
        } : null;
      } catch (error) {
        console.error('Error fetching plugin data for post:', error);
        return null;
      }
    },
  },
};
```

## Frontend Plugin Development

### 1. Plugin Registration (`frontend/src/Plugins/yourPlugin/index.js`)

```javascript
/*
Your Plugin - Frontend
Version: 1.0.0
*/

// This file serves as the frontend plugin entry point
// Components and pages are dynamically loaded by the system
export default {
  version: '1.0.0',
  name: 'Your Plugin',
  slug: 'yourPlugin',
  description: 'Frontend components for Your Plugin',
};
```

### 2. Main Plugin Page (`Pages/YourPluginMainPage.jsx`)

```jsx
import React, { useState, useEffect } from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import PageContent from '../../../Admin/Components/PageContent';
import YourPluginContent from './Components/YourPluginContent';
import LoadingSpinner from '../../../Utils/LoadingSpinner';

const YourPluginMainPage = ({ siteTitle }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pluginData, setPluginData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `Your Plugin - ${siteTitle}`;
    loadPluginData();
  }, [siteTitle]);

  const loadPluginData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'credentials': 'include',
        },
        body: JSON.stringify({
          query: `
            query GetYourPluginData($page: Int, $perPage: Int) {
              getYourPluginData(page: $page, perPage: $perPage) {
                id
                title
                content
                status
                metadata
              }
            }
          `,
          variables: { page: 1, perPage: 10 }
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      setPluginData(data.data.getYourPluginData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading plugin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <PageContent>
          <LoadingSpinner />
        </PageContent>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <PageContent>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Plugin Data
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </PageContent>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <PageContent>
        <YourPluginContent
          data={pluginData}
          onDataChange={loadPluginData}
        />
      </PageContent>
      <Footer />
    </>
  );
};

export default YourPluginMainPage;
```

### 3. Plugin Content Component (`Pages/Components/YourPluginContent.jsx`)

```jsx
import React, { useState } from 'react';

const YourPluginContent = ({ data, onDataChange }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    content: '',
    status: 'active'
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'credentials': 'include',
        },
        body: JSON.stringify({
          query: `
            mutation CreateYourPluginData($input: YourPluginDataInput!) {
              createYourPluginData(input: $input) {
                id
                title
                content
                status
              }
            }
          `,
          variables: { input: newItem }
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      // Reset form
      setNewItem({ title: '', content: '', status: 'active' });

      // Refresh data
      onDataChange();

      // Show success message (you might want to use a proper notification system)
      alert('Item created successfully!');
    } catch (err) {
      console.error('Error creating item:', err);
      alert(`Error creating item: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900">Your Plugin</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your plugin data and settings from this dashboard.
        </p>
      </div>

      {/* Create New Item Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Item</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={newItem.content}
              onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={newItem.status}
              onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>

      {/* Data List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Plugin Data</h2>
        </div>

        {data.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No data available. Create your first item above.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {data.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.content}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-500 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourPluginContent;
```

## Hook System

Available hooks in PhraseWorks (search backend resolvers for `doAction` to find all available hooks):

### Core Hooks:
- `get_posts` - Modify posts before returning
- `get_admin_menus` - Add/modify admin menu items
- `get_admin_pages` - Add admin page routes
- `plugin_activated` - Called when plugin is activated
- `plugin_deactivated` - Called when plugin is deactivated

### Example Hook Usage:

```javascript
// In your plugin's init() function
callbacks.getPostsHook = async (posts, context) => {
  // Add custom field to all posts
  return posts.map(post => ({
    ...post,
    customProcessed: true,
    processingTime: new Date().toISOString()
  }));
};

addAction('get_posts', callbacks.getPostsHook);
```

## Meta Boxes

Add meta boxes to existing admin pages:

```javascript
// In your plugin export
adminPageComponents: {
  add_post: [
    {
      name: 'SEO Settings',
      location: '/src/Plugins/yourPlugin/Components/SEOMetaBox',
    },
  ],
  edit_post: [
    {
      name: 'SEO Settings',
      location: '/src/Plugins/yourPlugin/Components/SEOMetaBox',
    },
  ],
  add_page: [
    {
      name: 'Page Settings',
      location: '/src/Plugins/yourPlugin/Components/PageSettingsMetaBox',
    },
  ],
}
```

Available meta box locations (search frontend for `<PluginComponents page=""` to find all):
- `add_post`
- `edit_post`
- `add_page`
- `edit_page`
- `settings_general`
- And more...

## Best Practices

### 1. Error Handling
```javascript
// Always wrap database operations
try {
  const result = await connection`SELECT * FROM your_table`;
  return result;
} catch (error) {
  console.error('Database error:', error);
  throw new Error('Failed to fetch data');
}
```

### 2. Authentication & Authorization
```javascript
// Check authentication first
if (!isAuth) {
  throw new Error('Authentication required');
}

// Check specific permissions
const user = await connection`SELECT * FROM pw_users WHERE id = ${userId}`;
if (user[0].role !== 'administrator') {
  throw new Error('Administrator access required');
}
```

### 3. Data Validation
```javascript
// Validate input data
const { title, content } = input;
if (!title || title.length < 3) {
  throw new Error('Title must be at least 3 characters');
}
```

### 4. Database Table Creation
Create tables in your plugin's `init()` function:

```javascript
export async function init(connection) {
  // Create plugin table if it doesn't exist
  await connection`
    CREATE TABLE IF NOT EXISTS pw_your_plugin_data (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      status VARCHAR(50) DEFAULT 'active',
      metadata JSONB,
      user_id INTEGER REFERENCES pw_users(id),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}
```

## Troubleshooting

### Plugin Not Loading
1. Check that both backend and frontend folders exist with matching names
2. Verify `slug` matches between backend plugin export and folder name
3. Run `npm run generate:plugins` to regenerate plugin metadata
4. Check console for JavaScript errors

### GraphQL Schema Issues
1. Ensure schema syntax is correct (use GraphQL Playground to test)
2. Check for naming conflicts with existing types
3. Verify resolvers match schema definitions

### Admin Pages Not Showing
1. Check `getAdminPages` hook is properly registered
2. Verify `elementLocation` path matches your file structure
3. Ensure frontend component exports are correct

### Hook Not Triggering
1. Search backend code for the exact hook name using `doAction`
2. Verify hook is registered in plugin's `init()` function
3. Check plugin is activated in admin panel

For more help, refer to the troubleshooting documentation and community resources.