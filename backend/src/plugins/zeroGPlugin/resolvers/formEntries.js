import System from '../../../models/system.js';

export default {
  Query: {
    getTotalEntriesGform: async (_, { formId }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const result = await connection`
        SELECT COUNT(*) AS total
        FROM pw_zg_entry e
        WHERE e.form_id = ${formId}
      `;

      return Number(result[0].total); // Convert from string to number
    },
    getEntriesGform: async (_, { page = 1, perPage = 10, formId }, { connection }) => {
      const totalEntries = await connection`
        SELECT 
          e.id as entry_id,
          e.form_id,
          e.post_id,
          e.date_created,
          e.date_updated,
          m.meta_data
        FROM pw_zg_entry e
        LEFT JOIN pw_zg_entrymeta m ON e.id = m.entry_id
        WHERE e.form_id = ${formId}
      `;
      const args = [
        { type: 'limit', value: perPage },
        { type: 'offset', value: (page - 1) * perPage },
      ];

      const limitArg = args.find((arg) => arg.type === 'limit');
      const limit = limitArg?.value ?? 10;

      const offsetArg = args.find((arg) => arg.type === 'offset');
      const offset = offsetArg?.value ?? 0;

      // let posts = await Post.fetch(args, type, connection, include_trash);
      let rows = await connection`
      SELECT 
          e.id as entry_id,
          e.form_id,
          e.post_id,
          e.date_created,
          e.date_updated,
          m.meta_data
        FROM pw_zg_entry e
        LEFT JOIN pw_zg_entrymeta m ON e.id = m.entry_id
        WHERE e.form_id = ${formId}
        ORDER BY e.date_created DESC LIMIT ${limit} OFFSET ${offset}
      `;

      const entries = rows.map((row) => ({
        id: row.entry_id,
        form_id: row.form_id,
        post_id: row.post_id,
        date_created: row.date_created.toISOString(),
        date_updated: row.date_created.toISOString(),
        data: row.meta_data,
      }));

      return {
        entries: entries,
        total: totalEntries.length,
      };
    },
    getEntryGform: async (_, { id }, { connection }) => {
      const row = await connection`
        SELECT 
          e.id as entry_id,
          e.form_id,
          e.post_id,
          e.date_created,
          e.date_updated,
          m.meta_data
        FROM pw_zg_entry e
        LEFT JOIN pw_zg_entrymeta m ON e.id = m.entry_id
        WHERE e.id = ${id}
      `;

      if (row.length == 0) {
        return {};
      }

      const form = await get_form(connection, row[0].form_id);

      return {
        id: row[0].entry_id,
        form_id: row[0].form_id,
        post_id: row[0].post_id,
        date_created: row[0].date_created.toISOString(),
        date_updated: row[0].date_created.toISOString(),
        data: row[0].meta_data,
        form_title: form.title,
      };
    },
  },
  Mutation: {
    addEntryGForm: async (_, { id, postId, values }, { connection }) => {
      const valuesData = JSON.parse(values);
      const form = await get_form(connection, id);

      const entry =
        await connection`INSERT INTO pw_zg_entry (form_id, post_id, date_created, date_updated) VALUES (${id}, ${postId}, NOW(), NOW()) RETURNING *;`;

      const entrymeta =
        await connection`INSERT INTO pw_zg_entrymeta (form_id, entry_id, meta_data) VALUES (${id}, ${entry[0].id}, ${values}) RETURNING *;`;

      return { success: !!entrymeta[0].id };
    },
    deleteEntriesGForm: async (_, { ids }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const idsArray = typeof ids === 'string' ? ids.split(',') : ids;
      const parsedIds = idsArray.map((id) => parseInt(id, 10)).filter((n) => !isNaN(n));
      const pgArrayLiteral = `{${parsedIds.join(',')}}`;

      try {
        await connection`
          DELETE FROM pw_zg_entrymeta WHERE entry_id = ANY(${pgArrayLiteral}::int[])
        `;
        await connection`
          DELETE FROM pw_zg_entry WHERE id = ANY(${pgArrayLiteral}::int[])
        `;
        return { success: true };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false };
      }
    },
  },
};
