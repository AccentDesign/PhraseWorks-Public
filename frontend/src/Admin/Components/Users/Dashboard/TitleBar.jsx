import React from 'react';
import { Link } from 'react-router-dom';

const TitleBar = () => {
  return (
    <div className="title-panel">
      <div className="title-bar">
        <div>
          <h2 className="text-3xl">Users</h2>
        </div>
        <Link to="/admin/users/new" className="text-white bg-blue-700 hover:bg-blue-800 btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="title-btn-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          Add New User
        </Link>
      </div>
    </div>
  );
};

export default TitleBar;
