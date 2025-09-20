import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FileField = ({ returnValue, setReturnValue, library, setLibrary }) => {
  const groupId = useMemo(() => uuidv4(), []);
  const radioGroupName = `return_format_${groupId}`;
  const libraryGroupName = `library_${groupId}`;
  return (
    <>
      <div className="mb-4">
        <label className="block">Return Format</label>
        <div className="flex flex-row items-center gap-8">
          <div className="flex items-center mb-4">
            <input
              type="radio"
              name={radioGroupName}
              value="file_array"
              className="w-4 h-4 border-gray-300"
              checked={returnValue === 'file_array'}
              onChange={(e) => setReturnValue(e.target.value)}
            />
            <p className="block ms-2 font-medium text-gray-900">File Array</p>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              name={radioGroupName}
              value="file_url"
              className="w-4 h-4 border-gray-300"
              checked={returnValue === 'file_url'}
              onChange={(e) => setReturnValue(e.target.value)}
            />
            <p className="block ms-2 font-medium text-gray-900">File Url</p>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              name={radioGroupName}
              value="file_id"
              className="w-4 h-4 border-gray-300"
              checked={returnValue === 'file_id'}
              onChange={(e) => setReturnValue(e.target.value)}
            />
            <p className="block ms-2 font-medium text-gray-900">File ID</p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="block">Library</label>
        <label className="text-sm text-gray-500">Limit the media library choice</label>
        <div className="flex flex-row items-center gap-8">
          <div className="flex items-center mb-4">
            <input
              type="radio"
              name={libraryGroupName}
              value="all"
              className="w-4 h-4 border-gray-300"
              checked={library === 'all'}
              onChange={(e) => setLibrary(e.target.value)}
            />
            <p className="block ms-2 font-medium text-gray-900">All</p>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              name={libraryGroupName}
              value="uploaded_to_post"
              className="w-4 h-4 border-gray-300"
              checked={library === 'uploaded_to_post'}
              onChange={(e) => setLibrary(e.target.value)}
            />
            <p className="block ms-2 font-medium text-gray-900">Uploaded To Post</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileField;
