import React from 'react';
import { Link } from 'react-router-dom';

const TitleBar = () => {
  return (
    <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
      <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
        <div>
          <h2 className="text-3xl">Add Page</h2>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
