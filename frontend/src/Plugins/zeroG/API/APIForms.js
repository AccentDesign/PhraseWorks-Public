import { graphqlUrl } from '../../../config';

const escapeForGraphQL = (str) =>
  str?.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

export const APIGetGForms = async (loginPassword) => {
  const query = `query { getGForms { forms {id status title slug entries views conversion fields { fields { type label id defaultValue description required } total } } total } }`;
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

export const APIGetGForm = async (id) => {
  const query = `query { getGForm(id: ${id}) { id status title description slug entries notifications confirmations views conversion fields { fields { type label id defaultValue addressFields { street_address address_line_2 city county postcode country street_addressLabel address_line_2Label cityLabel countyLabel postcodeLabel countryLabel } content dateFormat description required choices { id value } conditionals { id fieldId field finder value choice } conditionalsEnabled conditionalsShow conditionalsMatch } total } } }`;
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

export const APIGetFormConfirmations = async (id) => {
  const query = `query {getGFormConfirmations(id: ${id}) }`;
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

export const APIGetFormConfirmation = async (id, formId) => {
  const query = `query {getGFormConfirmation(id: \"${id}\", formId: ${formId}) }`;
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

export const APIGetFormNotifications = async (id) => {
  const query = `query {getGFormNotifications(id: ${id}) }`;
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

export const APIGetFormNotification = async (id, formId) => {
  const query = `query {getGFormNotification(id: \"${id}\", formId: ${formId}) }`;
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

export const APIAddGForm = async (loginPassword, title, formData) => {
  const query = `mutation { addGForm(title: \"${title}\", data: ${JSON.stringify(
    JSON.stringify(formData),
  )}) { success post_id } }`;
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

export const APIUpdateGForm = async (loginPassword, id, title, description, formData) => {
  const query = `mutation { updateGForm(id: ${id}, title: \"${title}\", description: \"${description}\" data: ${JSON.stringify(
    JSON.stringify(formData),
  )}) { success post_id } }`;
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

export const APIUpdateGFormActive = async (loginPassword, id, active) => {
  const query = `mutation { updateGFormActive(id: ${id}, active: ${active}) { success post_id } }`;
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

export const APIAddEntryGForm = async (id, postId, values) => {
  const query = `mutation { addEntryGForm(id: ${id}, postId: ${postId}, values: ${JSON.stringify(
    JSON.stringify(values),
  )}) { success } }`;
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

export const APIGetEntries = async (loginPassword, page, perPage, id) => {
  const query = `query { getEntriesGform(page: ${page}, perPage: ${perPage}, formId: ${id}){ entries { id form_id post_id date_created date_updated data } total } }`;
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

export const APIGetEntry = async (loginPassword, id) => {
  const query = `query { getEntryGform(id: ${id}){ id form_id post_id date_created date_updated data form_title } }`;
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

export const APIDeleteEntriesGForm = async (loginPassword, ids) => {
  const query = `mutation { deleteEntriesGForm(ids: [${ids}]) { success } }`;
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

export const APIAllGetPages = async (loginPassword, page, perPage, type) => {
  const query = `query {getPosts(page: ${page}, perPage: ${perPage}, type: \"page\", include_trash: 0) { posts { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } } total } }`;
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

export const APIAddConfirmationGForm = async (
  loginPassword,
  id,
  confirmationName,
  confirmationType,
  message,
  page,
  redirectUrl,
  passData,
) => {
  const query = `mutation { addGFormConfirmation(id: ${id}, confirmationName:\"${confirmationName}\", confirmationType:\"${confirmationType}\", message:\"${escapeForGraphQL(
    message,
  )}\", page:${page}, redirectUrl:\"${redirectUrl}\", passData:\"${passData}\" ) { success } }`;
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

export const APIUpdateConfirmationGForm = async (
  loginPassword,
  confirmationId,
  id,
  confirmationName,
  confirmationType,
  message,
  page,
  redirectUrl,
  passData,
) => {
  const query = `mutation { updateGFormConfirmation(id: \"${confirmationId}\", formId: ${id}, confirmationName:\"${confirmationName}\", confirmationType:\"${confirmationType}\", message:\"${escapeForGraphQL(
    message,
  )}\", page:${page}, redirectUrl:\"${redirectUrl}\", passData:\"${passData}\" ) { success } }`;
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

export const APIDeleteFormConfirmation = async (loginPassword, confId, id) => {
  const query = `mutation { deleteGFormConfirmation(id: \"${confId}\", formId: ${id}) { success } }`;
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

export const APIAddNotificationGForm = async (
  loginPassword,
  id,
  notificationName,
  notificationSendTo,
  sendToEmail,
  emailFieldId,
  fromName,
  fromEmail,
  replyTo,
  bcc,
  subject,
  message,
) => {
  const query = `mutation { addGFormNotification(id: ${id}, 
      notificationName:\"${notificationName}\", 
      notificationSendTo:\"${notificationSendTo}\", 
      sendToEmail:\"${sendToEmail}\", 
      emailFieldId:\"${emailFieldId}\", 
      fromName:\"${fromName}\", 
      fromEmail:\"${fromEmail}\" 
      replyTo:\"${replyTo}\", 
      bcc:\"${bcc}\" 
      subject:\"${subject}\", 
      message:"""${message}""" 
  ) { success } }`;
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

export const APIUpdateNotificationGForm = async (
  loginPassword,
  notificationId,
  id,
  notificationName,
  notificationSendTo,
  sendToEmail,
  emailFieldId,
  fromName,
  fromEmail,
  replyTo,
  bcc,
  subject,
  message,
) => {
  const query = `mutation { updateGFormNotification(id: \"${notificationId}\", formId: ${id}, 
      notificationName:\"${notificationName}\", 
      notificationSendTo:\"${notificationSendTo}\", 
      sendToEmail:\"${sendToEmail}\", 
      emailFieldId:\"${emailFieldId}\", 
      fromName:\"${fromName}\", 
      fromEmail:\"${fromEmail}\" 
      replyTo:\"${replyTo}\", 
      bcc:\"${bcc}\" 
      subject:\"${subject}\", 
      message:"""${message}""" 
  ) { success } }`;
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

export const APIDeleteFormNotification = async (loginPassword, confId, id) => {
  const query = `mutation { deleteGFormNotification(id: \"${confId}\", formId: ${id}) { success } }`;
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

export const APIGetTotalEntries = async (loginPassword, id) => {
  const query = `query { getTotalEntriesGform(formId: ${id}) }`;
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

export const APIAddFormView = async (id) => {
  const query = `mutation { addGFormView(formId: ${id}) { success } }`;
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

export const APIGetFormViews = async (loginPassword, id) => {
  const query = `query { getGFormViews(formId: ${id}) }`;
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

export const APIDeleteGForm = async (loginPassword, id) => {
  const query = `mutation { deleteGForm(formId: ${id}) { success } }`;
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
