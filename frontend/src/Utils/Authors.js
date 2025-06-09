import { APIGetAuthor } from '../API/APIUsers';

export const get_author = async (id) => {
  const data = await APIGetAuthor(id);
  if (data.status == 200) {
    return data.data.getAuthor;
  }
  return null;
};
