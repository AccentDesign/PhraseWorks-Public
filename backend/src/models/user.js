import Post from './post';
import WordpressHash from 'wordpress-hash-node';
import crypto from 'crypto';
import { Resend } from 'resend';
import Email from './email';

const resend = new Resend('re_akVmyiPX_7maBXSZYqVqvuymF1Yd3T1uB');

export default class User {
  constructor(id, user_login, user_nicename, user_email, user_url, user_status, display_name) {
    this.id = id;
    this.user_login = user_login;
    this.user_nicename = user_nicename;
    this.user_email = user_email;
    this.user_url = user_url;
    this.user_status = user_status;
    this.display_name = display_name;
  }

  static async fetchAll(connection) {
    const rows = await connection`SELECT * FROM pw_users`;
    return rows;
  }

  static async fetch(args, connection) {
    const limitArg = args.find((arg) => arg.type === 'limit');
    const limit = limitArg?.value ?? 10;

    const offsetArg = args.find((arg) => arg.type === 'offset');
    const offset = offsetArg?.value ?? 0;

    let query = connection`
      SELECT 
        u.*, 
        pm.meta_value AS user_role
      FROM pw_users u
      LEFT JOIN pw_usermeta pm 
        ON u.id = pm.user_id AND pm.meta_key = 'pw_user_role'
    `;

    query = connection`${query} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;

    const rows = await query;
    const roles = await User.getRoles(connection);

    await Promise.all(
      rows.map(async (row) => {
        row.user_role = roles.find((role) => role.id == row.user_role);
        const posts = await Post.fetchAllByAuthor(connection, 'post', row.id);
        row.post_count = posts.length;
      }),
    );

    return [...rows];
  }

  static async findById(id, connection) {
    const rows = await connection`SELECT * FROM pw_users WHERE id=${id}`;
    return rows[0];
  }

  static async find(arg, connection) {
    const allowedParams = ['user_email', 'username', 'id'];
    if (!allowedParams.includes(arg.param)) {
      throw new Error('Invalid query parameter');
    }

    const rows = await connection`SELECT * FROM pw_users WHERE ${connection(arg.param)} = ${
      arg.value
    } LIMIT 1`;

    if (rows.length === 0) {
      return [];
    }

    return rows[0];
  }

  static async getRoles(connection) {
    const data = await connection`SELECT * FROM pw_options WHERE option_name = 'pw_user_roles'`;
    if (data.length === 0) {
      return null;
    }
    const roles = JSON.parse(data[0].option_value);
    return roles;
  }

  static async getUserBy(field, value, connection) {
    const allowedFields = ['id', 'post_name', 'post_title', 'post_author'];
    if (!allowedFields.includes(field)) {
      throw new Error('Invalid field parameter');
    }
    const query = `
      SELECT 
        u.*, 
        pm.meta_value AS user_role
      FROM pw_users u
      LEFT JOIN pw_usermeta pm 
        ON u.id = pm.user_id AND pm.meta_key = 'pw_user_role'
      WHERE u.${field} = $1
    `;

    const user = await connection.unsafe(query, [value]);
    const roles = await User.getRoles(connection);

    if (user.length > 0) {
      await Promise.all(
        user.map(async (row) => {
          row.user_role = roles.find((role) => role.id == row.user_role);
          const posts = await Post.fetchAllByAuthor(connection, 'post', row.id);
          row.post_count = posts.length;
          row.user_registered = row.user_registered.toISOString();
        }),
      );
      return user[0];
    }
    return null;
  }

  static async updatePassword(password, userId, connection) {
    const hashedPassword = WordpressHash.HashPassword(password);
    const result = await connection`
      UPDATE pw_users
      SET user_pass = ${hashedPassword}
      WHERE id = ${userId}
      RETURNING *;
    `;
    return result.length > 0 ? true : false;
  }

  static async updateRole(roleId, userId, connection) {
    const result = await connection`
      UPDATE pw_usermeta
      SET meta_value = ${roleId}
      WHERE user_id = ${userId}
        AND meta_key = 'pw_user_role'
    `;
    return result.rowCount > 0;
  }

  static async updateNiceName(niceName, userId, connection) {
    const result = await connection`
      UPDATE pw_users
      SET user_nicename = ${niceName}
      WHERE id = ${userId}
    `;
    return result.rowCount > 0;
  }

  static async updateFirstName(firstName, userId, connection) {
    const result = await connection`
      UPDATE pw_users
      SET first_name = ${firstName}
      WHERE id = ${userId}
    `;
    return result.rowCount > 0;
  }

  static async updateLastName(lastName, userId, connection) {
    const result = await connection`
      UPDATE pw_users
      SET last_name = ${lastName}
      WHERE id = ${userId}
    `;
    return result.rowCount > 0;
  }

  static async updateEmail(email, userId, connection) {
    const result = await connection`
      UPDATE pw_users
      SET user_email = ${email}
      WHERE id = ${userId}
    `;
    return result.rowCount > 0;
  }

  static async createUser(
    display_name,
    first_name,
    last_name,
    email,
    password,
    roleId,
    connection,
    env,
  ) {
    const userLogin = email.split('@')[0];
    const userNicename = userLogin
      .replace(/_/g, ' ')
      .replace(/@/g, '-')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const userUrl = '';
    const userRegistered = new Date().toISOString().split('T')[0];
    const userStatus = 0;
    const hashedPassword = WordpressHash.HashPassword(password);
    const result = await connection`
    INSERT INTO pw_users (
        user_login, user_pass, user_nicename, user_email,
        user_registered, user_status, display_name,
        first_name, last_name
    ) VALUES (
        ${userLogin}, ${hashedPassword}, ${userNicename}, ${email},
        ${userRegistered}, ${userStatus}, ${display_name},
        ${first_name}, ${last_name}
    ) RETURNING *;
    `;
    if (result.length > 0) {
      const id = result[0].id;

      await connection`
          INSERT INTO pw_usermeta (user_id, meta_key, meta_value)
          VALUES (${id}, 'pw_user_role', ${roleId})
        `;

      const hashedKey = await User.generateRPKey(id, connection);
      const mailer = await Email.getMailer(connection, env);
      if (mailer != null) {
        await mailer.send({
          from: { name: 'noReply', email: 'noReply@agencyexpress.net' },
          to: { email: user[0].user_email },
          subject: `${env.SITE_NAME} Password Reset`,
          text: 'This is a plain text message from PhraseWorks, testing the smtp settings.',
          html: `
          <h2>Welcome to ${env.SITE_NAME}</h2>
          <p>Hi <strong>${userLogin}</strong>,</p>
          
          <p>You have been added to <strong>${env.SITE_NAME}</strong>.</p>
          
          <p>Here are your login details:</p>
          <ul>
            <li><strong>Username:</strong> ${userLogin}</li>
          </ul>
          
          <p>To set your password, visit the following address:</p>
          
          <p>
            <a href="http://localhost:5173/login?action=rp&key=${hashedKey}&login=${userLogin}"
              style="background-color: #0073aa; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
              Set Your Password
            </a>
          </p>
          
          <p>If you have any problems, please contact the administrator of this site.</p>
          
          <p>Thanks!<br>
          &mdash; The Team at <strong>${env.SITE_NAME}</strong><br>
          <a href="${env.SITE_URL}">${env.SITE_URL}</a></p>
        `,
        });
      }
    }

    return result.rowCount > 0;
  }

  static async getUserByRPKey(key, connection) {
    const query = `
    SELECT 
      u.*
    FROM pw_users u
    JOIN pw_usermeta um
      ON u.id = um.user_id
    WHERE um.meta_key = 'reset_pass_key'
      AND um.meta_value = $1
  `;

    const result = await connection.unsafe(query, [key]);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }

  static async removeRPKey(userId, connection) {
    await connection`
      DELETE FROM pw_usermeta
      WHERE user_id = ${userId}
        AND meta_key IN ('reset_pass_key', 'reset_pass_expiration')
    `;
  }

  static async generateRPKey(userId, connection) {
    const resetKey = crypto.randomBytes(32).toString('base64url');
    const hashedKey = WordpressHash.HashPassword(resetKey);
    await connection`
        INSERT INTO pw_usermeta (user_id, meta_key, meta_value)
        VALUES (${userId}, 'reset_pass_key', ${hashedKey});
      `;
    const expiration = Date.now() + 3600 * 1000 * 24;

    await connection`
        INSERT INTO pw_usermeta (user_id, meta_key, meta_value)
        VALUES (${userId}, 'reset_pass_expiration', ${expiration});
      `;
    return hashedKey;
  }

  static async passwordReset(userId, connection, env) {
    const user = await User.findById(userId, connection);
    const hashedKey = await User.generateRPKey(userId, connection);
    const brevoApiKey = env.BREVO_API_KEY;

    const mailer = await Email.getMailer(connection, env);
    if (mailer != null) {
      await mailer.send({
        from: { name: 'noReply', email: 'noReply@agencyexpress.net' },
        to: { email: user[0].user_email },
        subject: `${env.SITE_NAME} Password Reset`,
        text: 'This is a plain text message from PhraseWorks, testing the smtp settings.',
        html: `
        <img src="https://pub-1e2f36fe29994319a65d0ca6beca0f46.r2.dev/pw.svg" alt="hello" />
        <h2>Password Reset Request</h2>

        <p>Someone has requested a password reset for the following account:</p>

        <ul>
          <li><strong>Site:</strong> <a href="${env.SITE_URL}">${env.SITE_URL}</a></li>
          <li><strong>Username:</strong> ${user.user_login}</li>
        </ul>

        <p>If this was a mistake, you can safely ignore this email.</p>

        <p>To reset your password, click the button below:</p>

        <p>
          <a href="${env.SITE_URL}/login.php?action=rp&key=${hashedKey}&login=${user.user_login}"
            style="background-color: #2271b1; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>

        <p>Thanks,<br>The Team at <strong>${env.SITE_NAME}</strong></p>
      `,
      });
    }
    return true;
  }
}
