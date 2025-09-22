import System from '../../models/system.js';
import { adminPages } from '../../generated/adminPages.js';
import { doAction } from '../../utils/actionBus.js';
import WordpressHash from 'wordpress-hash-node';
import { pluginMeta } from '../../generated/pluginResolvers.js';
import Email from '../../models/email.js';
import { exec } from 'child_process';
import cron from 'node-cron';
import { scheduledJobs, taskHandlers } from '../../utils/cron.js';
import { connectedClients } from '../../server/websocket.js';
import { sanitizeInput } from '../../utils/sanitizeInputs.js';
import { clearAllCache } from '../../utils/cache.js';
import { handleResolverError, handleError } from '../../utils/errorHandler.js';

const mapPostDates = (p) => ({
  ...p,
  id: p.id,
  post_date: p.post_date ? p.post_date.toISOString() : null,
  post_date_gmt: p.post_date_gmt ? p.post_date_gmt.toISOString() : null,
  post_modified: p.post_modified ? p.post_modified.toISOString() : null,
  post_modified_gmt: p.post_modified_gmt ? p.post_modified_gmt.toISOString() : null,
});

function notifyThemeChanged() {
  for (const [clientId, ws] of connectedClients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'UPDATE_THEME', themeChanged: true }));
    }
  }
}

function notifySiteTitleChanged() {
  for (const [clientId, ws] of connectedClients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'UPDATE_SITE_TITLE', titleChanged: true }));
    }
  }
}

