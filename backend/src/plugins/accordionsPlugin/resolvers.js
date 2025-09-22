import System from '../../models/system.js';

export default {
  Query: {
    getAccordions: async (_, __, { connection }) => {
      const accordionsDb = await connection`SELECT * FROM pw_accordions`;

      const accordionsList = await Promise.all(
        accordionsDb.map(async (dbAccordion) => {
          const fieldData = JSON.parse(dbAccordion.data);

          return {
            id: dbAccordion.id,
            title: dbAccordion.title,
            status: dbAccordion.active ? 'active' : 'inactive',
            fields: { fields: fieldData, total: fieldData.length },
          };
        }),
      );
      return {
        accordions: accordionsList ? accordionsList : [],
        total: accordionsList ? accordionsList.length : 0,
      };
    },

    getAccordion: async (_, { id }, { connection }) => {
      const accordionsDb = await connection`SELECT * FROM pw_accordions WHERE id = ${id}`;

      const fieldData = JSON.parse(accordionsDb[0].data);

      return {
        id: accordionsDb[0].id,
        title: accordionsDb[0].title,
        status: accordionsDb[0].active ? 'active' : 'inactive',
        fields: { fields: fieldData, total: fieldData.length },
      };
    },
  },
  Mutation: {
    addAccordion: async (_, { title, data }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const result = await connection`
          INSERT INTO pw_accordions (title, data, active, trash)
          VALUES (${title}, ${data}, true, false)
          RETURNING id
        `;

        if (result.length > 0) {
          return {
            success: true,
            post_id: result[0].id,
          };
        } else {
          return {
            success: false,
            error: 'Insert failed — no rows returned.',
          };
        }
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        console.error('Insert error:', err);
        return {
          success: false,
          error: err.message || 'Unknown error during insert',
        };
      }
    },
    updateAccordion: async (_, { id, title, data }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const result = await connection`
          UPDATE pw_accordions
          SET title = ${title}, data = ${data}
          WHERE id = ${id}
          RETURNING id
        `;

        if (result.length > 0) {
          return {
            success: true,
            post_id: result[0].id,
          };
        } else {
          return {
            success: false,
            error: 'Update failed — no rows affected.',
          };
        }
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        console.error('Update error:', err);
        return {
          success: false,
          error: err.message || 'Unknown error during update',
        };
      }
    },
    updateAccordionActive: async (_, { id, active }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const result = await connection`
          UPDATE pw_accordions
          SET active = ${active}
          WHERE id = ${id}
          RETURNING id
        `;

        if (result.length > 0) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
            error: 'Update failed — no rows affected.',
          };
        }
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        console.error('Update error:', err);
        return {
          success: false,
          error: err.message || 'Unknown error during update',
        };
      }
    },
    deleteAccordion: async (_, { id }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      try {
        const result = await connection`
          DELETE FROM pw_accordions
          WHERE id = ${id}
          RETURNING id
        `;

        if (result.length > 0) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
            error: 'Delete failed — no rows affected.',
          };
        }
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        console.error('Delete error:', err);
        return {
          success: false,
          error: err.message || 'Unknown error during delete',
        };
      }
    },
  },
};
