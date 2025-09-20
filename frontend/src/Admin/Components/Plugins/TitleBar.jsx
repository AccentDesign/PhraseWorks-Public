import React from 'react';

const TitleBar = ({ sliderOpen, setSliderOpen }) => {
  return (
    <div className="title-panel">
      <div className="title-bar">
        <h2 className="text-3xl">Plugins</h2>
        {__DEV__ ? (
          <button
            onClick={() => setSliderOpen(true)}
            className="text-white bg-blue-700 hover:bg-blue-800 btn"
          >
            Add Plugins
          </button>
        ) : (
          <p className="text-sm text-gray-500">
            To add Plugins you need to be in local development mode
          </p>
        )}
      </div>
    </div>
  );
};

export default TitleBar;
