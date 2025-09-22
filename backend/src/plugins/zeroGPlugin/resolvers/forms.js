import System from '../../../models/system.js';
import { ZeroGUtils } from '../utils.js';

export default {
  Query: {
    getGForms: async (_, __, { connection }) => {
      const formsDb = await connection`SELECT * FROM pw_zg_forms`;

      const formsList = await Promise.all(
        formsDb.map(async (dbForm) => {
          const fieldData = JSON.parse(dbForm.data);
          const entries = await ZeroGUtils.getTotalEntries(connection, dbForm.id);
          const views = await ZeroGUtils.getViews(connection, dbForm.id);

          return {
            id: dbForm.id,
            title: dbForm.title,
            slug: ZeroGUtils.generateSlug(dbForm.title),
            entries,
            views,
            conversion: views === 0 ? 0 : (entries / views) * 100,
            status: dbForm.active ? 'active' : 'inactive',
            fields: { fields: fieldData, total: fieldData.length },
          };
        }),
      );

      return {
        forms: formsList,
        total: formsList.length,
      };
    },
    getGForm: async (_, { id }, { connection }) => {
      const form = await ZeroGUtils.get_form(connection, id);
      return form;
    },
    getGFormViews: async (_, { formId }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const result = await connection`
        SELECT views AS total
        FROM pw_zg_formmeta e
        WHERE e.form_id = ${formId}
      `;

      return Number(result[0].total); // Convert from string to number
    },
  },
  Mutation: {
    addGForm: async (_, { title, data }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const result = await connection`
        INSERT INTO pw_zg_forms (title, data, active, trash, description)
        VALUES (${title}, ${data}, true, false, '')
        RETURNING id
      `;
      let insertedId = null;
      if (result.length == 1) {
        insertedId = result[0].id;

        const conf = [
          {
            id: crypto.randomUUID(),
            name: 'Default Confirmation',
            type: 'text',
            message: 'Thanks for contacting us! We will get in touch with you shortly.',
            page: null,
            redirectUrl: '',
            passData: '',
          },
        ];

        await connection`
          INSERT INTO pw_zg_formmeta (form_id, confirmations, notifications)
          VALUES (${insertedId}, ${JSON.stringify(conf)}, '[]')
        `;
      }
      return { success: result.length === 1, post_id: insertedId };
    },
    addGFormView: async (_, { formId }, { connection }) => {
      const result = await connection`
        UPDATE pw_zg_formmeta
        SET views = views + 1
        WHERE form_id = ${formId}
        RETURNING id, views
      `;
      if (result.length > 0) {
        return { success: true };
      } else {
        return { success: false };
      }
    },
    updateGForm: async (_, { id, title, data, description }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const result = await connection`
        UPDATE pw_zg_forms
        SET title = ${title}, data = ${data}, description=${description}
        WHERE id = ${id}
        RETURNING id
      `;

      if (result.length !== 1) {
        throw new Error(`Form with ID ${id} not found or update failed.`);
      }

      const updatedId = result[0].id;

      return { success: true, post_id: updatedId };
    },
    updateGFormActive: async (_, { id, active }, { connection }) => {
      const result = await connection`
        UPDATE pw_zg_forms
        SET active = ${active}
        WHERE id = ${id}
        RETURNING id
      `;

      if (result.length !== 1) {
        throw new Error(`Form with ID ${id} not found or update failed.`);
      }

      const updatedId = result[0].id;

      return { success: true, post_id: updatedId };
    },
    deleteGForm: async (_, { formId }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const entries = await connection`
          SELECT id FROM pw_zg_entry WHERE form_id = ${formId}
        `;

        const entryIds = entries.map((e) => e.id);

        if (entryIds.length > 0) {
          await connection`
            DELETE FROM pw_zg_entrymeta WHERE entry_id = ANY(${entryIds}::int[])
          `;

          await connection`
            DELETE FROM pw_zg_entry WHERE id = ANY(${entryIds}::int[])
          `;
        }

        await connection`
          DELETE FROM pw_zg_formmeta WHERE form_id = ${formId}
        `;

        await connection`
          DELETE FROM pw_zg_forms WHERE id = ${formId}
        `;

        return { success: true };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false };
      }
    },
  },
};
