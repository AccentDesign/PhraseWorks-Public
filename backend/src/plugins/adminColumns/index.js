/*
Admin Columns - Backend
*/

import resolvers from './resolvers.js';
import typeDefs from './schema.js';
import { addAction, removeAction } from '../../utils/actionBus.js';

let initialized = false;
let pluginActivatedCallback,
  getAdminMenusCallback,
  getAdminPagesCallback,
  getPostTableFieldsCallback;

const checkAdminColumnsRowExists = async (connection) => {
  const cookieConsentRow = await connection`
    SELECT 1 FROM pw_options WHERE option_name = '_admin_columns' LIMIT 1
  `;

  const cookieConsentExists = cookieConsentRow.length > 0;
  return cookieConsentExists;
};

const setupTables = async (connection, env) => {
  const cookieConsentExists = await checkAdminColumnsRowExists(connection);
  if (!cookieConsentExists) {
    const defaultValue = JSON.stringify([
      {
        postType: 'post',
        fields: [
          { name: 'id', title: 'ID', order: 1 },
          { name: 'title', title: 'Title', order: 2 },
          { name: 'author', title: 'Author', order: 3 },
          { name: 'categories', title: 'Categories', order: 4 },
          { name: 'tags', title: 'Tags', order: 5 },
          { name: 'date', title: 'Date', order: 6 },
        ],
      },
      {
        postType: 'page',
        fields: [
          { name: 'id', title: 'ID', order: 1 },
          { name: 'title', title: 'Title', order: 2 },
          { name: 'author', title: 'Author', order: 3 },
          { name: 'categories', title: 'Categories', order: 4 },
          { name: 'tags', title: 'Tags', order: 5 },
          { name: 'date', title: 'Date', order: 6 },
        ],
      },
    ]);

    try {
      await connection`
        INSERT INTO pw_options (option_name, option_value)
        VALUES ('_admin_columns', ${defaultValue})
      `;
    } catch (error) {}
  } else {
  }
};

export function init() {
  if (initialized) return;
  pluginActivatedCallback = async (pluginName, connection, env) => {
    if (pluginName == 'adminColumns') {
      await setupTables(connection, env);
    }
  };

  // Enable this to allow the callback for the admin menu action
  getAdminMenusCallback = async (menu) => {
    const exists = menu.some((item) => item.id === 'admin-columns');
    if (!exists) {
      if (pluginConfig.menuPosition === 'plugins') {
        menu
          .find((item) => item.id == 'plugins')
          .children.push({
            id: 'admin-columns',
            name: 'Admin Columns',
            slug: '/admin/admin-columns',
            icon: '<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><path d="M4 6l5.5 0"></path><path d="M4 10l5.5 0"></path><path d="M4 14l5.5 0"></path><path d="M4 18l5.5 0"></path><path d="M14.5 6l5.5 0"></path><path d="M14.5 10l5.5 0"></path><path d="M14.5 14l5.5 0"></path><path d="M14.5 18l5.5 0"></path></svg>',
            order: 2,
            children: [],
          });
      } else {
        menu.push({
          id: 'admin-columns',
          name: 'Admin Columns',
          slug: '/admin/admin-columns',
          icon: '<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><path d="M4 6l5.5 0"></path><path d="M4 10l5.5 0"></path><path d="M4 14l5.5 0"></path><path d="M4 18l5.5 0"></path><path d="M14.5 6l5.5 0"></path><path d="M14.5 10l5.5 0"></path><path d="M14.5 14l5.5 0"></path><path d="M14.5 18l5.5 0"></path></svg>',
          order: 2,
          children: [],
        });
      }
    }
    return menu;
  };

  getAdminPagesCallback = async (pages) => {
    const exists = pages.some((item) => item.key === 'admin-columns-page');
    if (!exists) {
      pages.push({
        key: 'admin-columns-page',
        path: '/admin-columns',
        index: false,
        core: false,
        element: 'AdminColumnsPluginPage',
        elementLocation: 'AdminColumnsPlugin/Pages',
        children: [],
      });
      pages.push({
        key: 'admin-columns-add-page',
        path: '/admin-columns/add',
        index: false,
        core: false,
        element: 'AdminColumnsPluginAddPage',
        elementLocation: 'AdminColumnsPlugin/Pages',
        children: [],
      });
      pages.push({
        key: 'admin-columns-add-edit',
        path: '/admin-columns/edit/:id',
        index: false,
        core: false,
        element: 'AdminColumnsPluginEditPage',
        elementLocation: 'AdminColumnsPlugin/Pages',
        children: [],
      });
    }
    return pages;
  };

  getPostTableFieldsCallback = async (fields, postType, connection) => {
    const dbColumns = await getDBColumns(connection);

    const matched = dbColumns.find((cols) => cols.postType === postType);
    if (matched?.fields) {
      fields = matched.fields;
    }

    return fields;
  };

  addAction('plugin_activated', 'adminColumns', pluginActivatedCallback);

  addAction('get_admin_menus', 'adminColumns', getAdminMenusCallback);

  addAction('get_admin_pages', 'adminColumns', getAdminPagesCallback);

  addAction('get_post_table_fields', 'adminColumns', getPostTableFieldsCallback);

  initialized = true;
}

const addNewField = (fields, name, title, order) => {
  fields = fields.map((field) => {
    if (field.order >= order) {
      return { ...field, order: field.order + 1 };
    }
    return field;
  });

  fields.push({ name: name, title: title, order: order });

  return fields;
};

const getDBColumns = async (connection) => {
  const dbColumnsData =
    await connection`SELECT * FROM pw_options WHERE option_name = '_admin_columns' LIMIT 1`;
  if (dbColumnsData.length > 0) {
    return JSON.parse(dbColumnsData[0].option_value);
  }
  return [];
};

export function disable() {
  removeAction('plugin_activated', 'adminColumns', pluginActivatedCallback);

  // Enable this to on disable remove the link in the admin menu
  removeAction('get_admin_menus', 'adminColumns', getAdminMenusCallback);

  // Enable this to get on disable remove the page in the admin site
  removeAction('get_admin_pages', 'adminColumns', getAdminPagesCallback);

  removeAction('get_post_table_fields', 'adminColumns', getPostTableFieldsCallback);

  initialized = false;
}

const pluginConfig = {
  version: '0.0.1',
  name: 'Admin Columns',
  slug: 'adminColumns',
  description: 'A plugin for adding admin table columns.',
  author: 'Nick Thompson, Accent Design Ltd',
  authorUrl: 'https://www.accentdesign.co.uk',
  menuPosition: 'plugins',
  resolvers,
  typeDefs,
  init: init,
  disable: disable,
  shortCodes: [],
  src: '/plugins/AdminColumnsPlugin/plugin-bundle.js',
};

export default pluginConfig;