export default {
  Query: {
    systemCheck: async function (_, __, { connection }) {
      return await System.systemCheck(connection);
    },

    getSiteTitle: async function (_, __, { connection }) {
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
    getGeneralSettings: async function (_, __, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const data = await connection`
        SELECT * FROM pw_options
        WHERE option_name IN ('site_title', 'site_tagline', 'admin_email', 'site_address')
      `;
      if (data.length == 0) return null;
      const options = {};
      data.forEach((row) => {
        options[row.option_name] = row.option_value;
      });
      return options;
    },
    getWritingSettings: async function (_, __, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const data =
        await connection`SELECT * FROM pw_options WHERE option_name='default_post_category'`;
      if (data.length == 0) return null;
      return { default_post_category: data[0].option_value };
    },
    getReadingSettings: async function (_, __, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const data = await connection`
        SELECT * FROM pw_options
        WHERE option_name IN ('show_at_most', 'search_engine_visibility')
      `;
      if (data.length == 0) return null;
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
    getDashboardAtAGlanceData: async function (_, __, { connection, isAuth, c }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const posts = await connection`SELECT * FROM pw_posts WHERE post_type = 'post'`;
      const pages = await connection`SELECT * FROM pw_posts WHERE post_type = 'page'`;
      const comments = await connection`SELECT * FROM pw_comments`;

      return {
        version: c.env.PHRASE_WORKS_VERSION,
        posts: posts.length,
        pages: pages.length,
        comments: comments.length,
      };
    },
    getDashboardActivityData: async function (_, __, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const posts = await connection`
        SELECT *
        FROM pw_posts
        WHERE post_status = 'scheduled'
          AND post_date > NOW()
      `;
      return {
        posts: posts.map(mapPostDates),
        total: posts.length,
      };
    },
    getThemes: async function (_, __, { connection, isAuth }) {
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
    getTheme: async function (_, __, { connection }) {
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
    getEmailSettings: async function (_, __, { connection, isAuth }) {
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
    getAdminPages: async function (_, __, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const tmpAdminPages = JSON.parse(JSON.stringify(adminPages));
      let pages = await doAction('get_admin_pages', tmpAdminPages);
      if (pages) {
        return JSON.stringify(pages);
      }

      return JSON.stringify(adminPages);
    },
    getSiteSEOSettings: async function (_, __, { connection }) {
      const settings =
        await connection`SELECT * FROM pw_options WHERE option_name = '_site_seo_settings'`;
      if (settings.length == 0) return null;
      return settings[0].option_value;
    },
    getShortcodes: async function (_, __, { connection, c }) {
      const pluginsMeta = await connection`SELECT * FROM pw_options WHERE option_name = 'plugins'`;
      if (pluginsMeta.length === 0) return null;

      const dbPlugins = JSON.parse(pluginsMeta[0].option_value || '[]');

      const dbPluginMap = {};
      for (const p of dbPlugins) {
        dbPluginMap[p.slug] = p;
      }

      const withActiveFlag = pluginMeta.map((plugin) => ({
        ...plugin,
        active: dbPluginMap[plugin.slug]?.active ?? false,
      }));
      const allShortcodes = [];

      for (const plugin of withActiveFlag) {
        if (plugin.active && Array.isArray(plugin.shortcodes)) {
          for (const shortcode of plugin.shortcodes) {
            allShortcodes.push({
              plugin: plugin.slug,
              ...shortcode,
            });
          }
        }
      }
      return JSON.stringify(allShortcodes);
    },
    getCronTasks: async function (_, __, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const tasksDb = await connection`SELECT * FROM pw_options WHERE option_name = '_cron_tasks'`;
      if (tasksDb.length > 0) {
        return tasksDb[0].option_value;
      }
      return;
    },
  },

  Mutation: {
    systemCreate: async function (_, { input }, { connection, c }) {
      const cleanEmail = sanitizeInput(input.email);
      const cleanFirstName = sanitizeInput(input.first_name);
      const cleanLastName = sanitizeInput(input.last_name);
      const cleanDisplayName = sanitizeInput(input.display_name);

      return await System.createDatabase(
        connection,
        cleanEmail,
        cleanFirstName,
        cleanLastName,
        cleanDisplayName,
        WordpressHash.HashPassword(input.password),
        c.env,
      );
    },
    updateGeneralSettings: async function (_, args, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      let success = true;
      if (args.site_title != '' && args.site_title != null) {
        const cleanSiteTitle = sanitizeInput(args.site_title);
        const result =
          await connection`UPDATE pw_options SET option_value=${cleanSiteTitle} WHERE option_name='site_title'`;
        if (result.count == 0) success = false;
        if (success == true) {
          notifySiteTitleChanged();
        }
      }
      if (args.site_tagline != '' && args.site_tagline != null) {
        const cleanSiteTagline = sanitizeInput(args.site_tagline);
        const result =
          await connection`UPDATE pw_options SET option_value=${cleanSiteTagline} WHERE option_name='site_tagline'`;
        if (result.count == 0) success = false;
      }
      if (args.site_address != '' && args.site_address != null) {
        const cleanSiteAddress = sanitizeInput(args.site_address);
        const result =
          await connection`UPDATE pw_options SET option_value=${cleanSiteAddress} WHERE option_name='site_address'`;
        if (result.count == 0) success = false;
      }
      if (args.admin_email != '' && args.admin_email != null) {
        const cleanAdminEmail = sanitizeInput(args.admin_email);
        const result =
          await connection`UPDATE pw_options SET option_value=${cleanAdminEmail} WHERE option_name='admin_email'`;
        if (result.count == 0) success = false;
      }
      return { success: success };
    },
    updateWritingSettings: async function (_, { default_posts_category }, { connection, isAuth }) {
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
    updateReadingSettings: async function (
      _,
      { show_at_most, search_engine_visibility },
      { connection, isAuth },
    ) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof show_at_most !== 'number') {
        const error = new Error('Invalid or missing tag ID');
        error.code = 400;
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
        WHERE option_name = 'search_engine_visibility'
      `;
      if (result2.count === 0) {
        success = false;
      }

      return { success };
    },
    addTheme: async function (_, { name, location }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanName = sanitizeInput(name);
      const cleanLocation = sanitizeInput(location);

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

        const exists = themes.some(
          (theme) => theme.location === cleanLocation || theme.name === cleanName,
        );
        if (exists) {
          throw new Error('Theme with the same name or location already exists.');
        }

        const newId = themes.length > 0 ? Math.max(...themes.map((t) => t.id)) + 1 : 1;
        themes.push({ id: newId, cleanName, cleanLocation });

        await connection`
        UPDATE pw_options
        SET option_value = ${JSON.stringify(themes)}
        WHERE option_name = 'themes'
      `;

        return { success: true };
      } catch (err) {
        await handleResolverError(err, 'system', 'addTheme', { id });
        return { success: false, error: err.message };
      }
    },
    deleteTheme: async function (_, { id }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof id !== 'number') {
        const error = new Error('Invalid or missing ID');
        error.code = 400;
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
    setActiveTheme: async function (_, { id }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof id !== 'number') {
        const error = new Error('Invalid or missing ID');
        error.code = 400;
        throw error;
      }

      try {
        await connection`
          UPDATE pw_options 
          SET option_value = ${id} 
          WHERE option_name = 'site_theme'
        `;
        notifyThemeChanged();
        return { success: true };
      } catch (err) {
        console.error('Error setting active theme:', err);
        return { success: false, error: err.message };
      }
    },
    updateTheme: async function (_, { id, name, location }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof id !== 'number') {
        const error = new Error('Invalid or missing ID');
        error.code = 400;
        throw error;
      }

      const cleanName = sanitizeInput(name);
      const cleanLocation = sanitizeInput(location);

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

        themes[themeIndex].name = cleanName;
        themes[themeIndex].location = cleanLocation;

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
    updateEmailSettings: async function (_, { data }, { connection, isAuth }) {
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
    sendTestEmail: async function (_, { toAddress }, { connection, isAuth, env }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const mailer = await Email.getMailer(connection, env);
      if (mailer == null) {
        return { success: false };
      }
      const status = await mailer.sendMail({
        from: {
          name: env.DEFAULT_FROM_NAME || 'PhraseWorks',
          email: env.DEFAULT_FROM_EMAIL || 'noreply@localhost',
        },
        to: toAddress,
        subject: 'Hello from PhraseWorks',
        text: 'This is a plain text message from PhraseWorks, testing the smtp settings.',
        html: `
        <h1>Hello</h1>
        <img src="${env.R2_PUBLIC_URL}pw.svg" alt="${env.SITE_NAME}" />
        <p>This is an HTML message from PhraseWorks</p>
        <p>Testing the smtp settings</p>
        `,
      });
      return { success: true };
    },
    updateSiteSEOSettings: async function (_, { seoSettings }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      try {
        const result = await connection`
          INSERT INTO pw_options (option_name, option_value)
          VALUES ('_site_seo_settings', ${seoSettings})
          ON CONFLICT (option_name)
          DO UPDATE SET option_value = EXCLUDED.option_value
        `;

        return { success: result.count === 1 };
      } catch (err) {
        return { success: false, error: 'Failed to update seo settings' };
      }
    },
    regeneratePlugins: async function (_, { regenerate }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      exec('npm run generate:plugins', (error, stdout, stderr) => {
        if (error) {
          // Error logged by exec callback
        }
      });

      return { success: true };
    },
    runCronTaskInstantly: async function (_, { id }, { connection, isAuth }) {
      if (typeof id !== 'number') {
        const error = new Error('Invalid or missing ID');
        error.code = 400;
        throw error;
      }

      const tasksDb = await connection`SELECT * FROM pw_options WHERE option_name = '_cron_tasks'`;
      let tasks = JSON.parse(tasksDb[0].option_value);

      const task = tasks.find((t) => t.id === id);
      if (!task) {
        return { success: false };
      }

      const taskFunction = taskHandlers[task.function_name];
      if (!taskFunction) {
        return { success: false };
      }

      try {
        const existingJob = scheduledJobs.get(task.id);
        if (existingJob) {
          existingJob.destroy();
          scheduledJobs.delete(task.id);
        }

        await taskFunction();

        task.last_run_at = new Date().toISOString();
        if (task.run_once) {
          task.enabled = false;
        }

        await connection`
          UPDATE pw_options
          SET option_value = ${JSON.stringify(tasks)}
          WHERE option_name = '_cron_tasks'
        `;

        if (task.enabled && cron.validate(task.cron_expression)) {
          const newJob = cron.schedule(task.cron_expression, async () => {
            try {
              await taskFunction();
              task.last_run_at = new Date().toISOString();
              if (task.run_once) task.enabled = false;

              await connection`
              UPDATE pw_options
              SET option_value = ${JSON.stringify(tasks)}
              WHERE option_name = '_cron_tasks'
            `;
            } catch (e) {
              await handleError(e, `Cron.${task.name}`, {
                additionalData: { taskId: task.id, cronExpression: task.cron_expression },
              });
            }
          });
          scheduledJobs.set(task.id, newJob);
        }

        return { success: true };
      } catch (error) {
        await handleResolverError(error, 'system', 'runCronTaskInstantly');
        return { success: false };
      }
    },
    logError: async function (_, { error, logType }, {}) {
      await System.writeLogData(error, logType);
      return { success: true };
    },
    clearCache: async (_, { postId }, { isAuth }) => {
      if (!isAuth) {
        const error = new Error('Unauthorized');
        error.code = 401;
        throw error;
      }

      try {
        if (postId) {
          // Optionally clear only post-related cache
          await clearAllCache(`post:${postId}`);
          await clearAllCache(`comment:*`);
          await clearAllCache(`graphql:*getPWQuery*`);
        } else {
          await clearAllCache(); // clear everything
        }

        return { success: true, post_id: postId ?? null, error: null };
      } catch (err) {
        console.error(err);
        return { success: false, post_id: postId ?? null, error: 'Failed to clear cache' };
      }
    },
  },
};
