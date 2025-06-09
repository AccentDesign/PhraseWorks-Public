import React from 'react';

const PageContent = ({ children }) => {
  return (
    <div className="w-full md:w-[calc(100%-12rem)] mx-auto px-1 py-2 md:px-8 md:py-5 bg-white">
      {children}
    </div>
  );
};

export default PageContent;
