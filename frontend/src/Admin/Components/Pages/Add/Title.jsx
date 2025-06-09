import React from 'react';

const Title = ({ title, updateTitle }) => {
  return (
    <div className="w-full">
      <label>Title</label>
      <input
        type="text"
        name="title"
        placeholder="Title"
        autoComplete="Title"
        value={title}
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
        required
        onChange={(e) => {
          updateTitle(e.target.value);
        }}
      />
    </div>
  );
};

export default Title;
