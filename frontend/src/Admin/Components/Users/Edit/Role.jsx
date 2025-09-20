import React from 'react';

const Role = ({ title, name, value, updateFunction, options }) => {
  return (
    <div className="my-4 w-full">
      <label>{title}</label>
      <select
        id={name}
        className="select"
        value={value}
        onChange={(e) => updateFunction(e.target.value)}
      >
        <option value="">{title}</option>
        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
            onChange={(e) => updateFunction(e.target.value)}
          >
            {option.role.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Role;
