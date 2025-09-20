import { graphqlUrl } from '../config';

export const APIGetLoginToken = async (email, password, graphQlUrl) => {
  const Query = `query { login(email: \"${email}\", password: \"${password}\") { token refreshToken userId user { id user_login user_nicename user_email user_registered user_status display_name first_name last_name user_role { role id } } } }`;
  const formData = {};
  formData.query = Query;
  const url = `${graphQlUrl}graphql`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (response.status == 200) {
    return {
      status: 200, //response.status,
      data: data.data,
    };
  } else if (response.status == 500) {
    return { status: 401, data: { error: 'Invalid Password' } };
  } else {
    return {
      status: 403, //response.status,
      data: { error: 'Invalid Password' },
    };
  }
};

export const APIGetRefreshFromToken = async (refreshToken, userId, graphQlUrl) => {
  const Query = `query { 
    refresh(refreshToken: \"${refreshToken}\", userId: ${userId}) { 
      token refreshToken refreshTokenExpiry userId user { id user_login user_nicename user_email user_registered user_status display_name first_name last_name } } }`;
  const formData = {};
  formData.query = Query;
  formData.operation = 'refresh';
  const url = `${graphQlUrl}graphql`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (response.status == 200) {
    return {
      status: 200,
      data: data.data,
    };
  } else if (response.status == 500) {
    return { status: 401, data: { error: 'Invalid Token' } };
  } else {
    return {
      status: 403,
      data: { error: 'Invalid Token' },
    };
  }
};

export const APIForgottenPassword = async (email) => {
  const query = `mutation { forgottenPassword( email: \"${email}\") { success } }`;
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

export const APIResetPassword = async (token, password) => {
  const query = `mutation { resetPassword(token: \"${token}\", password: \"${password}\") { success } }`;
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
