import { graphqlUrl } from '../../../config';

export const APIGetS3UploadPluginOptions = async (loginPassword) => {
  const query = `query { getS3UploadPluginOptions }`;
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

export const APIUpdateS3UploadPluginOptions = async (
  loginPassword,
  bucketName,
  endpoint,
  accessKeyId,
  secretAccessKey,
) => {
  const query = `mutation { updateS3UploadPluginOptions(bucketName: \"${bucketName}\", endpoint: \"${endpoint}\", accessKeyId: \"${accessKeyId}\", secretAccessKey: \"${secretAccessKey}\") { success error} }`;
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
