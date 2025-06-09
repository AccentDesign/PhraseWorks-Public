export const APIGetLoginToken = async (email, password, graphQlUrl) => {
  const Query = `query { login(email: \"${email}\", password: \"${password}\") { token refreshToken userId user { id user_login user_nicename user_email user_registered user_status display_name first_name last_name } } }`;
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

export const APIGetRefreshFromToken = async (refreshToken, graphQlUrl) => {
  console.log('hitting it...');
  const Query = `query { 
    refresh(refreshToken: \"${refreshToken}\") { 
      token refreshToken userId user { id user_login user_nicename user_email user_registered user_status display_name first_name last_name } } }`;
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
  console.log(data);
  if (response.status == 200) {
    return {
      status: 200, //response.status,
      data: data.data,
    };
  } else if (response.status == 500) {
    return { status: 401, data: { error: 'Invalid Token' } };
  } else {
    return {
      status: 403, //response.status,
      data: { error: 'Invalid Token' },
    };
  }
};

// export const APIGetCustomerMetaData = async (apiBase, loginPassword, userId) => {
//   const query = `query { getCustomerMetaData(userId: ${userId}) { firstName lastName companyName companyWebsite jobTitle email address1 address2 address3 postcode telephone mobileTelephone } }`;
//   const url = `${apiBase}graphql`;
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

// export const APIUpdateUserMetaData = async (apiBase, loginPassword, userId, submitData) => {
//   const query = `mutation { updateCustomerMetaData(input: {userId: ${userId}, submitData: \"${JSON.stringify(
//     submitData,
//   ).replace(/"/g, '\\"')}\"}) { success } }`;
//   const url = `${apiBase}graphql`;
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

// export const APICreateAccount = async (apiBase, submitData) => {
//   const query = `mutation { createCustomerAccount(input: {submitData: \"${JSON.stringify(
//     submitData,
//   ).replace(/"/g, '\\"')}\"}) { success } }`;
//   const url = `${apiBase}graphql`;
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ query: query }),
//   });
//   const data = await response.json();
//   return {
//     status: response.status,
//     data: data.data,
//   };
// };

export const APIForgottenPassword = async (apiBase, email) => {
  const query = `mutation { forgottenPassword(input: { email: \"${email}\"}) { success } }`;
  const url = `${apiBase}graphql`;
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

export const APIResetPassword = async (apiBase, token, password) => {
  const query = `mutation { resetPassword(input: { token: \"${token}\", password: \"${password}\"}) { success } }`;
  const url = `${apiBase}graphql`;
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
