import React from 'react';

const OEmbedField = ({ width, setWidth, height, setHeight }) => {
  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block">Embed Size</label>
        <div className="w-full flex flex-row items-center gap-8">
          <div className="w-1/2">
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                Width
              </span>
              <input
                type="text"
                id="width"
                className="rounded-none  bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                placeholder=""
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-s-0 border-gray-300 rounded-e-md">
                px
              </span>
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                Height
              </span>
              <input
                type="text"
                id="height"
                className="rounded-none  bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                placeholder=""
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-s-0 border-gray-300 rounded-e-md">
                px
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OEmbedField;
