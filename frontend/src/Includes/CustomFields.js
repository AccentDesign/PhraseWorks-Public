import { APIGetCustomField, APIGetCustomFields } from '../API/APICustomFields';

export const get_field = async (postId, name, formatValue, escapeHtml) => {
  const data = await APIGetCustomField(postId, name, formatValue, escapeHtml);
  if (data.status == 200) {
    return data.data?.getField;
  }
  return null;
};

export const get_fields = async (postId) => {
  const data = await APIGetCustomFields(postId);

  if (data.status == 200) {
    if (data?.data?.getFields) {
      return data.data.getFields;
    } else {
      return null;
    }
  }
  return null;
};
