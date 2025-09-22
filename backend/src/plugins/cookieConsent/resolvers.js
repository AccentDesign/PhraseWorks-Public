export default {
  Query: {
    getCookieConsentSettings: async (_, __, { connection }) => {
      const result = await connection`
        SELECT option_value FROM pw_options WHERE option_name = '_cookie_consent' LIMIT 1
      `;

      const settings = result.length > 0 ? result[0].option_value : null;
      return settings || '';
    },
  },

  Mutation: {
    updateCookieConsentSettings: async (_, { data }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const result = await connection`
        SELECT option_value FROM pw_options WHERE option_name = '_cookie_consent' LIMIT 1
      `;

      if (result.length > 0) {
        await connection`
          UPDATE pw_options
          SET option_value = ${data}
          WHERE option_name = '_cookie_consent'
        `;
      } else {
        await connection`
          INSERT INTO pw_options (option_name, option_value)
          VALUES ('_cookie_consent', ${data})
        `;
      }

      return { success: true };
    },
  },
};
