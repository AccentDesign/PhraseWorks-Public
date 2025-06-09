import { WorkerMailer } from 'worker-mailer';

export default class Email {
  constructor() {}
  static async getMailer(connection, env) {
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

    const mailer = await WorkerMailer.connect({
      credentials: {
        username: settings.SMTP_USERNAME,
        password: settings.SMTP_PASSWORD,
      },
      authType: settings.SMTP_AUTHTYPE,
      host: settings.SMTP_HOST,
      port: settings.SMTP_PORT,
      secure: settings.SMTP_SECURE,
      startTls: true,
      logLevel: 0,
    });
    return mailer;
  }
}
