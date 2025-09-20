import { APIGetPluginComponentsByPage } from '../../API/APISystem';

export const get_plugin_page_components = async (loginPassword, page) => {
  const data = await APIGetPluginComponentsByPage(loginPassword, page);
  if (data.status == 200) {
    return JSON.parse(data.data.getPluginPageComponents);
  }
  return [];
};
