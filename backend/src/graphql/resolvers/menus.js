import { adminMenus } from '../../generated/adminMenuData.js';
import { doAction } from '../../utils/actionBus.js';

import { connectedClients } from '../../server/websocket.js';
import System from '../../models/system.js';

function notifyMenuChanges() {
  for (const [clientId, ws] of connectedClients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'UPDATE_MENU' }));
    }
  }
}

export default {
  Query: {
    getMenus: async function (_, {}, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      try {
        const menusMeta = await connection`SELECT * FROM pw_options WHERE option_name = 'menus'`;
        if (menusMeta.length === 0) return null;

        return menusMeta[0].option_value;
      } catch (err) {
        throw new Error('Failed to fetch menus');
      }
    },

    getMenuByName: async function (_, { name }, { connection }) {
      try {
        const menusMeta = await connection`SELECT * FROM pw_options WHERE option_name = 'menus'`;
        if (menusMeta.length === 0) return null;

        const menus = JSON.parse(menusMeta[0].option_value);
        return menus.find((menu) => menu.name === name) || null;
      } catch (err) {
        throw new Error('Failed to fetch menu by name');
      }
    },
    getAdminMenus: async function (_, {}, { connection, isAuth }) {
      const tmpAdminMenus = JSON.parse(JSON.stringify(adminMenus));
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      let menus = await doAction('get_admin_menus', tmpAdminMenus);
      if (menus) {
        return JSON.stringify(menus);
      }
      return JSON.stringify(adminMenus);
    },
  },

  Mutation: {
    updateMenus: async function (_, { menus }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      try {
        const result = await connection`
          UPDATE pw_options
          SET option_value = ${menus}
          WHERE option_name = 'menus'
        `;
        notifyMenuChanges();

        if (result.length > 0) {
          await delCacheByPattern(`graphql:*getMenuByName*`);
        }
        return { success: result.count > 0 };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update menus' };
      }
    },
  },
};
