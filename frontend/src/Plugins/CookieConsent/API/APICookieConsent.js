import { graphqlUrl } from '@/config';

export const APIGetCookieConsentSettings = async () => {
  const query = `query { getCookieConsentSettings }`;
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

export const APISaveCookieConsentSettings = async (loginPassword, objectData) => {
  const query = `mutation { updateCookieConsentSettings(data: ${JSON.stringify(
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
