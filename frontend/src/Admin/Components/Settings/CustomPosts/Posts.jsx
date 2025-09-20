import React from 'react';
import ListView from './ListView';

const Posts = ({
  posts,
  setPosts,
  selectedIds,
  setSelectedIds,
  toggleCheckbox,
  restorePost,
  binPost,
  permanentlyDeletePost,
  allSelected,
  toggleAllCheckboxes,
}) => {
  return (
    <div>
      <ListView
        posts={posts}
        selectedIds={selectedIds}
        toggleCheckbox={toggleCheckbox}
        restorePost={restorePost}
        binPost={binPost}
        permanentlyDeletePost={permanentlyDeletePost}
        allSelected={allSelected}
        toggleAllCheckboxes={toggleAllCheckboxes}
      />
    </div>
  );
};

export default Posts;
