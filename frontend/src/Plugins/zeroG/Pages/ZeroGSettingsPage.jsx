import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import SettingsPageContent from './Components/SettingsPageContent.jsx';
import Sidebar from '../../../Admin/Components/Sidebar.jsx';

const PluginTwoPage = ({ siteTitle }) => {
  document.title = `ZeroG Settings - ${siteTitle}`;
  return (
    <>
      <Header />
      <div className="page-content-no-padding">
        <Sidebar />
        <div className="page-content-main-no-padding">
          <SettingsPageContent />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PluginTwoPage;
