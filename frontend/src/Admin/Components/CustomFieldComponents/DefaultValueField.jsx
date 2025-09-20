import React from 'react';

const DefaultValueField = ({ type, defaultValue, setDefaultValue }) => {
  return (
    <>
      {type != 'text_area' && type != 'wysiwyg' ? (
        <div className="mb-4">
          <label className="block">Default Value</label>
          <input
            type="text"
            name="default"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
            className="input-white"
          />
        </div>
      ) : (
        <div className="mb-4">
          <label className="block">Default Value</label>
          <textarea
            name="default"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded resize-y"
          />
        </div>
      )}
    </>
  );
};

export default DefaultValueField;
