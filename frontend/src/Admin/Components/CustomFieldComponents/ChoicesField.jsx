import React from 'react';

const ChoicesField = ({ choices, setChoices }) => {
  return (
    <div className="mb-4">
      <label className="block">Choices</label>
      <textarea
        name="choices"
        value={choices}
        onChange={(e) => setChoices(e.target.value)}
        rows={4}
        className="w-full p-2 border rounded resize-y"
      />
      <p className="text-sm text-gray-500">Enter each choice on a new line.</p>
      <p className="text-sm text-gray-500">
        For more control, you may specify both a value and label like this:
      </p>
      <p className="text-sm text-gray-500">red : Red</p>
    </div>
  );
};

export default ChoicesField;
