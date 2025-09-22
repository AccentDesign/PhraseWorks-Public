// MailgunMailer.js
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import System from '../../models/system.js';

export class MailgunMailer {
  constructor({ apiKey, domain, region = 'us', defaultFrom, connection }) {
    if (!apiKey || !domain) {
      throw new Error('MailgunMailer requires an apiKey and domain');
    }

    const mailgun = new Mailgun(formData);
    this.client = mailgun.client({
      username: 'api',
      key: apiKey,
      url: region === 'eu' ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net',
    });

    this.domain = domain;
    this.defaultFrom = defaultFrom || { name: '', email: '' };
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
   * Send an email using Mailgun API
   * @param {Object} options
   * @param {Object} options.from - { name, email }
   * @param {Array} options.to - [{ name, email }] or array of strings
   * @param {String} options.subject
   * @param {String} options.html
   * @param {String} options.text
   * @returns {Promise<Object>} Mailgun API response
   */
  async sendMail({ from, to, subject, html, text }) {
    let senderName = from?.name || this.defaultFrom.name || '';
    let senderEmail = from?.address || from?.email || this.defaultFrom.email;

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

    const formattedFrom = senderName ? `${senderName} <${senderEmail}>` : senderEmail;

    const recipients = Array.isArray(to)
      ? to.map((r) => (typeof r === 'string' ? r : r.name ? `${r.name} <${r.email}>` : r.email))
      : [to];

    const data = {
      from: formattedFrom,
      to: recipients,
      subject,
      text,
      html,
    };

    try {
      const response = await this.client.messages.create(this.domain, data);
      return response;
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      throw err;
    }
  }

  getState() {
    return {
      domain: this.domain,
      defaultFrom: this.defaultFrom,
      canSend: typeof this.client?.messages?.create === 'function',
    };
  }
}
