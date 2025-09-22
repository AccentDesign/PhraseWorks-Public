export class ZeroGUtils {
  constructor() {}
  static generateSlug(title) {
    return title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-'); // Replace multiple - with single -
  }

  static async getTotalEntries(connection, formId) {
    const result = await connection`
    SELECT COUNT(*) AS total
    FROM pw_zg_entry e
    WHERE e.form_id = ${formId}
  `;
    return Number(result[0].total);
  }

  static async getViews(connection, formId) {
    const result = await connection`
    SELECT views FROM pw_zg_formmeta
    WHERE form_id = ${formId}
  `;
    return result[0]?.views || 0;
  }

  static async get_form(connection, id) {
    const data = await connection`
    SELECT 
      f.id, f.title, f.description, f.data, f.active, f.trash,
      fm.confirmations, fm.notifications
    FROM pw_zg_forms f
    LEFT JOIN pw_zg_formmeta fm ON f.id = fm.form_id
    WHERE f.id = ${id}
  `;

    if (data.length === 0) {
      throw new Error(`Form with ID ${id} not found.`);
    }

    const row = data[0];

    // Parse the JSON string to get fields
    let parsedFields = [];
    try {
      parsedFields = JSON.parse(row.data || '[]');
    } catch (err) {
      console.error('Error parsing fields JSON:', err);
    }
    const views = 0;
    const entries = 0;

    const form = {
      id: row.id,
      title: row.title,
      description: row.description,
      slug: row.title.toLowerCase().replace(/\s+/g, '-'),
      entries: entries,
      views: views,
      conversion: views === 0 ? 0 : (entries / views) * 100,
      confirmations: row.confirmations,
      notifications: row.notifications,
      fields: {
        fields: parsedFields.map((f, idx) => ({
          id: `field_${idx}`,
          key: `field_${idx}`,
          type: f.type,
          label: f.label,
          description: f.description,
          required: f.required,
          defaultValue: f.defaultValue,
          content: f.content,
          dateFormat: f.dateFormat,
          addressFields: f.addressFields,
          choices: f.choices,
          conditionals: f.conditionals,
          conditionalsEnabled: f.conditionalsEnabled,
          conditionalsShow: f.conditionalsShow,
          conditionalsMatch: f.conditionalsMatch,
        })),
        total: parsedFields.length,
      },
      status: row.active ? 'active' : 'inactive',
    };
    return form;
  }
}
