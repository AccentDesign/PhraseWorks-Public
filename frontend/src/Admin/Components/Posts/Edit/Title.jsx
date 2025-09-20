import React from 'react';

const Title = ({ title, updateTitle }) => {
  return (
    <div className="w-full">
      <label>
        Title <span className="text-red-600">*</span>
      </label>
      <input
        type="text"
        name="title"
        placeholder="Title"
        autoComplete="Title"
        value={title}
        className="input"
        required
        onChange={(e) => {
          updateTitle(e.target.value);
        }}
      />
    </div>
  );
};

export default Title;
