import React from 'react';

const PostReturnFormat = ({ postFormat, setPostFormat }) => {
  return (
    <div className="mb-4">
      <label className="block">Return Format</label>
      <div className="flex flex-row items-center gap-8">
        <div className="flex items-center mb-4">
          <input
            id="postFormat_1"
            type="radio"
            name="postFormat"
            value="post_object"
            className="w-4 h-4 border-gray-300"
            checked={postFormat === 'post_object'}
            onChange={(e) => setPostFormat(e.target.value)}
          />
          <label htmlFor="postFormat_1" className="block ms-2 font-medium text-gray-900">
            Post Object
          </label>
        </div>
        <div className="flex items-center mb-4">
          <input
            id="postFormat_2"
            type="radio"
            name="postFormat"
            value="post_id"
            className="w-4 h-4 border-gray-300"
            checked={postFormat === 'post_id'}
            onChange={(e) => setPostFormat(e.target.value)}
          />
          <label htmlFor="postFormat_2" className="block ms-2 font-medium text-gray-900">
            Post Id
          </label>
        </div>
      </div>
    </div>
  );
};

export default PostReturnFormat;
