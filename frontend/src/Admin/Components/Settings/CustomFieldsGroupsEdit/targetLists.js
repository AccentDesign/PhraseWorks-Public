export const targetLists = [
  {
    name: 'post_type',
    list: [
      {
        label: 'Post Type',
        options: [
          { label: 'Post', value: 'post' },
          { label: 'Page', value: 'page' },
        ],
      },
    ],
  },
  {
    name: 'post_status',
    list: [
      {
        label: 'Post Status',
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Draft', value: 'draft' },
          { label: 'Pending', value: 'pending' },
          { label: 'Private', value: 'private' },
          { label: 'Bin', value: 'bin' },
        ],
      },
    ],
  },
  {
    name: 'current_user',
    list: [
      {
        label: 'Current User',
        options: [{ label: 'Logged In', value: 'logged in' }],
      },
    ],
  },
  {
    name: 'current_user_role',
    list: [
      {
        label: 'Current User Role',
        options: [
          { label: 'Administrator', value: 'administrator' },
          { label: 'Editor', value: 'editor' },
          { label: 'Author', value: 'author' },
          { label: 'Subscriber', value: 'subscriber' },
        ],
      },
    ],
  },
];
