import React from 'react';
import TitleBar from './MediaSettings/TitleBar';
import Settings from './MediaSettings/Settings';

const MediaSettingsPageContent = () => {
  return (
    <div className="w-full">
      <TitleBar />
      <Settings />
    </div>
  );
};

export default MediaSettingsPageContent;
