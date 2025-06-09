import { graphqlUrl } from '../config';
export const APIGetNavigationPostsAndPages = async () => {
  const query = `query {getPostsAndPagesNavigation { posts { id post_name post_type child_count }  total } }`;
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

export const APIAllGetPosts = async (loginPassword, page, perPage, type) => {
  const query = `query {getPosts(page: ${page}, perPage: ${perPage}, type: \"${type}\", include_trash: 1) { posts { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } } total } }`;
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

export const APIAllGetPostsByType = async (page, perPage, type) => {
  const query = `query {getPostsByType(page: ${page}, perPage: ${perPage}, type: \"${type}\") { posts { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } featured_image_id featured_image_metadata categories { term_id name slug description } } total } }`;
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

export const APIGetPosts = async (loginPassword, page, perPage, type) => {
  const query = `query {getPosts(page: ${page}, perPage: ${perPage}, type: \"${type}\", include_trash: 0) { posts { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } } total } }`;
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

export const APIGetPostsByStatus = async (loginPassword, page, perPage, type, filter) => {
  const query = `query {getPostsByStatus(page: ${page}, perPage: ${perPage}, type: \"${type}\", status: \"${filter}\") { posts { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } } total } }`;
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

export const APIGetPostsByAuthor = async (page, perPage, type, authorId) => {
  const query = `query {getPostsByAuthor(page: ${page}, perPage: ${perPage}, type: \"${type}\", author_id: ${authorId}) { posts { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } featured_image_id featured_image_metadata categories { term_id name slug description } } total } }`;
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

export const APIGetPostsByCategory = async (page, perPage, term_id) => {
  const query = `query {getPostsByCategory(page: ${page}, perPage: ${perPage}, term_id: ${term_id}) { posts { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } featured_image_id featured_image_metadata categories { term_id name slug description } } total } }`;
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

export const APIGetCategory = async (category) => {
  const query = `query {getCategory(slug: \"${category}\") { term_id name slug description } }`;
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

export const APIGetPostCategories = async (postId) => {
  const query = `query {getPostCategories(postId: ${postId}) { categories { term_id name slug description } } }`;
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

export const APIGetPostTags = async (postId) => {
  const query = `query {getPostTags(postId: ${postId}) { tags { term_id name slug description } } }`;
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

export const APIAddPostCategories = async (loginPassword, categories, postId) => {
  const cleanedCategories = categories.filter((cat) => cat != null); // removes null and undefined
  const serializedCategories = JSON.stringify(JSON.stringify(cleanedCategories));
  const query = `mutation {updatePostCategories(categories: ${serializedCategories}, postId: ${postId}) { success error } }`;
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

export const APIAddPostTags = async (loginPassword, tags, postId) => {
  const cleanedTags = tags.filter((cat) => cat != null); // removes null and undefined
  const serializedTags = JSON.stringify(JSON.stringify(cleanedTags));
  const query = `mutation {updatePostTags(tags: ${serializedTags}, postId: ${postId}) { success error } }`;
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

export const APISaveDraftNewPost = async (
  loginPassword,
  title,
  content,
  featuredImageId,
  categoriesSelectedIds,
  tagsSelectedIds,
) => {
  const categories = JSON.stringify(JSON.stringify(categoriesSelectedIds));
  const tags = JSON.stringify(JSON.stringify(tagsSelectedIds));
  const query = `mutation {createDraftNewPost(title: \"${title}\" content: """${content}""", featuredImageId: ${featuredImageId}, categories: ${categories}, tags: ${tags}) { success error post_id} }`;
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

export const APISavePublishNewPost = async (
  loginPassword,
  title,
  content,
  featuredImageId,
  categoriesSelectedIds,
  tagsSelectedIds,
) => {
  const categories = JSON.stringify(JSON.stringify(categoriesSelectedIds));
  const tags = JSON.stringify(JSON.stringify(tagsSelectedIds));
  const query = `mutation {createPublishNewPost(title: \"${title}\" content: """${content}""", featuredImageId: ${featuredImageId}, categories: ${categories}, tags: ${tags}) { success error post_id} }`;
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

export const APIGetPostBy = async (field, value) => {
  const query = `query {getPostBy(field: \"${field}\", value: \"${value}\") { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } featured_image_id featured_image_metadata template_id categories { term_id name slug description } } }`;
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

export const APIUpdatePostStatus = async (loginPassword, status, postId) => {
  const query = `mutation {updatePostStatus(status: \"${status}\" post_id: ${postId}) { success error post_id} }`;
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

export const APIUpdatePostPublishDate = async (loginPassword, date, postId) => {
  const query = `mutation {updatePostPublishDate(date: \"${date}\" post_id: ${postId}) { success error post_id} }`;
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

export const APIUpdatePostPassword = async (loginPassword, password, postId) => {
  const query = `mutation {updatePostPassword(password: \"${password}\" post_id: ${postId}) { success error post_id} }`;
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

export const APIUpdatePost = async (loginPassword, title, content, featuredImageId, postId) => {
  const query = `mutation {updatePost(title: \"${title}\" content: """${content}""", featuredImageId: ${featuredImageId}, postId: ${postId}) { success error post_id} }`;
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

export const APIGetCategories = async (loginPassword, category) => {
  const query = `query {getCategories(type: \"${category}\") { categories { term_id name slug description post_count } } }`;
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

export const APICreatePostCategory = async (loginPassword, name, slug, description) => {
  const query = `mutation { createPostCategory(name: \"${name}\", slug: \"${slug}\", description: \"${description}\") { success error post_id} }`;
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

export const APIDeletePostCategory = async (loginPassword, id) => {
  const query = `mutation { deletePostCategory(id: ${id}) { success error } }`;
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

export const APIUpdatePostCategory = async (loginPassword, name, slug, description, categoryId) => {
  const query = `mutation { updatePostCategory(name: \"${name}\", slug: \"${slug}\", description: \"${description}\", categoryId: ${categoryId}) { success error post_id} }`;
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

export const APIGetTags = async (loginPassword, tag) => {
  const query = `query {getTags(type: \"${tag}\") { tags { term_id name slug description post_count } } }`;
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

export const APICreatePostTag = async (loginPassword, name, slug, description) => {
  const query = `mutation { createPostTag(name: \"${name}\", slug: \"${slug}\", description: \"${description}\") { success error post_id} }`;
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

export const APIDeletePostTag = async (loginPassword, id) => {
  const query = `mutation { deletePostTag(id: ${id}) { success error } }`;
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

export const APIUpdatePostTag = async (loginPassword, name, slug, description, tagId) => {
  const query = `mutation { updatePostTag(name: \"${name}\", slug: \"${slug}\", description: \"${description}\", tagId: ${tagId}) { success error post_id} }`;
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

export const APISaveDraftNewPage = async (
  loginPassword,
  title,
  content,
  featuredImageId,
  categoriesSelectedIds,
  tagsSelectedIds,
) => {
  const categories = JSON.stringify(JSON.stringify(categoriesSelectedIds));
  const tags = JSON.stringify(JSON.stringify(tagsSelectedIds));
  const query = `mutation {createDraftNewPage(title: \"${title}\" content: """${content}""", featuredImageId: ${featuredImageId}, categories: ${categories}, tags: ${tags}) { success error post_id} }`;
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

export const APISavePublishNewPage = async (
  loginPassword,
  title,
  content,
  featuredImageId,
  categoriesSelectedIds,
  tagsSelectedIds,
) => {
  const categories = JSON.stringify(JSON.stringify(categoriesSelectedIds));
  const tags = JSON.stringify(JSON.stringify(tagsSelectedIds));
  const query = `mutation {createPublishNewPage(title: \"${title}\" content: """${content}""", featuredImageId: ${featuredImageId}, categories: ${categories}, tags: ${tags}) { success error post_id} }`;
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
