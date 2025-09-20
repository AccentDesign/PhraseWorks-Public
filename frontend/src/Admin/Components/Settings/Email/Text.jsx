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
          className="input"
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
