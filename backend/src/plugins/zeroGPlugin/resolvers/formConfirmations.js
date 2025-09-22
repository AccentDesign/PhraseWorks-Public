import System from '../../../models/system.js';

export default {
  Query: {
    getGFormConfirmations: async (_, { id }, { connection }) => {
      const rows = await connection`
        SELECT 
          confirmations
        FROM pw_zg_formmeta        
        WHERE pw_zg_formmeta.form_id = ${id}
      `;
      if (rows.length == 0) {
        return null;
      }
      return rows[0].confirmations;
    },
    getGFormConfirmation: async (_, { id, formId }, { connection }) => {
      const rows = await connection`
        SELECT 
          confirmations
        FROM pw_zg_formmeta        
        WHERE pw_zg_formmeta.form_id = ${formId}
      `;
      if (rows.length == 0) {
        return null;
      }
      const confirmations = JSON.parse(rows[0].confirmations);
      const confirmation = confirmations.find((item) => item.id == id);
      if (!confirmation) {
        return null;
      }
      return JSON.stringify(confirmation);
    },
  },
  Mutation: {
    addGFormConfirmation: async (
      _,
      { id, confirmationName, confirmationType, message, page, redirectUrl, passData },
      { connection, isAuth },
    ) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const confirmationsData = await connection`
        SELECT confirmations
        FROM pw_zg_formmeta
        WHERE form_id = ${id}
      `;

      let confirmations = [];
      if (confirmationsData.length > 0 && confirmationsData[0].confirmations) {
        try {
          confirmations = JSON.parse(confirmationsData[0].confirmations);
        } catch (err) {
          await System.writeLogData(err.stack || String(err), 'backend');
          confirmations = [];
        }
      }

      const exists = confirmations.some(
        (c) =>
          c.name === confirmationName &&
          c.type === confirmationType &&
          c.message === message &&
          c.page === page &&
          c.redirectUrl === redirectUrl &&
          c.passData === passData,
      );

      if (exists) {
        return { success: false };
      }

      confirmations.push({
        id: crypto.randomUUID(),
        name: confirmationName,
        type: confirmationType,
        message: message,
        page: page,
        redirectUrl: redirectUrl,
        passData: passData,
      });

      await connection`
        UPDATE pw_zg_formmeta
        SET confirmations = ${JSON.stringify(confirmations)}
        WHERE form_id = ${id}
      `;

      return { success: true };
    },
    updateGFormConfirmation: async (
      _,
      { id, formId, confirmationName, confirmationType, message, page, redirectUrl, passData },
      { connection, isAuth },
    ) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const confirmationsData = await connection`
        SELECT confirmations
        FROM pw_zg_formmeta
        WHERE form_id = ${formId}
      `;

      let confirmations = [];
      if (confirmationsData.length > 0 && confirmationsData[0].confirmations) {
        try {
          confirmations = JSON.parse(confirmationsData[0].confirmations);
        } catch (err) {
          await System.writeLogData(err.stack || String(err), 'backend');
          confirmations = [];
        }
      }

      const index = confirmations.findIndex((c) => c.id === id);
      if (index === -1) {
        return { success: false };
      }

      confirmations[index] = {
        ...confirmations[index],
        name: confirmationName,
        type: confirmationType,
        message,
        page,
        redirectUrl,
        passData,
      };

      await connection`
        UPDATE pw_zg_formmeta
        SET confirmations = ${JSON.stringify(confirmations)}
        WHERE form_id = ${formId}
      `;

      return { success: true };
    },
    deleteGFormConfirmation: async (_, { id, formId }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const confirmationsData = await connection`
        SELECT confirmations
        FROM pw_zg_formmeta
        WHERE form_id = ${formId}
      `;

      let confirmations = [];
      if (confirmationsData.length > 0 && confirmationsData[0].confirmations) {
        try {
          confirmations = JSON.parse(confirmationsData[0].confirmations);
        } catch (err) {
          await System.writeLogData(err.stack || String(err), 'backend');
          confirmations = [];
        }
      }

      confirmations = confirmations.filter((item) => item.id != id);

      await connection`
        UPDATE pw_zg_formmeta
        SET confirmations = ${JSON.stringify(confirmations)}
        WHERE form_id = ${formId}
      `;

      return { success: true };
    },
  },
};
