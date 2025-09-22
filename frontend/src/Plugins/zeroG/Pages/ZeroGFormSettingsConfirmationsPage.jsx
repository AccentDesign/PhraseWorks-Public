import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import FormSettingsConfirmationsPageContent from './Components/FormSettingsConfirmationsPageContent.jsx';
import Sidebar from '../../../Admin/Components/Sidebar.jsx';

const ZeroGFormSettingsConfirmationsPage = ({ siteTitle }) => {
  document.title = `ZeroG Settings - Confirmations - ${siteTitle}`;
  return (
    <>
      <Header />

      <div className="page-content-no-padding">
        <Sidebar />
        <div className="page-content-main-no-padding">
          <FormSettingsConfirmationsPageContent />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ZeroGFormSettingsConfirmationsPage;
