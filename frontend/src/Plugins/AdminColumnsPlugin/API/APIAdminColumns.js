import { graphqlUrl } from '@/config';

export const APIGetAdminColumns = async () => {
  const query = `query { getAdminColumns { id postType fields { name title order } } }`;
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

export const APIGetAdminColumn = async (id) => {
  const query = `query { getAdminColumn(id: \"${id}\") { id postType fields { name title order } } }`;
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

export const APIGetPostTypes = async () => {
  const query = `query { getPostTypes }`;
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

export const APIDeleteAdminColumnsEntries = async (loginPassword, indexes) => {
  const query = `mutation { deleteAdminColumnEntries(indexes: ${JSON.stringify(
    JSON.stringify(indexes),
  )}) { success }}`;
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

export const APIUpdateAdminColumnsEntries = async (loginPassword, objectData) => {
  const query = `mutation { updateAdminColumnsEntries(data: ${JSON.stringify(
    JSON.stringify(objectData),
  )}) { success }}`;
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
