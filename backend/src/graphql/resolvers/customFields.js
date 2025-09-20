import CustomFields from '../../models/customFields.js';
import System from '../../models/system.js';

export default {
  Query: {
    getCustomFieldGroups: async function (_, {}, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const groups =
        await connection`SELECT * FROM pw_options WHERE option_name='custom_field_groups'`;
      if (groups.length === 0) {
        return JSON.stringify([]);
      }
      return groups[0].option_value;
    },

    getCustomFieldGroupById: async function (_, { groupId }, { connection, isAuth }) {
      const groupsData =
        await connection`SELECT * FROM pw_options WHERE option_name='custom_field_groups'`;
      if (groupsData.length === 0) {
        return JSON.stringify([]);
      }
      const groups = JSON.parse(groupsData[0].option_value);
      const group = groups.find((group) => group.id === groupId);
      return JSON.stringify(group || {});
    },

    getCustomFieldGroupsWhereMatch: async function (
      _,
      { type, equal, target },
      { connection, isAuth },
    ) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const groupsData =
        await connection`SELECT * FROM pw_options WHERE option_name='custom_field_groups'`;
      if (groupsData.length === 0) {
        return '';
      }
      const groups = JSON.parse(groupsData[0].option_value);
      const matchedGroups = groups.filter((group) =>
        group.rules.some(
          (rule) => rule.field === type && rule.equal === equal && rule.target === target,
        ),
      );
      return JSON.stringify(matchedGroups);
    },

    getPostCustomFieldData: async function (_, { postId }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      const result = await connection`
        SELECT meta_value FROM pw_postmeta
        WHERE post_id = ${postId} AND meta_key = 'custom_fields'
      `;
      if (result.length === 0) {
        return '[]';
      }
      try {
        return JSON.parse(result[0].meta_value);
      } catch {
        return '[]';
      }
    },

    getField: async function (_, { postId, name, formatValue, escapeHtml }, { connection }) {
      const dbData =
        await connection`SELECT * FROM pw_postmeta WHERE meta_key='custom_fields' AND post_id=${postId}`;
      if (dbData.length === 0) return '';

      let parsed;
      try {
        parsed = JSON.parse(JSON.parse(dbData[0].meta_value));
      } catch (e) {
        console.warn('Invalid JSON in meta_value:', e);
        return '';
      }

      let fieldValue = null;
      let groupId = null;
      for (const group of parsed) {
        if (!group.fields) continue;
        if (name in group.fields) {
          fieldValue = group.fields[name];
          groupId = group.group_id;
          break;
        }
      }
      if (fieldValue === null) return '';

      const groupDbData =
        await connection`SELECT * FROM pw_options WHERE option_name='custom_field_groups'`;
      if (groupDbData.length === 0) return '';

      let parsedGroups;
      try {
        parsedGroups = JSON.parse(groupDbData[0].option_value);
      } catch (e) {
        console.warn('Invalid JSON in meta_value:', e);
        return '';
      }

      let fieldType = null;
      let fieldData = null;
      for (const group of parsedGroups) {
        if (group.id === groupId && Array.isArray(group.fields)) {
          const fieldDef = group.fields.find((f) => f.name === name);
          if (fieldDef) {
            fieldType = fieldDef.type;
            fieldData = fieldDef;
            break;
          }
        }
      }

      if (formatValue) {
        return CustomFields.formatValue(fieldValue, fieldType, fieldData, connection);
      }

      return JSON.stringify(fieldValue);
    },
    getFields: async function (_, { postId, formatValue, escapeHtml }, { connection, loaders }) {
      const dbData =
        await connection`SELECT * FROM pw_postmeta WHERE meta_key='custom_fields' AND post_id=${postId}`;
      if (dbData.length === 0) return {};

      let parsed;
      try {
        parsed = JSON.parse(JSON.parse(dbData[0].meta_value));
      } catch (e) {
        console.warn('Invalid JSON in meta_value:', e);
        return '';
      }

      const groupDbData =
        await connection`SELECT * FROM pw_options WHERE option_name='custom_field_groups'`;
      if (groupDbData.length === 0) return '';

      let parsedGroups;
      try {
        parsedGroups = JSON.parse(groupDbData[0].option_value);
      } catch (e) {
        console.warn('Invalid JSON in meta_value:', e);
        return '';
      }

      const results = [];

      for (const group of parsed) {
        const groupId = group.group_id;
        for (const pGroup of parsedGroups) {
          if (pGroup.id === groupId && Array.isArray(pGroup.fields)) {
            for (const [fieldName, fieldValue] of Object.entries(group.fields)) {
              const fieldDef = pGroup.fields.find((f) => f.name === fieldName);

              if (fieldDef) {
                const fieldType = fieldDef.type;
                const fieldData = fieldDef;

                if (
                  fieldType == 'image' ||
                  fieldType == 'file' ||
                  fieldType == 'relationship' ||
                  fieldType == 'link' ||
                  fieldType == 'post' ||
                  fieldType == 'page_link'
                ) {
                  const data = await CustomFields.formatValue(
                    fieldValue,
                    fieldType,
                    fieldData,
                    connection,
                    loaders,
                  );
                  results.push({ name: fieldName, value: fieldValue, ...fieldDef, data: data });
                } else {
                  results.push({ name: fieldName, value: fieldValue, ...fieldDef });
                }
              }
            }
          }
        }
      }
      return JSON.stringify(results);
    },
  },

  Mutation: {
    updateCustomFieldGroups: async function (_, { groups }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      let parsedData;
      try {
        parsedData = JSON.parse(groups);
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Invalid JSON format' };
      }

      if (!Array.isArray(parsedData)) {
        return { success: false, error: 'Expected an array of custom field groups' };
      }

      try {
        const result = await connection`
          UPDATE pw_options
          SET option_value = ${JSON.stringify(parsedData)}
          WHERE option_name = 'custom_field_groups'
        `;
        return { success: result.count === 1 };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Database update failed' };
      }
    },

    updateCustomFieldGroupsStatus: async function (_, { id, status }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      try {
        const groupsData = await connection`
          SELECT * FROM pw_options WHERE option_name = 'custom_field_groups'
        `;

        if (!groupsData.length) {
          return { success: false, message: 'No custom field groups found' };
        }

        let groups;
        try {
          groups = JSON.parse(groupsData[0].option_value);
          if (!Array.isArray(groups)) throw new Error();
        } catch (err) {
          await System.writeLogData(err.stack || String(err), 'backend');
          return { success: false, message: 'Invalid groups data' };
        }

        const groupIndex = groups.findIndex((g) => g.id == id);
        if (groupIndex === -1) {
          return { success: false, message: 'Group not found' };
        }

        const validStatuses = ['active', 'inactive'];
        if (!validStatuses.includes(status)) {
          return { success: false, message: 'Invalid status' };
        }

        groups[groupIndex].status = status;

        const result = await connection`
          UPDATE pw_options
          SET option_value = ${JSON.stringify(groups)}
          WHERE option_name = 'custom_field_groups'
        `;

        return { success: result.count === 1 };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, message: 'Failed to update group status' };
      }
    },

    updatePostCustomFieldData: async function (_, { data, postId }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (typeof postId !== 'number') {
        const error = new Error('Invalid or missing postId');
        error.code = 400;
        throw error;
      }

      let parsedData;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Invalid JSON format for custom field data' };
      }
      try {
        const result = await connection`
        INSERT INTO pw_postmeta (post_id, meta_key, meta_value)
        VALUES (${postId}, 'custom_fields', ${JSON.stringify(data)})
        ON CONFLICT (post_id, meta_key)
        DO UPDATE SET meta_value = EXCLUDED.meta_value
      `;
        return { success: result.count === 1 };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        return { success: false, error: 'Failed to update custom field data' };
      }
    },
  },
};
