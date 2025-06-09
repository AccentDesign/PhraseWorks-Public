import React from 'react';
import Sidebar from './Sidebar';

const PageContent = ({ children }) => {
  return (
    <div className="flex flex-row bg-gray-100 min-h-[100vh] pb-8 pt-[40px]">
      <Sidebar />
      <div className="md:ml-[300px] mr-8 mt-[40px] w-full ">{children}</div>
    </div>
  );
};

export default PageContent;
