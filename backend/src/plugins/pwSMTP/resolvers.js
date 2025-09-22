import Email from '../../models/email.js';

export default {
  Query: {
    getPWSMTPData: async (_, __, { connection }) => {
      const dbData = await getDBData(connection);
      return dbData;
    },
  },
  Mutation: {
    sendTestEmail: async (_, { toAddress }, { connection, isAuth, c }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const mailer = await Email.getMailer(connection, c.env);
      if (mailer == null) {
        return { success: false };
      }
      const dbData = await getDBData(connection);
      const data = JSON.parse(dbData);

      const fromAddress =
        (data.force_from_email && data.from_email) ||
        c.env.DEFAULT_FROM_EMAIL ||
        'noreply@localhost';
      const fromName = (data.force_from_name && data.from_name) || 'noReply';

      const status = await mailer.sendMail({
        from: { name: fromName, address: fromAddress },
        to: toAddress,
        subject: 'Hello from PhraseWorks',
        text: 'This is a plain text message from PhraseWorks, testing the smtp settings.',
        html: `
        <img src="${c.env.SITE_URL}/images/pw-full.svg" width="220" height="47" alt="${c.env.SITE_NAME}" />
        <h2>Hello</h2>
        <p>This is an HTML message from PhraseWorks</p>
        <p>Testing the smtp settings</p>
        `,
      });

      return { success: true };
    },
    updatePWSMTPData: async (_, { dBData }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const success = await updateDBData(connection, dBData);
      return { success: success };
    },
  },
};

const getDBData = async (connection) => {
  let dbData = await connection`SELECT * FROM pw_options WHERE option_name = '_pw_smtp' LIMIT 1`;
  if (dbData.length > 0) {
    return dbData[0].option_value;
  }
  return [];
};

const updateDBData = async (connection, dBData) => {
  const result = await connection`
      UPDATE pw_options
      SET option_value = ${dBData}
      WHERE option_name = '_pw_smtp'
    `;
  if (result.count === 0) {
    return false;
  }

  return true;
};
