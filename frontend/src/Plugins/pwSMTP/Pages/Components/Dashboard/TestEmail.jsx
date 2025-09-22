import React from 'react';
import { notify } from '@/Utils/Notification';

const TestEmail = ({ testTo, setTestTo, sendTest }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Send Test Email</h2>
      <p>Send To</p>
      <input
        type="text"
        placeholder="To Address"
        className="border p-2 rounded w-full text-black"
        value={testTo}
        onChange={(e) => {
          setTestTo(e.target.value);
        }}
      />

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (testTo == '') {
            notify('You must enter the to address before sending', 'error');
            return;
          }
          sendTest();
        }}
        className="text-white bg-blue-700 hover:bg-blue-800 btn mt-4"
      >
        Send
      </button>
    </div>
  );
};

export default TestEmail;
