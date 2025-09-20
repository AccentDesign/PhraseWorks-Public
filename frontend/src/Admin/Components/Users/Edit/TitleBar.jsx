import React from 'react';

const TitleBar = ({ user }) => {
  return (
    <div className="title-panel">
      <div className="title-bar">
        <div>
          <h2 className="text-3xl">Edit User {user?.user_nicename}</h2>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
