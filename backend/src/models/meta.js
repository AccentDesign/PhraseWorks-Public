export default class Meta {
  constructor() {}
  static async getOptionsMetaEntry(sql, name) {
    const entry = await sql`SELECT * FROM pw_options WHERE option_name=${name}`;
    if (entry.length == 0) return null;
    return entry[0];
  }

  static async updateOptionsMetaEntry(sql, name, value) {
    const entry = await Meta.getOptionsMetaEntry(sql, name);
    let success = false;
    if (entry == null) {
      // We need to create our first entry
      const save =
        await sql`INSERT INTO pw_options(option_name, option_value) VALUES (${name}, ${value})`;
      if (save.count && save.count > 0) {
        success = true;
      } else {
        success = false;
      }
    } else {
      // We need to update the entry
      const save = await sql`
        UPDATE pw_options
        SET option_value = ${value}
        WHERE option_id = ${entry.option_id}
      `;
      if (save.count && save.count > 0) {
        success = true;
      } else {
        success = false;
      }
    }
    return success;
  }

  static async getPostMetaEntry(sql, name, postId) {
    const entry = await sql`SELECT * FROM pw_postmeta WHERE post_id=${postId} AND meta_key=${name}`;
    if (entry.length == 0) return null;
    return entry[0];
  }

  static async updatePostMetaEntry(sql, name, postId, value, singleOnly) {
    const entry = await Meta.getPostMetaEntry(sql, name, postId);
    let success = false;

    if (singleOnly) {
      if (entry == null) {
        const save =
          await sql`INSERT INTO pw_postmeta(post_id, meta_key, meta_value) VALUES (${postId}, ${name}, ${value})`;
        if (save.count && save.count > 0) {
          success = true;
        } else {
          success = false;
        }
      } else {
        const save = await sql`
          UPDATE pw_postmeta
          SET meta_value = ${value}
          WHERE meta_id = ${entry.meta_id}
        `;
        if (save.count && save.count > 0) {
          success = true;
        } else {
          success = false;
        }
      }
    } else {
      const save =
        await sql`INSERT INTO pw_postmeta(post_id, meta_key, meta_value) VALUES (${postId}, ${name}, ${value})`;
      if (save.count && save.count > 0) {
        success = true;
      } else {
        success = false;
      }
    }
    return success;
  }
}
