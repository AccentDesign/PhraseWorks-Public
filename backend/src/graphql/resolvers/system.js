import Email from '../../models/email';
import System from '../../models/system';
import WordpressHash from 'wordpress-hash-node';

export default {
  systemCheck: async function (_, { connection }) {
    return await System.systemCheck(connection);
  },
  systemCreate: async function ({ input }, { connection }) {
    return await System.createDatabase(
      connection,
      input.email,
      input.first_name,
      input.last_name,
      input.display_name,
      WordpressHash.HashPassword(input.password),
    );
  },
  getSiteTitle: async function ({}, { connection }) {
    try {
      const data = await connection`SELECT * FROM pw_options WHERE option_name = 'site_title'`;

      if (data.length > 0) {
        return data[0].option_value;
      }

      return null;
    } catch (error) {
      throw new Error('Failed to retrieve site title.');
    }
  },
  getGeneralSettings: async function ({}, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const data = await connection`
      SELECT * FROM pw_options 
      WHERE option_name IN ('site_title', 'site_tagline', 'admin_email', 'site_address')
    `;
    if (data.length == 0) {
      return null;
    }
    const options = {};
    data.forEach((row) => {
      options[row.option_name] = row.option_value;
    });
    return options;
  },
  updateGeneralSettings: async function (
    { site_title, site_tagline, site_address, admin_email },
    { connection, isAuth },
  ) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    let success = true;
    if (site_title != '' && site_title != null) {
      const result =
        await connection`UPDATE pw_options SET option_value=${site_title} WHERE option_name='site_title'`;
      if (result.count == 0) {
        success = false;
      }
    }
    if (site_tagline != '' && site_tagline != null) {
      const result =
        await connection`UPDATE pw_options SET option_value=${site_tagline} WHERE option_name='site_tagline'`;
      if (result.count == 0) {
        success = false;
      }
    }
    if (site_address != '' && site_address != null) {
      const result =
        await connection`UPDATE pw_options SET option_value=${site_address} WHERE option_name='site_address'`;
      if (result.count == 0) {
        success = false;
      }
    }
    if (admin_email != '' && admin_email != null) {
      const result =
        await connection`UPDATE pw_options SET option_value=${admin_email} WHERE option_name='admin_email'`;
      if (result.count == 0) {
        success = false;
      }
    }
    return { success: success };
  },
  getWritingSettings: async function ({}, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const data =
      await connection`SELECT * FROM pw_options WHERE option_name='default_post_category'`;
    if (data.length == 0) {
      return null;
    }
    return { default_post_category: data[0].option_value };
  },
  updateWritingSettings: async function ({ default_posts_category }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const value =
      default_posts_category != '' && default_posts_category != null
        ? default_posts_category
        : null;
    const result = await connection`
      UPDATE pw_options 
      SET option_value = ${value} 
      WHERE option_name = 'default_post_category'
    `;
    return { success: result.count > 0 };
  },
  getReadingSettings: async function ({}, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const data = await connection`
      SELECT * FROM pw_options 
      WHERE option_name IN ('show_at_most', 'search_engine_visibility')
    `;
    if (data.length == 0) {
      return null;
    }
    const settings = {};
    data.forEach(({ option_name, option_value }) => {
      settings[option_name] =
        option_value === 'true'
          ? true
          : option_value === 'false'
            ? false
            : isNaN(option_value)
              ? option_value
              : Number(option_value);
    });
    return {
      show_at_most: settings.show_at_most,
      search_engine_visibility: settings.search_engine_visibility,
    };
  },
  updateReadingSettings: async function (
    { show_at_most, search_engine_visibility },
    { connection, isAuth },
  ) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }

    let success = true;

    const result1 = await connection`
      UPDATE pw_options 
      SET option_value = ${show_at_most} 
      WHERE option_name = 'show_at_most'
    `;
    if (result1.count === 0) {
      success = false;
    }
    const result2 = await connection`
      UPDATE pw_options 
      SET option_value = ${search_engine_visibility ? 'true' : 'false'} 
      WHERE option_name = 'search_engine_visibility' -- typo if that's still your key
    `;
    if (result2.count === 0) {
      success = false;
    }

    return { success };
  },
  getDashboardAtAGlanceData: async function ({}, { connection, isAuth, env }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const posts = await connection`SELECT * FROM pw_posts WHERE post_type = 'post'`;
    const pages = await connection`SELECT * FROM pw_posts WHERE post_type = 'page'`;
    return { version: env.PHRASE_WORKS_VERSION, posts: posts.length, pages: pages.length };
  },
  getThemes: async function ({}, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const themesMeta = await connection`SELECT * FROM pw_options WHERE option_name = 'themes'`;
    if (themesMeta.length == 0) return null;

    const themes = JSON.parse(themesMeta[0].option_value);
    return { themes: themes };
  },
  getTheme: async function ({}, { connection }) {
    const themeId = await connection`SELECT * FROM pw_options WHERE option_name = 'site_theme'`;
    if (themeId.length == 0) return null;

    const themesMeta = await connection`SELECT * FROM pw_options WHERE option_name = 'themes'`;
    if (themesMeta.length == 0) return null;

    const themes = JSON.parse(themesMeta[0].option_value);
    const activeTheme = themes.filter((theme) => theme.id == themeId[0].option_value);
    if (activeTheme.length > 0) {
      return activeTheme[0];
    }
    return { id: 1, name: 'Theme2025', location: 'Components/Theme2025' };
  },
  addTheme: async function ({ name, location }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }

    try {
      const result = await connection`SELECT * FROM pw_options WHERE option_name = 'themes'`;

      let themes = [];
      if (result.length > 0) {
        try {
          themes = JSON.parse(result[0].option_value);
        } catch (e) {
          throw new Error('Invalid JSON in themes option');
        }
      }

      const exists = themes.some((theme) => theme.location === location || theme.name === name);
      if (exists) {
        throw new Error('Theme with the same name or location already exists.');
      }

      const newId = themes.length > 0 ? Math.max(...themes.map((t) => t.id)) + 1 : 1;
      themes.push({ id: newId, name, location });

      await connection`
        UPDATE pw_options
        SET option_value = ${JSON.stringify(themes)}
        WHERE option_name = 'themes'
      `;

      return { success: true };
    } catch (err) {
      console.error('Error adding theme:', err);
      return { success: false, error: err.message };
    }
  },
  deleteTheme: async function ({ id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }

    try {
      const result = await connection`SELECT * FROM pw_options WHERE option_name = 'themes'`;

      let themes = [];
      if (result.length > 0) {
        try {
          themes = JSON.parse(result[0].option_value);
        } catch (e) {
          throw new Error('Invalid JSON in themes option');
        }
      }
      const updatedThemes = themes.filter((theme) => theme.id !== id);

      await connection`
        UPDATE pw_options
        SET option_value = ${JSON.stringify(updatedThemes)}
        WHERE option_name = 'themes'
      `;

      const themeIdResult =
        await connection`SELECT * FROM pw_options WHERE option_name = 'site_theme'`;
      const currentThemeId = themeIdResult?.[0]?.option_value;

      if (parseInt(currentThemeId) === themeIdToDelete && updatedThemes.length > 0) {
        await connection`
          UPDATE pw_options 
          SET option_value = ${updatedThemes[0].id} 
          WHERE option_name = 'site_theme'
        `;
      }

      return { success: true };
    } catch (err) {
      console.error('Error deleting theme:', err);
      return { success: false, error: err.message };
    }
  },
  setActiveTheme: async function ({ id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    try {
      await connection`
          UPDATE pw_options 
          SET option_value = ${id} 
          WHERE option_name = 'site_theme'
        `;
      return { success: true };
    } catch (err) {
      console.error('Error setting active theme:', err);
      return { success: false, error: err.message };
    }
  },
  updateTheme: async function ({ id, name, location }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    try {
      const result = await connection`SELECT * FROM pw_options WHERE option_name = 'themes'`;

      let themes = [];
      if (result.length > 0) {
        try {
          themes = JSON.parse(result[0].option_value);
        } catch (e) {
          throw new Error('Invalid JSON in themes option');
        }
      }

      const themeIndex = themes.findIndex((theme) => theme.id === id);
      if (themeIndex === -1) {
        throw new Error(`Theme with ID ${id} not found.`);
      }

      themes[themeIndex].name = name;
      themes[themeIndex].location = location;

      await connection`
        UPDATE pw_options 
        SET option_value = ${JSON.stringify(themes)} 
        WHERE option_name = 'themes'
      `;

      return { success: true };
    } catch (err) {
      console.error('Error updating theme:', err);
      return { success: false, error: err.message };
    }
  },
  getEmailSettings: async function ({}, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const settings =
      await connection`SELECT * FROM pw_options WHERE option_name = 'email_settings'`;
    if (settings.length == 0) return null;

    return { data: settings[0].option_value };
  },
  updateEmailSettings: async function ({ data }, { connection, isAuth, env }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const menusMeta = await connection`
        UPDATE pw_options
        SET option_value = ${data}
        WHERE option_name = 'email_settings'
    `;
    return { success: menusMeta.count > 0 };
  },
  sendTestEmail: async function ({ toAddress }, { connection, isAuth, env }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const mailer = await Email.getMailer(connection, env);
    if (mailer == null) {
      return { success: false };
    }
    const status = await mailer.send({
      from: { name: 'noReply', email: 'noReply@agencyexpress.net' },
      to: { email: toAddress },
      subject: 'Hello from PhraseWorks',
      text: 'This is a plain text message from PhraseWorks, testing the smtp settings.',
      html: `
      <h1>Hello</h1>
      <img src="https://pub-1e2f36fe29994319a65d0ca6beca0f46.r2.dev/pw.svg" alt="hello" />
      <p>This is an HTML message from PhraseWorks</p>
      <p>Testing the smtp settings</p>
      `,
    });
    return { success: true };
  },
};
