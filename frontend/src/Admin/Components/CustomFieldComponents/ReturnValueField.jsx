import React from 'react';

const ReturnValueField = ({ returnFormat, setReturnFormat }) => {
  return (
    <>
      <div className="mb-4">
        <div className="mb-4">
          <label className="block">Return Format</label>
          <div className="flex flex-row items-center gap-8">
            <div className="flex items-center mb-4">
              <input
                id="return_format_1"
                type="radio"
                name="return_format"
                value="value"
                className="w-4 h-4 border-gray-300"
                checked={returnFormat === 'value'}
                onChange={(e) => setReturnFormat(e.target.value)}
              />
              <label htmlFor="return_format_1" className="block ms-2 font-medium text-gray-900">
                Value
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                id="return_format_2"
                type="radio"
                name="return_format"
                value="label"
                className="w-4 h-4 border-gray-300"
                checked={returnFormat === 'label'}
                onChange={(e) => setReturnFormat(e.target.value)}
              />
              <label htmlFor="return_format_2" className="block ms-2 font-medium text-gray-900">
                Label
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                id="return_format_3"
                type="radio"
                name="return_format"
                value="both"
                className="w-4 h-4 border-gray-300"
                checked={returnFormat === 'both'}
                onChange={(e) => setReturnFormat(e.target.value)}
              />
              <label htmlFor="return_format_3" className="block ms-2 font-medium text-gray-900">
                Both (Array)
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnValueField;
