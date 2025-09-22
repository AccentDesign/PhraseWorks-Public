// BrevoMailer.js
import SibApiV3Sdk from 'sib-api-v3-sdk';
import System from '../../models/system.js';

export class BrevoMailer {
  constructor({ apiKey, defaultFrom, connection }) {
    this.apiKey = apiKey;
    this.defaultFrom = defaultFrom || { name: '', email: '' };
    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications['api-key'].apiKey = apiKey;

    this.emailApi = new SibApiV3Sdk.TransactionalEmailsApi();
    this.connection = connection;
  }

  async getDBData(connection) {
    let dbData = await connection`SELECT * FROM pw_options WHERE option_name = '_pw_smtp' LIMIT 1`;
    if (dbData.length > 0) {
      return dbData[0].option_value;
    }
    return [];
  }

  /**
   * Send an email using Brevo API
   * @param {Object} options
   * @param {Object} options.from - { name, email }
   * @param {Array} options.to - [{ name, email }]
   * @param {String} options.subject
   * @param {String} options.html
   * @param {String} options.text
   * @returns {Promise<Object>} Brevo API response
   */
  async sendMail({ from, to, subject, html, text }) {
    const senderName = from?.name || this.defaultFrom.name || '';
    const senderEmail = from?.address || from?.email || this.defaultFrom.email;

    const dbData = await this.getDBData(this.connection);
    const dataParsed = JSON.parse(dbData);

    if (dataParsed.force_from_email && dataParsed.from_email) {
      senderEmail = dataParsed.from_email;
    }
    if (dataParsed.force_from_name && dataParsed.from_name) {
      senderName = dataParsed.from_name;
    }

    if (!senderEmail) {
      throw new Error('Sender email is required');
    }

    // Normalize recipients
    const recipients = Array.isArray(to)
      ? to.map((r) => {
          if (typeof r === 'string') {
            return { email: r }; // no name key if not provided
          } else {
            return r.name ? { email: r.email, name: r.name } : { email: r.email };
          }
        })
      : [{ email: to }];

    const emailData = {
      sender: { name: senderName, email: senderEmail },
      to: recipients,
      subject,
      htmlContent: html,
      textContent: text,
    };

    try {
      const result = await this.emailApi.sendTransacEmail(emailData);
      return result;
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      console.error('BrevoMailer send error:', error.response?.body || error);
      throw err;
    }
  }

  getState() {
    return {
      apiKeySet: !!this.apiKey,
      defaultFrom: this.defaultFrom,
      canSend: typeof this.emailApi?.sendTransacEmail === 'function',
    };
  }
}
