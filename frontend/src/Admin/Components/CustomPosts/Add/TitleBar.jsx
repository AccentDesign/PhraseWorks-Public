import React from 'react';
import { Link } from 'react-router-dom';

const TitleBar = ({ customPostName }) => {
  return (
    <div className="title-panel">
      <div className="title-bar">
        <div>
          <h2 className="text-3xl">Add {customPostName} Post</h2>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
