import React from 'react';
import AtAGlance from './Dashboard/AtAGlance';
import Activity from './Dashboard/Activity';

const DashboardPageContent = () => {
  return (
    <div className="dashboard-page-block">
      <AtAGlance />
      <Activity />
    </div>
  );
};

export default DashboardPageContent;
