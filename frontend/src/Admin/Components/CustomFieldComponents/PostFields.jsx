import React from 'react';

const PostFields = ({
  postType,
  setPostType,
  postStatus,
  setPostStatus,
  taxonomy,
  setTaxonomy,
}) => {
  return (
    <>
      <div className="mb-4">
        <label className="block">Filter by Post Type</label>
        <input
          type="text"
          name="postType"
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block">Filter by Post Status Label</label>
        <input
          type="text"
          name="postStatus"
          value={postStatus}
          onChange={(e) => setPostStatus(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block">Filter by taxonomy</label>
        <input
          type="text"
          name="taxonomy"
          value={taxonomy}
          onChange={(e) => setTaxonomy(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
    </>
  );
};

export default PostFields;
