/*
Accordions Plugin - Backend
*/

import resolvers from './resolvers.js';
import typeDefs from './schema.js';
import { addAction, removeAction } from '../../utils/actionBus.js';

let initialized = false;
let getAdminMenusCallback, getAdminPagesCallback, pluginActivatedCallback;

const checkTableExists = async (connection, tableName) => {
  const result = await connection`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ${tableName}
    ) AS "exists"
  `;

  return result[0].exists;
};

const setupTables = async (connection, env) => {
  let exists = await checkTableExists(connection, 'pw_accordions');
  if (!exists) {
    try {
      await connection`
        CREATE TABLE "public"."pw_accordions" (
          "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
          "title" varchar(255),
          "data" text,
          "active" boolean,
          "trash" boolean
        )
      `;
      await connection.unsafe(`
        ALTER TABLE "public"."pw_accordions" OWNER TO ${env.DATABASE_USER};
      `);
    } catch (error) {
      console.error('Error creating pw_accordions:', error);
    }
  }
};

export function init() {
  if (initialized) return;

  pluginActivatedCallback = async (pluginName, connection, env) => {
    if (pluginName == 'accordionsPlugin') {
      await setupTables(connection, env);
    }
  };
  // Enable this to allow the callback for the admin menu action
  getAdminMenusCallback = async (menu) => {
    const exists = menu.some((item) => item.id === 'accordions-plugin');
    if (!exists) {
      if (pluginConfig.menuPosition === 'plugins') {
        menu
          .find((item) => item.id == 'plugins')
          .children.push({
            id: 'accordions-plugin',
            name: 'Accordions Plugin',
            slug: '/admin/accordions-plugin',
            icon: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.1" viewBox="0 0 17 17"  height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><g></g><path d="M0 0v3h17v-3h-17zM16 2h-15v-1h15v1zM0 13h17v-9h-17v9zM1 5h15v7h-15v-7zM0 17h17v-3h-17v3zM1 15h15v1h-15v-1z"></path></svg>',
            order: 2,
            children: [],
          });
      } else {
        menu.push({
          id: 'accordions-plugin',
          name: 'Accordions Plugin',
          slug: '/admin/accordions-plugin',
          icon: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.1" viewBox="0 0 17 17"  height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><g></g><path d="M0 0v3h17v-3h-17zM16 2h-15v-1h15v1zM0 13h17v-9h-17v9zM1 5h15v7h-15v-7zM0 17h17v-3h-17v3zM1 15h15v1h-15v-1z"></path></svg>',
          order: 2,
          children: [],
        });
      }
    }
    return menu;
  };

  //   Enable this to allow the callback for the admin page action
  getAdminPagesCallback = async (pages) => {
    const exists = pages.some((item) => item.key === 'accordions-plugin-page');
    if (!exists) {
      pages.push({
        key: 'accordions-plugin-page',
        path: '/accordions-plugin',
        index: false,
        core: false,
        element: 'AccordionsPluginPage',
        elementLocation: 'accordionsPlugin/Pages',
        children: [],
      });
      pages.push({
        key: 'accordions-plugin-add-page',
        path: '/accordions-plugin/add',
        index: false,
        core: false,
        element: 'AccordionsPluginAddPage',
        elementLocation: 'accordionsPlugin/Pages',
        children: [],
      });
      pages.push({
        key: 'accordions-plugin-edit-page',
        path: '/accordions-plugin/edit/:id',
        index: false,
        core: false,
        element: 'AccordionsPluginEditPage',
        elementLocation: 'accordionsPlugin/Pages',
        children: [],
      });
    }
    return pages;
  };

  addAction('plugin_activated', 'accordionsPlugin', pluginActivatedCallback);

  // Enable this to get a link in the admin menu
  addAction('get_admin_menus', 'accordionsPlugin', getAdminMenusCallback);

  // Enable this to get a page in the admin site
  addAction('get_admin_pages', 'accordionsPlugin', getAdminPagesCallback);

  initialized = true;
}

export function disable() {
  removeAction('plugin_activated', 'accordionsPlugin', pluginActivatedCallback);

  // Enable this to on disable remove the link in the admin menu
  removeAction('get_admin_menus', 'accordionsPlugin', getAdminMenusCallback);

  // Enable this to get on disable remove the page in the admin site
  removeAction('get_admin_pages', 'accordionsPlugin', getAdminPagesCallback);

  initialized = false;
}

const pluginConfig = {
  version: '0.0.1',
  name: 'Accordions Plugin',
  slug: 'accordionsPlugin',
  description: 'A plugin for adding accordions to posts/pages.',
  author: 'Nick Thompson, Accent Design Ltd',
  authorUrl: 'https://www.accentdesign.co.uk',
  menuPosition: 'plugins',
  resolvers,
  typeDefs,
  init: init,
  disable: disable,
  shortCodes: [
    {
      name: 'accordions',
      path: './Plugins/accordionsPlugin/Shortcodes/Accordion.jsx',
    },
  ],
  src: '',
};

export default pluginConfig;
