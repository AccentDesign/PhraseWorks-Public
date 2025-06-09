import React from 'react';
import AtAGlance from './Dashboard/AtAGlance';

const DashboardPageContent = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap items-center">
      <AtAGlance />
    </div>
  );
};

export default DashboardPageContent;
