import User from '../../models/user';

export default {
  getUserRoles: async function ({}, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const roles = await User.getRoles(connection);
    return { roles };
  },
  getUsers: async function ({ page, perPage }, { connection, isAuth, env }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 10;
    }
    const totalUsers = await User.fetchAll(connection);
    const args = [
      { type: 'limit', value: perPage },
      { type: 'offset', value: (page - 1) * perPage },
    ];

    const users = await User.fetch(args, connection);

    return {
      users: users.map((u) => {
        const item = {
          ...u,
          id: u.id,
          user_registered: u.user_registered.toISOString(),
        };
        return item;
      }),
      total: totalUsers.length,
    };
  },
  getUserBy: async function ({ field, value }, { connection }) {
    return await User.getUserBy(field, value, connection);
  },
  updateUser: async function (
    { user_nicename, first_name, last_name, user_email, user_password, roleId, userId },
    { connection, isAuth },
  ) {
    let success = true;
    let user = await User.getUserBy('id', userId, connection);
    if (user_password != null) {
      const successPw = await User.updatePassword(user_password, userId, connection);
      if (successPw == false) {
        success = false;
      }
    }
    if (roleId != user.user_role.id) {
      const successRole = await User.updateRole(roleId, userId, connection);
      if (successRole == false) {
        success = false;
      }
    }
    if (user_nicename != user.user_nicename) {
      const successNiceName = User.updateNiceName(user_nicename, userId, connection);
      if (successNiceName == false) {
        success = false;
      }
    }
    if (first_name != user.first_name) {
      const successFirstName = User.updateFirstName(first_name, userId, connection);
      if (successFirstName == false) {
        success = false;
      }
    }
    if (last_name != user.last_name) {
      const successLastName = User.updateLastName(last_name, userId, connection);
      if (successLastName == false) {
        success = false;
      }
    }
    if (user_email != user.user_email) {
      const successEmail = User.updateEmail(user_email, userId, connection);
      if (successEmail == false) {
        success = false;
      }
    }
    return { success: success };
  },
  createUser: async function (
    { display_name, first_name, last_name, user_email, user_password, roleId },
    { connection, env },
  ) {
    let success = true;
    if (user_password != null) {
      const successCreate = await User.createUser(
        display_name,
        first_name,
        last_name,
        user_email,
        user_password,
        roleId,
        connection,
        env,
      );
      if (successCreate == false) {
        success = false;
      }
    }
    return { success: success };
  },
  createNewPassword: async function ({ password, userLogin, key }, { connection }) {
    // check the key against the user by loading user via key then comparing userlogin
    let success = true;
    const user = await User.getUserByRPKey(key, connection);
    if (user == null) {
      return { success: false, error: 'Cannot detect user from that key.' };
    }
    const successPw = await User.updatePassword(password, user.id, connection);
    if (successPw == false) {
      success = false;
    }
    if (success == true) {
      await User.removeRPKey(user.id, connection);
    }
    return { success: success };
  },
  passwordResetAdmin: async function ({ userId }, { connection, isAuth, env }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    let success = true;
    const successPR = await User.passwordReset(userId, connection, env);
    if (successPR == false) {
      success = false;
    }
    return { success: success };
  },
  getAuthors: async function ({}, { connection }) {
    const users = await User.fetchAll(connection);
    return { users: users, total: users.length };
  },
  getAuthor: async function ({ id }, { connection }) {
    const user = await User.getUserBy('id', id, connection);
    return user;
  },
};
