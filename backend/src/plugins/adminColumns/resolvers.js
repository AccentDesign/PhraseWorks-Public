export default {
  Query: {
    getAdminColumns: async (_, __, { connection }) => {
      const dbColumns = await getDBColumns(connection);
      return dbColumns;
    },
    getAdminColumn: async (_, { id }, { connection }) => {
      const dbColumns = await getDBColumns(connection);
      return dbColumns.find((col) => col.id == id);
    },
  },
  Mutation: {
    updateAdminColumnsEntries: async (_, { data }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const result = await connection`
        SELECT option_value FROM pw_options WHERE option_name = '_admin_columns' LIMIT 1
      `;

      if (result.length > 0) {
        await connection`
          UPDATE pw_options
          SET option_value = ${data}
          WHERE option_name = '_admin_columns'
        `;
      } else {
        await connection`
          INSERT INTO pw_options (option_name, option_value)
          VALUES ('_admin_columns', ${data})
        `;
      }

      return { success: true };
    },
    deleteAdminColumnEntries: async (_, { indexes }, { connection, isAuth }) => {
      let dbColumns = await getDBColumns(connection);

      dbColumns = dbColumns.filter((entry) => !indexes.includes(entry.id)); // or entry.uuid

      const save = await updateDBColumns(connection, dbColumns);

      return { success: save };
    },
  },
};

const getDBColumns = async (connection) => {
  let dbColumnsData =
    await connection`SELECT * FROM pw_options WHERE option_name = '_admin_columns' LIMIT 1`;
  if (dbColumnsData.length > 0) {
    return JSON.parse(dbColumnsData[0].option_value);
  }
  return [];
};

const updateDBColumns = async (connection, columns) => {
  const columnsJson = JSON.stringify(columns);
  const dbColumnsData = await getDBColumns(connection);

  if (dbColumnsData.length > 0) {
    const result = await connection`
      UPDATE pw_options 
      SET option_value = ${columnsJson}
      WHERE option_name = '_admin_columns'
    `;
    if (result.count === 0) {
      return false;
    }
  } else {
    const result = await connection`
      INSERT INTO pw_options (option_name, option_value)
      VALUES ('_admin_columns', ${columnsJson})
    `;
    if (!result) {
      return false;
    }
  }
  return true;
};
