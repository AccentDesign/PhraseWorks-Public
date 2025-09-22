import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import PluginPageContent from './Components/PluginPageContent.jsx';
import Sidebar from '../../../Admin/Components/Sidebar.jsx';

const CookieConsentPage = ({ siteTitle }) => {
  document.title = `ZeroG Forms - ${siteTitle}`;
  return (
    <>
      <Header />

      <div className="page-content-no-padding">
        <Sidebar />
        <div className="page-content-main-no-padding">
          <PluginPageContent />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CookieConsentPage;
