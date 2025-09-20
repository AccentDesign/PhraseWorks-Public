import React from 'react';

const MessageField = ({ message, setMessage }) => {
  return (
    <div className="mb-4">
      <label className="block">Message</label>
      <input
        type="text"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <p className="text-sm text-gray-500">Displays text alongside the checkbox</p>
    </div>
  );
};

export default MessageField;
