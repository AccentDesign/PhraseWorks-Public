import React from 'react';

const Role = ({ title, name, value, updateFunction, options }) => {
  return (
    <div className="my-4 w-full">
      <label>{title}</label>
      <select
        id={name}
        className="block w-auto bg-gray-100 border-gray-300 border px-4 py-2 divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
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
