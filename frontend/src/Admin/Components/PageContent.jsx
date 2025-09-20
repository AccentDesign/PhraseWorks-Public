import React from 'react';
import Sidebar from './Sidebar';

const PageContent = ({ children }) => {
  return (
    <div className="page-content">
      <Sidebar />
      <div className="page-content-main">{children}</div>
    </div>
  );
};

export default PageContent;
