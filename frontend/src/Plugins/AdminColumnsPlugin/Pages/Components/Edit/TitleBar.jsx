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
      </div>
    </div>
  );
};

export default TitleBar;
