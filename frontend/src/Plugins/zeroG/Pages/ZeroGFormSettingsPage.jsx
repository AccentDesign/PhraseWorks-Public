import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import FormSettingsPageContent from './Components/FormSettingsPageContent.jsx';
import Sidebar from '../../../Admin/Components/Sidebar.jsx';

const ZeroGFormSettingsPage = ({ siteTitle }) => {
  document.title = `ZeroG Form Settings - ${siteTitle}`;
  return (
    <>
      <Header />

      <div className="page-content-no-padding">
        <Sidebar />
        <div className="page-content-main-no-padding">
          <FormSettingsPageContent />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ZeroGFormSettingsPage;
