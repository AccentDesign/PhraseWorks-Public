import { graphqlUrl } from '../config';
import { handleError } from '../Utils/ErrorHandler';

export const APISendUpload = async (loginPassword, files) => {
  const formData = new FormData();

  for (const file of files) {
    formData.append('files', file); // note: 'files' key used for multiple
  }

  const response = await fetch(`${graphqlUrl}api/v1/files/upload`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${loginPassword}`,
    },
    body: formData,
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data,
  };
};

export const APIUploadFile = async (loginPassword, file) => {
  const query = `
    mutation UploadFile($file: Upload!) {
      uploadFile(file: $file) {
        success
      }
    }
  `;
  const url = `${graphqlUrl}graphql`;

  const formData = new FormData();
  formData.append('operations', JSON.stringify({ query, variables: { file: null } }));
  formData.append('map', JSON.stringify({ 0: ['variables.file'] }));
  formData.append('0', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${loginPassword}`,
      },
      body: formData,
    });

    const data = await response.json();
    return {
      status: response.status,
      data: data.data,
      errors: data.errors || null,
    };
  } catch (error) {
    await handleError(error, 'APIMedia.APIUploadFile');
    return {
      status: 500,
      errors: [{ message: error.message }],
    };
  }
};

export const APIReplaceFile = async (loginPassword, id, file) => {
  const query = `
    mutation ReplaceFile($id: Int!, $file: Upload) {
      replaceFile(id: $id, file: $file) {
        success
      }
    }
  `;

  const url = `${graphqlUrl}graphql`;

  const formData = new FormData();
  formData.append('operations', JSON.stringify({ query, variables: { id, file: null } }));
  formData.append('map', JSON.stringify({ 0: ['variables.file'] }));
  formData.append('0', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${loginPassword}`,
      },
      body: formData,
    });

    const data = await response.json();
    return {
      status: response.status,
      data: data.data,
      errors: data.errors || null,
    };
  } catch (error) {
    await handleError(error, 'APIMedia.APIReplaceFile');
    return {
      status: 500,
      errors: [{ message: error.message }],
    };
  }
};

export const APIReplaceFileWithSetting = async (loginPassword, id, file, setting) => {
  const query = `
    mutation ReplaceFileWithSetting($id: Int!, $file: Upload, $setting: String!) {
      replaceFileWithSetting(id: $id, file: $file, setting: $setting) {
        success
      }
    }
  `;

  const url = `${graphqlUrl}graphql`;

  const formData = new FormData();
  formData.append('operations', JSON.stringify({ query, variables: { id, file: null, setting } }));
  formData.append('map', JSON.stringify({ 0: ['variables.file'] }));
  formData.append('0', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${loginPassword}`,
      },
      body: formData,
    });

    const data = await response.json();
    return {
      status: response.status,
      data: data.data,
      errors: data.errors || null,
    };
  } catch (error) {
    await handleError(error, 'APIMedia.APIReplaceFileWithSetting');
    return {
      status: 500,
      errors: [{ message: error.message }],
    };
  }
};

export const APIDeleteFile = async (loginPassword, filepath) => {
  const query = `mutation {deleteFile(filepath: \"${filepath}\") { success } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });
  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIGetFile = async (key) => {
  const url = `${graphqlUrl}uploads/${key}`;
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  return response.blob();
};

export const APIGetFiles = async (loginPassword, offset, type, search) => {
  const query = `query {getMediaFiles(offset: ${offset}, type: \"${type}\", search: \"${search}\") { files { id filename mimetype encoding url date attachment_metadata metadata author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } } total } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIGetFileById = async (id) => {
  const query = `query {getMediaFileById(id: ${id}) { id filename mimetype encoding url date attachment_metadata author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIGetFilesR2List = async () => {
  const url = `${graphqlUrl}api/v1/files/list`;
  const response = await fetch(url, {
    method: 'GET',
  });
  const data = await response.json();
  return {
    status: response.status,
    data: data,
  };
};

export const APIDeleteFiles = async (loginPassword, ids) => {
  const query = `mutation {deleteFiles(ids: ${JSON.stringify(ids)}) { success error } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIGetMediaSettings = async (loginPassword) => {
  const query = `query {getMediaSettings { settings } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIUpdateMediaSettings = async (loginPassword, settings) => {
  const query = `mutation {updateMediaSettings(data: ${JSON.stringify(
    settings,
  )}) { success error } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIFetchMediaItemData = async (fileId) => {
  const query = `query {getMediaItemData(fileId: ${fileId}) }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIUpdateMediaItemData = async (loginPassword, fileId, fileData) => {
  const query = `mutation {updateMediaItemData(fileId: ${fileId}, data: ${fileData}) { success error } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};
