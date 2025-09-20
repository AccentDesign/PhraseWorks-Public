import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import WordpressHash from 'wordpress-hash-node';

export default {
  Query: {
    login: async function (_, { email, password }, { connection, secret }) {
      const user = await User.find({ param: 'user_email', value: email }, connection);
      if (!user) {
        throw Object.assign(new Error('User not found.'), { code: 401 });
      }

      const isEqual = WordpressHash.CheckPassword(password, user.user_pass);
      if (!isEqual) {
        throw Object.assign(new Error('Password is incorrect.'), { code: 401 });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ user }, secret, { expiresIn: '1d' });

      return {
        token,
        refreshToken,
        userId: user.id,
        user: [extractUserFields(user)],
      };
    },

    refresh: async function (_, { refreshToken, userId }, { connection, secret }) {
      try {
        const decoded = jwt.verify(refreshToken, secret);

        if (!decoded?.user?.id) {
          throw new Error('Invalid token payload.');
        }

        const user = await User.findById(decoded.user.id, connection);
        if (!user) {
          throw new Error('User not found.');
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
          expiresIn: '1h',
        });

        const newRefreshToken = jwt.sign({ user: { id: user.id, email: user.email } }, secret, {
          expiresIn: '7d',
        });

        const refreshTokenExpiry = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

        return {
          token,
          refreshToken: newRefreshToken,
          refreshTokenExpiry,
          userId: user.id,
          user: [extractUserFields(user)],
        };
      } catch (error) {
        const user = await User.findById(userId, connection);
        if (!user) {
          throw new Error('User not found.');
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
          expiresIn: '1h',
        });

        const newRefreshToken = jwt.sign({ user: { id: user.id, email: user.email } }, secret, {
          expiresIn: '7d',
        });

        const refreshTokenExpiry = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

        return {
          token,
          refreshToken: newRefreshToken,
          refreshTokenExpiry,
          userId: user.id,
          user: [extractUserFields(user)],
        };
      }
    },
  },
};

function extractUserFields(user) {
  return {
    id: user.id,
    user_login: user.user_login,
    user_nicename: user.user_nicename,
    user_email: user.user_email,
    user_registered: user.user_registered,
    user_status: user.user_status,
    display_name: user.display_name,
    first_name: user.first_name,
    last_name: user.last_name,
    user_role: user.user_role,
  };
}
