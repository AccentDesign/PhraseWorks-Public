/*
Test Plugin - Backend
*/

import resolvers from './resolvers.js';
import typeDefs from './schema.js';
import { addAction, removeAction } from '../../utils/actionBus.js';

let initialized = false;
let getPostsCallback, postUpdateCallback, getAdminMenusCallback, getAdminPagesCallback;

export function init() {
  if (initialized) return;
  getPostsCallback = async (posts) => {
    // console.log('Hook: get_posts', posts.length);
    return posts;
  };

  postUpdateCallback = async (post) => {
    // console.log('Hook: post_updated', post.id);
  };

  // Enable this to allow the callback for the admin menu action
  // getAdminMenusCallback = async (menu) => {
  //   const exists = menu.some((item) => item.id === 'test-plugin');
  //   if (!exists) {
  //     menu.push({
  //       id: 'test-plugin',
  //       name: 'Test Plugin',
  //       slug: '/admin/test-plugin',
  //       icon: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><path d="M96 0C78.3 0 64 14.3 64 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c0 77.4 55 142 128 156.8l0 67.2c0 17.7 14.3 32 32 32s32-14.3 32-32l0-67.2C297 398 352 333.4 352 256l0-32c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z"></path></svg>',
  //       order: 2,
  //       children: [],
  //     });
  //   }
  //   return menu;
  // };

  // Enable this to allow the callback for the admin page action
  // getAdminPagesCallback = async (pages) => {
  //   const exists = pages.some((item) => item.key === 'test-plugin-page');
  //   if (!exists) {
  //     pages.push({
  //       key: 'test-plugin-page',
  //       path: '/test-plugin',
  //       index: false,
  //       core: false,
  //       element: 'TestPluginPage',
  //       elementLocation: 'testPlugin/Pages',
  //       children: [],
  //     });
  //   }
  //   return pages;
  // };

  addAction('get_posts', 'testPlugin', getPostsCallback);

  addAction('post_update', 'testPlugin', postUpdateCallback);

  // Enable this to get a link in the admin menu
  // addAction('get_admin_menus', 'testPlugin', getAdminMenusCallback);

  // Enable this to get a page in the admin site
  // addAction('get_admin_pages', 'testPlugin', getAdminPagesCallback);

  initialized = true;
}

export function disable() {
  removeAction('get_posts', 'testPlugin', getPostsCallback);

  removeAction('post_update', 'testPlugin', postUpdateCallback);

  // Enable this to on disable remove the link in the admin menu
  // removeAction('get_admin_menus', 'testPlugin', getAdminMenusCallback);

  // Enable this to get on disable remove the page in the admin site
  // removeAction('get_admin_pages', 'testPlugin', getAdminPagesCallback);

  initialized = false;
}

export default {
  version: '0.0.1',
  name: 'Test Plugin',
  slug: 'testPlugin',
  description: 'A plugin for testing things.',
  author: 'Nick Thompson, Accent Design Ltd',
  authorUrl: 'https://www.accentdesign.co.uk',
  resolvers,
  typeDefs,
  init: init,
  disable: disable,
  // adminPageComponents: {
  //   add_page: [
  //     {
  //       name: 'Test Plugin MetaBox',
  //       location: '/src/Plugins/testPlugin/Components/TestPluginMetaBox',
  //     },
  //   ],
  // },
  shortCodes: [],
  src: '',
};
