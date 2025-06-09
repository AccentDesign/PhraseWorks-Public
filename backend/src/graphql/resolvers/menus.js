export default {
  getMenus: async function ({}, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const menusMeta = await connection`SELECT * FROM pw_options WHERE option_name = 'menus'`;
    if (menusMeta.length == 0) return null;

    const menus = menusMeta[0].option_value;
    return menus;
  },
  getMenuByName: async function ({ name }, { connection, isAuth }) {
    const menusMeta = await connection`SELECT * FROM pw_options WHERE option_name = 'menus'`;
    if (menusMeta.length == 0) return null;

    const menus = JSON.parse(menusMeta[0].option_value);
    return menus.find((menu) => menu.name == name);
  },
  updateMenus: async function ({ menus }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const menusMeta = await connection`
        UPDATE pw_options
        SET option_value = ${menus}
        WHERE option_name = 'menus'
    `;
    return { success: menusMeta.count > 0 };
  },
};
