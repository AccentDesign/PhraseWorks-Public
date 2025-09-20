import sql from '../middleware/db.js';
export const actions = {};

export function addAction(hook, parent, callback, options = {}) {
  if (!actions[hook]) {
    actions[hook] = [];
  }
  actions[hook].push({ parent: parent, callback: callback, public: options?.public || false });
}

export function removeAction(hook, parent, callback) {
  if (!actions[hook]) return;

  actions[hook] = actions[hook].filter(
    (params) => params.callback !== callback && params.parent !== parent,
  );

  if (actions[hook].length === 0) {
    delete actions[hook];
  }
}

export async function doAction(hook, ...args) {
  const [pluginsMetaDB] = await sql`SELECT * FROM pw_options WHERE option_name = 'plugins'`;
  const pluginsMeta = JSON.parse(pluginsMetaDB.option_value);
  if (!actions[hook]) return;

  let result = [];
  for (const fn of actions[hook]) {
    const plugin = pluginsMeta.find((p) => p.slug === fn.parent);

    if (!plugin || !plugin.active) continue;

    const maybeResult = await fn.callback(...args);
    if (maybeResult !== undefined) {
      if (Array.isArray(maybeResult)) {
        maybeResult.forEach((item) => {
          const alreadyExists = result.some((existing) => existing === item);
          if (!alreadyExists) {
            result.push(item);
          }
        });
      } else {
        result = maybeResult;
      }
    }
  }
  return result;
}
