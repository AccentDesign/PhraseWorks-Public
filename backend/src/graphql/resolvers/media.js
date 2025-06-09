import Media from '../../models/media';

export default {
  getMediaFiles: async function ({ folder, offset = 0, type, search }, { connection, isAuth }) {
    if (!isAuth) {
      throw Object.assign(new Error('Invalid Auth Token.'), { code: 401 });
    }

    const files = await Media.getFiles(folder, offset, type, search, connection);
    const count = await Media.getCount(type, search, connection);
    return { files, total: count };
  },

  getMediaFileById: async function ({ id }, { connection, isAuth }) {
    if (!isAuth) {
      throw Object.assign(new Error('Invalid Auth Token.'), { code: 401 });
    }

    return await Media.getFileById(id, connection);
  },

  deleteFiles: async function ({ ids }, { c, connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    let success = true;

    for (const id of ids) {
      const deleted = await Media.deleteFile(c, connection, id);
      if (!deleted) {
        success = false;
      }
    }

    return { success };
  },
  getMediaSettings: async function ({}, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const settings = await Media.getSettings(connection);
    return { settings: settings.option_value };
  },
  updateMediaSettings: async function ({ data }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    return Media.updateSettings(connection, data);
  },
};
