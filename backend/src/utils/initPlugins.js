import { pluginMeta } from '../generated/pluginResolvers.js';

export const runPluginInits = async (sql) => {
  const tableCheck = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name = 'pw_options'
    ) AS table_exists;
  `;

  if (tableCheck[0].table_exists) {
    const pluginsMeta = await sql`SELECT * FROM pw_options WHERE option_name = 'plugins'`;
    if (pluginsMeta.length === 0) return null;
    const plugins = JSON.parse(pluginsMeta[0].option_value);

    for (let i = 0; i < pluginMeta.length; i++) {
      const meta = pluginMeta[i];

      const storedPlugin = plugins.find((p) => p.slug === meta.slug);
      if (!storedPlugin || !storedPlugin.active) {
        meta?.disable();
        continue;
      } else {
        if (meta?.init && typeof meta.init === 'function') {
          try {
            meta.init();
          } catch (err) {
            console.warn(`[Plugin Init Error] ${meta.name || 'Unknown'}:`, err);
          }
        }
      }
    }
  } else {
    console.warn('Table "pw_options" does not exist, skipping plugin initialization.');
  }
};
