/*
PW SMTP - Backend
*/

import resolvers from './resolvers.js';
import typeDefs from './schema.js';
import { addAction, removeAction } from '../../utils/actionBus.js';
import nodemailer from 'nodemailer';
import { BrevoMailer } from './BrevoMailer.js';
import { MailgunMailer } from './MailgunMailer.js';

let initialized = false;
let pluginActivatedCallback, getAdminMenusCallback, getAdminPagesCallback, getMailerCallback;

const checkAdminColumnsRowExists = async (connection) => {
  const cookieConsentRow = await connection`
    SELECT 1 FROM pw_options WHERE option_name = '_pw_smtp' LIMIT 1
  `;

  const cookieConsentExists = cookieConsentRow.length > 0;
  return cookieConsentExists;
};

const getTableData = async (connection) => {
  let dbData = await connection`SELECT * FROM pw_options WHERE option_name = '_pw_smtp' LIMIT 1`;
  if (dbData.length > 0) {
    return dbData[0].option_value;
  }
  return [];
};

const setupTables = async (connection, env) => {
  const cookieConsentExists = await checkAdminColumnsRowExists(connection);
  if (!cookieConsentExists) {
    const defaultValue = JSON.stringify({
      from_email: '',
      force_from_email: false,
      from_name: '',
      force_from_name: false,
      return_path: true,
      mailer: 'default',
      api_details: {},
      enabled_email_log: true,
      log_email_content: true,
      save_attachments: false,
      open_email_tracking: false,
      click_link_tracking: false,
      log_retention: '1 Week',
      notify_initial: true,
      notify_delivery_hard_bounce: false,
      email_alerts: false,
      stop_sending: false,
    });

    try {
      await connection`
        INSERT INTO pw_options (option_name, option_value)
        VALUES ('_pw_smtp', ${defaultValue})
      `;
    } catch (error) {}
  } else {
  }
};

const getMailer = async (mailer, data, connection) => {
  if (mailer == 'smtp') {
    const newMailer = await getSMTPMailer(data, connection);
    return newMailer;
  }
  if (mailer == 'brevo') {
    const newMailer = await getBrevoMailer(data, connection);
    return newMailer;
  }
  if (mailer == 'mailgun') {
    const newMailer = await getMailgunMailer(data, connection);
    return newMailer;
  }
};

const getSMTPMailer = async (data, connection) => {
  const settings = {
    SMTP_USERNAME: data.api_details.smtpUserName,
    SMTP_PASSWORD: data.api_details.smtpPassword,
    SMTP_AUTHTYPE: 'login',
    SMTP_HOST: data.api_details.smtpHost,
    SMTP_PORT: Number(data.api_details.smtpPort),
    SMTP_SECURE: data.api_details.encryption === 'ssl',
  };
  const transporter = nodemailer.createTransport({
    host: settings.SMTP_HOST,
    port: settings.SMTP_PORT,
    secure: settings.SMTP_SECURE,
    auth: {
      user: settings.SMTP_USERNAME,
      pass: settings.SMTP_PASSWORD,
    },
    authMethod: settings.SMTP_AUTHTYPE,
    logger: false, // <--- turn off logging
    debug: false,
  });

  try {
    await transporter.verify();
  } catch (err) {
    console.error('Mailer connection failed:', err);
    return null;
  }

  const originalSendMail = transporter.sendMail.bind(transporter);

  transporter.sendMail = async (mailOptions, ...args) => {
    try {
      const dbData = await connection`
        SELECT * FROM pw_options WHERE option_name = '_pw_smtp' LIMIT 1
      `;
      const parsed = dbData.length > 0 ? JSON.parse(dbData[0].option_value) : {};

      if (!mailOptions.from || typeof mailOptions.from === 'string') {
        mailOptions.from = {
          name: '',
          address: mailOptions.from || '',
        };
      }

      if (parsed.force_from_email && parsed.from_email) {
        mailOptions.from.address = parsed.from_email;
      }
      if (parsed.force_from_name && parsed.from_name) {
        mailOptions.from.name = parsed.from_name;
      }

      return await originalSendMail(mailOptions, ...args);
    } catch (err) {
      console.error('Overridden sendMail error:', err);
      throw err;
    }
  };

  return transporter;
};

const getBrevoMailer = async (data, connection) => {
  const mailer = new BrevoMailer({
    apiKey: data.api_details.brevoAPIKey,
    defaultFrom: {
      name: 'noReply',
      email: 'noReply@phraseworks',
    },
    connection: connection,
  });

  return mailer;
};

const getMailgunMailer = async (data, connection) => {
  const mailer = new MailgunMailer({
    apiKey: data.api_details.mailgunAPIKey,
    domain: data.api_details.mailgunDomainName,
    region: data.api_details.mailgunRegion,
    defaultFrom: {
      name: 'noReply',
      email: 'noReply@phraseworks',
    },
    connection: connection,
  });
  return mailer;
};

