import React from 'react';

const TextArea = ({ value, setValue, label, name, defaultValue, args }) => {
  return (
    <div className="w-full mb-4">
      <label>{label}</label>
      <textarea
        name={name}
        value={value != '' ? value : defaultValue}
        onChange={setValue}
        rows={4}
        className="w-full p-2 bg-gray-50 border rounded resize-y"
        {...args}
      />
    </div>
  );
};

export default TextArea;
