import { Link } from 'react-router-dom';

const TitleBar = ({ title, save }) => {
  return (
    <div className="title-panel">
      <div className="title-bar">
        <div className="flex flex-row items-center gap-4">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            version="1.1"
            viewBox="0 0 17 17"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-500 group-hover:text-white w-16 h-16"
          >
            <g></g>
            <path d="M0 0v3h17v-3h-17zM16 2h-15v-1h15v1zM0 13h17v-9h-17v9zM1 5h15v7h-15v-7zM0 17h17v-3h-17v3zM1 15h15v1h-15v-1z"></path>
          </svg>
          <h2 className="text-3xl">{title}</h2>
        </div>
        <button onClick={save} className="text-white bg-blue-700 hover:bg-blue-800 btn">
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
          Update
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