export function init() {
  if (initialized) return;
  pluginActivatedCallback = async (pluginName, connection, env) => {
    if (pluginName == 'pwSMTP') {
      await setupTables(connection, env);
    }
  };

  getAdminMenusCallback = async (menu) => {
    const exists = menu.some((item) => item.id === 'pw-smtp');
    if (!exists) {
      if (pluginConfig.menuPosition === 'plugins') {
        menu
          .find((item) => item.id == 'plugins')
          .children.push({
            id: 'pw-smtp',
            name: 'PW SMTP',
            slug: '/admin/pw-smtp',
            icon: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"  class="w-4 h-4"><path d="M160 448c-25.6 0-51.2-22.4-64-32-64-44.8-83.2-60.8-96-70.4V480c0 17.67 14.33 32 32 32h256c17.67 0 32-14.33 32-32V345.6c-12.8 9.6-32 25.6-96 70.4-12.8 9.6-38.4 32-64 32zm128-192H32c-17.67 0-32 14.33-32 32v16c25.6 19.2 22.4 19.2 115.2 86.4 9.6 6.4 28.8 25.6 44.8 25.6s35.2-19.2 44.8-22.4c92.8-67.2 89.6-67.2 115.2-86.4V288c0-17.67-14.33-32-32-32zm256-96H224c-17.67 0-32 14.33-32 32v32h96c33.21 0 60.59 25.42 63.71 57.82l.29-.22V416h192c17.67 0 32-14.33 32-32V192c0-17.67-14.33-32-32-32zm-32 128h-64v-64h64v64zm-352-96c0-35.29 28.71-64 64-64h224V32c0-17.67-14.33-32-32-32H96C78.33 0 64 14.33 64 32v192h96v-32z"></path></svg>',
            order: 2,
            children: [],
          });
      } else {
        menu.push({
          id: 'pw-smtp',
          name: 'PW SMTP',
          slug: '/admin/pw-smtp',
          icon: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"  class="w-4 h-4"><path d="M160 448c-25.6 0-51.2-22.4-64-32-64-44.8-83.2-60.8-96-70.4V480c0 17.67 14.33 32 32 32h256c17.67 0 32-14.33 32-32V345.6c-12.8 9.6-32 25.6-96 70.4-12.8 9.6-38.4 32-64 32zm128-192H32c-17.67 0-32 14.33-32 32v16c25.6 19.2 22.4 19.2 115.2 86.4 9.6 6.4 28.8 25.6 44.8 25.6s35.2-19.2 44.8-22.4c92.8-67.2 89.6-67.2 115.2-86.4V288c0-17.67-14.33-32-32-32zm256-96H224c-17.67 0-32 14.33-32 32v32h96c33.21 0 60.59 25.42 63.71 57.82l.29-.22V416h192c17.67 0 32-14.33 32-32V192c0-17.67-14.33-32-32-32zm-32 128h-64v-64h64v64zm-352-96c0-35.29 28.71-64 64-64h224V32c0-17.67-14.33-32-32-32H96C78.33 0 64 14.33 64 32v192h96v-32z"></path></svg>',
          order: 2,
          children: [],
        });
      }
    }
    return menu;
  };

  getAdminPagesCallback = async (pages) => {
    const exists = pages.some((item) => item.key === 'pw-smtp-page');
    if (!exists) {
      pages.push({
        key: 'pw-smtp-page',
        path: '/pw-smtp',
        index: false,
        core: false,
        element: 'PWSMTPPage',
        elementLocation: 'pwSMTP/Pages',
        children: [],
      });
    }
    return pages;
  };

  getMailerCallback = async (connection, env) => {
    const dataDB = await getTableData(connection);
    const data = JSON.parse(dataDB);
    if (data.mailer == 'default') return;
    if (data.stop_sending) return;
    const mailer = await getMailer(data.mailer, data, connection);
    return mailer;
  };

  addAction('plugin_activated', 'pwSMTP', pluginActivatedCallback);

  addAction('get_admin_menus', 'pwSMTP', getAdminMenusCallback);

  addAction('get_admin_pages', 'pwSMTP', getAdminPagesCallback);

  addAction('get_mailer', 'pwSMTP', getMailerCallback);

  initialized = true;
}

export function disable() {
  removeAction('plugin_activated', 'pwSMTP', pluginActivatedCallback);

  removeAction('get_admin_menus', 'pwSMTP', getAdminMenusCallback);

  removeAction('get_admin_pages', 'pwSMTP', getAdminPagesCallback);

  removeAction('get_mailer', 'pwSMTP', getMailerCallback);

  initialized = false;
}

const pluginConfig = {
  version: '0.0.1',
  name: 'PW SMTP',
  slug: 'pwSMTP',
  description: 'A plugin for smtp email and api.',
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
