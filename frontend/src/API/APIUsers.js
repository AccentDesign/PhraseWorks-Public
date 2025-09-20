import { graphqlUrl } from '../config';
export const APICreateFirstUser = async () => {
  const query = `query {createFirstUser { success error } }`;
  const url = `${graphqlUrl}api/v1/test`;
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
    data: data,
  };
};

export const APIGetUserRoles = async (loginPassword) => {
  const query = `query {getUserRoles { roles { id role } } }`;
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

export const APIAllGetUsers = async (loginPassword, page, perPage) => {
  const query = `query {getUsers(page: ${page}, perPage: ${perPage}) { users { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name user_role { id role } post_count } total } }`;
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

export const APIGetUserBy = async (field, value) => {
  const query = `query {getUserBy(field: \"${field}\", value: \"${value}\") { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name user_role { id role } post_count } }`;
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

export const APIUpdateUser = async (
  loginPassword,
  user_nicename,
  first_name,
  last_name,
  user_email,
  user_password,
  role_id,
  userId,
) => {
  const query = `mutation {updateUser(user_nicename: \"${user_nicename}\", first_name: \"${first_name}\", last_name: \"${last_name}\", user_email: \"${user_email}\", user_password: """${user_password}""", roleId: ${role_id}, userId: ${userId}) { success error } }`;
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

export const APICreateUser = async (
  display_name,
  first_name,
  last_name,
  user_email,
  user_password,
  role_id,
) => {
  const query = `mutation { createUser(display_name: \"${display_name}\", first_name: \"${first_name}\", last_name: \"${last_name}\", user_email: \"${user_email}\", user_password: """${user_password}""", roleId: ${role_id} ) { success error } }`;
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

export const APICreateNewPassword = async (password, userLogin, key) => {
  const query = `mutation { createNewPassword(password: \"${password}\", userLogin: \"${userLogin}\", key: \"${key}\") { success error } }`;
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

export const APIPasswordResetAdmin = async (loginPassword, userId) => {
  const query = `mutation { passwordResetAdmin(userId: ${userId}) { success error } }`;
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

export const APIGetAuthors = async () => {
  const query = `query{getAuthors { users { id user_login user_nicename display_name first_name last_name post_count } total } }`;
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

export const APIGetAuthor = async (id) => {
  const query = `query { getAuthor(id: ${id}) { id user_login user_nicename display_name first_name last_name post_count } }`;
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
export const APIDeleteUser = async (loginPassword, id) => {
  const query = `mutation {deleteUser(userId: ${id}) { success error } }`;
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

export const APICreateUserNew = async (email, firstName, lastName, displayName, password) => {
  const query = `mutation {
    userCreate(input: { 
      email: \"${email}\", 
      first_name: \"${firstName}\", 
      last_name: \"${lastName}\", 
      display_name: \"${displayName}\"
      password: \"${password}\"
    }) { success error } }`;
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
