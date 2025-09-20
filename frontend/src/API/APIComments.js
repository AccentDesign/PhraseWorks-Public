import { graphqlUrl } from '../config';

export const APIGetAdminComments = async (loginPassword, page, perPage) => {
  const query = `query { getAllAdminComments(page: ${page}, perPage: ${perPage}) { comments { comment_id comment_post_id comment_author_name comment_date comment_content comment_parent user_id user { id user_email first_name last_name display_name} post { id post_name post_title }} totalComments } }`;
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

export const APIGetCommentsByAuthor = async (loginPassword, page, perPage, userId) => {
  const query = `query { getAllAdminCommentsByAuthor(page: ${page}, perPage: ${perPage}, userId: ${userId}) { comments { comment_id comment_post_id comment_author_name comment_date comment_content comment_parent user_id user { id user_email first_name last_name display_name} post { id post_name post_title }} totalComments } }`;
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

export const APIDeleteCommentById = async (loginPassword, id) => {
  const query = `mutation { deleteCommentById(id: ${id}){ success } }`;
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
