import Email from '../../models/email.js';
import User from '../../models/user.js';
import WordpressHash from 'wordpress-hash-node';
import crypto from 'crypto';
import System from '../../models/system.js';

export default {
  Query: {
    getUserRoles: async function (_, __, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const roles = await User.getRoles(connection);
        return { roles };
      } catch (err) {
        throw new Error('Failed to fetch roles.');
      }
    },

    getUsers: async function (_, { page = 1, perPage = 10 }, { connection, isAuth, loaders }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const [{ count }] = await connection`SELECT COUNT(*)::int AS count FROM pw_users`;

        const args = [
          { type: 'limit', value: perPage },
          { type: 'offset', value: (page - 1) * perPage },
        ];
        const users = await User.fetch(args, connection, loaders);

        return {
          users: users.map((u) => ({
            ...u,
            id: u.id,
            user_registered: u.user_registered.toISOString(),
          })),
          total: count,
        };
      } catch (err) {
        throw new Error('Failed to fetch users.');
      }
    },

    getUserBy: async function (_, { field, value }, { connection, loaders }) {
      try {
        const user = await User.getUserBy(field, value, connection, loaders);
        return user;
      } catch (err) {
        throw new Error('Failed to fetch user.');
      }
    },

    getAuthors: async function (_, __, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const users = await User.fetchAll(connection);
        return { users, total: users.length };
      } catch (err) {
        throw new Error('Failed to fetch authors.');
      }
    },

    getAuthor: async function (_, { id }, { connection, loaders }) {
      try {
        const user = await User.getUserBy('id', id, connection, loaders);
        return user;
      } catch (err) {
        throw new Error('Failed to fetch author.');
      }
    },
  },

  Mutation: {
    updateUser: async function (
      _,
      { user_nicename, first_name, last_name, user_email, user_password, roleId, userId },
      { connection, isAuth, loaders },
    ) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      const cleanNicename = sanitizeInput(user_nicename);
      const cleanFirstName = sanitizeInput(first_name);
      const cleanLastName = sanitizeInput(last_name);
      const cleanUserEmail = sanitizeInput(user_email);

      if (typeof roleId !== 'number') {
        const error = new Error('Invalid or missing Role ID');
        error.code = 400;
        throw error;
      }

      if (typeof userId !== 'number') {
        const error = new Error('Invalid or missing User ID');
        error.code = 400;
        throw error;
      }

      let success = true;

      try {
        await connection.begin(async (sql) => {
          const user = await User.getUserBy('id', userId, sql, loaders);

          if (user_password != null) {
            const successPw = await User.updatePassword(user_password, userId, sql);
            if (!successPw) success = false;
          }

          if (roleId != user.user_role.id) {
            const successRole = await User.updateRole(roleId, userId, sql);
            if (!successRole) success = false;
          }

          if (cleanNicename != user.user_nicename) {
            const successNiceName = await User.updateNiceName(cleanNicename, userId, sql);
            if (!successNiceName) success = false;
          }

          if (cleanFirstName != user.first_name) {
            const successFirstName = await User.updateFirstName(cleanFirstName, userId, sql);
            if (!successFirstName) success = false;
          }

          if (cleanLastName != user.last_name) {
            const successLastName = await User.updateLastName(cleanLastName, userId, sql);
            if (!successLastName) success = false;
          }

          if (cleanUserEmail != user.user_email) {
            const successEmail = await User.updateEmail(cleanUserEmail, userId, sql);
            if (!successEmail) success = false;
          }
        });
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        success = false;
      }

      return { success };
    },

    createUser: async function (
      _,
      { display_name, first_name, last_name, user_email, user_password, roleId },
      { connection, env },
    ) {
      const cleanDisplayName = sanitizeInput(display_name);
      const cleanFirstName = sanitizeInput(first_name);
      const cleanLastName = sanitizeInput(last_name);
      const cleanUserEmail = sanitizeInput(user_email);

      if (typeof roleId !== 'number') {
        const error = new Error('Invalid or missing Role ID');
        error.code = 400;
        throw error;
      }

      let success = true;
      try {
        if (user_password != null) {
          const successCreate = await User.createUser(
            cleanDisplayName,
            cleanFirstName,
            cleanLastName,
            cleanUserEmail,
            user_password,
            roleId,
            connection,
            env,
          );
          if (!successCreate) success = false;
        } else {
          success = false;
        }
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        success = false;
      }

      return { success };
    },

    createNewPassword: async function (_, { password, userLogin, key }, { connection }) {
      try {
        const user = await User.getUserByRPKey(key, connection);
        if (!user) {
          return { success: false, error: 'Cannot detect user from that key.' };
        }

        const successPw = await User.updatePassword(password, user.id, connection);
        if (!successPw) {
          return { success: false, error: 'Password update failed.' };
        }

        await User.removeRPKey(user.id, connection);
        return { success: true };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: err.message };
      }
    },

    passwordResetAdmin: async function (_, { userId }, { connection, isAuth, env, c }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof userId !== 'number') {
        const error = new Error('Invalid or missing User ID');
        error.code = 400;
        throw error;
      }
      try {
        const userData = await connection`SELECT * FROM pw_users WHERE id=${userId}`;
        if (userData.length === 0) {
          return { success: false };
        }
        const user = userData[0];

        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        await connection`
          INSERT INTO pw_usermeta (user_id, meta_key, meta_value)
          SELECT ${user.id}, 'pw_reset_password_token_hash', ${tokenHash}
          WHERE NOT EXISTS (
            SELECT 1
            FROM pw_usermeta
            WHERE user_id = ${user.id} AND meta_key = 'pw_reset_password_token_hash'
          )
        `;

        await connection`
          INSERT INTO pw_usermeta (user_id, meta_key, meta_value)
          SELECT ${user.id}, 'pw_reset_password_expires', ${expires}
          WHERE NOT EXISTS (
            SELECT 1
            FROM pw_usermeta
            WHERE user_id = ${user.id} AND meta_key = 'pw_reset_password_expires'
          )
        `;

        const mailer = await Email.getMailer(connection, c.env);
        if (mailer != null) {
          await mailer.sendMail({
            from: { name: c.env.DEFAULT_FROM_NAME || 'PhraseWorks', email: c.env.DEFAULT_FROM_EMAIL || 'noreply@localhost' },
            to: user.user_email,
            subject: `${c.env.SITE_NAME} User Created`,
            text: `Thank you for submitting your forgottem password request on ${c.env.SITE_NAME}, you can click here to change the password: ${c.env.SITE_URL}/login?action=reset-password&token=${token}&email=${user.user_email}.`,
            html: `
            <img src="${c.env.R2_PUBLIC_URL}pw.svg" alt="${c.env.SITE_NAME}" />
            <h2>Password Reset Request</h2>

            <p>Someone has requested a password reset for the following account:</p>

            <ul>
              <li><strong>Site:</strong> <a href="${c.env.SITE_URL}">${c.env.SITE_URL}</a></li>
              <li><strong>Username:</strong> ${user.user_login}</li>
            </ul>

            <p>If this was a mistake, you can safely ignore this email.</p>

            <p>To reset your password, click the button below:</p>

            <p>
              <a href="${c.env.SITE_URL}/login?action=reset-password&token=${token}&email=${user.user_email}"
                style="background-color: #2271b1; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
                Reset Password
              </a>
            </p>

            <p>Thanks,<br>The Team at <strong>${c.env.SITE_NAME}</strong></p>
        `,
          });
        }

        return { success: true };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
      }
    },

    deleteUser: async function (_, { userId }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof userId !== 'number') {
        const error = new Error('Invalid or missing User ID');
        error.code = 400;
        throw error;
      }

      try {
        await connection.begin(async (sql) => {
          await sql`DELETE FROM pw_usermeta WHERE user_id = ${userId}`;
          await sql`DELETE FROM pw_users WHERE id = ${userId}`;
        });
        return { success: true };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Could not delete user.' };
      }
    },
    userCreate: async function (_, { input }, { connection, c }) {
      try {
        const userLogin = input.email.split('@')[0];
        const userNicename = userLogin
          .replace(/_/g, ' ')
          .replace(/@/g, '-')
          .replace(/\b\w/g, (l) => l.toUpperCase());

        const userUrl = '';
        const userRegistered = new Date().toISOString().split('T')[0];
        const userStatus = 0;
        const result = await connection`
            INSERT INTO pw_users (
                user_login, user_pass, user_nicename, user_email,
                user_registered, user_status, display_name,
                first_name, last_name
            ) VALUES (
                ${userLogin}, ${WordpressHash.HashPassword(input.password)}, ${userNicename}, ${input.email},
                ${userRegistered}, ${userStatus}, ${input.display_name},
                ${input.first_name}, ${input.last_name}
            ) RETURNING *;
        `;
        if (result.length > 0) {
          await connection`INSERT INTO pw_usermeta (user_id, meta_key, meta_value) VALUES (${result[0].id}, 'pw_user_role',	1)`;

          const hashedKey = await User.generateRPKey(result[0].id, connection);
          const mailer = await Email.getMailer(connection, c.env);
          if (mailer != null) {
            await mailer.sendMail({
              from: { name: c.env.DEFAULT_FROM_NAME || 'PhraseWorks', email: c.env.DEFAULT_FROM_EMAIL || 'noreply@localhost' },
              to: input.email,
              subject: `${c.env.SITE_NAME} User Created`,
              text: `Welcome to ${c.env.SITE_NAME}, You have been added as a user and can log in: ${c.env.SITE_URL}/login?action=rp&key=${hashedKey}&login=${userLogin}.`,
              html: `
                  <h2>Welcome to ${c.env.SITE_NAME}</h2>
                  <p>Hi <strong>${userLogin}</strong>,</p>
                  
                  <p>You have been added to <strong>${c.env.SITE_NAME}</strong>.</p>
                  
                  <p>Here are your login details:</p>
                  <ul>
                    <li><strong>Username:</strong> ${userLogin}</li>
                  </ul>
                  
                  <p>To log in, visit the following address:</p>
                  
                  <p>
                    <a href="${c.env.SITE_URL}/login"
                      style="background-color: #0073aa; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
                      Log in to the site
                    </a>
                  </p>
                  
                  <p>If you have any problems, please contact the administrator of this site.</p>
                  
                  <p>Thanks!<br>
                  &mdash; The Team at <strong>${c.env.SITE_NAME}</strong><br>
                  <a href="${c.env.SITE_URL}">${c.env.SITE_URL}</a></p>
                `,
            });
          }
          return { success: true };
        }
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
      }
      return { success: false };
    },
    forgottenPassword: async (_, { email }, { connection, c }) => {
      try {
        const userData = await connection`SELECT * FROM pw_users WHERE user_email=${email}`;
        if (userData.length === 0) {
          return { success: false };
        }
        const user = userData[0];

        const token = crypto.randomBytes(32).toString('hex'); // send via email
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        await connection`
        DELETE FROM pw_usermeta
        WHERE user_id = ${user.id}
        AND meta_key IN ('pw_reset_password_token_hash', 'pw_reset_password_expires');
      `;

        await connection`
        INSERT INTO pw_usermeta (user_id, meta_key, meta_value)
        VALUES (${user.id}, 'pw_reset_password_token_hash', ${tokenHash});
      `;

        await connection`
        INSERT INTO pw_usermeta (user_id, meta_key, meta_value)
        VALUES (${user.id}, 'pw_reset_password_expires', ${expires});
      `;

        const mailer = await Email.getMailer(connection, c.env);
        if (mailer != null) {
          await mailer.sendMail({
            from: { name: c.env.DEFAULT_FROM_NAME || 'PhraseWorks', email: c.env.DEFAULT_FROM_EMAIL || 'noreply@localhost' },
            to: user.user_email,
            subject: `${c.env.SITE_NAME} Forgotten Password`,
            text: `Thank you for submitting your forgottem password request on ${c.env.SITE_NAME}, you can click here to change the password: ${c.env.SITE_URL}/login?action=reset-password&token=${token}&email=${email}.`,
            html: `
          <img src="data:image/png;base64,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" alt="Logo" height="50" width="50">
          <h2>Password Reset Request</h2>

            <p>Someone has requested a password reset for the following account:</p>

            <ul>
              <li><strong>Site:</strong> <a href="${c.env.SITE_URL}">${c.env.SITE_URL}</a></li>
              <li><strong>Username:</strong> ${user.user_login}</li>
            </ul>

            <p>If this was a mistake, you can safely ignore this email.</p>

            <p>To reset your password, click the button below:</p>

            <p>
              <a href="${c.env.SITE_URL}/login?action=reset-password&token=${token}&email=${email}"
                style="background-color: #2271b1; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
                Reset Password
              </a>
            </p>

            <p>Thanks,<br>The Team at <strong>${c.env.SITE_NAME}</strong></p>
        `,
          });
        }

        return { success: true };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
      }
    },
    resetPassword: async (_, { token, password }, { connection, c }) => {
      try {
        let success = true;
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const userMeta = await connection`
        SELECT user_id, meta_value AS expires
        FROM pw_usermeta
        WHERE meta_key = 'pw_reset_password_token_hash'
          AND meta_value = ${tokenHash}
      `;

        if (!userMeta || userMeta.length === 0) {
          throw new Error('Invalid or unknown token');
        }

        const userId = userMeta[0].user_id;

        const expiryMeta = await connection`
        SELECT meta_value
        FROM pw_usermeta
        WHERE user_id = ${userId} AND meta_key = 'pw_reset_password_expires'
      `;

        if (!expiryMeta || expiryMeta.length === 0) {
          throw new Error('Token expiry missing');
        }

        const expires = new Date(expiryMeta[0].meta_value);
        const now = new Date();

        if (now > expires) {
          await connection`
          DELETE FROM pw_usermeta
          WHERE user_id = ${userId} AND meta_key IN ('pw_reset_password_token_hash','pw_reset_password_expires')
        `;
          return { success: false, error: 'Token has expired' };
        }

        await connection`
        DELETE FROM pw_usermeta
        WHERE user_id = ${userId} AND meta_key IN ('pw_reset_password_token_hash','pw_reset_password_expires')
      `;

        if (password != null) {
          const successPw = await User.updatePassword(password, userId, connection);
          if (!successPw) success = false;
        }
        return { success: success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
      }
    },
  },
};
