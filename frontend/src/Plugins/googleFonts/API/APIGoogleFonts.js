import { graphqlUrl } from '@/config';

export const APIGetGoogleFonts = async () => {
  const query = `query { getGoogleFonts }`;
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

export const APIDownloadGoogleFont = async (loginPassword, font) => {
  const query = `mutation { downloadGoogleFont(font: ${JSON.stringify(
    JSON.stringify(font),
  )}){ success } }`;
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
