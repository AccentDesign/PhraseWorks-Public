import React from 'react';

const Chevrons = ({ expanded, setValue }) => {
  return (
    <>
      {expanded ? (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 20 20"
          aria-hidden="true"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white hover:text-blue-500 cursor-pointer w-4 h-4"
          onClick={() => setValue(false)}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      ) : (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 20 20"
          aria-hidden="true"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white hover:text-blue-500 cursor-pointer w-4 h-4"
          onClick={() => setValue(true)}
        >
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      )}
    </>
  );
};

export default Chevrons;
