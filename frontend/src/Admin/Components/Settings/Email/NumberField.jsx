import React from 'react';

const NumberField = ({ name, title, value, updateFunction, text }) => {
  return (
    <div className="mb-4">
      <div className="w-auto">
        <label>{title}</label>
        <input
          type="number"
          name={name}
          placeholder={title}
          autoComplete={title}
          value={value}
          min={0}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-auto p-2.5"
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

export default NumberField;
