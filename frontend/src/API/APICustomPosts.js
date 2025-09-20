import { graphqlUrl } from '../config';

export const APIGetCustomPosts = async (loginPassword) => {
  const query = `query {getCustomPosts }`;
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

export const APIGetCustomPostById = async (postId, loginPassword) => {
  const query = `query {getCustomPostById(postId: \"${postId}\") }`;
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

export const APIGetCustomPostBySlug = async (slug, loginPassword) => {
  const query = `query {getCustomPostBySlug(slug: \"${slug}\") }`;
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

export const APIGetCustomPostsWhereMatch = async (type, equal, target, loginPassword) => {
  const query = `query {getCustomPostsWhereMatch(type: \"${type}\", equal: \"${equal}\", target: \"${target}\") }`;
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

// export const APIGetPostCustomPostData = async (postId, loginPassword) => {
//   const query = `query {getPostCustomPostData(postId: ${postId}) }`;
//   const url = `${graphqlUrl}graphql`;
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${loginPassword}`,
//     },
//     body: JSON.stringify({ query: query }),
//   });

//   const data = await response.json();
//   return {
//     status: response.status,
//     data: data.data,
//   };
// };

export const APIUpdateCustomPosts = async (posts, loginPassword) => {
  const query = `mutation {updateCustomPosts(posts: ${JSON.stringify(
    JSON.stringify(posts),
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

export const APIUpdateCustomPostStatus = async (loginPassword, status, id) => {
  const query = `mutation {updateCustomPostStatus(id: \"${id}\", status: \"${status}\") { success error } }`;
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
