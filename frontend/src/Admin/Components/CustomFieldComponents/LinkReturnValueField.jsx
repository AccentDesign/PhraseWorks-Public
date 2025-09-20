import React from 'react';

const LinkReturnValueField = ({ linkReturnValue, setLinkReturnValue }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block">Return Value</label>
        <div className="flex flex-row items-center gap-8">
          <div className="flex items-center mb-4">
            <input
              id="return_format_1"
              type="radio"
              name="return_format"
              value="link_array"
              className="w-4 h-4 border-gray-300"
              checked={linkReturnValue === 'link_array'}
              onChange={(e) => setLinkReturnValue(e.target.value)}
            />
            <label htmlFor="return_format_1" className="block ms-2 font-medium text-gray-900">
              Link Array
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="return_format_2"
              type="radio"
              name="return_format"
              value="link_url"
              className="w-4 h-4 border-gray-300"
              checked={linkReturnValue === 'link_url'}
              onChange={(e) => setLinkReturnValue(e.target.value)}
            />
            <label htmlFor="return_format_2" className="block ms-2 font-medium text-gray-900">
              Link URL
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkReturnValueField;
