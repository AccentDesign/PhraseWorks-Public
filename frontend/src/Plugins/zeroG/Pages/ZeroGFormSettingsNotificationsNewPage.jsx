import React from 'react';
import Header from '../../../Admin/Components/Header';
import Footer from '../../../Admin/Components/Footer';
import FormSettingsNotificationsNewPageContent from './Components/FormSettingsNotificationsNewPageContent.jsx';
import Sidebar from '../../../Admin/Components/Sidebar.jsx';

const ZeroGFormSettingsNotificationsNewPage = ({ siteTitle }) => {
  document.title = `ZeroG Settings - Notifications - New - ${siteTitle}`;
  return (
    <>
      <Header />

      <div className="page-content-no-padding">
        <Sidebar />
        <div className="page-content-main-no-padding">
          <FormSettingsNotificationsNewPageContent />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ZeroGFormSettingsNotificationsNewPage;
