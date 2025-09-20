import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import PageContent from '../../Components/PageContent.jsx';
import SettingsPageContent from '../../Components/Settings/SettingsPageContent.jsx';

const Settings = ({ siteTitle }) => {
  document.title = `General Settings - ${siteTitle}`;
  return (
    <>
      <Header />

      <PageContent>
        <SettingsPageContent />
      </PageContent>
      <Footer />
    </>
  );
};

export default Settings;
