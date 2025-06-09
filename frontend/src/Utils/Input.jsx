import React, { useState } from 'react';

const Input = ({ type, name, id, placeholder, value }) => {
  const [val, setVal] = useState(value);

  const Change = (e) => {
    setVal(e.target.value);
  };
  return (
    <input
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      className="w-32 border border-neutral-400 rounded-lg px-4 py-2 mx-2"
      required=""
      value={val}
      onChange={Change}
    />
  );
};

export default Input;
