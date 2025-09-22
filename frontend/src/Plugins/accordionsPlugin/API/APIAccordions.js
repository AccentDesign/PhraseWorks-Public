import { graphqlUrl } from '../../../config';

const escapeForGraphQL = (str) =>
  str?.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

export const APIGetAccordions = async (loginPassword) => {
  const query = `query { getAccordions { accordions { id status title fields { fields { id title content } } }  total } }`;
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

export const APIGetAccordion = async (id) => {
  const query = `query { getAccordion(id: ${id}) { id status title fields { fields { id title content } } }}`;
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

export const APIAddAccordion = async (loginPassword, title, fields) => {
  const query = `mutation { addAccordion(title: \"${title}\", data: ${JSON.stringify(
    JSON.stringify(fields),
  )}){ success post_id } }`;
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

export const APIUpdateAccordion = async (loginPassword, id, title, fields) => {
  const query = `mutation { updateAccordion(id: ${id}, title: \"${title}\", data: ${JSON.stringify(
    JSON.stringify(fields),
  )}){ success post_id } }`;
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

export const APIUpdateAccordionActive = async (loginPassword, id, active) => {
  const query = `mutation { updateAccordionActive(id: ${id}, active: ${active}){ success } }`;
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

export const APIDeleteAccordion = async (loginPassword, id) => {
  const query = `mutation { deleteAccordion(id: ${id}){ success } }`;
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
