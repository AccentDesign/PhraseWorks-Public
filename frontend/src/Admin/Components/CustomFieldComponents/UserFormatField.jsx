import React from 'react';

const UserFormatField = ({ returnValue, setReturnValue }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block">Return Format</label>
        <div className="flex flex-row items-center gap-8">
          <div className="flex items-center mb-4">
            <input
              id="return_format_1"
              type="radio"
              name="return_format"
              value="file_array"
              className="w-4 h-4 border-gray-300"
              checked={returnValue === 'user_array'}
              onChange={(e) => setReturnValue(e.target.value)}
            />
            <label htmlFor="return_format_1" className="block ms-2 font-medium text-gray-900">
              User Array
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="return_format_2"
              type="radio"
              name="return_format"
              value="file_url"
              className="w-4 h-4 border-gray-300"
              checked={returnValue === 'user_object'}
              onChange={(e) => setReturnValue(e.target.value)}
            />
            <label htmlFor="return_format_2" className="block ms-2 font-medium text-gray-900">
              User Object
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="return_format_3"
              type="radio"
              name="return_format"
              value="file_id"
              className="w-4 h-4 border-gray-300"
              checked={returnValue === 'user_id'}
              onChange={(e) => setReturnValue(e.target.value)}
            />
            <label htmlFor="return_format_3" className="block ms-2 font-medium text-gray-900">
              User ID
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFormatField;
