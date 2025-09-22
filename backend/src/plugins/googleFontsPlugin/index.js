/*
Google Fonts Plugin - Backend
*/

import resolvers from './resolvers.js';
import typeDefs from './schema.js';
import { addAction, removeAction } from '../../utils/actionBus.js';

let initialized = false;
let getAdminMenusCallback, getAdminPagesCallback;

export function init() {
  if (initialized) return;

  getAdminMenusCallback = async (menu) => {
    const exists = menu.some((item) => item.id === 'google-fonts');
    if (!exists) {
      if (pluginConfig.menuPosition === 'plugins') {
        menu
          .find((item) => item.id == 'plugins')
          .children.push({
            id: 'google-fonts',
            name: 'Google Fonts Plugin',
            slug: '/admin/google-fonts',
            icon: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><path d="M4 2.8A3.6 3.6 0 1 0 4 10a3.6 3.6 0 0 0 0-7.2zm7.6 0v18.4h7.2a5.2 5.2 0 1 1 0-10.4 4 4 0 1 1 0-8zm7.2 0v8a4 4 0 1 0 0-8zm0 8v10.4A5.2 5.2 0 0 0 24 16a5.2 5.2 0 0 0-5.2-5.2zm-7.7-7.206L0 21.199h8.8l2.3-3.64Z"></path></svg>',
            order: 2,
            children: [],
          });
      } else {
        menu.push({
          id: 'google-fonts',
          name: 'Google Fonts Plugin',
          slug: '/admin/google-fonts',
          icon: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><path d="M4 2.8A3.6 3.6 0 1 0 4 10a3.6 3.6 0 0 0 0-7.2zm7.6 0v18.4h7.2a5.2 5.2 0 1 1 0-10.4 4 4 0 1 1 0-8zm7.2 0v8a4 4 0 1 0 0-8zm0 8v10.4A5.2 5.2 0 0 0 24 16a5.2 5.2 0 0 0-5.2-5.2zm-7.7-7.206L0 21.199h8.8l2.3-3.64Z"></path></svg>',
          order: 2,
          children: [],
        });
      }
    }
    return menu;
  };

  getAdminPagesCallback = async (pages) => {
    const exists = pages.some((item) => item.key === 'google-fonts-page');
    if (!exists) {
      pages.push({
        key: 'google-fonts-page',
        path: '/google-fonts',
        index: false,
        core: false,
        element: 'GoogleFontsPage',
        elementLocation: 'googleFonts/Pages',
        children: [],
      });
    }
    return pages;
  };
  addAction('get_admin_menus', 'googleFontsPlugin', getAdminMenusCallback);

  addAction('get_admin_pages', 'googleFontsPlugin', getAdminPagesCallback);

  initialized = true;
}

export function disable() {
  removeAction('get_admin_menus', 'googleFontsPlugin', getAdminMenusCallback);

  removeAction('get_admin_pages', 'googleFontsPlugin', getAdminPagesCallback);

  initialized = false;
}

const pluginConfig = {
  version: '0.0.1',
  name: 'Google Fonts Plugin',
  slug: 'googleFonts',
  description: 'A plugin for using Google fonts.',
  author: 'Nick Thompson, Accent Design Ltd',
  authorUrl: 'https://www.accentdesign.co.uk',
  menuPosition: 'plugins',
  resolvers,
  typeDefs,
  init: init,
  disable: disable,
  shortCodes: [],
  src: '',
};

export default pluginConfig;
