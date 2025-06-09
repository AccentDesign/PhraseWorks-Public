import { graphqlUrl } from '../config';

export const APISendUploadOld = async (loginPassword, file) => {
  const formData = new FormData();
  formData.append('file', file);

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

export const APIGetFile = async (key) => {
  const url = `${graphqlUrl}api/v1/files/${encodeURIComponent(key)}`;
  console.log(url);
  const response = await fetch(url, {
    method: 'GET',
  });
  console.log(response);

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  return response.blob();
};

export const APIGetFiles = async (loginPassword, offset, type, search) => {
  const query = `query {getMediaFiles(offset: ${offset}, type: \"${type}\", search: \"${search}\") { files { id filename mimetype encoding url date attachment_metadata author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } } total } }`;
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

export const APIGetFileById = async (loginPassword, id) => {
  const query = `query {getMediaFileById(id: ${id}) { id filename mimetype encoding url date attachment_metadata author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } } }`;
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

export const APIGetFilesR2List = async () => {
  const url = `${graphqlUrl}api/v1/files/list`;
  console.log(url);
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
