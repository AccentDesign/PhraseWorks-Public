import { Link } from 'react-router-dom';

const TitleBar = ({ title }) => {
  return (
    <div className="title-panel">
      <div className="title-bar">
        <div className="flex flex-row items-center gap-4">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            role="img"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-500 group-hover:text-white w-16 h-16"
          >
            <path d="M4 2.8A3.6 3.6 0 1 0 4 10a3.6 3.6 0 0 0 0-7.2zm7.6 0v18.4h7.2a5.2 5.2 0 1 1 0-10.4 4 4 0 1 1 0-8zm7.2 0v8a4 4 0 1 0 0-8zm0 8v10.4A5.2 5.2 0 0 0 24 16a5.2 5.2 0 0 0-5.2-5.2zm-7.7-7.206L0 21.199h8.8l2.3-3.64Z"></path>
          </svg>
          <h2 className="text-3xl">{title}</h2>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
