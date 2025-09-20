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
        className="input"
        required
        onChange={(e) => {
          updateFunction(e.target.value);
        }}
      />
    </div>
  );
};

export default Field;
