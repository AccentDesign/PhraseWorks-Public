import React from 'react';
import { Link } from 'react-router-dom';

const TitleBar = ({ setAddSliderOpen }) => {
  return (
    <div className="title-panel">
      <div className="title-bar">
        <div>
          <h2 className="text-3xl">Page Templates</h2>
        </div>
        <button
          type="button"
          onClick={() => setAddSliderOpen(true)}
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
            />
          </svg>
          Add New Page Template
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
