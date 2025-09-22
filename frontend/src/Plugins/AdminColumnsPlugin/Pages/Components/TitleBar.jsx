import React from 'react';
import { Link } from 'react-router-dom';

const TitleBar = ({ title }) => {
  return (
    <div className="title-panel">
      <div className="title-bar">
        <div className="flex flex-row items-center gap-4">
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-500 group-hover:text-white w-16 h-16"
          >
            <path d="M4 6l5.5 0"></path>
            <path d="M4 10l5.5 0"></path>
            <path d="M4 14l5.5 0"></path>
            <path d="M4 18l5.5 0"></path>
            <path d="M14.5 6l5.5 0"></path>
            <path d="M14.5 10l5.5 0"></path>
            <path d="M14.5 14l5.5 0"></path>
            <path d="M14.5 18l5.5 0"></path>
          </svg>
          <h2 className="text-3xl">{title}</h2>
        </div>
        <Link
          to="/admin/admin-columns/add"
          className="text-white bg-blue-700 hover:bg-blue-800 btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 mr-2 -ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            ></path>
          </svg>
          Add
        </Link>
      </div>
    </div>
  );
};

export default TitleBar;
