# GraphQL API Reference

PhraseWorks provides a comprehensive GraphQL API for managing content, users, media, and plugins.

## 🔗 Endpoint

```
POST /graphql
```

## 🔐 Authentication

Most operations require authentication. Include credentials in your requests:

```javascript
fetch('/graphql', {
  method: 'POST',
  credentials: 'include', // Important for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': 'your-csrf-token' // Required for mutations
  },
  body: JSON.stringify({
    query: '...',
    variables: {}
  })
})
```

## 📊 Core Types

### Post
```graphql
type Post {
  id: Int!
  post_date: String
  post_date_gmt: String
  post_content: String!
  post_title: String!
  post_excerpt: String
  post_status: String!           # publish, draft, private, trash
  post_password: String
  post_name: String              # URL slug
  post_modified: String
  post_modified_gmt: String
  post_parent: Int
  guid: String
  menu_order: Int
  post_type: String              # post, page, custom_post_type
  post_mime_type: String
  comment_count: Int
  post_author: Int

  # Relationships
  author: User
  featured_image_id: Int
  featured_image_metadata: String
  featured_image_imagedata: String
  template_id: Int
  categories: [Category]
  comment_status: String
  ping_status: String
  to_ping: String
  pinged: String
  post_content_filtered: String
  meta: [PostMeta]
  terms: [Term]
  comments: [Comment]
}
```

### User
```graphql
type User {
  id: Int!
  user_login: String!
  user_nicename: String
  user_email: String!
  user_url: String
  user_registered: String
  user_status: Int
  display_name: String
  first_name: String
  last_name: String
  roles: [String]                # administrator, editor, author, contributor, subscriber
  capabilities: [String]
}
```

### Category / Tag (Term)
```graphql
type Category {
  term_id: Int!
  name: String!
  slug: String!
  term_group: Int
  term_taxonomy_id: Int
  taxonomy: String!              # category, post_tag, etc.
  description: String
  parent: Int
  count: Int
}

type Tag {
  term_id: Int!
  name: String!
  slug: String!
  term_group: Int
  term_taxonomy_id: Int
  taxonomy: String!
  description: String
  parent: Int
  count: Int
}
```

### Media
```graphql
type Media {
  id: Int!
  title: String
  filename: String
  original_filename: String
  alt_text: String
  caption: String
  description: String
  mime_type: String
  file_size: Int
  dimensions: String
  url: String
  thumbnail_url: String
  upload_date: String
  uploaded_by: Int
}
```

## 🔍 Queries

### Posts & Pages

#### Get Posts
```graphql
query GetPosts($page: Int, $perPage: Int, $type: String, $include_trash: Boolean) {
  getPosts(page: $page, perPage: $perPage, type: $type, include_trash: $include_trash) {
    posts {
      id
      post_title
      post_content
      post_status
      post_date
      author {
        display_name
        user_email
      }
      categories {
        name
        slug
      }
    }
    total
  }
}
```

#### Get Single Post
```graphql
query GetPost($field: String!, $value: String!) {
  getPostBy(field: $field, value: $value) {
    id
    post_title
    post_content
    post_excerpt
    post_status
    post_name
    post_type
    post_date
    featured_image_metadata
    author {
      display_name
    }
    categories {
      name
      slug
    }
    meta {
      meta_key
      meta_value
    }
  }
}
```

#### Advanced Post Query (PW_Query)
```graphql
query AdvancedPostQuery($args: String!) {
  getPWQuery(args: $args) {
    posts {
      id
      post_title
      post_content
      post_excerpt
      post_date
      post_status
      post_type
      author {
        display_name
      }
    }
    total
  }
}
```

**Example PW_Query args**:
```javascript
const args = JSON.stringify({
  post_type: 'post',
  post_status: 'publish',
  posts_per_page: 10,
  paged: 1,
  meta_query: [
    {
      key: 'featured',
      value: 'true',
      compare: '='
    }
  ],
  tax_query: [
    {
      taxonomy: 'category',
      field: 'slug',
      terms: ['news', 'updates']
    }
  ]
});
```

### Users

#### Get Users
```graphql
query GetUsers($page: Int, $perPage: Int) {
  getUsers(page: $page, perPage: $perPage) {
    users {
      id
      display_name
      user_email
      user_registered
      roles
    }
    total
  }
}
```

#### Get Current User
```graphql
query GetCurrentUser {
  getCurrentUser {
    id
    display_name
    user_email
    roles
    capabilities
  }
}
```

### Media

#### Get Media Files
```graphql
query GetMedia($page: Int, $perPage: Int) {
  getMedia(page: $page, perPage: $perPage) {
    media {
      id
      title
      filename
      mime_type
      file_size
      url
      thumbnail_url
      upload_date
    }
    total
  }
}
```

### Categories & Tags

#### Get Categories
```graphql
query GetCategories($taxonomy: String!) {
  getCategories(taxonomy: $taxonomy) {
    term_id
    name
    slug
    description
    count
    parent
  }
}
```

