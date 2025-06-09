import { APIGetMenuByName, APIGetSiteTitle } from '../API/APISystem';

export const get_site_title = async () => {
  const data = await APIGetSiteTitle();
  if (data.status == 200) {
    return data.data.getSiteTitle;
  }
  return null;
};

export const get_menu_by_name = async (name) => {
  const data = await APIGetMenuByName(name);
  if (data.status == 200) {
    return data.data.getMenuByName;
  }
  return null;
};
