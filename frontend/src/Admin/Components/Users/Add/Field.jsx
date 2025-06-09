import React from 'react';

const Field = ({ type, title, name, value, updateFunction }) => {
  return (
    <div className="w-full my-4">
      <label>{title}</label>
      <input
        type={type}
        name={name}
        placeholder={title}
        autoComplete={title}
        value={value}
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
        required
        onChange={(e) => {
          updateFunction(e.target.value);
        }}
      />
    </div>
  );
};

export default Field;