### System

#### Get System Settings
```graphql
query GetSystemSettings {
  getSiteTitle
  getGeneralSettings {
    site_title
    site_tagline
    admin_email
    site_address
  }
}
```

## ✏️ Mutations

### Posts & Pages

#### Create Post
```graphql
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    post_title
    post_content
    post_status
    post_type
  }
}
```

**Input Type**:
```graphql
input CreatePostInput {
  post_title: String!
  post_content: String
  post_excerpt: String
  post_status: String!
  post_type: String!
  post_name: String
  post_author: Int
  categories: [Int]
  tags: [Int]
  featured_image_id: Int
  template_id: Int
  meta: [PostMetaInput]
}

input PostMetaInput {
  meta_key: String!
  meta_value: String!
}
```

#### Update Post
```graphql
mutation UpdatePost($id: Int!, $input: UpdatePostInput!) {
  updatePost(id: $id, input: $input) {
    id
    post_title
    post_content
    post_status
    post_modified
  }
}
```

#### Delete Post
```graphql
mutation DeletePost($postId: Int!) {
  deletePost(postId: $postId)
}
```

### Users

#### Create User
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    display_name
    user_email
    roles
  }
}
```

**Input Type**:
```graphql
input CreateUserInput {
  user_login: String!
  user_email: String!
  user_pass: String!
  display_name: String
  first_name: String
  last_name: String
  role: String!
}
```

### Authentication

#### Login
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    success
    message
    user {
      id
      display_name
      user_email
      roles
    }
  }
}
```

#### Logout
```graphql
mutation Logout {
  logout {
    success
    message
  }
}
```

### Media

#### Upload File
```graphql
mutation UploadFile($file: Upload!, $title: String, $alt_text: String) {
  uploadFile(file: $file, title: $title, alt_text: $alt_text) {
    id
    title
    filename
    url
    mime_type
    file_size
  }
}
```

### Categories & Tags

#### Create Category
```graphql
mutation CreateCategory($input: CreateCategoryInput!) {
  createPostCategory(input: $input) {
    term_id
    name
    slug
    description
  }
}
```

**Input Type**:
```graphql
input CreateCategoryInput {
  name: String!
  slug: String
  description: String
  parent: Int
}
```

## 🔒 Security & Rate Limiting

### Query Complexity
Queries are limited by complexity to prevent abuse:
- **Unauthenticated users**: 1000 complexity points
- **Authenticated users**: 2000 complexity points

### Query Depth
Maximum query depth is limited to **10 levels** to prevent deeply nested queries.

### Rate Limiting
API requests are rate limited:
- **60 seconds window**
- **400 requests maximum** per window per IP

## 🔧 Advanced Usage

### Using Variables
```javascript
const query = `
  query GetPostsByCategory($categorySlug: String!, $limit: Int!) {
    getPWQuery(args: $args) {
      posts {
        id
        post_title
        post_excerpt
        post_date
      }
    }
  }
`;

const variables = {
  args: JSON.stringify({
    post_type: 'post',
    post_status: 'publish',
    posts_per_page: variables.limit,
    tax_query: [{
      taxonomy: 'category',
      field: 'slug',
      terms: [variables.categorySlug]
    }]
  })
};
```

### Fragments
```graphql
fragment PostSummary on Post {
  id
  post_title
  post_excerpt
  post_date
  post_name
  author {
    display_name
  }
  categories {
    name
    slug
  }
}

query GetRecentPosts {
  getPosts(page: 1, perPage: 5, type: "post") {
    posts {
      ...PostSummary
    }
  }
}
```

### Error Handling
```javascript
const response = await fetch('/graphql', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables })
});

const result = await response.json();

if (result.errors) {
  console.error('GraphQL Errors:', result.errors);
  // Handle errors appropriately
} else {
  console.log('Data:', result.data);
}
```

## 🧩 Plugin Extensions

Plugins can extend the GraphQL schema. For example, a plugin might add:

```graphql
# Added by YourPlugin
extend type Query {
  getYourPluginData: [YourPluginData!]!
}

extend type Mutation {
  createYourPluginItem(input: YourPluginInput!): YourPluginData!
}

type YourPluginData {
  id: Int!
  title: String!
  content: String
}
```

See the **Plugin Development Guide** section for more details on extending the GraphQL schema.

## 🔍 Schema Introspection

You can explore the full schema using GraphQL introspection:

```graphql
query IntrospectSchema {
  __schema {
    types {
      name
      description
      fields {
        name
        type {
          name
        }
      }
    }
  }
}
```

**Note**: Introspection may be disabled in production environments for security.

## 📞 Getting Help

- 📚 **Main Documentation**: Use the navigation menu to explore all sections
- 🔌 **Plugin Development Guide**: See the Plugin Development section
- 🐛 **Report API Issues**: https://github.com/yourusername/phraseworks/issues
- 💬 **Community Forum**: https://community.phraseworks.com