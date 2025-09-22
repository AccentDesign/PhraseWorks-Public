import { pluginMeta } from '../../generated/pluginResolvers.js';
import { doAction } from '../../utils/actionBus.js';
import { runPluginInits } from '../../utils/initPlugins.js';
import path from 'path';
import { promises as fs } from 'fs';
import AdmZip from 'adm-zip';
import { exec } from 'child_process';
import { promisify } from 'util';
import { connectedClients } from '../../server/websocket.js';
import { sanitizeInput } from '../../utils/sanitizeInputs.js';
import System from '../../models/system.js';

export const APIGetPluginsFromMastersite = async () => {
  const query = `query {getPlugins { title zip description icon version author company } }`;
  const url = `https://phraseworks.support-524.workers.dev/graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

const execAsync = promisify(exec);

function notifyPluginChanges() {
  for (const [clientId, ws] of connectedClients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'PLUGIN_UPDATE', shortcodesChanged: true }));
      ws.send(JSON.stringify({ type: 'UPDATE_ADMIN_PAGES' }));
      ws.send(JSON.stringify({ type: 'UPDATE_ADMIN_SIDEBAR' }));
    }
  }
}

export default {
  Query: {
    getPlugins: async function (_, {}, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const { pluginMeta } = await import(
        '../../generated/pluginResolvers.js?update=' + Date.now()
      );
      try {
        const pluginsMeta =
          await connection`SELECT * FROM pw_options WHERE option_name = 'plugins'`;
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

        return JSON.stringify(withActiveFlag);
      } catch (err) {
        throw new Error('Failed to fetch plugins');
      }
    },
    getPluginPageComponents: async function (_, { pageKey }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const pluginsMeta = await connection`SELECT * FROM pw_options WHERE option_name = 'plugins'`;
      if (pluginsMeta.length === 0) return null;
      const pluginsData = JSON.parse(pluginsMeta[0].option_value);

      const components = pluginMeta.flatMap((plugin) => {
        const isActive = pluginsData?.find((item) => item.slug == plugin.slug)?.active === true;
        if (!isActive) return [];

        return (
          plugin.adminPageComponents?.[pageKey]?.map((c) => ({
            ...c,
            plugin: plugin.slug,
          })) || []
        );
      });
      return JSON.stringify(components);
    },
    getPluginsRepo: async function (_, __, { connection }) {
      const plugins = [];

      const data = await APIGetPluginsFromMastersite();

      if (
        data.status === 200 &&
        Array.isArray(data.data.getPlugins) &&
        data.data.getPlugins.length > 0
      ) {
        const pluginsData = data.data.getPlugins;

        for (const plugin of pluginsData) {
          const sanitizedData = JSON.stringify(plugin);
          const logoSvg = plugin.icon;
          const zipUrl = plugin.zip;

          plugins.push({
            data: sanitizedData,
            logo: logoSvg,
            file: zipUrl,
          });
        }
      }

      return { plugins };
    },
  },

  Mutation: {
    updatePlugins: async function (_, { plugins }, { connection, isAuth, c }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const pluginsData = JSON.parse(plugins);

      const pluginsMeta = await connection`SELECT * FROM pw_options WHERE option_name = 'plugins'`;
      if (pluginsMeta.length === 0) return null;
      const dbPlugins = JSON.parse(pluginsMeta[0].option_value);

      const pluginsDiff = dbPlugins
        .map((dbPlugin) => {
          const matching = pluginsData.find((p) => p.slug === dbPlugin.slug);

          if (!matching) {
            return {
              slug: dbPlugin.slug,
              status: 'missing_in_pluginsData',
              dbPlugin,
              pluginsDataPlugin: null,
              differences: null,
            };
          }

          const keysToCompare = [
            'version',
            'name',
            'pageUrls',
            'description',
            'author',
            'authorUrl',
            'active',
          ];

          const differences = keysToCompare.reduce((diffs, key) => {
            const dbValue = dbPlugin[key];
            const newValue = matching[key];

            let isDifferent = false;

            if (Array.isArray(dbValue) && Array.isArray(newValue)) {
              isDifferent = JSON.stringify(dbValue) !== JSON.stringify(newValue);
            } else {
              isDifferent = dbValue !== newValue;
            }

            if (isDifferent) {
              diffs.push({
                key,
                dbValue,
                pluginsDataValue: newValue,
              });
            }

            return diffs;
          }, []);

          if (differences.length > 0) {
            return {
              slug: dbPlugin.slug,
              status: 'different',
              dbPlugin,
              pluginsDataPlugin: matching,
              differences,
            };
          }

          return null; // No difference
        })
        .filter(Boolean);

      try {
        const result = await connection`
          UPDATE pw_options
          SET option_value = ${plugins}
          WHERE option_name = 'plugins'
          RETURNING *
        `;

        await runPluginInits(connection);

        for (const diff of pluginsDiff) {
          if (diff.status === 'different') {
            for (const change of diff.differences) {
              if (
                change.key === 'active' &&
                change.dbValue === false &&
                change.pluginsDataValue === true
              ) {
                await doAction('plugin_activated', diff.slug, connection, c.env);
              }
            }
          }
        }
        notifyPluginChanges();
        return { success: result.count > 0 };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update plugins' };
      }
    },
    installPlugin: async function (_, { pluginUrl }, { connection, isAuth, c }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const cleanPluginUrl = sanitizeInput(pluginUrl);

        const fullUrl = `${c.env.PLUGIN_BASE_URL}${cleanPluginUrl}`;

        // Fetch the ZIP from the static server
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`Failed to download plugin: ${response.status} ${response.statusText}`);
        }
        const zipBuffer = Buffer.from(await response.arrayBuffer());

        // Load ZIP from buffer
        const zip = new AdmZip(zipBuffer);

        const backendPluginsDir = path.join(process.cwd(), 'src', 'plugins');
        const frontendPluginsDir = path.join(process.cwd(), '..', 'frontend', 'src', 'Plugins');

        const zipEntries = zip.getEntries();

        // Determine root folder in ZIP
        const pluginRoot = zipEntries[0].entryName.split('/')[0] + '/';
        const backendPrefix = pluginRoot + 'backend/src/plugins/';
        const frontendPrefix = pluginRoot + 'frontend/src/Plugins/';

        // Identify distinct backend/frontend plugin folders
        const backendPluginFolderSet = new Set();
        const frontendPluginFolderSet = new Set();

        zipEntries.forEach((entry) => {
          if (entry.entryName.startsWith(backendPrefix)) {
            const relativePath = entry.entryName.slice(backendPrefix.length);
            const folderName = relativePath.split('/')[0];
            if (folderName && !folderName.startsWith('.')) backendPluginFolderSet.add(folderName);
          }
          if (entry.entryName.startsWith(frontendPrefix)) {
            const relativePath = entry.entryName.slice(frontendPrefix.length);
            const folderName = relativePath.split('/')[0];
            if (folderName && !folderName.startsWith('.')) frontendPluginFolderSet.add(folderName);
          }
        });

        if (backendPluginFolderSet.size !== 1) {
          throw new Error('Expected exactly one plugin folder in backend/src/plugins');
        }
        if (frontendPluginFolderSet.size !== 1) {
          throw new Error('Expected exactly one plugin folder in frontend/src/plugins');
        }

        const backendPluginFolder = Array.from(backendPluginFolderSet)[0];
        const frontendPluginFolder = Array.from(frontendPluginFolderSet)[0];

        async function extractToFolder(zip, prefix, targetBaseDir) {
          const entriesToExtract = zip.getEntries().filter((e) => e.entryName.startsWith(prefix));
          for (const entry of entriesToExtract) {
            const relativePath = entry.entryName.slice(prefix.length);
            if (!relativePath) continue;

            const destPath = path.join(targetBaseDir, relativePath);
            if (entry.isDirectory) {
              await fs.mkdir(destPath, { recursive: true });
            } else {
              await fs.mkdir(path.dirname(destPath), { recursive: true });
              await fs.writeFile(destPath, entry.getData());
            }
          }
        }

        await extractToFolder(
          zip,
          `${backendPrefix}${backendPluginFolder}/`,
          path.join(backendPluginsDir, backendPluginFolder),
        );
        await extractToFolder(
          zip,
          `${frontendPrefix}${frontendPluginFolder}/`,
          path.join(frontendPluginsDir, frontendPluginFolder),
        );
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
      }

      try {
        const { stdout, stderr } = await execAsync('npm run generate:plugins');
        if (stderr) console.error(stderr);
      } catch (error) {
        await System.writeLogData(error.stack || String(error), 'backend');
        console.error('Failed to generate plugins:', error);
        throw new Error('Plugin generation failed.');
      }

      return { success: true };
    },
  },
};
