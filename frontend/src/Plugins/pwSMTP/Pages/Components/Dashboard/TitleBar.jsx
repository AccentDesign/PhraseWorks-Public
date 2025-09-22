const TitleBar = ({ title, save }) => {
  return (
    <div className="title-panel">
      <div className="title-bar">
        <div className="flex flex-row items-center gap-4">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 576 512"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-500 group-hover:text-white w-16 h-16"
          >
            <path d="M160 448c-25.6 0-51.2-22.4-64-32-64-44.8-83.2-60.8-96-70.4V480c0 17.67 14.33 32 32 32h256c17.67 0 32-14.33 32-32V345.6c-12.8 9.6-32 25.6-96 70.4-12.8 9.6-38.4 32-64 32zm128-192H32c-17.67 0-32 14.33-32 32v16c25.6 19.2 22.4 19.2 115.2 86.4 9.6 6.4 28.8 25.6 44.8 25.6s35.2-19.2 44.8-22.4c92.8-67.2 89.6-67.2 115.2-86.4V288c0-17.67-14.33-32-32-32zm256-96H224c-17.67 0-32 14.33-32 32v32h96c33.21 0 60.59 25.42 63.71 57.82l.29-.22V416h192c17.67 0 32-14.33 32-32V192c0-17.67-14.33-32-32-32zm-32 128h-64v-64h64v64zm-352-96c0-35.29 28.71-64 64-64h224V32c0-17.67-14.33-32-32-32H96C78.33 0 64 14.33 64 32v192h96v-32z"></path>
          </svg>
          <h2 className="text-3xl">{title}</h2>
        </div>
        <button onClick={save} className="text-white bg-blue-700 hover:bg-blue-800 btn">
          <svg
            className="h-5 w-5 mr-2 -ml-1"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 256 256"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M216,83.31V208a8,8,0,0,1-8,8H176V152a8,8,0,0,0-8-8H88a8,8,0,0,0-8,8v64H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H172.69a8,8,0,0,1,5.65,2.34l35.32,35.32A8,8,0,0,1,216,83.31Z"
              opacity="0.2"
            ></path>
            <path d="M219.31,72,184,36.69A15.86,15.86,0,0,0,172.69,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V83.31A15.86,15.86,0,0,0,219.31,72ZM168,208H88V152h80Zm40,0H184V152a16,16,0,0,0-16-16H88a16,16,0,0,0-16,16v56H48V48H172.69L208,83.31ZM160,72a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h56A8,8,0,0,1,160,72Z"></path>
          </svg>
          Save
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
