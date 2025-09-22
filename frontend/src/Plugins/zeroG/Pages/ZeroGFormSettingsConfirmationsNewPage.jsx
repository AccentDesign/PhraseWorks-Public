import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import FormSettingsConfirmationsNewPageContent from './Components/FormSettingsConfirmationsNewPageContent.jsx';
import Sidebar from '../../../Admin/Components/Sidebar.jsx';

const ZeroGFormSettingsConfirmationsNewPage = ({ siteTitle }) => {
  document.title = `ZeroG Settings - Confirmations - New - ${siteTitle}`;
  return (
    <>
      <Header />

      <div className="page-content-no-padding">
        <Sidebar />
        <div className="page-content-main-no-padding">
          <FormSettingsConfirmationsNewPageContent />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ZeroGFormSettingsConfirmationsNewPage;
