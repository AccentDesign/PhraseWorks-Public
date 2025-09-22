import System from '../../../models/system.js';

export default {
  Query: {
    getGFormNotifications: async (_, { id }, { connection }) => {
      const rows = await connection`
        SELECT 
          notifications
        FROM pw_zg_formmeta        
        WHERE pw_zg_formmeta.form_id = ${id}
      `;
      if (rows.length == 0) {
        return null;
      }
      return rows[0].notifications;
    },
    getGFormNotification: async (_, { id, formId }, { connection }) => {
      const rows = await connection`
        SELECT 
          notifications
        FROM pw_zg_formmeta        
        WHERE pw_zg_formmeta.form_id = ${formId}
      `;
      if (rows.length == 0) {
        return null;
      }
      const notifications = JSON.parse(rows[0].notifications);
      const notification = notifications.find((item) => item.id == id);
      if (!notification) {
        return null;
      }
      return JSON.stringify(notification);
    },
  },
  Mutation: {
    addGFormNotification: async (
      _,
      {
        id,
        notificationName,
        notificationSendTo,
        sendToEmail,
        emailFieldId,
        fromName,
        fromEmail,
        replyTo,
        bcc,
        subject,
        message,
      },
      { connection, isAuth },
    ) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const notificationsData = await connection`
        SELECT notifications
        FROM pw_zg_formmeta
        WHERE form_id = ${id}
      `;

      let notifications = [];
      if (notificationsData.length > 0 && notificationsData[0].notifications) {
        try {
          notifications = JSON.parse(notificationsData[0].notifications);
        } catch (err) {
          await System.writeLogData(err.stack || String(err), 'backend');
          notifications = [];
        }
      }

      const exists = notifications.some(
        (c) =>
          c.name === notificationName &&
          c.sendTo === notificationSendTo &&
          c.sendToEmail === sendToEmail &&
          c.emailFieldId === emailFieldId &&
          c.fromName === fromName &&
          c.fromEmail === fromEmail &&
          c.replyTo === replyTo &&
          c.bcc === bcc &&
          c.subject === subject &&
          c.message === message,
      );

      if (exists) {
        return { success: false };
      }

      notifications.push({
        id: crypto.randomUUID(),
        name: notificationName,
        sendTo: notificationSendTo,
        sendToEmail: sendToEmail,
        emailFieldId: emailFieldId,
        fromName: fromName,
        fromEmail: fromEmail,
        replyTo: replyTo,
        bcc: bcc,
        subject: subject,
        message: message,
      });

      await connection`
        UPDATE pw_zg_formmeta
        SET notifications = ${JSON.stringify(notifications)}
        WHERE form_id = ${id}
      `;

      return { success: true };
    },
    updateGFormNotification: async (
      _,
      {
        id,
        formId,
        notificationName,
        notificationSendTo,
        sendToEmail,
        emailFieldId,
        fromName,
        fromEmail,
        replyTo,
        bcc,
        subject,
        message,
      },
      { connection, isAuth },
    ) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const notificationsData = await connection`
        SELECT notifications
        FROM pw_zg_formmeta
        WHERE form_id = ${formId}
      `;

      let notifications = [];
      if (notificationsData.length > 0 && notificationsData[0].notifications) {
        try {
          notifications = JSON.parse(notificationsData[0].notifications);
        } catch (err) {
          await System.writeLogData(err.stack || String(err), 'backend');
          notifications = [];
        }
      }

      const index = notifications.findIndex((c) => c.id === id);
      if (index === -1) {
        return { success: false };
      }

      notifications[index] = {
        ...notifications[index],
        name: notificationName,
        sendTo: notificationSendTo,
        sendToEmail: sendToEmail,
        emailFieldId: emailFieldId,
        fromName: fromName,
        fromEmail: fromEmail,
        replyTo: replyTo,
        bcc: bcc,
        subject: subject,
        message: message,
      };

      await connection`
        UPDATE pw_zg_formmeta
        SET notifications = ${JSON.stringify(notifications)}
        WHERE form_id = ${formId}
      `;

      return { success: true };
    },
    deleteGFormNotification: async (_, { id, formId }, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const notificationsData = await connection`
        SELECT notifications
        FROM pw_zg_formmeta
        WHERE form_id = ${formId}
      `;

      let notifications = [];
      if (notificationsData.length > 0 && notificationsData[0].notifications) {
        try {
          notifications = JSON.parse(notificationsData[0].notifications);
        } catch (err) {
          await System.writeLogData(err.stack || String(err), 'backend');
          notifications = [];
        }
      }

      notifications = notifications.filter((item) => item.id != id);

      await connection`
        UPDATE pw_zg_formmeta
        SET notifications = ${JSON.stringify(notifications)}
        WHERE form_id = ${formId}
      `;

      return { success: true };
    },
  },
};
