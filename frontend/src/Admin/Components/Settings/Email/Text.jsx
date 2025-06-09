import React from 'react';

const Text = ({ name, title, value, updateFunction, text }) => {
  return (
    <div className="mb-4">
      <div className="w-full md:w-1/2 ">
        <label>{title}</label>
        <input
          type="text"
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
      {text ? <p className="text-gray-500 text-sm mt-2">{text}</p> : ''}
    </div>
  );
};

export default Text;
