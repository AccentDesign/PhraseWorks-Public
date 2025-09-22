/*
Cookie-Consent Plugin - Backend
*/

import resolvers from './resolvers.js';
import typeDefs from './schema.js';
import { addAction, removeAction } from '../../utils/actionBus.js';

let initialized = false;
let getAdminMenusCallback,
  getAdminPagesCallback,
  pluginActivatedCallback,
  getPostCallback,
  loadPageCallBack;

const checkCookieConsentRowExists = async (connection) => {
  const cookieConsentRow = await connection`
    SELECT 1 FROM pw_options WHERE option_name = '_cookie_consent' LIMIT 1
  `;

  const cookieConsentExists = cookieConsentRow.length > 0;
  return cookieConsentExists;
};

const setupTables = async (connection, env) => {
  const cookieConsentExists = await checkCookieConsentRowExists(connection);
  if (!cookieConsentExists) {
    const defaultValue = JSON.stringify({
      title: 'We value your privacy',
      title_color: '#ffffff',
      consent_text:
        'We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies.',
      consent_text_color: '#ffffff',
      consent_location: 'botton_right',
      cookie_content: '',
      accept_btn_text: 'Accept All',
      decline_btn_text: 'Reject All',
      section_color: '#8f78b0',
      accept_btn_color: 'ffffff',
      accept_btn_text_color: '#292751',
      decline_btn_color: '#ffffff',
      decline_btn_text_color: '#292751',
    });

    try {
      await connection`
        INSERT INTO pw_options (option_name, option_value)
        VALUES ('_cookie_consent', ${defaultValue})
      `;
    } catch (error) {}
  } else {
  }
};

export function init() {
  if (initialized) return;
  pluginActivatedCallback = async (pluginName, connection, env) => {
    if (pluginName == 'cookieConsent') {
      await setupTables(connection, env);
    }
  };

  getAdminMenusCallback = async (menu) => {
    const exists = menu.some((item) => item.id === 'cookie-consent');
    if (!exists) {
      if (pluginConfig.menuPosition === 'plugins') {
        menu
          .find((item) => item.id == 'plugins')
          .children.push({
            id: 'cookie-consent',
            name: 'Cookie Consent',
            slug: '/admin/cookie-consent',
            icon: `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z"></path><path d="M8 13v.01"></path><path d="M12 17v.01"></path><path d="M12 12v.01"></path><path d="M16 14v.01"></path><path d="M11 8v.01"></path><path d="M13.148 3.476l2.667 1.104a4 4 0 0 0 4.656 6.14l.053 .132a3 3 0 0 1 0 2.296q -.745 1.18 -1.024 1.852q -.283 .684 -.66 2.216a3 3 0 0 1 -1.624 1.623q -1.572 .394 -2.216 .661q -.712 .295 -1.852 1.024a3 3 0 0 1 -2.296 0q -1.203 -.754 -1.852 -1.024q -.707 -.292 -2.216 -.66a3 3 0 0 1 -1.623 -1.624q -.397 -1.577 -.661 -2.216q -.298 -.718 -1.024 -1.852a3 3 0 0 1 0 -2.296q .719 -1.116 1.024 -1.852q .257 -.62 .66 -2.216a3 3 0 0 1 1.624 -1.623q 1.547 -.384 2.216 -.661q .687 -.285 1.852 -1.024a3 3 0 0 1 2.296 0"></path></svg>`,
            order: 2,
            children: [],
          });
      } else {
        menu.push({
          id: 'cookie-consent',
          name: 'Cookie Consent',
          slug: '/admin/cookie-consent',
          icon: `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z"></path><path d="M8 13v.01"></path><path d="M12 17v.01"></path><path d="M12 12v.01"></path><path d="M16 14v.01"></path><path d="M11 8v.01"></path><path d="M13.148 3.476l2.667 1.104a4 4 0 0 0 4.656 6.14l.053 .132a3 3 0 0 1 0 2.296q -.745 1.18 -1.024 1.852q -.283 .684 -.66 2.216a3 3 0 0 1 -1.624 1.623q -1.572 .394 -2.216 .661q -.712 .295 -1.852 1.024a3 3 0 0 1 -2.296 0q -1.203 -.754 -1.852 -1.024q -.707 -.292 -2.216 -.66a3 3 0 0 1 -1.623 -1.624q -.397 -1.577 -.661 -2.216q -.298 -.718 -1.024 -1.852a3 3 0 0 1 0 -2.296q .719 -1.116 1.024 -1.852q .257 -.62 .66 -2.216a3 3 0 0 1 1.624 -1.623q 1.547 -.384 2.216 -.661q .687 -.285 1.852 -1.024a3 3 0 0 1 2.296 0"></path></svg>`,
          order: 2,
          children: [],
        });
      }
    }
    return menu;
  };

  getAdminPagesCallback = async (adminPages) => {
    const exists = adminPages.some((item) => item.key === 'cookie-consent-page');
    if (!exists) {
      adminPages.push({
        key: 'cookie-consent-page',
        path: '/cookie-consent',
        index: false,
        core: false,
        element: 'CookieConsentPage',
        elementLocation: 'CookieConsent/Pages',
        children: [],
      });
    }
    return adminPages;
  };

  const getPostCallback = async (post) => {
    // Only append if [cookieConsent] isn't already present
    if (!post.post_content.includes('[cookieConsent]')) {
      post.post_content += '\n<p>[cookieConsent]</p>';
    }

    return post;
  };

  addAction('plugin_activated', 'cookieConsent', pluginActivatedCallback);
  addAction('get_admin_menus', 'cookieConsent', getAdminMenusCallback);
  addAction('get_admin_pages', 'cookieConsent', getAdminPagesCallback);
  addAction('get_post', 'cookieConsent', getPostCallback);
  addAction('get_page', 'cookieConsent', loadPageCallBack, {
    public: true,
  });

  initialized = true;
}

export function disable() {
  removeAction('plugin_activated', 'cookieConsent', pluginActivatedCallback);
  removeAction('get_admin_menus', 'cookieConsent', getAdminMenusCallback);
  removeAction('get_admin_pages', 'cookieConsent', getAdminPagesCallback);
  removeAction('get_post', 'cookieConsent', getPostCallback);
  removeAction('get_page', 'cookieConsent', loadPageCallBack);
  initialized = false;
}

const pluginConfig = {
  version: '0.0.1',
  name: 'Cookie Consent',
  slug: 'cookieConsent',
  description: 'A plugin for creating Cookie Consent on pages.',
  author: 'Nick Thompson, Accent Design Ltd',
  authorUrl: 'https://www.accentdesign.co.uk',
  menuPosition: 'plugins',
  resolvers,
  typeDefs,
  init: init,
  disable: disable,
  shortCodes: [
    {
      name: 'cookieConsent',
      path: './Plugins/CookieConsent/Shortcodes/Cookie.jsx',
    },
  ],
  src: '',
};

export default pluginConfig;

export { getAdminPagesCallback };
