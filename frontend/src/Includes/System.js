import { APIGetMenuByName, APIGetSiteTitle, APIGetTheme } from '../API/APISystem';

export const get_site_title = async () => {
  const data = await APIGetSiteTitle();
  if (data.status == 200) {
    return data.data.getSiteTitle;
  }
  return null;
};

export const get_site_url = () => {
  return window.location.origin.replace('5173', '');
};

export const get_url = () => {
  return window.location.href.replace(':5173', '');
};

export const get_menu_by_name = async (name) => {
  const data = await APIGetMenuByName(name);
  if (data.status == 200) {
    return data.data.getMenuByName;
  }
  return null;
};

export const get_theme = async () => {
  const data = await APIGetTheme();
  if (data.status == 200) {
    return data.data.getTheme;
  }
  return null;
};
