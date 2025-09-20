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

    const emailSettings = await connection`
      SELECT option_value FROM pw_options WHERE option_name = 'email_settings'
    `;

    let settings;
    if (!emailSettings || emailSettings.length === 0) {
      settings = {
        SMTP_USERNAME: env?.SMTP_USERNAME,
        SMTP_PASSWORD: env?.SMTP_PASSWORD,
        SMTP_AUTHTYPE: env?.SMTP_AUTHTYPE,
        SMTP_HOST: env?.SMTP_HOST,
        SMTP_PORT: Number(env?.SMTP_PORT),
        SMTP_SECURE: env?.SMTP_SECURE === 'true',
      };
    } else {
      settings = JSON.parse(emailSettings[0].option_value);
      settings.SMTP_PORT = Number(settings.SMTP_PORT);
      settings.SMTP_SECURE = settings.SMTP_SECURE === true;
    }
    if (!emailSettings || emailSettings.length === 0) {
      return null;
    }

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
