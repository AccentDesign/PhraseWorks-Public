import React from 'react';

const TextField = ({ type, value, setValue, label, name, defaultValue, args }) => {
  return (
    <div className="w-full mb-4">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={label}
        autoComplete={defaultValue}
        value={value}
        className="input"
        required
        onChange={setValue}
        {...args}
      />
    </div>
  );
};

export default TextField;
