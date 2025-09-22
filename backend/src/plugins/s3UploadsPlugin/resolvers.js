export default {
  Query: {
    getS3UploadPluginOptions: async (_, __, { connection, isAuth }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const emptyData = {
        bucketName: '',
        endpoint: '',
        accessKeyId: '',
        secretAccessKey: '',
      };
      const data =
        await connection`SELECT * FROM pw_options WHERE option_name='_s3_uploads_plugin'`;
      if (data.length > 0) {
        return data[0].option_value;
      } else {
        await connection`INSERT INTO pw_options (option_name, option_value) VALUES ('_s3_uploads_plugin', ${JSON.stringify(emptyData)})`;
      }
      return JSON.stringify(emptyData);
    },
  },
  Mutation: {
    updateS3UploadPluginOptions: async (
      _,
      { bucketName, endpoint, accessKeyId, secretAccessKey },
      { connection, isAuth },
    ) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const newData = {
        bucketName: bucketName,
        endpoint: endpoint,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      };
      await connection`
        UPDATE pw_options
        SET option_value = ${JSON.stringify(newData)}
        WHERE option_name = '_s3_uploads_plugin'
      `;
      if (result.count === 0) {
        return { success: false };
      }

      return { success: true };
    },
  },
};
