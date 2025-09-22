import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import FormSettingsConfirmationsEditPageContent from './Components/FormSettingsConfirmationsEditPageContent.jsx';
import Sidebar from '../../../Admin/Components/Sidebar.jsx';

const ZeroGFormSettingsConfirmationsEditPage = ({ siteTitle }) => {
  document.title = `ZeroG Settings - Confirmations - New - ${siteTitle}`;
  return (
    <>
      <Header />

      <div className="page-content-no-padding">
        <Sidebar />
        <div className="page-content-main-no-padding">
          <FormSettingsConfirmationsEditPageContent />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ZeroGFormSettingsConfirmationsEditPage;
