import nodemailer from 'nodemailer';
import { doAction } from '../utils/actionBus.js';
import System from './system.js';

export default class Email {
  constructor() {}
  static async getMailer(connection, env) {
    const override = await doAction('get_mailer', connection, env);
    if (override && (!Array.isArray(override) || override.length > 0)) {
      return override;
    }

    // Fetch DB settings
    const emailSettings = await connection`
      SELECT option_value FROM pw_options WHERE option_name = 'email_settings'
    `;

    let settings = {};
    if (emailSettings && emailSettings.length > 0) {
      try {
        settings = JSON.parse(emailSettings[0].option_value);
      } catch (err) {
        console.error('Invalid email_settings JSON in DB:', err);
      }
    }

    // ✅ Override DB values with ENV if defined
    settings = {
      SMTP_USERNAME: env?.SMTP_USERNAME !== undefined ? env.SMTP_USERNAME : settings.SMTP_USERNAME,
      SMTP_PASSWORD: env?.SMTP_PASSWORD !== undefined ? env.SMTP_PASSWORD : settings.SMTP_PASSWORD,
      SMTP_AUTHTYPE: env?.SMTP_AUTHTYPE !== undefined ? env.SMTP_AUTHTYPE : settings.SMTP_AUTHTYPE,
      SMTP_HOST: env?.SMTP_HOST !== undefined ? env.SMTP_HOST : settings.SMTP_HOST,
      SMTP_PORT: env?.SMTP_PORT !== undefined ? Number(env.SMTP_PORT) : Number(settings.SMTP_PORT),
      SMTP_SECURE:
        env?.SMTP_SECURE !== undefined ? env.SMTP_SECURE === 'true' : !!settings.SMTP_SECURE,
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
      logger: false,
      debug: false,
    });

    try {
      await transporter.verify();
      return transporter;
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      console.error('Mailer connection failed:', err);
      return null;
    }
  }
}
