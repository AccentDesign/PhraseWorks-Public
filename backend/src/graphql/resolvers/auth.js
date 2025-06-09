import jwt from 'jsonwebtoken';
import User from '../../models/user';
import WordpressHash from 'wordpress-hash-node';

export default {
  login: async function ({ email, password }, { connection, secret }) {
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

  refresh: async function ({ refreshToken }, { connection, secret }) {
    const decoded = jwt.verify(refreshToken, secret);
    const token = jwt.sign({ userId: decoded.user.id, email: decoded.user.email }, secret, {
      expiresIn: '1h',
    });
    const newRefreshToken = jwt.sign({ user: decoded.user }, secret, { expiresIn: '1d' });

    const user = await User.findById(decoded.user.id, connection);
    return {
      token,
      refreshToken: newRefreshToken,
      userId: user.id,
      user: [extractUserFields(user)],
    };
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
  };
}
